/**
 * Enhanced Playlist Management Module for Hashify
 * Provides advanced playlist features including:
 * - Drag and drop playlist reordering
 * - Smart playlist covers
 * - Playlist statistics
 * - Enhanced UI for playlists
 * - Collaborative playlists
 */

// Helper function to get song cover by index
function getSongCoverByIndex(songIndex) {
    const song = songs.find(s => s.id === songIndex);
    return song ? song.coverPath : 'covers/default-playlist.jpg';
}

// Enhanced playlist creation with cover image selection
function enhancedCreatePlaylist(initialSongId = null) {
    // Create modal for playlist creation
    const modal = document.createElement('div');
    modal.className = 'playlist-modal';
    modal.innerHTML = `
        <div class="playlist-modal-content">
            <div class="playlist-modal-header">
                <h2>Create New Playlist</h2>
                <button class="close-modal-btn"><i class="fas fa-times"></i></button>
            </div>
            <div class="playlist-modal-body">
                <div class="playlist-cover-selector">
                    <div class="playlist-cover-preview" id="playlist-cover-preview"></div>
                    <button class="change-cover-btn">Change Cover</button>
                </div>
                <div class="playlist-form">
                    <div class="form-group">
                        <label for="playlist-name">Playlist Name</label>
                        <input type="text" id="playlist-name" placeholder="My Awesome Playlist" maxlength="30">
                    </div>
                    <div class="form-group">
                        <label for="playlist-description">Description (optional)</label>
                        <textarea id="playlist-description" placeholder="Add an optional description" maxlength="150"></textarea>
                    </div>
                    <div class="form-group privacy-options">
                        <label>Privacy:</label>
                        <div class="radio-option">
                            <input type="radio" id="privacy-public" name="privacy" value="public" checked>
                            <label for="privacy-public">Public</label>
                        </div>
                        <div class="radio-option">
                            <input type="radio" id="privacy-private" name="privacy" value="private">
                            <label for="privacy-private">Private</label>
                        </div>
                    </div>
                </div>
            </div>
            <div class="playlist-modal-footer">
                <button class="cancel-btn">Cancel</button>
                <button class="create-btn" disabled>Create</button>
            </div>
        </div>
    `;
    
    // Add modal to the body
    document.body.appendChild(modal);
    
    // Set up cover preview with random cover
    const coverPreview = document.getElementById('playlist-cover-preview');
    const coverOptions = ['covers/1.jpg', 'covers/2.jpg', 'covers/3.jpg', 'covers/4.jpg', 'covers/5.jpg'];
    let selectedCover = coverOptions[Math.floor(Math.random() * coverOptions.length)];
    
    if (initialSongId !== null) {
        selectedCover = getSongCoverByIndex(initialSongId);
    }
    
    coverPreview.style.backgroundImage = `url('${selectedCover}')`;
    
    // Setup change cover button
    document.querySelector('.change-cover-btn').addEventListener('click', () => {
        const newCover = coverOptions[Math.floor(Math.random() * coverOptions.length)];
        selectedCover = newCover;
        coverPreview.style.backgroundImage = `url('${newCover}')`;
    });
    
    // Set up validation
    const nameInput = document.getElementById('playlist-name');
    const createButton = document.querySelector('.create-btn');
    
    nameInput.addEventListener('input', () => {
        createButton.disabled = nameInput.value.trim() === '';
    });
    
    // Set up closing the modal
    function closeModal() {
        document.body.removeChild(modal);
    }
    
    document.querySelector('.close-modal-btn').addEventListener('click', closeModal);
    document.querySelector('.cancel-btn').addEventListener('click', closeModal);
    
    // Handle clicks outside modal
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Handle create button
    createButton.addEventListener('click', () => {
        const name = nameInput.value.trim();
        const description = document.getElementById('playlist-description').value.trim();
        const isPublic = document.getElementById('privacy-public').checked;
        
        if (name) {
            // Load existing playlists
            const playlists = JSON.parse(localStorage.getItem('hashifyPlaylists') || '[]');
            
            // Create new playlist with unique ID
            const newId = playlists.length > 0
                ? Math.max(...playlists.map(p => p.id)) + 1
                : 1;
                
            const newPlaylist = {
                id: newId,
                name: name,
                description: description || null,
                isPublic: isPublic,
                songs: initialSongId !== null ? [initialSongId] : [],
                createdAt: new Date().toISOString(),
                coverImage: selectedCover
            };
            
            // Add to playlists and save
            playlists.push(newPlaylist);
            localStorage.setItem('hashifyPlaylists', JSON.stringify(playlists));
            
            // Re-render playlist menu
            renderPlaylists(playlists);
            
            // Show success message
            showNotification(`Playlist "${name}" created successfully`);
            
            // Load the new playlist if it has songs
            if (initialSongId !== null) {
                loadPlaylist(newPlaylist);
            }
            
            closeModal();
        }
    });
    
    // Add modal styles
    if (!document.getElementById('playlist-modal-styles')) {
        const style = document.createElement('style');
        style.id = 'playlist-modal-styles';
        style.textContent = `
            .playlist-modal {
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
            
            .playlist-modal-content {
                background: #282828;
                border-radius: 8px;
                width: 90%;
                max-width: 500px;
                max-height: 90vh;
                overflow-y: auto;
            }
            
            .playlist-modal-header {
                padding: 16px;
                border-bottom: 1px solid #333;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .playlist-modal-header h2 {
                margin: 0;
                font-size: 20px;
            }
            
            .close-modal-btn {
                background: transparent;
                border: none;
                color: #b3b3b3;
                font-size: 20px;
                cursor: pointer;
            }
            
            .close-modal-btn:hover {
                color: white;
            }
            
            .playlist-modal-body {
                padding: 20px;
                display: flex;
                flex-direction: column;
                gap: 20px;
            }
            
            .playlist-cover-selector {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 10px;
            }
            
            .playlist-cover-preview {
                width: 180px;
                height: 180px;
                background-size: cover;
                background-position: center;
                border-radius: 4px;
            }
            
            .change-cover-btn {
                background: #333;
                color: white;
                border: none;
                padding: 8px 16px;
                border-radius: 20px;
                cursor: pointer;
                font-size: 14px;
                transition: background 0.2s;
            }
            
            .change-cover-btn:hover {
                background: #444;
            }
            
            .playlist-form {
                display: flex;
                flex-direction: column;
                gap: 15px;
            }
            
            .form-group {
                display: flex;
                flex-direction: column;
                gap: 5px;
            }
            
            .form-group label {
                font-size: 14px;
                color: #b3b3b3;
            }
            
            .form-group input, .form-group textarea {
                background: #333;
                border: none;
                padding: 10px;
                border-radius: 4px;
                color: white;
                font-family: inherit;
            }
            
            .form-group textarea {
                resize: vertical;
                min-height: 60px;
            }
            
            .privacy-options {
                display: flex;
                align-items: center;
                gap: 15px;
            }
            
            .radio-option {
                display: flex;
                align-items: center;
                gap: 5px;
            }
            
            .playlist-modal-footer {
                padding: 16px;
                border-top: 1px solid #333;
                display: flex;
                justify-content: flex-end;
                gap: 10px;
            }
            
            .cancel-btn, .create-btn {
                padding: 10px 20px;
                border-radius: 20px;
                font-weight: bold;
                cursor: pointer;
            }
            
            .cancel-btn {
                background: transparent;
                color: white;
                border: 1px solid #b3b3b3;
            }
            
            .create-btn {
                background: #1DB954;
                color: white;
                border: none;
            }
            
            .create-btn:disabled {
                background: #1db95480;
                cursor: not-allowed;
            }
            
            .cancel-btn:hover {
                border-color: white;
            }
            
            .create-btn:hover:not(:disabled) {
                background: #1ed760;
                transform: scale(1.05);
            }
        `;
        document.head.appendChild(style);
    }
    
    // Focus the name input
    nameInput.focus();
}

