# Hashify Music Player

## Project Overview
Hashify is a modern music player application built with HTML, CSS, and JavaScript. It offers a responsive design and multiple player interfaces, featuring playlist management, search capabilities, audio visualization, and user authentication.

## Features
- **Multiple Player Interfaces**: Original, Simple, Minimal, Standalone, SVG, and Unicode players
- **Playlist Management**: Create, edit, duplicate, and share playlists
- **Search Functionality**: Find songs, artists, and albums with history tracking
- **Audio Visualization**: Real-time audio visualization with multiple modes
- **Responsive Design**: Works on desktop and mobile devices
- **User Authentication**: Login and signup with social media integration
- **Theme Customization**: Light and dark mode support

## File Structure
```
hashify/
├── public/                  # Client-side files
│   ├── enhanced-playlists.js  # Playlist management functionality
│   ├── fallback-icons.js      # Icon fallback system
│   ├── icons/                 # SVG icons for player controls
│   ├── script.js              # Main player logic
│   ├── script_new.js          # Enhanced player logic
│   ├── search.js              # Search functionality
│   ├── visualizer.js          # Audio visualization
│   ├── style.css              # Main styles
│   ├── style_new.css          # Enhanced styles
│   ├── login.html             # Login page
│   ├── signup.html            # Signup page
│   └── various player.html    # Different player interfaces
├── covers/                  # Album artwork
├── songs/                   # MP3 audio files
├── server.js                # Express server
├── standalone.html          # Standalone player
├── index.html               # Main entry point
└── package.json             # Project dependencies
```

## Technology Stack
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Node.js with Express
- **Audio**: Web Audio API
- **Storage**: LocalStorage for user data
- **Authentication**: Custom auth system with social integration

## Key Components

### Player Core (script.js, script_new.js)
Handles audio playback, controls, and the main player interface. Features include play/pause, previous/next, volume control, progress bar, and playback modes (shuffle, repeat).

### Playlist Management (enhanced-playlists.js)
Provides comprehensive playlist functionality including creation, editing, sharing, and song management. Uses localStorage for persistence.

### Search (search.js)
Implements search functionality with history tracking, filters, and display of search results.

### Audio Visualization (visualizer.js)
Creates real-time audio visualizations with multiple modes: bars, circles, waves, and particles.

### User Experience
- Smooth animations and transitions
- Keyboard shortcuts for playback control
- Drag-and-drop playlist management
- Mobile-responsive design

## Running the Project
1. Install Node.js dependencies: `npm install`
2. Start the server: `node server.js`
3. Open browser to `http://localhost:5000`

## Notes on Rebranding
This project was completely rebranded from "Spotify" to "Hashify" with these changes:

- All localStorage keys renamed (spotifyPlaylists → hashifyPlaylists, etc.)
- CSS selectors and IDs updated
- Share URLs modified to hashify.com
- Notification system rebranded
- Server comments and documentation updated

## Future Enhancements
- Server-side storage with database integration
- Enhanced collaborative playlists
- Music recommendation engine
- Audio equalizer functionality
- More visualization options