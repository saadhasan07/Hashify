import express, { type Request, Response, NextFunction } from "express";
import path from "path";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// SWITCH BETWEEN APPS: Set to true to show the Gaming Profile App, false to show the CI/CD app
const SHOW_GAMING_APP = true;

// Only set up CI/CD app middleware if we're not showing the Gaming App
if (!SHOW_GAMING_APP) {
  app.use((req, res, next) => {
    const start = Date.now();
    const path = req.path;
    let capturedJsonResponse: Record<string, any> | undefined = undefined;

    const originalResJson = res.json;
    res.json = function (bodyJson, ...args) {
      capturedJsonResponse = bodyJson;
      return originalResJson.apply(res, [bodyJson, ...args]);
    };

    res.on("finish", () => {
      const duration = Date.now() - start;
      if (path.startsWith("/api")) {
        let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
        if (capturedJsonResponse) {
          logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
        }

        if (logLine.length > 80) {
          logLine = logLine.slice(0, 79) + "…";
        }

        log(logLine);
      }
    });

    next();
  });
}

(async () => {
  if (SHOW_GAMING_APP) {
    log('🎮 Showing Gaming Profile App preview');
    
    // Serve the Gaming Profile App directly
    app.use(express.static(path.join(process.cwd(), 'gaming-profile-app', 'client', 'public')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(process.cwd(), 'gaming-profile-app', 'client', 'public', 'index.html'));
    });
    
    // ALWAYS serve the app on port 5000
    const port = 5000;
    app.listen(port, '0.0.0.0', () => {
      log(`
      ===========================================================
      🎮 Gaming Profile App server running on port ${port}
      🚀 View the app in the preview window
      ===========================================================
      `);
    });
  } else {
    // Regular CI/CD Pipeline Monitor app setup
    const server = await registerRoutes(app);

    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";

      res.status(status).json({ message });
      throw err;
    });

    // importantly only setup vite in development and after
    // setting up all the other routes so the catch-all route
    // doesn't interfere with the other routes
    if (app.get("env") === "development") {
      await setupVite(app, server);
    } else {
      serveStatic(app);
    }

    // ALWAYS serve the app on port 5000
    // this serves both the API and the client.
    // It is the only port that is not firewalled.
    const port = 5000;
    server.listen({
      port,
      host: "0.0.0.0",
      reusePort: true,
    }, () => {
      log(`serving on port ${port}`);
    });
  }
})();
