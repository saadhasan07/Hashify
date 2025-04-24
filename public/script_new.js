console.log("Welcome to Hashify");

// Initialize the Variables
let songIndex = 0;
let audioElement = new Audio('songs/1.mp3');
let masterPlay = document.getElementById('masterPlay');
let myProgressBar = document.getElementById('myProgressBar');
let gif = document.getElementById('gif');
let masterSongName = document.getElementById('masterSongName');
let songItems = Array.from(document.getElementsByClassName('songItem'));

// Initialize visualizer variables
let visualizer;
const visualizerContainer = document.getElementById('visualizer-container');

// Add volume control
let volumeControl = document.createElement('input');
volumeControl.type = 'range';
volumeControl.min = 0;
volumeControl.max = 1;
volumeControl.step = 0.01;
volumeControl.value = 1;
volumeControl.className = 'volume-control';
document.querySelector('.icons').appendChild(volumeControl);

// Add repeat and shuffle buttons
let repeatButton = document.createElement('i');
repeatButton.className = 'fas fa-2x fa-repeat';
repeatButton.id = 'repeat';
repeatButton.style.marginLeft = '20px';
document.querySelector('.icons').appendChild(repeatButton);

let shuffleButton = document.createElement('i');
shuffleButton.className = 'fas fa-2x fa-random';
shuffleButton.id = 'shuffle';
shuffleButton.style.marginLeft = '20px';
document.querySelector('.icons').appendChild(shuffleButton);

// Flag for repeat and shuffle modes
let isRepeat = false;
let isShuffle = false;

let songs = [
    {songName: "Warriyo - Mortals [NCS Release]", filePath: "songs/1.mp3", coverPath: "covers/1.jpg"},
    {songName: "Cielo - Huma-Huma", filePath: "songs/2.mp3", coverPath: "covers/2.jpg"},
    {songName: "DEAF KEV - Invincible [NCS Release]", filePath: "songs/3.mp3", coverPath: "covers/3.jpg"},
    {songName: "Different Heaven & EH!DE - My Heart", filePath: "songs/4.mp3", coverPath: "covers/4.jpg"},
    {songName: "Janji-Heroes-Tonight-feat-Johnning", filePath: "songs/5.mp3", coverPath: "covers/5.jpg"},
    {songName: "Rabba - Salam-e-Ishq", filePath: "songs/2.mp3", coverPath: "covers/6.jpg"}, // Using existing MP3 files
    {songName: "Sakhiyaan - Salam-e-Ishq", filePath: "songs/2.mp3", coverPath: "covers/7.jpg"}, // Using existing MP3 files
    {songName: "Bhula Dena - Salam-e-Ishq", filePath: "songs/2.mp3", coverPath: "covers/8.jpg"}, // Using existing MP3 files
    {songName: "Tumhari Kasam - Salam-e-Ishq", filePath: "songs/2.mp3", coverPath: "covers/9.jpg"}, // Using existing MP3 files
    {songName: "Na Jaana - Salam-e-Ishq", filePath: "songs/4.mp3", coverPath: "covers/10.jpg"}, // Using existing MP3 files
]

// Add song durations
const songDurations = ["03:50", "04:12", "03:28", "04:47", "03:32", "04:15", "03:20", "03:43", "04:30", "03:54"];

// Add a current time display
let currentTimeDisplay = document.createElement('div');
currentTimeDisplay.className = 'current-time-display';
currentTimeDisplay.innerHTML = '0:00 / 0:00';
document.querySelector('.bottom').insertBefore(currentTimeDisplay, document.querySelector('.songInfo'));

songItems.forEach((element, i)=>{ 
    element.getElementsByTagName("img")[0].src = songs[i].coverPath; 
    element.getElementsByClassName("songName")[0].innerText = songs[i].songName; 
    
    // Update song duration
    const timestamp = element.querySelector(".timestamp");
    timestamp.innerHTML = songDurations[i] + ' <i id="'+ i +'" class="far songItemPlay fa-play-circle"></i>';
})
 
