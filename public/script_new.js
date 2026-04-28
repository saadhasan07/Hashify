console.log("Welcome to Hashify");

// Initialize the Variables
let songIndex = 0;
let audioElement = new Audio('songs/1.mp3');
let masterPlay = document.getElementById('masterPlay');
let myProgressBar = document.getElementById('myProgressBar');
let gif = document.getElementById('gif');
let masterSongName = document.getElementById('masterSongName');
let songItems = Array.from(document.getElementsByClassName('songItem'));
const iconsContainer = document.querySelector('.icons');

// Initialize visualizer variables
let visualizer;
const visualizerContainer = document.getElementById('visualizer-container');

function updateMasterPlayButton(isPlaying) {
    if (!masterPlay) return;

    if (masterPlay.tagName === 'BUTTON') {
        masterPlay.textContent = isPlaying ? '⏸' : '▶';
    } else {
        masterPlay.classList.toggle('fa-play-circle', !isPlaying);
        masterPlay.classList.toggle('fa-pause-circle', isPlaying);
    }
}

// Add volume control
let volumeControl = document.createElement('input');
volumeControl.type = 'range';
volumeControl.min = 0;
volumeControl.max = 1;
volumeControl.step = 0.01;
volumeControl.value = 1;
volumeControl.className = 'volume-control';
iconsContainer.appendChild(volumeControl);

// Add repeat and shuffle buttons
let repeatButton = document.createElement('button');
repeatButton.id = 'repeat';
repeatButton.type = 'button';
repeatButton.textContent = '🔁';
repeatButton.style.marginLeft = '20px';
repeatButton.style.background = '#282828';
repeatButton.style.color = 'white';
repeatButton.style.border = 'none';
repeatButton.style.fontSize = '20px';
repeatButton.style.cursor = 'pointer';
iconsContainer.appendChild(repeatButton);

let shuffleButton = document.createElement('button');
shuffleButton.id = 'shuffle';
shuffleButton.type = 'button';
shuffleButton.textContent = '🔀';
shuffleButton.style.marginLeft = '20px';
shuffleButton.style.background = '#282828';
shuffleButton.style.color = 'white';
shuffleButton.style.border = 'none';
shuffleButton.style.fontSize = '20px';
shuffleButton.style.cursor = 'pointer';
iconsContainer.appendChild(shuffleButton);

// Flag for repeat and shuffle modes
let isRepeat = false;
let isShuffle = false;

let songs = [
    {songName: "Warriyo - Mortals [NCS Release]", filePath: "songs/1.mp3", coverPath: "covers/1.jpg"},
    {songName: "Cielo - Huma-Huma", filePath: "songs/2.mp3", coverPath: "covers/2.jpg"},
    {songName: "DEAF KEV - Invincible [NCS Release]", filePath: "songs/3.mp3", coverPath: "covers/3.jpg"},
    {songName: "Different Heaven & EH!DE - My Heart", filePath: "songs/4.mp3", coverPath: "covers/4.jpg"},
    {songName: "Janji-Heroes-Tonight-feat-Johnning", filePath: "songs/5.mp3", coverPath: "covers/5.jpg"},
    {songName: "Rabba - Salam-e-Ishq", filePath: "songs/2.mp3", coverPath: "covers/6.jpg"},
    {songName: "Sakhiyaan - Salam-e-Ishq", filePath: "songs/2.mp3", coverPath: "covers/7.jpg"},
    {songName: "Bhula Dena - Salam-e-Ishq", filePath: "songs/2.mp3", coverPath: "covers/8.jpg"},
    {songName: "Tumhari Kasam - Salam-e-Ishq", filePath: "songs/2.mp3", coverPath: "covers/9.jpg"},
    {songName: "Na Jaana - Salam-e-Ishq", filePath: "songs/4.mp3", coverPath: "covers/10.jpg"},
];

const songDurations = ["03:50", "04:12", "03:28", "04:47", "03:32", "04:15", "03:20", "03:43", "04:30", "03:54"];

let currentTimeDisplay = document.createElement('div');
currentTimeDisplay.className = 'current-time-display';
currentTimeDisplay.innerHTML = '0:00 / 0:00';
document.querySelector('.bottom').insertBefore(currentTimeDisplay, document.querySelector('.songInfo'));

