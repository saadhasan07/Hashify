const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Route for the old Hashify app
app.get('/old', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Route for the home page (redirect to unicode player)
app.get('/', (req, res) => {
  res.redirect('/unicode');
});

// Route for the search page
app.get('/search', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'search.html'));
});

// Route for the login page
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Route for the signup page
app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'signup.html'));
});

// Route for the simple player (fallback for icon issues)
app.get('/simple', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'simple-player.html'));
});

// Route for minimal player (super simple fallback)
app.get('/minimal', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'minimal.html'));
});

// Route for the original full experience player
app.get('/original', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index_new.html'));
});

// Super simple standalone player
app.get('/standalone', (req, res) => {
  res.sendFile(path.join(__dirname, 'standalone.html'));
});

// SVG-based player with custom icons
app.get('/svg', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'svg-player.html'));
});

// Unicode-based player with no external icon dependencies
app.get('/unicode', (req, res) => {
  res.sendFile(path.join(__dirname, 'unicode-player.html'));
});

// Mock API for song data
app.get('/api/songs', (req, res) => {
  // This would typically come from a database
  const songs = [
    {
      id: 1,
      title: "Warriyo - Mortals",
      artist: "NCS Release",
      duration: "3:50",
      filePath: "songs/1.mp3",
      coverPath: "covers/1.jpg"
    },
    {
      id: 2,
      title: "Cielo",
      artist: "Huma-Huma",
      duration: "4:12",
      filePath: "songs/2.mp3",
      coverPath: "covers/2.jpg"
    },
    // Add more songs here as needed
  ];
  
  res.json(songs);
});

// Mock API for playlist data
app.get('/api/playlists', (req, res) => {
  // We'll create a simple mock response
  // In a real application, this would come from a database
  // and would be specific to the logged-in user
  res.json([
    { id: 1, name: "Chill Vibes", songs: [1, 3, 5] },
    { id: 2, name: "Workout Mix", songs: [2, 4, 6, 8] },
    { id: 3, name: "Focus Mode", songs: [5, 7, 9] }
  ]);
});

// Mock API route for creating a playlist
app.post('/api/playlists', (req, res) => {
  const { name, songs } = req.body;
  
  // In a real app, you would save this to a database
  // and associate it with the current user
  res.status(201).json({
    id: Date.now(), // Generate a unique ID (not ideal for production)
    name,
    songs: songs || []
  });
});

// Mock API route for adding a song to a playlist
app.post('/api/playlists/:id/songs', (req, res) => {
  const { songId } = req.body;
  const playlistId = req.params.id;
  
  // In a real app, you would update this in the database
  res.status(200).json({
    message: `Song ${songId} added to playlist ${playlistId}`
  });
});

// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🎵 Hashify music app running on port ${PORT}`);
  console.log('🚀 Open the app in your browser');
});