// Volume control event listener
volumeControl.addEventListener('input', () => {
    audioElement.volume = volumeControl.value;
});

// Repeat button event listener
repeatButton.addEventListener('click', () => {
    isRepeat = !isRepeat;
    if (isRepeat) {
        repeatButton.style.color = '#1DB954'; // Spotify green
    } else {
        repeatButton.style.color = 'white';
    }
});

// Shuffle button event listener
shuffleButton.addEventListener('click', () => {
    isShuffle = !isShuffle;
    if (isShuffle) {
        shuffleButton.style.color = '#1DB954'; // Spotify green
    } else {
        shuffleButton.style.color = 'white';
    }
});

// Handle play/pause click
masterPlay.addEventListener('click', ()=>{
    if(audioElement.paused || audioElement.currentTime<=0){
        audioElement.play()
            .then(() => {
                // Start visualizer when the song plays
                if (visualizer) {
                    visualizer.start();
                }
            })
            .catch(error => console.error('Error playing audio:', error));
        masterPlay.classList.remove('fa-play-circle');
        masterPlay.classList.add('fa-pause-circle');
        gif.style.opacity = 1;
    }
    else{
        audioElement.pause();
        // Stop visualizer when the song is paused
        if (visualizer) {
            visualizer.stop();
        }
        masterPlay.classList.remove('fa-pause-circle');
        masterPlay.classList.add('fa-play-circle');
        gif.style.opacity = 0;
    }
})

// Listen to Events
audioElement.addEventListener('timeupdate', ()=>{ 
    // Update Seekbar
    progress = parseInt((audioElement.currentTime/audioElement.duration)* 100); 
    myProgressBar.value = progress;

    // Update time display
    const currentMinutes = Math.floor(audioElement.currentTime / 60);
    const currentSeconds = Math.floor(audioElement.currentTime % 60);
    const durationMinutes = Math.floor(audioElement.duration / 60) || 0;
    const durationSeconds = Math.floor(audioElement.duration % 60) || 0;
    
    currentTimeDisplay.textContent = `${currentMinutes}:${currentSeconds < 10 ? '0' : ''}${currentSeconds} / ${durationMinutes}:${durationSeconds < 10 ? '0' : ''}${durationSeconds}`;

    // If song ends, play next song or repeat
    if(audioElement.currentTime >= audioElement.duration) {
        if(isRepeat) {
            playSong(songIndex);
        } else if(isShuffle) {
            let randomIndex = Math.floor(Math.random() * songs.length);
            songIndex = randomIndex;
            playSong(songIndex);
        } else {
            nextSong();
        }
    }
})

myProgressBar.addEventListener('change', ()=>{
    audioElement.currentTime = myProgressBar.value * audioElement.duration/100;
})

const makeAllPlays = ()=>{
    Array.from(document.getElementsByClassName('songItemPlay')).forEach((element)=>{
        element.classList.remove('fa-pause-circle');
        element.classList.add('fa-play-circle');
    })
}

// Function to play a song
function playSong(index) {
    makeAllPlays();
    const playIcon = document.getElementById(index);
    if (playIcon) {
        playIcon.classList.remove('fa-play-circle');
        playIcon.classList.add('fa-pause-circle');
    }
    
    audioElement.src = `songs/${index+1}.mp3`;
    masterSongName.innerText = songs[index].songName;
    audioElement.currentTime = 0;
    audioElement.play()
        .then(() => {
            // Start visualizer when the song plays
            if (visualizer) {
                visualizer.start();
            }
        })
        .catch(error => console.error('Error playing audio:', error));
    
    gif.style.opacity = 1;
    masterPlay.classList.remove('fa-play-circle');
    masterPlay.classList.add('fa-pause-circle');
}

// Function to play next song
function nextSong() {
    if(songIndex >= songs.length-1){
        songIndex = 0;
    }
    else{
        songIndex += 1;
    }
    playSong(songIndex);
}

// Function to play previous song
function previousSong() {
    if(songIndex <= 0){
        songIndex = 0;
    }
    else{
        songIndex -= 1;
    }
    playSong(songIndex);
}