songItems.forEach((element, i) => {
    element.getElementsByTagName("img")[0].src = songs[i].coverPath;
    element.getElementsByClassName("songName")[0].innerText = songs[i].songName;
    const timestamp = element.querySelector(".timestamp");
    timestamp.innerHTML = songDurations[i] + ' <i id="' + i + '" class="far songItemPlay fa-play-circle"></i>';
});

volumeControl.addEventListener('input', () => {
    audioElement.volume = volumeControl.value;
});

repeatButton.addEventListener('click', () => {
    isRepeat = !isRepeat;
    repeatButton.style.color = isRepeat ? '#1DB954' : 'white';
});

shuffleButton.addEventListener('click', () => {
    isShuffle = !isShuffle;
    shuffleButton.style.color = isShuffle ? '#1DB954' : 'white';
});

masterPlay.addEventListener('click', () => {
    if (audioElement.paused || audioElement.currentTime <= 0) {
        audioElement.play()
            .then(() => {
                if (visualizer) visualizer.start();
            })
            .catch(error => console.error('Error playing audio:', error));
        updateMasterPlayButton(true);
        gif.style.opacity = 1;
    } else {
        audioElement.pause();
        if (visualizer) visualizer.stop();
        updateMasterPlayButton(false);
        gif.style.opacity = 0;
    }
});

audioElement.addEventListener('timeupdate', () => {
    const progress = parseInt((audioElement.currentTime / audioElement.duration) * 100);
    myProgressBar.value = progress;

    const currentMinutes = Math.floor(audioElement.currentTime / 60);
    const currentSeconds = Math.floor(audioElement.currentTime % 60);
    const durationMinutes = Math.floor(audioElement.duration / 60) || 0;
    const durationSeconds = Math.floor(audioElement.duration % 60) || 0;

    currentTimeDisplay.textContent = `${currentMinutes}:${currentSeconds < 10 ? '0' : ''}${currentSeconds} / ${durationMinutes}:${durationSeconds < 10 ? '0' : ''}${durationSeconds}`;

    if (audioElement.currentTime >= audioElement.duration) {
        if (isRepeat) {
            playSong(songIndex);
        } else if (isShuffle) {
            songIndex = Math.floor(Math.random() * songs.length);
            playSong(songIndex);
        } else {
            nextSong();
        }
    }
});

myProgressBar.addEventListener('change', () => {
    audioElement.currentTime = myProgressBar.value * audioElement.duration / 100;
});

const makeAllPlays = () => {
    Array.from(document.getElementsByClassName('songItemPlay')).forEach((element) => {
        element.classList.remove('fa-pause-circle');
        element.classList.add('fa-play-circle');
    });
};

function playSong(index) {
    makeAllPlays();
    const playIcon = document.getElementById(index);
    if (playIcon) {
        playIcon.classList.remove('fa-play-circle');
        playIcon.classList.add('fa-pause-circle');
    }

    audioElement.src = `songs/${index + 1}.mp3`;
    masterSongName.innerText = songs[index].songName;
    audioElement.currentTime = 0;
    audioElement.play()
        .then(() => {
            if (visualizer) visualizer.start();
        })
        .catch(error => console.error('Error playing audio:', error));

    gif.style.opacity = 1;
    updateMasterPlayButton(true);
}

function nextSong() {
    if (songIndex >= songs.length - 1) {
        songIndex = 0;
    } else {
        songIndex += 1;
    }
    playSong(songIndex);
}

function previousSong() {
    if (songIndex <= 0) {
        songIndex = 0;
    } else {
        songIndex -= 1;
    }
    playSong(songIndex);
}

Array.from(document.getElementsByClassName('songItem')).forEach((element, i) => {
    const playButton = element.querySelector('.songItemPlay');
    if (playButton) {
        playButton.addEventListener('click', (e) => {
            songIndex = parseInt(e.target.id);
            playSong(songIndex);
        });
    }

    element.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        addSongToPlaylistMenu(i);
    });
});

document.getElementById('next').addEventListener('click', () => {
    nextSong();
});

document.getElementById('previous').addEventListener('click', () => {
    previousSong();
});

