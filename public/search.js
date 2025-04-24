// Initialize audio element for song playback
let audioElement = new Audio();
let masterPlay = document.createElement('i');
masterPlay.className = 'far fa-3x fa-play-circle';
masterPlay.id = 'masterPlay';
document.querySelector('.icons').appendChild(masterPlay);

// Add volume control
let volumeControl = document.createElement('input');
volumeControl.type = 'range';
volumeControl.min = 0;
volumeControl.max = 1;
volumeControl.step = 0.01;
volumeControl.value = 1;
volumeControl.className = 'volume-control';
document.querySelector('.icons').appendChild(volumeControl);

// Add time display
let currentTimeDisplay = document.createElement('div');
currentTimeDisplay.className = 'current-time-display';
currentTimeDisplay.innerHTML = '0:00 / 0:00';
document.querySelector('.bottom').insertBefore(currentTimeDisplay, document.querySelector('.songInfo'));

// Volume control event listener
volumeControl.addEventListener('input', () => {
    audioElement.volume = volumeControl.value;
});

// Song database with metadata
const songs = [
    {
        id: 0,
        title: "Warriyo - Mortals",
        artist: "NCS Release",
        duration: "3:50",
        filePath: "songs/1.mp3",
        coverPath: "covers/1.jpg",
        tags: ["electronic", "dance"]
    },
    {
        id: 1,
        title: "Cielo",
        artist: "Huma-Huma",
        duration: "4:12",
        filePath: "songs/2.mp3",
        coverPath: "covers/2.jpg",
        tags: ["ambient", "chill"]
    },
    {
        id: 2,
        title: "DEAF KEV - Invincible",
        artist: "NCS Release",
        duration: "3:28",
        filePath: "songs/3.mp3",
        coverPath: "covers/3.jpg",
        tags: ["electronic", "bass"]
    },
    {
        id: 3,
        title: "Different Heaven & EH!DE - My Heart",
        artist: "NCS Release",
        duration: "4:47",
        filePath: "songs/4.mp3",
        coverPath: "covers/4.jpg",
        tags: ["electronic", "melodic"]
    },
    {
        id: 4,
        title: "Janji-Heroes-Tonight",
        artist: "Johnning",
        duration: "3:32",
        filePath: "songs/5.mp3",
        coverPath: "covers/5.jpg",
        tags: ["electronic", "vocal"]
    },
    {
        id: 5,
        title: "Rabba",
        artist: "Salam-e-Ishq",
        duration: "4:15",
        filePath: "songs/2.mp3",
        coverPath: "covers/6.jpg",
        tags: ["bollywood", "romantic"]
    },
    {
        id: 6,
        title: "Sakhiyaan",
        artist: "Salam-e-Ishq",
        duration: "3:20",
        filePath: "songs/2.mp3",
        coverPath: "covers/7.jpg",
        tags: ["bollywood", "upbeat"]
    },
    {
        id: 7,
        title: "Bhula Dena",
        artist: "Salam-e-Ishq",
        duration: "3:43",
        filePath: "songs/2.mp3",
        coverPath: "covers/8.jpg",
        tags: ["bollywood", "sad"]
    },
    {
        id: 8,
        title: "Tumhari Kasam",
        artist: "Salam-e-Ishq",
        duration: "4:30",
        filePath: "songs/2.mp3",
        coverPath: "covers/9.jpg",
        tags: ["bollywood", "romantic"]
    },
    {
        id: 9,
        title: "Na Jaana",
        artist: "Salam-e-Ishq",
        duration: "3:54",
        filePath: "songs/4.mp3",
        coverPath: "covers/10.jpg",
        tags: ["bollywood", "emotional"]
    }
];

// Sample artist data
const artists = [
    { id: 1, name: "NCS Release", image: "covers/1.jpg", genre: "Electronic" },
    { id: 2, name: "Huma-Huma", image: "covers/2.jpg", genre: "Ambient" },
    { id: 3, name: "Johnning", image: "covers/5.jpg", genre: "Vocal" },
    { id: 4, name: "Salam-e-Ishq", image: "covers/6.jpg", genre: "Bollywood" }
];

