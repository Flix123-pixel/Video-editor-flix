/* =========================================
   FLIX VIDEO EDITOR - SCRIPT.JS
========================================= */


/* =========================
   ELEMENTS
========================= */

const mediaInput = document.getElementById("mediaInput");

const video = document.getElementById("videoPreview");

const image = document.getElementById("imagePreview");

const emptyPreview =
    document.getElementById("emptyPreview");

const playBtn =
    document.getElementById("playBtn");

const seekBar =
    document.getElementById("seekBar");

const currentTime =
    document.getElementById("currentTime");

const totalTime =
    document.getElementById("totalTime");

const muteBtn =
    document.getElementById("muteBtn");

const volume =
    document.getElementById("volume");

const timelineClip =
    document.getElementById("timelineClip");

const newBtn =
    document.getElementById("newBtn");

const textInput =
    document.getElementById("textInput");

const textSize =
    document.getElementById("textSize");

const textOverlay =
    document.getElementById("textOverlay");

const brightness =
    document.getElementById("brightness");

const contrast =
    document.getElementById("contrast");

const saturation =
    document.getElementById("saturation");

const blur =
    document.getElementById("blur");

const aspectRatio =
    document.getElementById("aspectRatio");


let mediaURL = null;


/* =========================
   INITIAL STATE
========================= */

video.style.display = "none";
image.style.display = "none";
textOverlay.style.display = "none";


/* =========================
   IMPORT MEDIA
========================= */

mediaInput.addEventListener("change", function () {

    const file = this.files[0];

    if (!file) return;

    console.log("Imported:", file.name);
    console.log("Type:", file.type);

    /* Old URL remove */

    if (mediaURL) {

        URL.revokeObjectURL(mediaURL);

        mediaURL = null;

    }


    /* Create new URL */

    mediaURL =
        URL.createObjectURL(file);


    /* =========================
       VIDEO
    ========================= */

    if (file.type.startsWith("video/")) {

        image.style.display = "none";

        video.style.display = "block";

        emptyPreview.style.display = "none";

        video.pause();

        video.src = mediaURL;

        video.load();

        timelineClip.textContent =
            "🎬 " + file.name;

        seekBar.value = 0;

        currentTime.textContent =
            "00:00";

        totalTime.textContent =
            "00:00";

        console.log("Video preview loaded.");

    }


    /* =========================
       IMAGE
    ========================= */

    else if (file.type.startsWith("image/")) {

        video.pause();

        video.removeAttribute("src");

        video.style.display = "none";

        image.src = mediaURL;

        image.style.display = "block";

        emptyPreview.style.display = "none";

        timelineClip.textContent =
            "🖼️ " + file.name;

        console.log("Image preview loaded.");

    }


    /* =========================
       AUDIO
    ========================= */

    else if (file.type.startsWith("audio/")) {

        alert(
            "Audio import ho gaya. Audio preview feature next step mein add karenge."
        );

        timelineClip.textContent =
            "🎵 " + file.name;

    }


    else {

        alert(
            "Ye file supported nahi hai."
        );

    }

});


/* =========================
   VIDEO METADATA
========================= */

video.addEventListener(
    "loadedmetadata",
    function () {

        if (!isFinite(video.duration)) {
            return;
        }

        totalTime.textContent =
            formatTime(video.duration);

        currentTime.textContent =
            "00:00";

        seekBar.value = 0;

        console.log(
            "Duration:",
            video.duration
        );

    }
);


/* =========================
   VIDEO TIME UPDATE
========================= */

video.addEventListener(
    "timeupdate",
    function () {

        if (!video.duration) {
            return;
        }

        const percent =
            (video.currentTime /
            video.duration) * 100;

        seekBar.value = percent;

        currentTime.textContent =
            formatTime(
                video.currentTime
            );

    }
);


/* =========================
   PLAY / PAUSE
========================= */

playBtn.addEventListener(
    "click",
    function () {

        if (!video.src) {

            alert(
                "Pehle video import karo."
            );

            return;

        }


        if (video.paused) {

            video.play()
                .catch(function (error) {

                    console.log(
                        "Play error:",
                        error
                    );

                });

        } else {

            video.pause();

        }

    }
);