let skipForwardButton = document.createElement('button');
skipForwardButton.id = 'skipForward';
skipForwardButton.type = 'button';
skipForwardButton.textContent = '⏩';
skipForwardButton.style.marginLeft = '20px';
skipForwardButton.style.background = '#282828';
skipForwardButton.style.color = 'white';
skipForwardButton.style.border = 'none';
skipForwardButton.style.fontSize = '20px';
skipForwardButton.style.cursor = 'pointer';
iconsContainer.appendChild(skipForwardButton);

let skipBackwardButton = document.createElement('button');
skipBackwardButton.id = 'skipBackward';
skipBackwardButton.type = 'button';
skipBackwardButton.textContent = '⏪';
skipBackwardButton.style.marginRight = '20px';
skipBackwardButton.style.background = '#282828';
skipBackwardButton.style.color = 'white';
skipBackwardButton.style.border = 'none';
skipBackwardButton.style.fontSize = '20px';
skipBackwardButton.style.cursor = 'pointer';
iconsContainer.insertBefore(skipBackwardButton, document.querySelector('#previous'));

skipForwardButton.addEventListener('click', () => {
    audioElement.currentTime = Math.min(audioElement.currentTime + 10, audioElement.duration);
});

skipBackwardButton.addEventListener('click', () => {
    audioElement.currentTime = Math.max(audioElement.currentTime - 10, 0);
});

document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        e.preventDefault();
        masterPlay.click();
    } else if (e.code === 'ArrowRight') {
        if (e.shiftKey) {
            skipForwardButton.click();
        } else {
            document.getElementById('next').click();
        }
    } else if (e.code === 'ArrowLeft') {
        if (e.shiftKey) {
            skipBackwardButton.click();
        } else {
            document.getElementById('previous').click();
        }
    } else if (e.code === 'KeyM') {
        audioElement.muted = !audioElement.muted;
    }
});

function updateUserUI() {
    const userProfile = document.getElementById('user-profile');
    if (!userProfile) return;

    const userInfo = JSON.parse(localStorage.getItem('hashifyUser') || 'null');

    if (userInfo && userInfo.isLoggedIn) {
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

        document.getElementById('logout-btn').addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('hashifyUser');
            window.location.reload();
        });

        document.querySelector('.user-menu-trigger').addEventListener('click', () => {
            document.querySelector('.user-dropdown').classList.toggle('active');
        });

        document.addEventListener('click', (e) => {
            if (!e.target.closest('.user-menu-trigger') && !e.target.closest('.user-dropdown')) {
                document.querySelector('.user-dropdown')?.classList.remove('active');
            }
        });
    } else {
        userProfile.innerHTML = `<a href="login.html" class="nav-link login-link">Log In</a>`;
    }
}

updateUserUI();

const defaultPlaylists = [
    { id: 1, name: "Chill Vibes", songs: [0, 2, 5] },
    { id: 2, name: "Workout Mix", songs: [1, 3, 6, 8] },
    { id: 3, name: "Focus Mode", songs: [4, 7, 9] }
];