// Sample playlist data (would usually come from the server)
const playlists = [
    { id: 1, name: "Electronic Hits", coverPath: "covers/1.jpg", songCount: 5 },
    { id: 2, name: "Bollywood Classics", coverPath: "covers/6.jpg", songCount: 5 },
    { id: 3, name: "Chill Vibes", coverPath: "covers/2.jpg", songCount: 3 },
    { id: 4, name: "Workout Mix", coverPath: "covers/3.jpg", songCount: 4 }
];

// Search functionality
const searchInput = document.getElementById('search-input');
const clearButton = document.getElementById('clear-button');
const resultsContainer = document.getElementById('search-results');
const filterButtons = document.querySelectorAll('.filter-button');

// Load categories for initial view
function loadBrowseCategories() {
    const categories = [
        { name: "Electronic", coverPath: "covers/1.jpg" },
        { name: "Chill", coverPath: "covers/2.jpg" },
        { name: "Bollywood", coverPath: "covers/6.jpg" },
        { name: "Upbeat", coverPath: "covers/3.jpg" },
        { name: "Focus", coverPath: "covers/4.jpg" },
        { name: "Party", coverPath: "covers/5.jpg" },
        { name: "Romantic", coverPath: "covers/8.jpg" },
        { name: "Workout", coverPath: "covers/9.jpg" }
    ];
    
    resultsContainer.innerHTML = `
        <h2 class="section-title">Browse All</h2>
        <div class="results-grid">
            ${categories.map(category => `
                <div class="result-card">
                    <img src="${category.coverPath}" alt="${category.name}">
                    <h3>${category.name}</h3>
                </div>
            `).join('')}
        </div>
    `;
}

// Show "clear" button when search input has content
searchInput.addEventListener('input', () => {
    if (searchInput.value.length > 0) {
        clearButton.classList.add('visible');
        performSearch(searchInput.value);
    } else {
        clearButton.classList.remove('visible');
        loadBrowseCategories();
    }
});

// Clear search 
clearButton.addEventListener('click', () => {
    searchInput.value = '';
    clearButton.classList.remove('visible');
    loadBrowseCategories();
    searchInput.focus();
});

// Handle filter buttons
filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons
        filterButtons.forEach(btn => btn.classList.remove('active'));
        // Add active class to clicked button
        button.classList.add('active');
        
        // Re-run search with current filter
        if (searchInput.value.length > 0) {
            performSearch(searchInput.value);
        }
    });
});

