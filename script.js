const fileInput = document.getElementById("fileInput");
const video = document.getElementById("video");
const empty = document.getElementById("empty");
const clip = document.getElementById("clip");

const playButton = document.getElementById("playButton");
const seek = document.getElementById("seek");
const time = document.getElementById("time");
const duration = document.getElementById("duration");
const muteButton = document.getElementById("muteButton");
const volume = document.getElementById("volume");

let videoURL = null;


/* =========================
   IMPORT VIDEO
========================= */

fileInput.addEventListener("change", function () {

    const file = this.files[0];

    if (!file) return;

    console.log("Selected:", file.name);
    console.log("Type:", file.type);

    if (!file.type.startsWith("video/")) {
        alert("Please ek video file select karo.");
        return;
    }

    /* Purana URL remove */
    if (videoURL) {
        URL.revokeObjectURL(videoURL);
    }

    /* Naya video URL */
    videoURL = URL.createObjectURL(file);

    /* Video set */
    video.src = videoURL;

    /* Preview show */
    video.style.display = "block";
    empty.style.display = "none";

    /* Timeline */
    clip.textContent = "🎬 " + file.name;

    /* Video load */
    video.load();

});


/* =========================
   VIDEO LOADED
========================= */

video.addEventListener("loadedmetadata", function () {

    console.log("Video loaded:", video.duration);

    duration.textContent =
        formatTime(video.duration);

    time.textContent =
        "00:00 / " +
        formatTime(video.duration);

    seek.value = 0;

});


/* =========================
   VIDEO ERROR
========================= */

video.addEventListener("error", function () {

    console.log("Video error:", video.error);

    alert(
        "Ye video format browser mein play nahi ho raha. MP4 (H.264) video try karo."
    );

});


/* =========================
   TIME UPDATE
========================= */

video.addEventListener("timeupdate", function () {

    if (!video.duration) return;

    seek.value =
        (video.currentTime / video.duration) * 100;

    time.textContent =
        formatTime(video.currentTime) +
        " / " +
        formatTime(video.duration);

});


/* =========================
   PLAY / PAUSE
========================= */

playButton.addEventListener("click", function () {

    if (!video.src) {

        alert("Pehle video import karo.");

        return;
    }

    if (video.paused) {

        video.play();

        playButton.textContent = "⏸";

    } else {

        video.pause();

        playButton.textContent = "▶";

    }

});


video.addEventListener("play", function () {

    playButton.textContent = "⏸";

});


video.addEventListener("pause", function () {

    playButton.textContent = "▶";

});


/* =========================
   SEEK
========================= */

seek.addEventListener("input", function () {

    if (!video.duration) return;

    video.currentTime =
        (Number(this.value) / 100) *
        video.duration;

});


/* =========================
   MUTE
========================= */

muteButton.addEventListener("click", function () {

    video.muted = !video.muted;

    muteButton.textContent =
        video.muted ? "🔇" : "🔊";

});


/* =========================
   VOLUME
========================= */

volume.addEventListener("input", function () {

    video.volume =
        Number(this.value) / 100;

    if (video.volume > 0) {

        video.muted = false;

        muteButton.textContent = "🔊";

    }

});


/* =========================
   TIME FORMAT
========================= */

function formatTime(seconds) {

    if (!isFinite(seconds)) {
        return "00:00";
    }

    const minutes =
        Math.floor(seconds / 60);

    const secondsLeft =
        Math.floor(seconds % 60);

    return String(minutes).padStart(2, "0") +
        ":" +
        String(secondsLeft).padStart(2, "0");

}


/* =========================
   NEW PROJECT
========================= */

document
    .getElementById("newButton")
    .addEventListener("click", function () {

        video.pause();

        video.removeAttribute("src");

        video.load();

        video.style.display = "none";

        empty.style.display = "block";

        clip.textContent =
            "🎬 No video imported";

        seek.value = 0;

        time.textContent =
            "00:00 / 00:00";

        duration.textContent =
            "00:00";

        fileInput.value = "";

    });


/* =========================
   CLEAN URL
========================= */

window.addEventListener("beforeunload", function () {

    if (videoURL) {
        URL.revokeObjectURL(videoURL);
    }

});