function initPlaylists() {
    let playlists = JSON.parse(localStorage.getItem('hashifyPlaylists') || 'null');

    if (!playlists) {
        const enhancedDefaults = defaultPlaylists.map(playlist => ({
            ...playlist,
            createdAt: new Date().toISOString(),
            coverImage: playlist.id === 1 ? "covers/2.jpg" : playlist.id === 2 ? "covers/3.jpg" : "covers/4.jpg"
        }));

        playlists = enhancedDefaults;
        localStorage.setItem('hashifyPlaylists', JSON.stringify(playlists));
    }

    if (typeof window.enhancedCreatePlaylist === 'function') {
        renderPlaylists(playlists);
        const createPlaylistBtn = document.getElementById('create-playlist');
        if (createPlaylistBtn) {
            createPlaylistBtn.addEventListener('click', () => window.enhancedCreatePlaylist());
        }
        if (typeof window.setupPlaylistDragAndDrop === 'function') {
            window.setupPlaylistDragAndDrop();
        }
    } else {
        renderPlaylists(playlists);
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

    const sortedPlaylists = [...playlists].sort((a, b) => {
        if (a.createdAt && b.createdAt) {
            return new Date(b.createdAt) - new Date(a.createdAt);
        }
        return 0;
    });

    sortedPlaylists.forEach(playlist => {
        const songCount = playlist.songs ? playlist.songs.length : 0;
        const li = document.createElement('li');
        li.className = 'playlist-item';
        li.dataset.playlistId = playlist.id;

        const firstSongCover = playlist.songs && playlist.songs.length > 0 ? getSongCoverByIndex(playlist.songs[0]) : null;
        const coverImage = playlist.coverImage || firstSongCover || 'covers/default-playlist.jpg';

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

        li.querySelector('.playlist-link').addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelectorAll('.playlist-item').forEach(pl => pl.classList.remove('active'));
            li.classList.add('active');
            loadPlaylist(playlist);
        });

        li.querySelector('.playlist-options-btn').addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (typeof window.showPlaylistOptionsMenu === 'function') {
                window.showPlaylistOptionsMenu(playlist, e);
            } else {
                const confirmed = confirm(`Do you want to delete the playlist "${playlist.name}"?`);
                if (confirmed) {
                    const updatedPlaylists = playlists.filter(p => p.id !== playlist.id);
                    localStorage.setItem('hashifyPlaylists', JSON.stringify(updatedPlaylists));
                    renderPlaylists(updatedPlaylists);
                }
            }
        });
    });

    if (!document.getElementById('enhanced-playlist-styles')) {
        const style = document.createElement('style');
        style.id = 'enhanced-playlist-styles';
        style.textContent = `
            .playlist-item { margin-bottom: 5px; border-radius: 4px; transition: background-color 0.2s; }
            .playlist-item.active .playlist-link, .playlist-item .playlist-link:hover { background-color: #282828; }
            .playlist-item.active { border-left: 3px solid #1DB954; }
            .playlist-link { display: flex; align-items: center; justify-content: space-between; padding: 8px 10px; text-decoration: none; color: #b3b3b3; border-radius: 4px; transition: all 0.2s; }
            .playlist-info { display: flex; align-items: center; gap: 10px; flex: 1; }
            .playlist-cover { width: 32px; height: 32px; background-size: cover; background-position: center; border-radius: 4px; }
            .playlist-details { display: flex; flex-direction: column; overflow: hidden; }
            .playlist-name { font-size: 14px; font-weight: 500; color: white; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 150px; }
            .playlist-count { font-size: 12px; color: #b3b3b3; }
            .playlist-options-btn { background: transparent; border: none; color: #b3b3b3; font-size: 14px; cursor: pointer; padding: 5px; border-radius: 50%; opacity: 0; transition: opacity 0.2s, background-color 0.2s; }
            .playlist-link:hover .playlist-options-btn { opacity: 1; }
            .playlist-options-btn:hover { background-color: #333; color: white; }
        `;
        document.head.appendChild(style);
    }
}

function getSongCoverByIndex(songIndex) {
    if (!songIndex && songIndex !== 0) return null;
    const song = songs.find(s => s.id === songIndex);
    return song ? song.coverPath : null;
}

function loadPlaylist(playlist) {
    if (typeof window.enhancedLoadPlaylist === 'function') {
        window.enhancedLoadPlaylist(playlist);
        return;
    }

    const songListTitle = document.querySelector('.songList h1');
    if (songListTitle) {
        songListTitle.textContent = playlist.name;
    }

    songItems.forEach((item, index) => {
        if (playlist.songs.includes(index)) {
            item.classList.add('in-playlist');
        } else {
            item.classList.remove('in-playlist');
        }
    });

    if (playlist.songs.length > 0) {
        songIndex = playlist.songs[0];
        playSong(songIndex);
    }
}

function createNewPlaylist() {
    const playlistName = prompt('Enter a name for your new playlist:');
    if (playlistName && playlistName.trim()) {
        const playlists = JSON.parse(localStorage.getItem('hashifyPlaylists') || '[]');
        const newId = Math.max(0, ...playlists.map(p => p.id)) + 1;
        const newPlaylist = { id: newId, name: playlistName.trim(), songs: [] };
        playlists.push(newPlaylist);
        localStorage.setItem('hashifyPlaylists', JSON.stringify(playlists));
        renderPlaylists(playlists);
        loadPlaylist(newPlaylist);
    }
}