Array.from(document.getElementsByClassName('songItem')).forEach((element, i) => {
    // Click on play button to play the song
    const playButton = element.querySelector('.songItemPlay');
    if (playButton) {
        playButton.addEventListener('click', (e) => { 
            songIndex = parseInt(e.target.id);
            playSong(songIndex);
        });
    }
    
    // Right-click on song item to show add to playlist menu
    element.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        addSongToPlaylistMenu(i);
    });
})

document.getElementById('next').addEventListener('click', () => {
    nextSong();
})

document.getElementById('previous').addEventListener('click', () => {
    previousSong();
})

// Add skip forward and skip backward buttons
let skipForwardButton = document.createElement('i');
skipForwardButton.className = 'fas fa-2x fa-forward';
skipForwardButton.id = 'skipForward';
skipForwardButton.style.marginLeft = '20px';
document.querySelector('.icons').appendChild(skipForwardButton);

let skipBackwardButton = document.createElement('i');
skipBackwardButton.className = 'fas fa-2x fa-backward';
skipBackwardButton.id = 'skipBackward';
skipBackwardButton.style.marginRight = '20px';
document.querySelector('.icons').insertBefore(skipBackwardButton, document.querySelector('#previous'));

// Skip forward 10 seconds
skipForwardButton.addEventListener('click', () => {
    audioElement.currentTime = Math.min(audioElement.currentTime + 10, audioElement.duration);
});

// Skip backward 10 seconds
skipBackwardButton.addEventListener('click', () => {
    audioElement.currentTime = Math.max(audioElement.currentTime - 10, 0);
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if(e.code === 'Space') {
        e.preventDefault(); // Prevent scrolling with spacebar
        masterPlay.click();
    } else if (e.code === 'ArrowRight') {
        if (e.shiftKey) {
            // Skip forward 10 seconds with Shift+Right Arrow
            skipForwardButton.click();
        } else {
            document.getElementById('next').click();
        }
    } else if (e.code === 'ArrowLeft') {
        if (e.shiftKey) {
            // Skip backward 10 seconds with Shift+Left Arrow
            skipBackwardButton.click();
        } else {
            document.getElementById('previous').click();
        }
    } else if (e.code === 'KeyM') {
        // Mute/unmute with 'm' key
        audioElement.muted = !audioElement.muted;
    }
});

// User Authentication Management
function updateUserUI() {
    const userProfile = document.getElementById('user-profile');
    // Check if the user profile element exists
    if (!userProfile) return;
    
    const userInfo = JSON.parse(localStorage.getItem('hashifyUser') || 'null');
    
    if (userInfo && userInfo.isLoggedIn) {
        // User is logged in
        userProfile.innerHTML = `
            <div class="user-menu-trigger">
                <span>${userInfo.displayName || userInfo.username}</span>
                <i class="fas fa-chevron-down"></i>
            </div>
            <div class="user-dropdown">
                <ul>
                    <li><a href="#"><i class="fas fa-user"></i> Profile</a></li>
                    <li><a href="#"><i class="fas fa-cog"></i> Settings</a></li>
                    <li><a href="#" id="logout-btn"><i class="fas fa-sign-out-alt"></i> Logout</a></li>
                </ul>
            </div>
        `;
        
        // Add logout functionality
        document.getElementById('logout-btn').addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('hashifyUser');
            window.location.reload();
        });
        
        // Toggle dropdown
        document.querySelector('.user-menu-trigger').addEventListener('click', () => {
            document.querySelector('.user-dropdown').classList.toggle('active');
        });
        
        // Close dropdown when clicking elsewhere
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.user-menu-trigger') && !e.target.closest('.user-dropdown')) {
                document.querySelector('.user-dropdown')?.classList.remove('active');
            }
        });
    } else {
        // User is not logged in
        userProfile.innerHTML = `<a href="login.html" class="nav-link login-link">Log In</a>`;
    }
}

// Initialize user UI
updateUserUI();

