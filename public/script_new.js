const tracks = [
  { title: "Warriyo - Mortals [NCS Release]", duration: "03:50", audio: "songs/1.mp3", cover: "covers/1.jpg" },
  { title: "Cielo - Huma-Huma", duration: "04:12", audio: "songs/2.mp3", cover: "covers/2.jpg" },
  { title: "DEAF KEV - Invincible [NCS Release]", duration: "03:28", audio: "songs/3.mp3", cover: "covers/3.jpg" },
  { title: "Different Heaven & EH!DE - My Heart", duration: "04:47", audio: "songs/4.mp3", cover: "covers/4.jpg" },
  { title: "Janji - Heroes Tonight", duration: "03:32", audio: "songs/5.mp3", cover: "covers/5.jpg" },
  { title: "Rabba - Salam-e-Ishq", duration: "04:15", audio: "songs/2.mp3", cover: "covers/6.jpg" },
  { title: "Sakhiyaan - Salam-e-Ishq", duration: "03:20", audio: "songs/2.mp3", cover: "covers/7.jpg" },
  { title: "Bhula Dena - Salam-e-Ishq", duration: "03:43", audio: "songs/2.mp3", cover: "covers/8.jpg" },
  { title: "Tumhari Kasam - Salam-e-Ishq", duration: "04:30", audio: "songs/2.mp3", cover: "covers/9.jpg" },
  { title: "Na Jaana - Salam-e-Ishq", duration: "03:54", audio: "songs/4.mp3", cover: "covers/10.jpg" }
];

const audio = new Audio();
let currentIndex = 0;
let isPlaying = false;

const songList = document.getElementById("song-list");
const currentCover = document.getElementById("current-cover");
const currentCoverSecondary = document.getElementById("current-cover-secondary");
const currentTitle = document.getElementById("current-title");
const currentMeta = document.getElementById("current-meta");
const playButton = document.getElementById("play-button");
const prevButton = document.getElementById("prev-button");
const nextButton = document.getElementById("next-button");
const progressBar = document.getElementById("progress-bar");
const timeCurrent = document.getElementById("time-current");
const timeTotal = document.getElementById("time-total");
const volumeBar = document.getElementById("volume-bar");

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return "0:00";
  const minutes = Math.floor(seconds / 60);
  const remaining = Math.floor(seconds % 60);
  return `${minutes}:${String(remaining).padStart(2, "0")}`;
}

function renderTrackList() {
  songList.innerHTML = "";

  tracks.forEach((track, index) => {
    const item = document.createElement("button");
    item.className = "track-card";
    item.type = "button";
    item.dataset.index = String(index);
    item.innerHTML = `
      <img class="track-cover" src="${track.cover}" alt="${track.title}">
      <span class="track-copy">
        <span class="track-name">${track.title}</span>
        <span class="track-duration">${track.duration}</span>
      </span>
      <span class="track-action">${index === currentIndex && isPlaying ? "⏸" : "▶"}</span>
    `;

    item.addEventListener("click", () => {
      if (index === currentIndex) {
        togglePlayback();
      } else {
        loadTrack(index, true);
      }
    });

    songList.appendChild(item);
  });
}

function syncPlayerUi() {
  const track = tracks[currentIndex];
  currentCover.src = track.cover;
  currentCover.alt = track.title;
  currentCoverSecondary.src = track.cover;
  currentCoverSecondary.alt = track.title;
  currentTitle.textContent = track.title;
  currentMeta.textContent = `Track ${currentIndex + 1} of ${tracks.length}`;
  playButton.textContent = isPlaying ? "⏸" : "▶";
  renderTrackList();
}

function loadTrack(index, autoplay = false) {
  currentIndex = index;
  const track = tracks[currentIndex];
  audio.src = track.audio;
  timeCurrent.textContent = "0:00";
  timeTotal.textContent = track.duration;
  progressBar.value = "0";
  syncPlayerUi();

  if (autoplay) {
    playCurrentTrack();
  }
}

function playCurrentTrack() {
  audio.play()
    .then(() => {
      isPlaying = true;
      syncPlayerUi();
    })
    .catch(() => {
      isPlaying = false;
      syncPlayerUi();
    });
}

function pauseCurrentTrack() {
  audio.pause();
  isPlaying = false;
  syncPlayerUi();
}

function togglePlayback() {
  if (audio.src === "") {
    loadTrack(currentIndex, true);
    return;
  }

  if (isPlaying) {
    pauseCurrentTrack();
  } else {
    playCurrentTrack();
  }
}

function stepTrack(direction) {
  const nextIndex = (currentIndex + direction + tracks.length) % tracks.length;
  loadTrack(nextIndex, true);
}

playButton.addEventListener("click", togglePlayback);
prevButton.addEventListener("click", () => stepTrack(-1));
nextButton.addEventListener("click", () => stepTrack(1));

progressBar.addEventListener("input", () => {
  if (!Number.isFinite(audio.duration)) return;
  audio.currentTime = (Number(progressBar.value) / 100) * audio.duration;
});

volumeBar.addEventListener("input", () => {
  audio.volume = Number(volumeBar.value);
});

audio.addEventListener("timeupdate", () => {
  if (!Number.isFinite(audio.duration)) return;
  progressBar.value = String((audio.currentTime / audio.duration) * 100);
  timeCurrent.textContent = formatTime(audio.currentTime);
  timeTotal.textContent = formatTime(audio.duration);
});

audio.addEventListener("ended", () => stepTrack(1));
audio.addEventListener("pause", () => {
  isPlaying = false;
  syncPlayerUi();
});
audio.addEventListener("play", () => {
  isPlaying = true;
  syncPlayerUi();
});

document.addEventListener("keydown", (event) => {
  if (event.code === "Space") {
    event.preventDefault();
    togglePlayback();
  }
});

audio.volume = Number(volumeBar.value);
loadTrack(0, false);
