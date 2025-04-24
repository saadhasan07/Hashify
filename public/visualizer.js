// Enhanced Audio Visualizer with multiple visualization modes
class AudioVisualizer {
    constructor(audioElement, container) {
        this.audioElement = audioElement;
        this.container = container;
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.isInitialized = false;
        this.animationId = null;
        this.analyser = null;
        this.dataArray = null;
        this.waveformDataArray = null;
        
        // Set canvas dimensions
        this.canvas.width = container.offsetWidth;
        this.canvas.height = container.offsetHeight;
        
        // Add canvas to container
        this.canvas.classList.add('audio-visualizer');
        this.container.appendChild(this.canvas);
        
        // Visualization properties
        this.visualizationMode = 'bars'; // Default mode: 'bars', 'circles', 'waves', 'particles'
        this.particles = []; // For particle mode
        this.particleCount = 100;
        this.hueRotation = 0; // For color effects
        this.colorMode = 'spotify'; // Options: 'spotify', 'rainbow', 'pulse'
        
        // Create mode selector
        this.createModeSelector();
        
        // Resize event listener
        window.addEventListener('resize', this.handleResize.bind(this));
    }
    
    // Create visualization mode selector
    createModeSelector() {
        const selector = document.createElement('div');
        selector.className = 'visualizer-controls';
        
        const modes = [
            { id: 'bars', label: 'Bars', icon: 'fa-bars' },
            { id: 'circles', label: 'Circles', icon: 'fa-circle' },
            { id: 'waves', label: 'Waves', icon: 'fa-wave-square' },
            { id: 'particles', label: 'Particles', icon: 'fa-meteor' }
        ];
        
        const colors = [
            { id: 'spotify', label: 'Spotify', color: '#1DB954' },
            { id: 'rainbow', label: 'Rainbow', color: 'linear-gradient(90deg, red, orange, yellow, green, blue, indigo, violet)' },
            { id: 'pulse', label: 'Pulse', color: '#ff00ff' }
        ];
        
        // Mode buttons
        const modeContainer = document.createElement('div');
        modeContainer.className = 'visualizer-mode-buttons';
        
        modes.forEach(mode => {
            const button = document.createElement('button');
            button.className = `visualizer-mode-button ${this.visualizationMode === mode.id ? 'active' : ''}`;
            button.dataset.mode = mode.id;
            button.innerHTML = `<i class="fas ${mode.icon}"></i>`;
            button.title = mode.label;
            
            button.addEventListener('click', () => {
                // Update active button
                document.querySelectorAll('.visualizer-mode-button').forEach(btn => {
                    btn.classList.remove('active');
                });
                button.classList.add('active');
                
                // Set visualization mode
                this.visualizationMode = mode.id;
                
                // Initialize particles if needed
                if (mode.id === 'particles' && this.particles.length === 0) {
                    this.initParticles();
                }
            });
            
            modeContainer.appendChild(button);
        });
        
        // Color buttons
        const colorContainer = document.createElement('div');
        colorContainer.className = 'visualizer-color-buttons';
        
        colors.forEach(color => {
            const button = document.createElement('button');
            button.className = `visualizer-color-button ${this.colorMode === color.id ? 'active' : ''}`;
            button.dataset.color = color.id;
            button.style.background = color.color;
            button.title = color.label;
            
            button.addEventListener('click', () => {
                // Update active button
                document.querySelectorAll('.visualizer-color-button').forEach(btn => {
                    btn.classList.remove('active');
                });
                button.classList.add('active');
                
                // Set color mode
                this.colorMode = color.id;
            });
            
            colorContainer.appendChild(button);
        });
        
        selector.appendChild(modeContainer);
        selector.appendChild(colorContainer);
        this.container.appendChild(selector);
        
        // Add styling
        const style = document.createElement('style');
        style.textContent = `
            .visualizer-controls {
                position: absolute;
                bottom: 10px;
                left: 50%;
                transform: translateX(-50%);
                display: flex;
                flex-direction: column;
                gap: 5px;
                z-index: 10;
                background: rgba(0,0,0,0.5);
                padding: 5px 10px;
                border-radius: 20px;
                opacity: 0.7;
                transition: opacity 0.3s;
            }
            .visualizer-controls:hover {
                opacity: 1;
            }
            .visualizer-mode-buttons, .visualizer-color-buttons {
                display: flex;
                gap: 5px;
                justify-content: center;
            }
            .visualizer-mode-button, .visualizer-color-button {
                background: #333;
                border: none;
                color: white;
                width: 30px;
                height: 30px;
                border-radius: 50%;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s;
            }
            .visualizer-mode-button:hover, .visualizer-color-button:hover {
                background: #555;
                transform: scale(1.1);
            }
            .visualizer-mode-button.active, .visualizer-color-button.active {
                background: #1DB954;
                transform: scale(1.1);
            }
            .visualizer-color-button {
                border: 1px solid white;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Initialize particles
    initParticles() {
        this.particles = [];
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 5 + 1,
                speedX: Math.random() * 3 - 1.5,
                speedY: Math.random() * 3 - 1.5,
                color: '#1DB954'
            });
        }
    }
    
    // Initialize audio context and analyser
    init() {
        if (this.isInitialized) return;
        
        // Create audio context
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        this.audioCtx = new AudioContext();
        
        // Create analyser node for frequency data
        this.analyser = this.audioCtx.createAnalyser();
        this.analyser.fftSize = 256;
        const bufferLength = this.analyser.frequencyBinCount;
        this.dataArray = new Uint8Array(bufferLength);
        
        // Create second analyser for waveform
        this.waveformAnalyser = this.audioCtx.createAnalyser();
        this.waveformAnalyser.fftSize = 2048;
        const waveformBufferLength = this.waveformAnalyser.frequencyBinCount;
        this.waveformDataArray = new Uint8Array(waveformBufferLength);
        
        // Create media element source
        this.source = this.audioCtx.createMediaElementSource(this.audioElement);
        
        // Connect nodes
        this.source.connect(this.analyser);
        this.source.connect(this.waveformAnalyser);
        this.analyser.connect(this.audioCtx.destination);
        
        this.isInitialized = true;
    }
    
    // Handle resize events
    handleResize() {
        this.canvas.width = this.container.offsetWidth;
        this.canvas.height = this.container.offsetHeight;
        
        // Reinitialize particles if needed
        if (this.visualizationMode === 'particles') {
            this.initParticles();
        }
    }
    
    // Start visualization
    start() {
        if (!this.isInitialized) {
            this.init();
        }
        
        // Initialize particles if using particle mode
        if (this.visualizationMode === 'particles') {
            this.initParticles();
        }
        
        this.render();
    }
    
    // Stop visualization
    stop() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }
    
    // Get color based on current mode
    getColor(value, index, total) {
        switch (this.colorMode) {
            case 'spotify':
                // Spotify green gradient
                return `rgb(${Math.floor(29 + (value/255) * 50)}, ${Math.floor(185 + (value/255) * 70)}, ${Math.floor(84 + (value/255) * 40)})`;
            case 'rainbow':
                // Rainbow colors
                this.hueRotation = (this.hueRotation + 0.1) % 360;
                return `hsl(${(index / total * 360 + this.hueRotation) % 360}, 80%, 50%)`;
            case 'pulse':
                // Pulsing color based on audio level
                const intensity = Math.floor(50 + value/255 * 50);
                return `hsl(${(Date.now() / 50) % 360}, ${intensity}%, 50%)`;
            default:
                return '#1DB954';
        }
    }
    
    // Render bars visualization
    renderBars() {
        // Get frequency data
        this.analyser.getByteFrequencyData(this.dataArray);
        
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Set bar width based on canvas size and data length
        const barWidth = (this.canvas.width / this.dataArray.length) * 2.5;
        let barHeight;
        let x = 0;
        
        // Draw bars
        for (let i = 0; i < this.dataArray.length; i++) {
            barHeight = this.dataArray[i] / 2;
            
            // Get color based on current mode
            const color = this.getColor(this.dataArray[i], i, this.dataArray.length);
            
            // Create gradient
            const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
            gradient.addColorStop(0, color); // Color at top
            gradient.addColorStop(1, '#121212'); // Dark gray at bottom
            
            this.ctx.fillStyle = gradient;
            this.ctx.fillRect(x, this.canvas.height - barHeight, barWidth, barHeight);
            
            x += barWidth + 1;
        }
    }
    
    // Render circles visualization
    renderCircles() {
        // Get frequency data
        this.analyser.getByteFrequencyData(this.dataArray);
        
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        
        // Calculate average frequency value
        let sum = 0;
        for (let i = 0; i < this.dataArray.length; i++) {
            sum += this.dataArray[i];
        }
        const average = sum / this.dataArray.length;
        
        // Draw outer circle based on average volume
        const outerRadius = 50 + average / 2;
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, outerRadius, 0, Math.PI * 2);
        this.ctx.strokeStyle = this.getColor(average, 0, 1);
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
        
        // Draw circles for each frequency band
        for (let i = 0; i < this.dataArray.length; i += 8) {
            const radius = 20 + (this.dataArray[i] / 10);
            const angle = (i / this.dataArray.length) * Math.PI * 2;
            const x = centerX + Math.cos(angle) * outerRadius;
            const y = centerY + Math.sin(angle) * outerRadius;
            
            this.ctx.beginPath();
            this.ctx.arc(x, y, radius / 8, 0, Math.PI * 2);
            this.ctx.fillStyle = this.getColor(this.dataArray[i], i, this.dataArray.length);
            this.ctx.fill();
        }
    }
    
    // Render waves visualization
    renderWaves() {
        // Get time domain data (waveform)
        this.waveformAnalyser.getByteTimeDomainData(this.waveformDataArray);
        
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.lineWidth = 2;
        this.ctx.strokeStyle = this.getColor(128, 0, 1);
        
        this.ctx.beginPath();
        
        const sliceWidth = this.canvas.width / this.waveformDataArray.length;
        let x = 0;
        
        for (let i = 0; i < this.waveformDataArray.length; i++) {
            const v = this.waveformDataArray[i] / 128.0;
            const y = v * this.canvas.height / 2;
            
            if (i === 0) {
                this.ctx.moveTo(x, y);
            } else {
                this.ctx.lineTo(x, y);
            }
            
            x += sliceWidth;
        }
        
        this.ctx.lineTo(this.canvas.width, this.canvas.height / 2);
        this.ctx.stroke();
        
        // Get frequency data for additional wave visualization
        this.analyser.getByteFrequencyData(this.dataArray);
        
        // Draw frequency overlay
        this.ctx.beginPath();
        this.ctx.moveTo(0, this.canvas.height);
        
        for (let i = 0; i < this.dataArray.length; i++) {
            const x = (i / this.dataArray.length) * this.canvas.width;
            const y = this.canvas.height - this.dataArray[i];
            
            this.ctx.lineTo(x, y);
        }
        
        this.ctx.lineTo(this.canvas.width, this.canvas.height);
        this.ctx.closePath();
        
        // Create gradient for fill
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, this.getColor(255, 0, 1) + '80'); // Semi-transparent
        gradient.addColorStop(1, '#12121200'); // Transparent
        
        this.ctx.fillStyle = gradient;
        this.ctx.fill();
    }
    
    // Render particles visualization
    renderParticles() {
        // Get frequency data
        this.analyser.getByteFrequencyData(this.dataArray);
        
        // Calculate average frequency value
        let sum = 0;
        for (let i = 0; i < this.dataArray.length; i++) {
            sum += this.dataArray[i];
        }
        const average = sum / this.dataArray.length;
        
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Update and draw particles
        for (let i = 0; i < this.particles.length; i++) {
            const p = this.particles[i];
            
            // Update position
            p.x += p.speedX * (average / 100);
            p.y += p.speedY * (average / 100);
            
            // Bounce off edges
            if (p.x > this.canvas.width || p.x < 0) {
                p.speedX *= -1;
            }
            if (p.y > this.canvas.height || p.y < 0) {
                p.speedY *= -1;
            }
            
            // Keep in bounds
            p.x = Math.max(0, Math.min(this.canvas.width, p.x));
            p.y = Math.max(0, Math.min(this.canvas.height, p.y));
            
            // Update size based on audio data
            const dataIndex = Math.floor((i / this.particles.length) * this.dataArray.length);
            const adjustedSize = p.size * (0.5 + this.dataArray[dataIndex] / 255);
            
            // Update color
            p.color = this.getColor(this.dataArray[dataIndex], i, this.particles.length);
            
            // Draw particle
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, adjustedSize, 0, Math.PI * 2);
            this.ctx.fillStyle = p.color;
            this.ctx.fill();
        }
        
        // Connect nearby particles
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.strokeStyle = this.colorMode === 'spotify' ? 
                        `rgba(29, 185, 84, ${1 - distance / 100})` : 
                        `rgba(255, 255, 255, ${1 - distance / 100})`;
                    this.ctx.stroke();
                }
            }
        }
    }
    
    // Render visualization
    render() {
        // Render different visualizations based on the current mode
        switch (this.visualizationMode) {
            case 'bars':
                this.renderBars();
                break;
            case 'circles':
                this.renderCircles();
                break;
            case 'waves':
                this.renderWaves();
                break;
            case 'particles':
                this.renderParticles();
                break;
            default:
                this.renderBars();
        }
        
        // Continue animation
        this.animationId = requestAnimationFrame(this.render.bind(this));
    }
}

// Export the class
window.AudioVisualizer = AudioVisualizer;