// Enhanced search function with relevance scoring
function performSearch(query) {
    query = query.toLowerCase();
    const queryWords = query.split(/\s+/).filter(word => word.length > 0);
    let results = { songs: [], artists: [], playlists: [] };
    const activeFilter = document.querySelector('.filter-button.active').dataset.filter;
    
    // Search songs with relevance scoring
    if (activeFilter === 'all' || activeFilter === 'songs') {
        const scoredSongs = songs.map(song => {
            let score = 0;
            const titleLower = song.title.toLowerCase();
            const artistLower = song.artist.toLowerCase();
            const tagsLower = song.tags.map(tag => tag.toLowerCase());
            
            // Exact match in title (highest relevance)
            if (titleLower === query) {
                score += 100;
            }
            // Title starts with query
            else if (titleLower.startsWith(query)) {
                score += 75;
            }
            // Title contains query
            else if (titleLower.includes(query)) {
                score += 50;
            }
            
            // Check individual words in multi-word queries
            queryWords.forEach(word => {
                // Word in title
                if (titleLower.includes(word)) {
                    score += 25;
                }
                // Word in artist name
                if (artistLower.includes(word)) {
                    score += 20;
                }
                // Word in tags
                if (tagsLower.some(tag => tag.includes(word))) {
                    score += 15;
                }
            });
            
            // Exact match in artist name
            if (artistLower === query) {
                score += 40;
            }
            // Artist name starts with query
            else if (artistLower.startsWith(query)) {
                score += 30;
            }
            // Artist name contains query
            else if (artistLower.includes(query)) {
                score += 20;
            }
            
            // Tag matching
            if (tagsLower.includes(query)) {
                score += 35;
            }
            else if (tagsLower.some(tag => tag.includes(query))) {
                score += 25;
            }
            
            return { song, score };
        }).filter(item => item.score > 0);
        
        // Sort by score (descending) and extract songs
        results.songs = scoredSongs
            .sort((a, b) => b.score - a.score)
            .map(item => ({
                ...item.song,
                relevanceScore: item.score // Add score for debugging/display
            }));
    }
    
    // Search artists with relevance scoring
    if (activeFilter === 'all' || activeFilter === 'artists') {
        const scoredArtists = artists.map(artist => {
            let score = 0;
            const nameLower = artist.name.toLowerCase();
            const genreLower = artist.genre.toLowerCase();
            
            // Exact match in name (highest relevance)
            if (nameLower === query) {
                score += 100;
            }
            // Name starts with query
            else if (nameLower.startsWith(query)) {
                score += 75;
            }
            // Name contains query
            else if (nameLower.includes(query)) {
                score += 50;
            }
            
            // Check individual words in multi-word queries
            queryWords.forEach(word => {
                // Word in name
                if (nameLower.includes(word)) {
                    score += 25;
                }
                // Word in genre
                if (genreLower.includes(word)) {
                    score += 20;
                }
            });
            
            // Genre matching
            if (genreLower === query) {
                score += 40;
            }
            else if (genreLower.includes(query)) {
                score += 30;
            }
            
            return { artist, score };
        }).filter(item => item.score > 0);
        
        // Sort by score (descending) and extract artists
        results.artists = scoredArtists
            .sort((a, b) => b.score - a.score)
            .map(item => ({
                ...item.artist,
                relevanceScore: item.score
            }));
    }
    
    // Search playlists with relevance scoring
    if (activeFilter === 'all' || activeFilter === 'playlists') {
        const scoredPlaylists = playlists.map(playlist => {
            let score = 0;
            const nameLower = playlist.name.toLowerCase();
            
            // Exact match in name (highest relevance)
            if (nameLower === query) {
                score += 100;
            }
            // Name starts with query
            else if (nameLower.startsWith(query)) {
                score += 75;
            }
            // Name contains query
            else if (nameLower.includes(query)) {
                score += 50;
            }
            
            // Check individual words in multi-word queries
            queryWords.forEach(word => {
                if (nameLower.includes(word)) {
                    score += 25;
                }
            });
            
            return { playlist, score };
        }).filter(item => item.score > 0);
        
        // Sort by score (descending) and extract playlists
        results.playlists = scoredPlaylists
            .sort((a, b) => b.score - a.score)
            .map(item => ({
                ...item.playlist,
                relevanceScore: item.score
            }));
    }
    
    // Add search history
    saveSearchHistory(query);
    
    displaySearchResults(results, query);
}

// Save search history to localStorage
function saveSearchHistory(query) {
    if (!query || query.trim().length < 3) return; // Don't save very short queries
    
    // Get existing history
    let searchHistory = JSON.parse(localStorage.getItem('hashifySearchHistory') || '[]');
    
    // Prevent duplicates by removing existing instances of this query
    searchHistory = searchHistory.filter(item => item.toLowerCase() !== query.toLowerCase());
    
    // Add query to the beginning of the list
    searchHistory.unshift(query);
    
    // Keep only the last 10 searches
    searchHistory = searchHistory.slice(0, 10);
    
    // Save back to localStorage
    localStorage.setItem('hashifySearchHistory', JSON.stringify(searchHistory));
    
    // Update search history UI if it exists
    updateSearchHistoryUI();
}

// Function to update search history UI
function updateSearchHistoryUI() {
    const historyContainer = document.getElementById('search-history');
    if (!historyContainer) return;
    
    const searchHistory = JSON.parse(localStorage.getItem('hashifySearchHistory') || '[]');
    
    if (searchHistory.length === 0) {
        historyContainer.innerHTML = '<p class="empty-history">No recent searches</p>';
        return;
    }
    
    historyContainer.innerHTML = `
        <h3>Recent Searches</h3>
        <ul class="history-list">
            ${searchHistory.map(query => `
                <li>
                    <button class="history-item" data-query="${query}">
                        <i class="fas fa-history"></i>
                        <span>${query}</span>
                    </button>
                    <button class="history-remove" data-query="${query}">
                        <i class="fas fa-times"></i>
                    </button>
                </li>
            `).join('')}
        </ul>
        <button id="clear-history" class="clear-history-btn">Clear Search History</button>
    `;
    
    // Add event listeners to history items
    document.querySelectorAll('.history-item').forEach(item => {
        item.addEventListener('click', () => {
            const query = item.dataset.query;
            searchInput.value = query;
            performSearch(query);
        });
    });
    
    // Add event listeners to remove buttons
    document.querySelectorAll('.history-remove').forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            const query = button.dataset.query;
            removeFromSearchHistory(query);
        });
    });
    
    // Add event listener to clear history button
    document.getElementById('clear-history')?.addEventListener('click', () => {
        localStorage.removeItem('hashifySearchHistory');
        updateSearchHistoryUI();
    });
}