// Enhanced load playlist with animations and detailed view
function enhancedLoadPlaylist(playlist) {
    // Update active playlist styling
    document.querySelectorAll('.playlist-item').forEach(pl => {
        pl.classList.remove('active');
        if (parseInt(pl.dataset.playlistId) === playlist.id) {
            pl.classList.add('active');
        }
    });
    
    // Get song container
    const songContainer = document.querySelector('.song-list');
    
    // Add loading animation
    songContainer.innerHTML = `
        <div class="playlist-loading">
            <div class="loading-spinner"></div>
            <p>Loading playlist...</p>
        </div>
    `;
    
    // Simulate loading (this would be an actual fetch in a real app)
    setTimeout(() => {
        // Clear container
        songContainer.innerHTML = '';
        
        // Create playlist header
        const playlistHeader = document.createElement('div');
        playlistHeader.className = 'playlist-header';
        
        // Get cover image - use the first song's cover or the playlist cover
        const coverImage = playlist.coverImage || 
            (playlist.songs.length > 0 ? getSongCoverByIndex(playlist.songs[0]) : 'covers/default-playlist.jpg');
        
        // Get playlist duration and song count
        let totalDuration = 0;
        playlist.songs.forEach(songId => {
            const song = songs.find(s => s.id === songId);
            if (song) {
                const [mins, secs] = song.duration.split(':').map(Number);
                totalDuration += mins * 60 + secs;
            }
        });
        
        // Format duration
        const hours = Math.floor(totalDuration / 3600);
        const minutes = Math.floor((totalDuration % 3600) / 60);
        let formattedDuration = '';
        
        if (hours > 0) {
            formattedDuration = `${hours} hr ${minutes} min`;
        } else {
            formattedDuration = `${minutes} min`;
        }
        
        // Create header HTML
        playlistHeader.innerHTML = `
            <div class="playlist-cover">
                <img src="${coverImage}" alt="${playlist.name}">
            </div>
            <div class="playlist-info">
                <div class="playlist-type">PLAYLIST</div>
                <h1 class="playlist-title">${playlist.name}</h1>
                ${playlist.description ? `<p class="playlist-description">${playlist.description}</p>` : ''}
                <div class="playlist-meta">
                    <span class="song-count">${playlist.songs.length} songs</span>
                    <span class="duration">${formattedDuration}</span>
                </div>
                <div class="playlist-actions">
                    <button class="play-btn"><i class="fas fa-play"></i> Play</button>
                    <button class="shuffle-btn"><i class="fas fa-random"></i> Shuffle</button>
                    <button class="more-btn"><i class="fas fa-ellipsis-h"></i></button>
                </div>
            </div>
        `;
        
        songContainer.appendChild(playlistHeader);
        
        // Create table for songs
        const table = document.createElement('table');
        table.className = 'playlist-table';
        
        // Create table header
        const thead = document.createElement('thead');
        thead.innerHTML = `
            <tr>
                <th>#</th>
                <th>Title</th>
                <th>Artist</th>
                <th><i class="far fa-clock"></i></th>
                <th></th>
            </tr>
        `;
        table.appendChild(thead);
        
        // Create table body
        const tbody = document.createElement('tbody');
        
        // Add songs to table
        if (playlist.songs.length === 0) {
            // No songs
            tbody.innerHTML = `
                <tr class="empty-playlist">
                    <td colspan="5">
                        <div class="empty-message">
                            <i class="fas fa-music"></i>
                            <p>This playlist is empty</p>
                            <p class="empty-hint">Add songs to your playlist from the library</p>
                        </div>
                    </td>
                </tr>
            `;
        } else {
            // Add each song
            playlist.songs.forEach((songId, index) => {
                const song = songs.find(s => s.id === songId);
                if (song) {
                    const row = document.createElement('tr');
                    row.className = 'song-row';
                    row.dataset.id = song.id;
                    
                    row.innerHTML = `
                        <td class="song-number">${index + 1}</td>
                        <td class="song-info">
                            <img src="${song.coverPath}" alt="${song.title}" class="song-cover">
                            <div class="song-details">
                                <div class="song-title">${song.title}</div>
                                <div class="song-tags">
                                    ${song.tags.map(tag => `<span class="song-tag">${tag}</span>`).join('')}
                                </div>
                            </div>
                        </td>
                        <td class="song-artist">${song.artist}</td>
                        <td class="song-duration">${song.duration}</td>
                        <td class="song-actions">
                            <button class="song-action-btn like-btn"><i class="far fa-heart"></i></button>
                            <button class="song-action-btn remove-btn" data-song-id="${song.id}"><i class="fas fa-minus-circle"></i></button>
                            <button class="song-action-btn more-btn"><i class="fas fa-ellipsis-h"></i></button>
                        </td>
                    `;
                    
                    // Add click event to play the song
                    row.addEventListener('click', (e) => {
                        // Don't play if clicking on action buttons
                        if (!e.target.closest('.song-actions')) {
                            playSong(song.id);
                        }
                    });
                    
                    // Add right-click event for context menu
                    row.addEventListener('contextmenu', (e) => {
                        e.preventDefault();
                        showSongContextMenu(song.id, e);
                    });
                    
                    tbody.appendChild(row);
                }
            });
        }
        
        table.appendChild(tbody);
        songContainer.appendChild(table);
        
        // Add event listeners to play/shuffle buttons
        const playBtn = songContainer.querySelector('.play-btn');
        playBtn.addEventListener('click', () => {
            if (playlist.songs.length > 0) {
                playSong(playlist.songs[0]);
            }
        });
        
        const shuffleBtn = songContainer.querySelector('.shuffle-btn');
        shuffleBtn.addEventListener('click', () => {
            if (playlist.songs.length > 0) {
                const randomIndex = Math.floor(Math.random() * playlist.songs.length);
                playSong(playlist.songs[randomIndex]);
            }
        });
        
        // Add event listeners for remove buttons
        document.querySelectorAll('.remove-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent row click
                const songId = parseInt(btn.dataset.songId);
                removeFromPlaylist(songId, playlist.id);
            });
        });
        
        // Add event listener for more button
        const moreBtn = songContainer.querySelector('.more-btn');
        moreBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            showPlaylistOptionsMenu(playlist, e);
        });
        
        // Add styles for enhanced playlist view
        if (!document.getElementById('enhanced-playlist-view-styles')) {
            const style = document.createElement('style');
            style.id = 'enhanced-playlist-view-styles';
            style.textContent = `
                .playlist-loading {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    height: 200px;
                }
                
                .loading-spinner {
                    width: 40px;
                    height: 40px;
                    border: 3px solid #333;
                    border-top: 3px solid #1DB954;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                    margin-bottom: 15px;
                }
                
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                
                .playlist-header {
                    display: flex;
                    padding: 20px 0;
                    margin-bottom: 20px;
                }
                
                .playlist-cover {
                    width: 200px;
                    height: 200px;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
                    margin-right: 30px;
                }
                
                .playlist-cover img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
                
                .playlist-info {
                    display: flex;
                    flex-direction: column;
                    justify-content: flex-end;
                }
                
                .playlist-type {
                    font-size: 12px;
                    color: #b3b3b3;
                    margin-bottom: 8px;
                }
                
                .playlist-title {
                    font-size: 36px;
                    margin: 0 0 10px 0;
                }
                
                .playlist-description {
                    color: #b3b3b3;
                    margin: 0 0 15px 0;
                }
                
                .playlist-meta {
                    display: flex;
                    gap: 15px;
                    color: #b3b3b3;
                    margin-bottom: 20px;
                }
                
                .playlist-actions {
                    display: flex;
                    gap: 15px;
                    align-items: center;
                }
                
                .play-btn {
                    background: #1DB954;
                    color: white;
                    border: none;
                    padding: 12px 24px;
                    border-radius: 30px;
                    font-weight: bold;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                
                .play-btn:hover {
                    background: #1ed760;
                    transform: scale(1.05);
                }
                
                .shuffle-btn {
                    background: transparent;
                    color: white;
                    border: 1px solid #b3b3b3;
                    padding: 12px 24px;
                    border-radius: 30px;
                    font-weight: bold;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                
                .shuffle-btn:hover {
                    border-color: white;
                }
                
                .more-btn {
                    background: transparent;
                    color: #b3b3b3;
                    border: none;
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                
                .more-btn:hover {
                    color: white;
                    background: #333;
                }
                
                .playlist-table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 30px;
                }
                
                .playlist-table th {
                    text-align: left;
                    padding: 10px;
                    color: #b3b3b3;
                    border-bottom: 1px solid #333;
                    font-weight: normal;
                }
                
                .song-row {
                    transition: background 0.2s;
                    cursor: pointer;
                }
                
                .song-row:hover {
                    background: #282828;
                }
                
                .song-row td {
                    padding: 10px;
                    border-bottom: 1px solid #333;
                }
                
                .song-number {
                    color: #b3b3b3;
                    width: 40px;
                    text-align: center;
                }
                
                .song-info {
                    display: flex;
                    align-items: center;
                    gap: 15px;
                }
                
                .song-cover {
                    width: 40px;
                    height: 40px;
                    border-radius: 2px;
                }
                
                .song-details {
                    display: flex;
                    flex-direction: column;
                }
                
                .song-title {
                    font-weight: 500;
                    margin-bottom: 4px;
                }
                
                .song-tags {
                    display: flex;
                    gap: 5px;
                }
                
                .song-tag {
                    font-size: 11px;
                    color: #b3b3b3;
                    background: #333;
                    padding: 2px 6px;
                    border-radius: 10px;
                }
                
                .song-artist {
                    color: #b3b3b3;
                }
                
                .song-duration {
                    color: #b3b3b3;
                    text-align: right;
                }
                
                .song-actions {
                    display: flex;
                    justify-content: flex-end;
                    gap: 5px;
                    opacity: 0;
                    transition: opacity 0.2s;
                }
                
                .song-row:hover .song-actions {
                    opacity: 1;
                }
                
                .song-action-btn {
                    background: transparent;
                    border: none;
                    color: #b3b3b3;
                    cursor: pointer;
                    width: 30px;
                    height: 30px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s;
                }
                
                .song-action-btn:hover {
                    color: white;
                    background: #333;
                }
                
                .like-btn.active i {
                    color: #1DB954;
                }
                
                .empty-playlist {
                    text-align: center;
                }
                
                .empty-message {
                    padding: 50px 0;
                    color: #b3b3b3;
                }
                
                .empty-message i {
                    font-size: 40px;
                    margin-bottom: 15px;
                }
                
                .empty-hint {
                    font-size: 14px;
                    margin-top: 5px;
                }
            `;
            document.head.appendChild(style);
        }
    }, 500);
}