function addSongToPlaylistMenu(songIndex) {
    const playlists = JSON.parse(localStorage.getItem('spotifyPlaylists') || '[]');
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
    const menuElement = document.createElement('div');
    menuElement.className = 'context-menu';
    menuElement.innerHTML = menuHTML;
    document.body.appendChild(menuElement);

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

    menuElement.querySelectorAll('li').forEach(item => {
        item.addEventListener('click', () => {
            const playlistId = parseInt(item.dataset.playlistId);
            const playlist = playlists.find(p => p.id === playlistId);
            if (playlist) {
                const songIndexValue = parseInt(songIndex);
                const songIndexInPlaylist = playlist.songs.indexOf(songIndexValue);
                if (songIndexInPlaylist >= 0) {
                    playlist.songs.splice(songIndexInPlaylist, 1);
                } else {
                    playlist.songs.push(songIndexValue);
                }
                localStorage.setItem('hashifyPlaylists', JSON.stringify(playlists));
                closeContextMenu();
                const currentPlaylistTitle = document.querySelector('.songList h1').textContent;
                if (currentPlaylistTitle === playlist.name) {
                    loadPlaylist(playlist);
                }
            }
        });
    });

    document.addEventListener('click', closeContextMenu);
}

function closeContextMenu() {
    const menu = document.querySelector('.context-menu');
    if (menu) {
        menu.remove();
        document.removeEventListener('click', closeContextMenu);
    }
}

initPlaylists();

document.addEventListener('DOMContentLoaded', () => {
    if (visualizerContainer && typeof AudioVisualizer !== 'undefined') {
        visualizer = new AudioVisualizer(audioElement, visualizerContainer);
        console.log('Audio visualizer initialized');
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

    if (typeof window.showNotification === 'function') {
        setTimeout(() => {
            window.showNotification("Welcome to Hashify! Try our new features");
            setTimeout(() => {
                showFeatureHelp();
            }, 3000);
        }, 1000);
    }
});

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

    document.body.appendChild(helpModal);

    const style = document.createElement('style');
    style.textContent = `
        .help-modal { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.7); display: flex; align-items: center; justify-content: center; z-index: 9999; }
        .help-modal-content { background: #282828; border-radius: 8px; width: 90%; max-width: 500px; max-height: 90vh; overflow-y: auto; animation: modal-slide-in 0.3s ease; }
        @keyframes modal-slide-in { 0% { transform: translateY(-50px); opacity: 0; } 100% { transform: translateY(0); opacity: 1; } }
        .help-modal-header { padding: 16px; border-bottom: 1px solid #333; display: flex; justify-content: space-between; align-items: center; }
        .help-modal-header h2 { margin: 0; color: #1DB954; font-size: 24px; }
        .close-modal-btn { background: transparent; border: none; color: #b3b3b3; font-size: 20px; cursor: pointer; }
        .help-modal-body { padding: 20px; }
        .feature-section { display: flex; margin-bottom: 20px; padding-bottom: 20px; border-bottom: 1px solid #333; }
        .feature-section:last-child { border-bottom: none; margin-bottom: 0; }
        .feature-icon { font-size: 30px; color: #1DB954; margin-right: 15px; background: rgba(29, 185, 84, 0.1); width: 60px; height: 60px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .feature-details h3 { margin: 0 0 8px 0; font-size: 18px; }
        .feature-details p { margin: 0; color: #b3b3b3; line-height: 1.5; }
        .help-modal-footer { padding: 16px; border-top: 1px solid #333; display: flex; justify-content: center; }
        .got-it-btn { background: #1DB954; color: white; border: none; padding: 10px 30px; border-radius: 30px; font-size: 16px; font-weight: bold; cursor: pointer; transition: all 0.2s; }
        .got-it-btn:hover { background: #1ed760; transform: scale(1.05); }
    `;
    document.head.appendChild(style);

    function closeModal() {
        document.body.removeChild(helpModal);
    }

    helpModal.querySelector('.close-modal-btn').addEventListener('click', closeModal);
    helpModal.querySelector('.got-it-btn').addEventListener('click', closeModal);
    helpModal.addEventListener('click', (e) => {
        if (e.target === helpModal) {
            closeModal();
        }
    });
}