// Function to remove item from search history
function removeFromSearchHistory(queryToRemove) {
    const searchHistory = JSON.parse(localStorage.getItem('hashifySearchHistory') || '[]');
    const updatedHistory = searchHistory.filter(query => query !== queryToRemove);
    localStorage.setItem('hashifySearchHistory', JSON.stringify(updatedHistory));
    updateSearchHistoryUI();
}

// Enhanced display search results with tags and better UI
function displaySearchResults(results, query) {
    const totalResults = results.songs.length + results.artists.length + results.playlists.length;
    
    if (totalResults === 0) {
        resultsContainer.innerHTML = `
            <div class="no-results">
                <h2>No results found for "${query}"</h2>
                <p>Please try another search or check the spelling.</p>
                
                <div class="search-suggestions">
                    <h3>Try searching for:</h3>
                    <ul>
                        <li>Song titles (like "Mortals" or "Different Heaven")</li>
                        <li>Artists (like "NCS Release" or "Johnning")</li>
                        <li>Genres (like "electronic" or "ambient")</li>
                        <li>Moods (like "chill" or "upbeat")</li>
                    </ul>
                </div>
                
                <div id="search-history"></div>
            </div>
        `;
        
        updateSearchHistoryUI();
        return;
    }
    
    let html = `
        <div class="search-results-header">
            <h2>Search Results for "${query}"</h2>
            <p class="results-count">${totalResults} results found</p>
        </div>
    `;
    
    // Add songs section if there are results or if specifically looking for songs
    if (results.songs.length > 0) {
        html += `
            <h2 class="section-title">Songs</h2>
            <div class="results-grid song-results">
                ${results.songs.map(song => `
                    <div class="result-card song-card" data-song-id="${song.id}">
                        <div class="card-image">
                            <img src="${song.coverPath}" alt="${song.title}">
                            <div class="play-overlay">
                                <i class="fas fa-play"></i>
                            </div>
                        </div>
                        <div class="card-content">
                            <h3 class="truncate-text">${song.title}</h3>
                            <p class="artist">${song.artist}</p>
                            <p class="duration">${song.duration}</p>
                            <div class="tags">
                                ${song.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                            </div>
                        </div>
                        <div class="card-actions">
                            <button class="card-action-btn add-to-playlist" data-song-id="${song.id}">
                                <i class="fas fa-plus"></i>
                            </button>
                            <button class="card-action-btn add-to-favorite" data-song-id="${song.id}">
                                <i class="far fa-heart"></i>
                            </button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    // Add artists section if there are results or if specifically looking for artists
    if (results.artists.length > 0) {
        html += `
            <h2 class="section-title">Artists</h2>
            <div class="results-grid artist-results">
                ${results.artists.map(artist => `
                    <div class="result-card artist-card">
                        <div class="card-image round-image">
                            <img src="${artist.image}" alt="${artist.name}">
                        </div>
                        <div class="card-content">
                            <h3>${artist.name}</h3>
                            <p class="genre">${artist.genre}</p>
                            <button class="view-artist-btn">View Artist</button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    // Add playlists section if there are results or if specifically looking for playlists
    if (results.playlists.length > 0) {
        html += `
            <h2 class="section-title">Playlists</h2>
            <div class="results-grid playlist-results">
                ${results.playlists.map(playlist => `
                    <div class="result-card playlist-card">
                        <div class="card-image">
                            <img src="${playlist.coverPath}" alt="${playlist.name}">
                            <div class="play-overlay">
                                <i class="fas fa-play"></i>
                            </div>
                        </div>
                        <div class="card-content">
                            <h3>${playlist.name}</h3>
                            <p class="song-count">${playlist.songCount} songs</p>
                            <button class="view-playlist-btn">View Playlist</button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    // Add search history at the bottom
    html += `<div id="search-history"></div>`;
    
    resultsContainer.innerHTML = html;
    
    // Add styles for the enhanced search results
    if (!document.getElementById('search-results-styles')) {
        const style = document.createElement('style');
        style.id = 'search-results-styles';
        style.textContent = `
            .search-results-header {
                margin-bottom: 20px;
            }
            .results-count {
                color: #b3b3b3;
                font-size: 14px;
                margin-top: 5px;
            }
            .result-card {
                position: relative;
                background: #181818;
                border-radius: 6px;
                padding: 16px;
                transition: background 0.3s ease;
                display: flex;
                flex-direction: column;
                cursor: pointer;
            }
            .result-card:hover {
                background: #282828;
            }
            .card-image {
                position: relative;
                margin-bottom: 16px;
                overflow: hidden;
                border-radius: 4px;
            }
            .round-image img {
                border-radius: 50%;
            }
            .play-overlay {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                display: flex;
                align-items: center;
                justify-content: center;
                opacity: 0;
                transition: opacity 0.3s ease;
            }
            .play-overlay i {
                color: white;
                font-size: 36px;
                background: #1DB954;
                width: 50px;
                height: 50px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                transform: translateY(10px);
                transition: transform 0.3s ease;
            }
            .result-card:hover .play-overlay {
                opacity: 1;
            }
            .result-card:hover .play-overlay i {
                transform: translateY(0);
            }
            .card-content h3 {
                font-size: 16px;
                margin-bottom: 8px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            .card-content p {
                color: #b3b3b3;
                font-size: 14px;
                margin-bottom: 8px;
            }
            .tags {
                display: flex;
                flex-wrap: wrap;
                gap: 4px;
                margin-top: 8px;
            }
            .tag {
                background: #333;
                color: #b3b3b3;
                font-size: 12px;
                padding: 2px 8px;
                border-radius: 12px;
            }
            .card-actions {
                display: flex;
                justify-content: flex-end;
                gap: 8px;
                margin-top: auto;
                padding-top: 12px;
            }
            .card-action-btn {
                background: transparent;
                border: none;
                color: #b3b3b3;
                font-size: 16px;
                cursor: pointer;
                width: 32px;
                height: 32px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s;
            }
            .card-action-btn:hover {
                color: white;
                background: #333;
            }
            .view-artist-btn, .view-playlist-btn {
                background: #1DB954;
                color: white;
                border: none;
                padding: 8px 16px;
                border-radius: 20px;
                margin-top: 8px;
                cursor: pointer;
                font-weight: bold;
                transition: all 0.2s;
            }
            .view-artist-btn:hover, .view-playlist-btn:hover {
                background: #1ed760;
                transform: scale(1.05);
            }
            #search-history {
                margin-top: 40px;
                border-top: 1px solid #333;
                padding-top: 20px;
            }
            .history-list {
                list-style: none;
                padding: 0;
                margin: 10px 0;
            }
            .history-list li {
                display: flex;
                align-items: center;
                margin-bottom: 8px;
            }
            .history-item {
                flex: 1;
                background: #282828;
                border: none;
                color: white;
                padding: 8px 16px;
                border-radius: 4px;
                text-align: left;
                cursor: pointer;
                transition: background 0.2s;
                display: flex;
                align-items: center;
                gap: 10px;
            }
            .history-item:hover {
                background: #333;
            }
            .history-remove {
                background: transparent;
                border: none;
                color: #b3b3b3;
                cursor: pointer;
                margin-left: 8px;
                width: 30px;
                height: 30px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .history-remove:hover {
                color: white;
                background: #333;
            }
            .clear-history-btn {
                background: transparent;
                border: 1px solid #b3b3b3;
                color: #b3b3b3;
                padding: 6px 12px;
                border-radius: 4px;
                margin-top: 10px;
                cursor: pointer;
                transition: all 0.2s;
            }
            .clear-history-btn:hover {
                background: #333;
                color: white;
            }
            .empty-history {
                color: #b3b3b3;
                font-style: italic;
            }
            .search-suggestions {
                margin: 20px 0;
                background: #282828;
                padding: 15px;
                border-radius: 6px;
            }
            .search-suggestions h3 {
                margin-bottom: 10px;
                color: #1DB954;
            }
            .search-suggestions ul {
                padding-left: 20px;
            }
            .search-suggestions li {
                margin-bottom: 5px;
                color: #b3b3b3;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Add click events to song cards
    document.querySelectorAll('.song-card').forEach(card => {
        card.addEventListener('click', () => {
            const songId = parseInt(card.dataset.songId);
            playSong(songId);
        });
    });
    
    // Add click events for "Add to playlist" buttons
    document.querySelectorAll('.add-to-playlist').forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent card click
            const songId = parseInt(button.dataset.songId);
            showAddToPlaylistMenu(songId, e);
        });
    });
    
    // Add click events for favorite buttons
    document.querySelectorAll('.add-to-favorite').forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent card click
            const songId = parseInt(button.dataset.songId);
            toggleFavorite(songId);
            
            // Toggle button icon
            const icon = button.querySelector('i');
            if (icon.classList.contains('far')) {
                icon.classList.remove('far');
                icon.classList.add('fas');
                icon.style.color = '#1DB954';
            } else {
                icon.classList.remove('fas');
                icon.classList.add('far');
                icon.style.color = '';
            }
        });
    });
    
    // Update search history UI
    updateSearchHistoryUI();
}

// Function to show add to playlist menu
function showAddToPlaylistMenu(songId, event) {
    // Get playlists from localStorage
    const playlists = JSON.parse(localStorage.getItem('hashifyPlaylists') || '[]');
    
    // Create menu element
    const menu = document.createElement('div');
    menu.className = 'playlist-menu';
    menu.innerHTML = `
        <div class="playlist-menu-header">
            <h3>Add to playlist</h3>
            <button id="close-playlist-menu"><i class="fas fa-times"></i></button>
        </div>
        <ul>
            ${playlists.map(playlist => `
                <li data-playlist-id="${playlist.id}">${playlist.name}</li>
            `).join('')}
            <li class="create-new" id="create-new-playlist-menu">
                <i class="fas fa-plus"></i> Create New Playlist
            </li>
        </ul>
    `;
    
    // Position menu near the click
    menu.style.position = 'absolute';
    menu.style.top = `${event.clientY}px`;
    menu.style.left = `${event.clientX}px`;
    menu.style.zIndex = '1000';
    
    // Add menu styles
    const style = document.createElement('style');
    style.textContent = `
        .playlist-menu {
            background: #282828;
            border-radius: 4px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
            width: 200px;
            overflow: hidden;
        }
        .playlist-menu-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 12px 16px;
            border-bottom: 1px solid #333;
        }
        .playlist-menu-header h3 {
            margin: 0;
            font-size: 14px;
        }
        .playlist-menu-header button {
            background: transparent;
            border: none;
            color: white;
            cursor: pointer;
        }
        .playlist-menu ul {
            list-style: none;
            padding: 8px 0;
            margin: 0;
            max-height: 300px;
            overflow-y: auto;
        }
        .playlist-menu li {
            padding: 8px 16px;
            cursor: pointer;
            transition: background 0.2s;
        }
        .playlist-menu li:hover {
            background: #333;
        }
        .playlist-menu .create-new {
            border-top: 1px solid #333;
            color: #1DB954;
            padding-top: 12px;
        }
    `;
    document.head.appendChild(style);
    
    // Add to document
    document.body.appendChild(menu);
    
    // Add event listeners
    document.getElementById('close-playlist-menu').addEventListener('click', () => {
        document.body.removeChild(menu);
    });
    
    document.getElementById('create-new-playlist-menu').addEventListener('click', () => {
        document.body.removeChild(menu);
        createNewPlaylist(songId);
    });
    
    document.querySelectorAll('.playlist-menu li[data-playlist-id]').forEach(item => {
        item.addEventListener('click', () => {
            const playlistId = parseInt(item.dataset.playlistId);
            addSongToPlaylist(songId, playlistId);
            document.body.removeChild(menu);
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function closeMenu(e) {
        if (!menu.contains(e.target) && e.target !== event.target) {
            document.body.removeChild(menu);
            document.removeEventListener('click', closeMenu);
        }
    });
}

// Function to add song to playlist
function addSongToPlaylist(songId, playlistId) {
    const playlists = JSON.parse(localStorage.getItem('hashifyPlaylists') || '[]');
    const playlist = playlists.find(p => p.id === playlistId);
    
    if (playlist) {
        // Check if song is already in playlist
        if (!playlist.songs.includes(songId)) {
            playlist.songs.push(songId);
            localStorage.setItem('hashifyPlaylists', JSON.stringify(playlists));
            
            // Show success message
            showNotification(`Added to "${playlist.name}"`);
        } else {
            showNotification('Song is already in this playlist');
        }
    }
}

// Function to toggle favorite status
function toggleFavorite(songId) {
    let favorites = JSON.parse(localStorage.getItem('hashifyFavorites') || '[]');
    
    if (favorites.includes(songId)) {
        // Remove from favorites
        favorites = favorites.filter(id => id !== songId);
        showNotification('Removed from Favorites');
    } else {
        // Add to favorites
        favorites.push(songId);
        showNotification('Added to Favorites');
    }
    
    localStorage.setItem('hashifyFavorites', JSON.stringify(favorites));
}

// Function to show notification
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

// Play song function
function playSong(id) {
    const song = songs.find(s => s.id === id);
    if (!song) return;
    
    audioElement.src = song.filePath;
    audioElement.play();
    
    // Update UI
    document.getElementById('masterSongName').innerText = `${song.title} - ${song.artist}`;
    document.getElementById('gif').style.opacity = 1;
    
    // Update play button
    masterPlay.classList.remove('fa-play-circle');
    masterPlay.classList.add('fa-pause-circle');
    
    // Update progress and time display
    audioElement.addEventListener('timeupdate', updateTimeAndProgress);
}

// Update time display and progress bar
function updateTimeAndProgress() {
    if (!audioElement.duration) return;
    
    // Update progress bar
    const progress = parseInt((audioElement.currentTime/audioElement.duration)* 100); 
    document.getElementById('myProgressBar').value = progress;
    
    // Update time display
    const currentMinutes = Math.floor(audioElement.currentTime / 60);
    const currentSeconds = Math.floor(audioElement.currentTime % 60);
    const durationMinutes = Math.floor(audioElement.duration / 60);
    const durationSeconds = Math.floor(audioElement.duration % 60);
    
    currentTimeDisplay.textContent = `${currentMinutes}:${currentSeconds < 10 ? '0' : ''}${currentSeconds} / ${durationMinutes}:${durationSeconds < 10 ? '0' : ''}${durationSeconds}`;
}

// Handle play/pause click
masterPlay.addEventListener('click', () => {
    if(audioElement.paused || audioElement.currentTime <= 0) {
        audioElement.play();
        masterPlay.classList.remove('fa-play-circle');
        masterPlay.classList.add('fa-pause-circle');
        document.getElementById('gif').style.opacity = 1;
    } else {
        audioElement.pause();
        masterPlay.classList.remove('fa-pause-circle');
        masterPlay.classList.add('fa-play-circle');
        document.getElementById('gif').style.opacity = 0;
    }
});

// Handle progress bar change
document.getElementById('myProgressBar').addEventListener('change', () => {
    audioElement.currentTime = document.getElementById('myProgressBar').value * audioElement.duration/100;
});

// Initialize the page
loadBrowseCategories();

// Add user authentication
function updateUserUI() {
    const userProfile = document.getElementById('user-profile');
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

// Initialize playlists in sidebar
function initPlaylists() {
    // Load playlists from localStorage or use default ones
    const defaultPlaylists = [
        { id: 1, name: "Chill Vibes", songs: [0, 2, 5] },
        { id: 2, name: "Workout Mix", songs: [1, 3, 6, 8] },
        { id: 3, name: "Focus Mode", songs: [4, 7, 9] }
    ];
    
    let userPlaylists = JSON.parse(localStorage.getItem('hashifyPlaylists') || 'null');
    
    if (!userPlaylists) {
        // First time - set default playlists
        userPlaylists = defaultPlaylists;
        localStorage.setItem('hashifyPlaylists', JSON.stringify(userPlaylists));
    }
    
    renderPlaylists(userPlaylists);
    
    // Add event listener for creating new playlists
    document.getElementById('create-playlist').addEventListener('click', createNewPlaylist);
}

function renderPlaylists(playlists) {
    const playlistMenu = document.getElementById('playlist-menu');
    playlistMenu.innerHTML = '';
    
    playlists.forEach(playlist => {
        const li = document.createElement('li');
        li.innerHTML = `<a href="#" data-playlist-id="${playlist.id}"><i class="fas fa-music"></i> ${playlist.name}</a>`;
        playlistMenu.appendChild(li);
    });
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
    }
}

// Initialize playlists
initPlaylists();