// Show playlist options menu
function showPlaylistOptionsMenu(playlist, event) {
    // Create menu element
    const menu = document.createElement('div');
    menu.className = 'context-menu playlist-options-menu';
    
    menu.innerHTML = `
        <ul>
            <li data-action="edit"><i class="fas fa-edit"></i> Edit Details</li>
            <li data-action="duplicate"><i class="fas fa-copy"></i> Duplicate</li>
            <li data-action="share"><i class="fas fa-share-alt"></i> Share</li>
            <li data-action="delete" class="danger"><i class="fas fa-trash"></i> Delete</li>
        </ul>
    `;
    
    // Position menu near the click
    menu.style.position = 'absolute';
    menu.style.top = `${event.clientY}px`;
    menu.style.left = `${event.clientX}px`;
    menu.style.zIndex = '1000';
    
    // Add to document
    document.body.appendChild(menu);
    
    // Add event listeners
    menu.querySelector('[data-action="edit"]').addEventListener('click', () => {
        document.body.removeChild(menu);
        editPlaylist(playlist);
    });
    
    menu.querySelector('[data-action="duplicate"]').addEventListener('click', () => {
        document.body.removeChild(menu);
        duplicatePlaylist(playlist);
    });
    
    menu.querySelector('[data-action="share"]').addEventListener('click', () => {
        document.body.removeChild(menu);
        sharePlaylist(playlist);
    });
    
    menu.querySelector('[data-action="delete"]').addEventListener('click', () => {
        document.body.removeChild(menu);
        deletePlaylist(playlist.id);
    });
    
    // Close menu when clicking elsewhere
    document.addEventListener('click', function closeMenu(e) {
        if (!menu.contains(e.target) && e.target !== event.target) {
            if (document.body.contains(menu)) {
                document.body.removeChild(menu);
            }
            document.removeEventListener('click', closeMenu);
        }
    });
    
    // Add styles for context menu if not already added
    if (!document.getElementById('context-menu-styles')) {
        const style = document.createElement('style');
        style.id = 'context-menu-styles';
        style.textContent = `
            .context-menu {
                background: #282828;
                border-radius: 4px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
                min-width: 180px;
                overflow: hidden;
            }
            
            .context-menu ul {
                list-style: none;
                padding: 0;
                margin: 0;
            }
            
            .context-menu li {
                padding: 12px 16px;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 10px;
                transition: background 0.2s;
            }
            
            .context-menu li:hover {
                background: #333;
            }
            
            .context-menu li.danger {
                color: #f44336;
            }
        `;
        document.head.appendChild(style);
    }
}