// Playlist Management
const defaultPlaylists = [
    { id: 1, name: "Chill Vibes", songs: [0, 2, 5] },
    { id: 2, name: "Workout Mix", songs: [1, 3, 6, 8] },
    { id: 3, name: "Focus Mode", songs: [4, 7, 9] }
];

function initPlaylists() {
    // Load playlists from localStorage or use default ones
    let playlists = JSON.parse(localStorage.getItem('hashifyPlaylists') || 'null');
    
    if (!playlists) {
        // First time - set default playlists with additional metadata
        const enhancedDefaults = defaultPlaylists.map(playlist => ({
            ...playlist,
            createdAt: new Date().toISOString(),
            coverImage: playlist.id === 1 ? "covers/2.jpg" : 
                       playlist.id === 2 ? "covers/3.jpg" : "covers/4.jpg"
        }));
        
        playlists = enhancedDefaults;
        localStorage.setItem('hashifyPlaylists', JSON.stringify(playlists));
    }
    
    // Check if we have the enhanced playlists module, use it if available
    if (typeof window.enhancedCreatePlaylist === 'function') {
        // Using enhanced playlist rendering
        renderPlaylists(playlists);
        
        // Add event listener for creating new playlists with the enhanced UI
        const createPlaylistBtn = document.getElementById('create-playlist');
        if (createPlaylistBtn) {
            createPlaylistBtn.addEventListener('click', () => window.enhancedCreatePlaylist());
        }
        
        // Set up drag and drop functionality if available
        if (typeof window.setupPlaylistDragAndDrop === 'function') {
            window.setupPlaylistDragAndDrop();
        }
    } else {
        // Fallback to basic playlist rendering
        renderPlaylists(playlists);
        
        // Add event listener for creating new playlists
        const createPlaylistBtn = document.getElementById('create-playlist');
        if (createPlaylistBtn) {
            createPlaylistBtn.addEventListener('click', createNewPlaylist);
        }
    }
}

