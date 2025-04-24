console.log("Welcome to Hashify");

// Initialize the Variables
let songIndex = 0;
let audioElement = new Audio('songs/1.mp3');
let masterPlay = document.getElementById('masterPlay');
let myProgressBar = document.getElementById('myProgressBar');
let gif = document.getElementById('gif');
let masterSongName = document.getElementById('masterSongName');
let songItems = Array.from(document.getElementsByClassName('songItem'));

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
        repeatButton.style.color = '#1DB954'; // Hashify green
    } else {
        repeatButton.style.color = 'white';
    }
});

// Shuffle button event listener
shuffleButton.addEventListener('click', () => {
    isShuffle = !isShuffle;
    if (isShuffle) {
        shuffleButton.style.color = '#1DB954'; // Hashify green
    } else {
        shuffleButton.style.color = 'white';
    }
});

// Handle play/pause click
masterPlay.addEventListener('click', ()=>{
    if(audioElement.paused || audioElement.currentTime<=0){
        audioElement.play();
        masterPlay.classList.remove('fa-play-circle');
        masterPlay.classList.add('fa-pause-circle');
        gif.style.opacity = 1;
    }
    else{
        audioElement.pause();
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
    document.getElementById(index).classList.remove('fa-play-circle');
    document.getElementById(index).classList.add('fa-pause-circle');
    audioElement.src = `songs/${index+1}.mp3`;
    masterSongName.innerText = songs[index].songName;
    audioElement.currentTime = 0;
    audioElement.play();
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

Array.from(document.getElementsByClassName('songItemPlay')).forEach((element)=>{
    element.addEventListener('click', (e)=>{ 
        songIndex = parseInt(e.target.id);
        playSong(songIndex);
    })
})

document.getElementById('next').addEventListener('click', () => {
    nextSong();
})

document.getElementById('previous').addEventListener('click', () => {
    previousSong();
})

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if(e.code === 'Space') {
        e.preventDefault(); // Prevent scrolling with spacebar
        masterPlay.click();
    } else if (e.code === 'ArrowRight') {
        document.getElementById('next').click();
    } else if (e.code === 'ArrowLeft') {
        document.getElementById('previous').click();
    }
});