/* =========================
   PLAY BUTTON ICON
========================= */

video.addEventListener(
    "play",
    function () {

        playBtn.textContent = "⏸";

    }
);


video.addEventListener(
    "pause",
    function () {

        playBtn.textContent = "▶";

    }
);


/* =========================
   SEEK
========================= */

seekBar.addEventListener(
    "input",
    function () {

        if (!video.duration) {
            return;
        }

        video.currentTime =
            (Number(this.value) / 100) *
            video.duration;

    }
);


/* =========================
   MUTE
========================= */

muteBtn.addEventListener(
    "click",
    function () {

        video.muted =
            !video.muted;

        muteBtn.textContent =
            video.muted
            ? "🔇"
            : "🔊";

    }
);


/* =========================
   VOLUME
========================= */

volume.addEventListener(
    "input",
    function () {

        video.volume =
            Number(this.value) / 100;

        if (video.volume > 0) {

            video.muted = false;

            muteBtn.textContent =
                "🔊";

        }

    }
);


/* =========================
   TEXT
========================= */

textInput.addEventListener(
    "input",
    function () {

        textOverlay.textContent =
            this.value;

        if (this.value.trim() !== "") {

            textOverlay.style.display =
                "block";

        } else {

            textOverlay.style.display =
                "none";

        }

    }
);


/* =========================
   TEXT SIZE
========================= */

textSize.addEventListener(
    "input",
    function () {

        textOverlay.style.fontSize =
            this.value + "px";

    }
);


/* =========================
   FILTERS
========================= */

function applyFilters() {

    video.style.filter =
        "brightness(" +
        brightness.value +
        "%) " +

        "contrast(" +
        contrast.value +
        "%) " +

        "saturate(" +
        saturation.value +
        "%) " +

        "blur(" +
        blur.value +
        "px)";

}


brightness.addEventListener(
    "input",
    applyFilters
);

contrast.addEventListener(
    "input",
    applyFilters
);

saturation.addEventListener(
    "input",
    applyFilters
);

blur.addEventListener(
    "input",
    applyFilters
);


/* =========================
   ASPECT RATIO
========================= */

aspectRatio.addEventListener(
    "change",
    function () {

        if (this.value === "auto") {

            video.style.aspectRatio =
                "auto";

        } else {

            video.style.aspectRatio =
                this.value;

        }

    }
);


/* =========================
   NEW PROJECT
========================= */

newBtn.addEventListener(
    "click",
    function () {

        video.pause();

        video.removeAttribute("src");

        video.load();

        image.removeAttribute("src");

        video.style.display = "none";

        image.style.display = "none";

        emptyPreview.style.display =
            "block";

        timelineClip.textContent =
            "No media imported";

        currentTime.textContent =
            "00:00";

        totalTime.textContent =
            "00:00";

        seekBar.value = 0;

        mediaInput.value = "";

        textInput.value = "";

        textOverlay.textContent = "";

        textOverlay.style.display =
            "none";

    }
);


/* =========================
   VIDEO ERROR
========================= */

video.addEventListener(
    "error",
    function () {

        console.log(
            "VIDEO ERROR:",
            video.error
        );

        alert(
            "Video browser mein play nahi ho raha. Ek normal MP4 video try karo."
        );

    }
);


/* =========================
   TIME FORMAT
========================= */

function formatTime(seconds) {

    if (
        !isFinite(seconds) ||
        seconds < 0
    ) {

        return "00:00";

    }

    const minutes =
        Math.floor(seconds / 60);

    const secs =
        Math.floor(seconds % 60);

    return (
        String(minutes).padStart(2, "0")
        +
        ":" +
        String(secs).padStart(2, "0")
    );

}


/* =========================
   CLEANUP
========================= */

window.addEventListener(
    "beforeunload",
    function () {

        if (mediaURL) {

            URL.revokeObjectURL(
                mediaURL
            );

        }

    }
);