function renderPlaylists(playlists) {
    const playlistMenu = document.getElementById('playlist-menu');
    if (!playlistMenu) return;
    
    playlistMenu.innerHTML = '';
    
    // Sort playlists by creation date (newest first) if they have that property
    const sortedPlaylists = [...playlists].sort((a, b) => {
        if (a.createdAt && b.createdAt) {
            return new Date(b.createdAt) - new Date(a.createdAt);
        }
        return 0; // Keep original order if no dates
    });
    
    sortedPlaylists.forEach(playlist => {
        const songCount = playlist.songs ? playlist.songs.length : 0;
        const li = document.createElement('li');
        li.className = 'playlist-item';
        li.dataset.playlistId = playlist.id;
        
        // Get cover image - use the first song's cover or the playlist cover or default
        const firstSongCover = playlist.songs && playlist.songs.length > 0 
            ? getSongCoverByIndex(playlist.songs[0]) 
            : null;
        const coverImage = playlist.coverImage || firstSongCover || 'covers/default-playlist.jpg';
        
        // Enhanced playlist item with cover and song count
        li.innerHTML = `
            <a href="#" class="playlist-link" data-playlist-id="${playlist.id}">
                <div class="playlist-info">
                    <div class="playlist-cover" style="background-image: url('${coverImage}')"></div>
                    <div class="playlist-details">
                        <span class="playlist-name">${playlist.name}</span>
                        <span class="playlist-count">${songCount} song${songCount !== 1 ? 's' : ''}</span>
                    </div>
                </div>
                <button class="playlist-options-btn" aria-label="Playlist options">
                    <i class="fas fa-ellipsis-v"></i>
                </button>
            </a>
        `;
        
        playlistMenu.appendChild(li);
        
        // Add click event to load this playlist
        li.querySelector('.playlist-link').addEventListener('click', (e) => {
            e.preventDefault();
            
            // Update active playlist styling
            document.querySelectorAll('.playlist-item').forEach(pl => pl.classList.remove('active'));
            li.classList.add('active');
            
            loadPlaylist(playlist);
        });
        
        // Add context menu for options button
        li.querySelector('.playlist-options-btn').addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            // Check if we have the enhanced version
            if (typeof window.showPlaylistOptionsMenu === 'function') {
                window.showPlaylistOptionsMenu(playlist, e);
            } else {
                // Fallback
                const confirmed = confirm(`Do you want to delete the playlist "${playlist.name}"?`);
                if (confirmed) {
                    // Delete playlist
                    const updatedPlaylists = playlists.filter(p => p.id !== playlist.id);
                    localStorage.setItem('hashifyPlaylists', JSON.stringify(updatedPlaylists));
                    renderPlaylists(updatedPlaylists);
                }
            }
        });
    });
    
    // Add styles for enhanced playlists if not already added
    if (!document.getElementById('enhanced-playlist-styles')) {
        const style = document.createElement('style');
        style.id = 'enhanced-playlist-styles';
        style.textContent = `
            .playlist-item {
                margin-bottom: 5px;
                border-radius: 4px;
                transition: background-color 0.2s;
            }
            
            .playlist-item.active .playlist-link,
            .playlist-item .playlist-link:hover {
                background-color: #282828;
            }
            
            .playlist-item.active {
                border-left: 3px solid #1DB954;
            }
            
            .playlist-link {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 8px 10px;
                text-decoration: none;
                color: #b3b3b3;
                border-radius: 4px;
                transition: all 0.2s;
            }
            
            .playlist-info {
                display: flex;
                align-items: center;
                gap: 10px;
                flex: 1;
            }
            
            .playlist-cover {
                width: 32px;
                height: 32px;
                background-size: cover;
                background-position: center;
                border-radius: 4px;
            }
            
            .playlist-details {
                display: flex;
                flex-direction: column;
                overflow: hidden;
            }
            
            .playlist-name {
                font-size: 14px;
                font-weight: 500;
                color: white;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                max-width: 150px;
            }
            
            .playlist-count {
                font-size: 12px;
                color: #b3b3b3;
            }
            
            .playlist-options-btn {
                background: transparent;
                border: none;
                color: #b3b3b3;
                font-size: 14px;
                cursor: pointer;
                padding: 5px;
                border-radius: 50%;
                opacity: 0;
                transition: opacity 0.2s, background-color 0.2s;
            }
            
            .playlist-link:hover .playlist-options-btn {
                opacity: 1;
            }
            
            .playlist-options-btn:hover {
                background-color: #333;
                color: white;
            }
        `;
        document.head.appendChild(style);
    }
}

// Helper function to get song cover by index
function getSongCoverByIndex(songIndex) {
    if (!songIndex && songIndex !== 0) return null;
    const song = songs.find(s => s.id === songIndex);
    return song ? song.coverPath : null;
}

function loadPlaylist(playlist) {
    // Check if we have the enhanced playlist module
    if (typeof window.enhancedLoadPlaylist === 'function') {
        // Use the enhanced version
        window.enhancedLoadPlaylist(playlist);
        return;
    }
    
    // Fallback to basic playlist loading
    // Change the title to playlist name
    const songListTitle = document.querySelector('.songList h1');
    if (songListTitle) {
        songListTitle.textContent = playlist.name;
    }
    
    // Highlight just the songs in this playlist
    songItems.forEach((item, index) => {
        if (playlist.songs.includes(index)) {
            item.classList.add('in-playlist');
        } else {
            item.classList.remove('in-playlist');
        }
    });
    
    // Optional: Automatically play the first song in the playlist
    if (playlist.songs.length > 0) {
        songIndex = playlist.songs[0];
        playSong(songIndex);
    }
}

function createNewPlaylist() {
    const playlistName = prompt('Enter a name for your new playlist:');
    
    if (playlistName && playlistName.trim()) {
        // Load existing playlists
        const playlists = JSON.parse(localStorage.getItem('hashifyPlaylists') || '[]');
        
        // Create new playlist with unique ID
        const newId = Math.max(0, ...playlists.map(p => p.id)) + 1;
        const newPlaylist = {
            id: newId,
            name: playlistName.trim(),
            songs: []
        };
        
        // Add to playlists and save
        playlists.push(newPlaylist);
        localStorage.setItem('hashifyPlaylists', JSON.stringify(playlists));
        
        // Re-render playlist menu
        renderPlaylists(playlists);
        
        // Load the new playlist
        loadPlaylist(newPlaylist);
    }
}