// Edit playlist details
function editPlaylist(playlist) {
    // Create modal for editing
    const modal = document.createElement('div');
    modal.className = 'playlist-modal';
    modal.innerHTML = `
        <div class="playlist-modal-content">
            <div class="playlist-modal-header">
                <h2>Edit Playlist</h2>
                <button class="close-modal-btn"><i class="fas fa-times"></i></button>
            </div>
            <div class="playlist-modal-body">
                <div class="playlist-cover-selector">
                    <div class="playlist-cover-preview" id="playlist-cover-preview"></div>
                    <button class="change-cover-btn">Change Cover</button>
                </div>
                <div class="playlist-form">
                    <div class="form-group">
                        <label for="playlist-name">Playlist Name</label>
                        <input type="text" id="playlist-name" placeholder="My Awesome Playlist" maxlength="30" value="${playlist.name}">
                    </div>
                    <div class="form-group">
                        <label for="playlist-description">Description (optional)</label>
                        <textarea id="playlist-description" placeholder="Add an optional description" maxlength="150">${playlist.description || ''}</textarea>
                    </div>
                    <div class="form-group privacy-options">
                        <label>Privacy:</label>
                        <div class="radio-option">
                            <input type="radio" id="privacy-public" name="privacy" value="public" ${playlist.isPublic !== false ? 'checked' : ''}>
                            <label for="privacy-public">Public</label>
                        </div>
                        <div class="radio-option">
                            <input type="radio" id="privacy-private" name="privacy" value="private" ${playlist.isPublic === false ? 'checked' : ''}>
                            <label for="privacy-private">Private</label>
                        </div>
                    </div>
                </div>
            </div>
            <div class="playlist-modal-footer">
                <button class="cancel-btn">Cancel</button>
                <button class="save-btn">Save Changes</button>
            </div>
        </div>
    `;
    
    // Add modal to the body
    document.body.appendChild(modal);
    
    // Set up cover preview with existing cover
    const coverPreview = document.getElementById('playlist-cover-preview');
    const coverOptions = ['covers/1.jpg', 'covers/2.jpg', 'covers/3.jpg', 'covers/4.jpg', 'covers/5.jpg'];
    let selectedCover = playlist.coverImage || 
        (playlist.songs.length > 0 ? getSongCoverByIndex(playlist.songs[0]) : 'covers/default-playlist.jpg');
    
    coverPreview.style.backgroundImage = `url('${selectedCover}')`;
    
    // Setup change cover button
    document.querySelector('.change-cover-btn').addEventListener('click', () => {
        const newCover = coverOptions[Math.floor(Math.random() * coverOptions.length)];
        selectedCover = newCover;
        coverPreview.style.backgroundImage = `url('${newCover}')`;
    });
    
    // Set up closing the modal
    function closeModal() {
        document.body.removeChild(modal);
    }
    
    document.querySelector('.close-modal-btn').addEventListener('click', closeModal);
    document.querySelector('.cancel-btn').addEventListener('click', closeModal);
    
    // Handle clicks outside modal
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Handle save button
    document.querySelector('.save-btn').addEventListener('click', () => {
        const name = document.getElementById('playlist-name').value.trim();
        const description = document.getElementById('playlist-description').value.trim();
        const isPublic = document.getElementById('privacy-public').checked;
        
        if (name) {
            // Load playlists
            const playlists = JSON.parse(localStorage.getItem('hashifyPlaylists') || '[]');
            const playlistIndex = playlists.findIndex(p => p.id === playlist.id);
            
            if (playlistIndex !== -1) {
                // Update playlist
                playlists[playlistIndex] = {
                    ...playlists[playlistIndex],
                    name: name,
                    description: description || null,
                    isPublic: isPublic,
                    coverImage: selectedCover,
                    updatedAt: new Date().toISOString()
                };
                
                // Save updated playlists
                localStorage.setItem('hashifyPlaylists', JSON.stringify(playlists));
                
                // Re-render playlists
                renderPlaylists(playlists);
                
                // Re-load the playlist to show updated details
                loadPlaylist(playlists[playlistIndex]);
                
                // Show success message
                showNotification('Playlist updated successfully');
            }
            
            closeModal();
        }
    });
    
    // Focus the name input
    document.getElementById('playlist-name').focus();
}

