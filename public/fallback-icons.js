// This script replaces all Font Awesome icons with emoji equivalents
document.addEventListener('DOMContentLoaded', function() {
    console.log("Applying fallback icons...");
    
    // Replace control icons
    replaceIconWithButton('#masterPlay', '▶️ Play', function() {
        const playPauseButton = document.getElementById('masterPlay');
        if (playPauseButton) {
            playPauseButton.click();
        }
    });
    
    replaceIconWithButton('#previous', '⏮️ Previous', function() {
        const previousButton = document.getElementById('previous');
        if (previousButton) {
            previousButton.click();
        }
    });
    
    replaceIconWithButton('#next', '⏭️ Next', function() {
        const nextButton = document.getElementById('next');
        if (nextButton) {
            nextButton.click();
        }
    });
    
    // Replace song list play buttons
    document.querySelectorAll('.songItemPlay').forEach((icon, index) => {
        const button = document.createElement('button');
        button.innerHTML = '▶️';
        button.className = 'emoji-play-button';
        button.style.background = 'none';
        button.style.border = 'none';
        button.style.cursor = 'pointer';
        button.style.fontSize = '1.2rem';
        button.dataset.songIndex = index;
        
        button.addEventListener('click', function() {
            console.log("Playing song at index:", this.dataset.songIndex);
            playSong(parseInt(this.dataset.songIndex));
        });
        
        if (icon.parentNode) {
            icon.parentNode.replaceChild(button, icon);
        }
    });
    
    // Add volume controls if they don't exist
    if (!document.getElementById('volume-controls')) {
        const iconsContainer = document.querySelector('.icons');
        if (iconsContainer) {
            const volumeControls = document.createElement('div');
            volumeControls.id = 'volume-controls';
            volumeControls.style.display = 'inline-block';
            volumeControls.style.marginLeft = '20px';
            
            const volumeLabel = document.createElement('span');
            volumeLabel.textContent = '🔊';
            volumeLabel.style.marginRight = '5px';
            
            const volumeSlider = document.createElement('input');
            volumeSlider.type = 'range';
            volumeSlider.min = '0';
            volumeSlider.max = '1';
            volumeSlider.step = '0.01';
            volumeSlider.value = '0.5';
            volumeSlider.style.width = '100px';
            volumeSlider.style.verticalAlign = 'middle';
            
            volumeSlider.addEventListener('input', function() {
                const audioElement = document.getElementById('audioElement');
                if (audioElement) {
                    audioElement.volume = this.value;
                }
            });
            
            volumeControls.appendChild(volumeLabel);
            volumeControls.appendChild(volumeSlider);
            iconsContainer.appendChild(volumeControls);
        }
    }
    
    // Add shuffle and repeat buttons if they don't exist
    const iconsContainer = document.querySelector('.icons');
    if (iconsContainer) {
        if (!document.getElementById('shuffle-button')) {
            const shuffleButton = createEmojiButton('🔀 Shuffle', 'shuffle-button');
            shuffleButton.addEventListener('click', function() {
                toggleShuffle();
            });
            iconsContainer.appendChild(shuffleButton);
        }
        
        if (!document.getElementById('repeat-button')) {
            const repeatButton = createEmojiButton('🔁 Repeat', 'repeat-button');
            repeatButton.addEventListener('click', function() {
                toggleRepeat();
            });
            iconsContainer.appendChild(repeatButton);
        }
    }
});

function replaceIconWithButton(selector, text, clickHandler) {
    const icon = document.querySelector(selector);
    if (icon) {
        const button = document.createElement('button');
        button.innerHTML = text;
        button.style.background = '#1DB954';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.padding = '10px 20px';
        button.style.borderRadius = '20px';
        button.style.cursor = 'pointer';
        button.style.margin = '0 5px';
        button.style.fontSize = '1rem';
        button.style.fontWeight = 'bold';
        
        if (clickHandler) {
            button.addEventListener('click', clickHandler);
        }
        
        // Store the original ID
        button.id = icon.id;
        
        if (icon.parentNode) {
            icon.parentNode.replaceChild(button, icon);
        }
    }
}

function createEmojiButton(text, id) {
    const button = document.createElement('button');
    button.innerHTML = text;
    button.id = id;
    button.style.background = '#1DB954';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.padding = '10px 15px';
    button.style.borderRadius = '20px';
    button.style.cursor = 'pointer';
    button.style.margin = '0 5px';
    button.style.fontSize = '0.9rem';
    button.style.fontWeight = 'bold';
    return button;
}

function toggleShuffle() {
    console.log("Toggle shuffle clicked");
    // Use the existing isShuffle variable from script_new.js
    if (typeof isShuffle !== 'undefined') {
        isShuffle = !isShuffle;
        const shuffleButton = document.getElementById('shuffle-button');
        if (shuffleButton) {
            shuffleButton.style.background = isShuffle ? '#1ed760' : '#1DB954';
        }
    }
}

function toggleRepeat() {
    console.log("Toggle repeat clicked");
    // Use the existing isRepeat variable from script_new.js
    if (typeof isRepeat !== 'undefined') {
        isRepeat = !isRepeat;
        const repeatButton = document.getElementById('repeat-button');
        if (repeatButton) {
            repeatButton.style.background = isRepeat ? '#1ed760' : '#1DB954';
        }
    }
}