// Add song to playlist functionality
function addSongToPlaylistMenu(songIndex) {
    // Get playlists
    const playlists = JSON.parse(localStorage.getItem('spotifyPlaylists') || '[]');
    
    // Create menu HTML
    let menuHTML = '<div class="add-to-playlist-menu">';
    menuHTML += '<h3>Add to Playlist</h3>';
    menuHTML += '<ul>';
    
    playlists.forEach(playlist => {
        const isInPlaylist = playlist.songs.includes(songIndex);
        menuHTML += `
            <li data-playlist-id="${playlist.id}" class="${isInPlaylist ? 'in-playlist' : ''}">
                ${playlist.name}
                ${isInPlaylist ? '<i class="fas fa-check"></i>' : '<i class="fas fa-plus"></i>'}
            </li>
        `;
    });
    
    menuHTML += '</ul></div>';
    
    // Create menu element
    const menuElement = document.createElement('div');
    menuElement.className = 'context-menu';
    menuElement.innerHTML = menuHTML;
    document.body.appendChild(menuElement);
    
    // Position menu near the song
    const songElement = document.getElementById(songIndex);
    if (!songElement) {
        closeContextMenu();
        return;
    }
    
    const song = songElement.closest('.songItem');
    if (!song) {
        closeContextMenu();
        return;
    }
    
    const rect = song.getBoundingClientRect();
    menuElement.style.top = `${rect.bottom}px`;
    menuElement.style.left = `${rect.left}px`;
    
    // Add click events to playlist items
    menuElement.querySelectorAll('li').forEach(item => {
        item.addEventListener('click', () => {
            const playlistId = parseInt(item.dataset.playlistId);
            const playlist = playlists.find(p => p.id === playlistId);
            
            if (playlist) {
                // Toggle song in playlist
                const songIndex = parseInt(songIndex);
                const songIndexInPlaylist = playlist.songs.indexOf(songIndex);
                
                if (songIndexInPlaylist >= 0) {
                    // Remove song
                    playlist.songs.splice(songIndexInPlaylist, 1);
                } else {
                    // Add song
                    playlist.songs.push(songIndex);
                }
                
                // Save changes
                localStorage.setItem('hashifyPlaylists', JSON.stringify(playlists));
                
                // Close menu
                closeContextMenu();
                
                // Refresh current playlist if needed
                const currentPlaylistTitle = document.querySelector('.songList h1').textContent;
                if (currentPlaylistTitle === playlist.name) {
                    loadPlaylist(playlist);
                }
            }
        });
    });
    
    // Close menu when clicking elsewhere
    document.addEventListener('click', closeContextMenu);
}

function closeContextMenu() {
    const menu = document.querySelector('.context-menu');
    if (menu) {
        menu.remove();
        document.removeEventListener('click', closeContextMenu);
    }
}

// Initialize playlists
initPlaylists();

// Initialize Audio Visualizer
document.addEventListener('DOMContentLoaded', () => {
    if (visualizerContainer && typeof AudioVisualizer !== 'undefined') {
        visualizer = new AudioVisualizer(audioElement, visualizerContainer);
        console.log('Audio visualizer initialized');
        
        // Add event listener for play/pause to start/stop visualizer if not already added
        if (!audioElement._visualizerEventsAdded) {
            audioElement.addEventListener('play', () => {
                if (visualizer) visualizer.start();
            });
            
            audioElement.addEventListener('pause', () => {
                if (visualizer) visualizer.stop();
            });
            
            audioElement.addEventListener('ended', () => {
                if (visualizer) visualizer.stop();
            });
            
            audioElement._visualizerEventsAdded = true;
        }
    }
    
    // Show welcome notification with feature help
    if (typeof window.showNotification === 'function') {
        setTimeout(() => {
            window.showNotification("Welcome to Hashify! Try our new features");
            
            // Show feature help after a delay
            setTimeout(() => {
                showFeatureHelp();
            }, 3000);
        }, 1000);
    }
});