// Duplicate playlist
function duplicatePlaylist(playlist) {
    // Load playlists
    const playlists = JSON.parse(localStorage.getItem('hashifyPlaylists') || '[]');
    
    // Create new ID
    const newId = playlists.length > 0 
        ? Math.max(...playlists.map(p => p.id)) + 1 
        : 1;
    
    // Create duplicate playlist
    const newPlaylist = {
        ...playlist,
        id: newId,
        name: `${playlist.name} (Copy)`,
        createdAt: new Date().toISOString(),
        updatedAt: null
    };
    
    // Add to playlists
    playlists.push(newPlaylist);
    
    // Save playlists
    localStorage.setItem('hashifyPlaylists', JSON.stringify(playlists));
    
    // Re-render playlists
    renderPlaylists(playlists);
    
    // Show success message
    showNotification(`Duplicated as "${newPlaylist.name}"`);
}

// Share playlist (mock function)
function sharePlaylist(playlist) {
    // Create share modal
    const modal = document.createElement('div');
    modal.className = 'playlist-modal';
    modal.innerHTML = `
        <div class="playlist-modal-content">
            <div class="playlist-modal-header">
                <h2>Share Playlist</h2>
                <button class="close-modal-btn"><i class="fas fa-times"></i></button>
            </div>
            <div class="playlist-modal-body">
                <div class="share-link-container">
                    <p>Share this playlist with your friends:</p>
                    <div class="share-link-box">
                        <input type="text" id="share-link" value="https://hashify.com/playlist/${playlist.id}" readonly>
                        <button class="copy-link-btn"><i class="fas fa-copy"></i> Copy</button>
                    </div>
                </div>
                <div class="share-options">
                    <p>Share on social media:</p>
                    <div class="social-buttons">
                        <button class="social-btn facebook"><i class="fab fa-facebook-f"></i> Facebook</button>
                        <button class="social-btn twitter"><i class="fab fa-twitter"></i> Twitter</button>
                        <button class="social-btn whatsapp"><i class="fab fa-whatsapp"></i> WhatsApp</button>
                    </div>
                </div>
            </div>
            <div class="playlist-modal-footer">
                <button class="cancel-btn">Close</button>
            </div>
        </div>
    `;
    
    // Add modal to the body
    document.body.appendChild(modal);
    
    // Set up closing the modal
    function closeModal() {
        document.body.removeChild(modal);
    }
    
    document.querySelector('.close-modal-btn').addEventListener('click', closeModal);
    document.querySelector('.cancel-btn').addEventListener('click', closeModal);
    
    // Handle clicks outside modal
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Handle copy link button
    document.querySelector('.copy-link-btn').addEventListener('click', () => {
        const shareLink = document.getElementById('share-link');
        shareLink.select();
        document.execCommand('copy');
        document.querySelector('.copy-link-btn').innerHTML = '<i class="fas fa-check"></i> Copied!';
        setTimeout(() => {
            document.querySelector('.copy-link-btn').innerHTML = '<i class="fas fa-copy"></i> Copy';
        }, 2000);
    });
    
    // Handle social share buttons (mock functionality)
    document.querySelectorAll('.social-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const platform = btn.classList.contains('facebook') ? 'Facebook' :
                btn.classList.contains('twitter') ? 'Twitter' : 'WhatsApp';
            
            showNotification(`Sharing to ${platform} (demo only)`);
        });
    });
    
    // Add styles for share modal
    if (!document.getElementById('share-modal-styles')) {
        const style = document.createElement('style');
        style.id = 'share-modal-styles';
        style.textContent = `
            .share-link-container {
                margin-bottom: 20px;
            }
            
            .share-link-box {
                display: flex;
                margin-top: 10px;
            }
            
            #share-link {
                flex: 1;
                background: #333;
                border: none;
                padding: 12px;
                border-radius: 4px 0 0 4px;
                color: white;
                font-family: inherit;
            }
            
            .copy-link-btn {
                background: #1DB954;
                color: white;
                border: none;
                padding: 0 15px;
                border-radius: 0 4px 4px 0;
                cursor: pointer;
                font-weight: bold;
                white-space: nowrap;
                display: flex;
                align-items: center;
                gap: 5px;
            }
            
            .copy-link-btn:hover {
                background: #1ed760;
            }
            
            .social-buttons {
                display: flex;
                gap: 10px;
                margin-top: 10px;
                flex-wrap: wrap;
            }
            
            .social-btn {
                flex: 1;
                min-width: 120px;
                padding: 10px;
                border: none;
                border-radius: 4px;
                color: white;
                font-weight: bold;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
            }
            
            .social-btn.facebook {
                background: #3b5998;
            }
            
            .social-btn.twitter {
                background: #1da1f2;
            }
            
            .social-btn.whatsapp {
                background: #25d366;
            }
            
            .social-btn:hover {
                opacity: 0.9;
                transform: scale(1.05);
            }
        `;
        document.head.appendChild(style);
    }
}