// Function to show feature help
function showFeatureHelp() {
    const helpModal = document.createElement('div');
    helpModal.className = 'help-modal';
    helpModal.innerHTML = `
        <div class="help-modal-content">
            <div class="help-modal-header">
                <h2>New Features!</h2>
                <button class="close-modal-btn"><i class="fas fa-times"></i></button>
            </div>
            <div class="help-modal-body">
                <div class="feature-section">
                    <i class="fas fa-music feature-icon"></i>
                    <div class="feature-details">
                        <h3>Enhanced Playlist Management</h3>
                        <p>Create gorgeous playlists with custom covers, drag and drop to reorder, and easily add songs.</p>
                    </div>
                </div>
                <div class="feature-section">
                    <i class="fas fa-search feature-icon"></i>
                    <div class="feature-details">
                        <h3>Smart Search</h3>
                        <p>Our improved search shows the most relevant results first and remembers your search history.</p>
                    </div>
                </div>
                <div class="feature-section">
                    <i class="fas fa-wave-square feature-icon"></i>
                    <div class="feature-details">
                        <h3>Audio Visualizer</h3>
                        <p>Try four different visualization modes: Bars, Circles, Waves and Particles with multiple color schemes.</p>
                    </div>
                </div>
            </div>
            <div class="help-modal-footer">
                <button class="got-it-btn">Got it!</button>
            </div>
        </div>
    `;
    
    // Add modal to the body
    document.body.appendChild(helpModal);
    
    // Add modal styles
    const style = document.createElement('style');
    style.textContent = `
        .help-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
        }
        
        .help-modal-content {
            background: #282828;
            border-radius: 8px;
            width: 90%;
            max-width: 500px;
            max-height: 90vh;
            overflow-y: auto;
            animation: modal-slide-in 0.3s ease;
        }
        
        @keyframes modal-slide-in {
            0% { transform: translateY(-50px); opacity: 0; }
            100% { transform: translateY(0); opacity: 1; }
        }
        
        .help-modal-header {
            padding: 16px;
            border-bottom: 1px solid #333;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .help-modal-header h2 {
            margin: 0;
            color: #1DB954;
            font-size: 24px;
        }
        
        .close-modal-btn {
            background: transparent;
            border: none;
            color: #b3b3b3;
            font-size: 20px;
            cursor: pointer;
        }
        
        .help-modal-body {
            padding: 20px;
        }
        
        .feature-section {
            display: flex;
            margin-bottom: 20px;
            padding-bottom: 20px;
            border-bottom: 1px solid #333;
        }
        
        .feature-section:last-child {
            border-bottom: none;
            margin-bottom: 0;
        }
        
        .feature-icon {
            font-size: 30px;
            color: #1DB954;
            margin-right: 15px;
            background: rgba(29, 185, 84, 0.1);
            width: 60px;
            height: 60px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
        }
        
        .feature-details h3 {
            margin: 0 0 8px 0;
            font-size: 18px;
        }
        
        .feature-details p {
            margin: 0;
            color: #b3b3b3;
            line-height: 1.5;
        }
        
        .help-modal-footer {
            padding: 16px;
            border-top: 1px solid #333;
            display: flex;
            justify-content: center;
        }
        
        .got-it-btn {
            background: #1DB954;
            color: white;
            border: none;
            padding: 10px 30px;
            border-radius: 30px;
            font-size: 16px;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.2s;
        }
        
        .got-it-btn:hover {
            background: #1ed760;
            transform: scale(1.05);
        }
    `;
    document.head.appendChild(style);
    
    // Set up closing the modal
    function closeModal() {
        document.body.removeChild(helpModal);
    }
    
    helpModal.querySelector('.close-modal-btn').addEventListener('click', closeModal);
    helpModal.querySelector('.got-it-btn').addEventListener('click', closeModal);
    
    // Handle clicks outside modal
    helpModal.addEventListener('click', (e) => {
        if (e.target === helpModal) {
            closeModal();
        }
    });
}