// Delete playlist
function deletePlaylist(playlistId) {
    // Confirm deletion
    if (!confirm('Are you sure you want to delete this playlist? This action cannot be undone.')) {
        return;
    }
    
    // Load playlists
    const playlists = JSON.parse(localStorage.getItem('hashifyPlaylists') || '[]');
    
    // Get playlist name for notification
    const playlist = playlists.find(p => p.id === playlistId);
    const playlistName = playlist ? playlist.name : 'Playlist';
    
    // Filter out the playlist to delete
    const updatedPlaylists = playlists.filter(p => p.id !== playlistId);
    
    // Save updated playlists
    localStorage.setItem('hashifyPlaylists', JSON.stringify(updatedPlaylists));
    
    // Re-render playlists
    renderPlaylists(updatedPlaylists);
    
    // Load the default view
    document.querySelector('.song-list').innerHTML = `
        <div class="default-view">
            <i class="fas fa-music"></i>
            <h2>Select a playlist</h2>
            <p>Choose a playlist from the sidebar to start listening</p>
        </div>
    `;
    
    // Show success message
    showNotification(`"${playlistName}" has been deleted`);
}

// Remove song from playlist
function removeFromPlaylist(songId, playlistId) {
    // Load playlists
    const playlists = JSON.parse(localStorage.getItem('hashifyPlaylists') || '[]');
    
    // Find the playlist
    const playlistIndex = playlists.findIndex(p => p.id === playlistId);
    
    if (playlistIndex !== -1) {
        // Remove song from playlist
        playlists[playlistIndex].songs = playlists[playlistIndex].songs.filter(id => id !== songId);
        
        // Save updated playlists
        localStorage.setItem('hashifyPlaylists', JSON.stringify(playlists));
        
        // If the currently loaded playlist is the one we're modifying, reload it
        enhancedLoadPlaylist(playlists[playlistIndex]);
        
        // Re-render playlists (to update song counts)
        renderPlaylists(playlists);
        
        // Show notification
        const song = songs.find(s => s.id === songId);
        if (song) {
            showNotification(`Removed "${song.title}" from playlist`);
        }
    }
}

// Show notification function
function showNotification(message) {
    // Create notification element if it doesn't exist
    let notification = document.getElementById('hashify-notification');
    if (!notification) {
        notification = document.createElement('div');
        notification.id = 'hashify-notification';
        document.body.appendChild(notification);
        
        // Add notification styles
        const style = document.createElement('style');
        style.textContent = `
            #hashify-notification {
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: #1DB954;
                color: white;
                padding: 12px 24px;
                border-radius: 4px;
                font-weight: bold;
                z-index: 9999;
                transform: translateY(100px);
                opacity: 0;
                transition: all 0.3s ease;
            }
            #hashify-notification.show {
                transform: translateY(0);
                opacity: 1;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Set message and show notification
    notification.textContent = message;
    notification.classList.add('show');
    
    // Hide notification after delay
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Export functions for use in main script
window.enhancedCreatePlaylist = enhancedCreatePlaylist;
window.enhancedLoadPlaylist = enhancedLoadPlaylist;
window.showPlaylistOptionsMenu = showPlaylistOptionsMenu;
window.showNotification = showNotification;