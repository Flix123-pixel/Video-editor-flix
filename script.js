/* =====================================================
FLIX VIDEO EDITOR - SCRIPT.JS
VIDEO + PHOTO IMPORT / PREVIEW
===================================================== */

const mediaInput = document.getElementById("mediaInput");

const videoPreview = document.getElementById("videoPreview");
const photoPreview = document.getElementById("photoPreview");

const emptyPreview = document.getElementById("emptyPreview");

const playBtn = document.getElementById("playBtn");
const seekBar = document.getElementById("seekBar");

const currentTime = document.getElementById("currentTime");
const totalTime = document.getElementById("totalTime");

const muteBtn = document.getElementById("muteBtn");
const fullscreenBtn = document.getElementById("fullscreenBtn");

const mediaClip = document.getElementById("mediaClip");

const brightness = document.getElementById("brightness");
const contrast = document.getElementById("contrast");
const saturation = document.getElementById("saturation");
const blur = document.getElementById("blur");

const volume = document.getElementById("volume");
const speed = document.getElementById("speed");

const textInput = document.getElementById("textInput");
const textOverlay = document.getElementById("textOverlay");

const aspectRatio = document.getElementById("aspectRatio");

const newBtn = document.getElementById("newBtn");
const exportBtn = document.getElementById("exportBtn");

const undoBtn = document.getElementById("undoBtn");
const redoBtn = document.getElementById("redoBtn");
const splitBtn = document.getElementById("splitBtn");
const deleteBtn = document.getElementById("deleteBtn");

let mediaURL = null;
let currentFile = null;

/* =====================================================
TIME FORMAT
===================================================== */

function formatTime(seconds) {

if (!isFinite(seconds)) {
    return "00:00";
}

const minutes = Math.floor(seconds / 60);

const secondsPart = Math.floor(seconds % 60);

return (
    String(minutes).padStart(2, "0") +
    ":" +
    String(secondsPart).padStart(2, "0")
);

}

/* =====================================================
IMPORT VIDEO / PHOTO
===================================================== */

mediaInput.addEventListener("change", function () {

const file = this.files[0];

if (!file) return;

currentFile = file;

/* Old URL remove */

if (mediaURL) {

    URL.revokeObjectURL(mediaURL);

}

mediaURL = URL.createObjectURL(file);


/* ================= VIDEO ================= */

if (file.type.startsWith("video/")) {

    photoPreview.style.display = "none";

    videoPreview.style.display = "block";

    emptyPreview.style.display = "none";

    videoPreview.src = mediaURL;

    videoPreview.load();

    mediaClip.textContent =
        "🎬 " + file.name;

    currentTime.textContent =
        "00:00";

    totalTime.textContent =
        "00:00";

    seekBar.value = 0;

    videoPreview.playbackRate = 1;

}


/* ================= PHOTO ================= */

else if (file.type.startsWith("image/")) {

    videoPreview.pause();

    videoPreview.removeAttribute("src");

    videoPreview.load();

    videoPreview.style.display = "none";

    photoPreview.style.display = "block";

    emptyPreview.style.display = "none";

    photoPreview.src = mediaURL;

    mediaClip.textContent =
        "🖼️ " + file.name;

    currentTime.textContent =
        "00:00";

    totalTime.textContent =
        "00:00";

    seekBar.value = 0;

}

});

/* =====================================================
VIDEO METADATA
===================================================== */

videoPreview.addEventListener(
"loadedmetadata",
function () {

    totalTime.textContent =
        formatTime(videoPreview.duration);

    currentTime.textContent =
        "00:00";

    seekBar.value = 0;

}

);

/* =====================================================
VIDEO TIME UPDATE
===================================================== */

videoPreview.addEventListener(
"timeupdate",
function () {

    if (!videoPreview.duration) return;

    seekBar.value =
        (videoPreview.currentTime /
            videoPreview.duration) * 100;

    currentTime.textContent =
        formatTime(videoPreview.currentTime);

}

);

/* =====================================================
PLAY / PAUSE
===================================================== */

playBtn.addEventListener(
"click",
function () {

    if (!videoPreview.src) {

        alert(
            "Pehle video import karo."
        );

        return;

    }

    if (videoPreview.paused) {

        videoPreview.play();

        playBtn.textContent = "⏸";

    } else {

        videoPreview.pause();

        playBtn.textContent = "▶";

    }

}

);

videoPreview.addEventListener(
"play",
function () {

    playBtn.textContent = "⏸";

}

);

videoPreview.addEventListener(
"pause",
function () {

    playBtn.textContent = "▶";

}

);

/* =====================================================
SEEK
===================================================== */

seekBar.addEventListener(
"input",
function () {

    if (!videoPreview.duration) return;

    videoPreview.currentTime =
        videoPreview.duration *
        (Number(this.value) / 100);

}

);

/* =====================================================
MUTE
===================================================== */

muteBtn.addEventListener(
"click",
function () {

    videoPreview.muted =
        !videoPreview.muted;

    muteBtn.textContent =
        videoPreview.muted
            ? "🔇"
            : "🔊";

}

);

/* =====================================================
VOLUME
===================================================== */

volume.addEventListener(
"input",
function () {

    videoPreview.volume =
        Number(this.value) / 100;

    if (videoPreview.volume > 0) {

        videoPreview.muted = false;

        muteBtn.textContent = "🔊";

    }

}

);

/* =====================================================
SPEED
===================================================== */

speed.addEventListener(
"change",
function () {

    videoPreview.playbackRate =
        Number(this.value);

}

);

/* =====================================================
VIDEO FILTERS
===================================================== */

function applyFilters() {

videoPreview.style.filter =
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

photoPreview.style.filter =
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

/* =====================================================
ASPECT RATIO
===================================================== */

aspectRatio.addEventListener(
"change",
function () {

    const preview =
        document.getElementById("preview");

    if (this.value === "auto") {

        preview.style.aspectRatio = "";

    } else {

        preview.style.aspectRatio =
            this.value;

    }

}

);

/* =====================================================
TEXT
===================================================== */

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

/* =====================================================
FULLSCREEN
===================================================== */

fullscreenBtn.addEventListener(
"click",
function () {

    const preview =
        document.getElementById("preview");

    if (!document.fullscreenElement) {

        preview.requestFullscreen();

    } else {

        document.exitFullscreen();

    }

}

);

/* =====================================================
NEW PROJECT
===================================================== */

newBtn.addEventListener(
"click",
function () {

    if (
        !confirm(
            "New project start karna hai?"
        )
    ) {
        return;
    }

    videoPreview.pause();

    videoPreview.removeAttribute("src");

    videoPreview.load();

    photoPreview.removeAttribute("src");

    videoPreview.style.display =
        "none";

    photoPreview.style.display =
        "none";

    emptyPreview.style.display =
        "block";

    mediaClip.textContent =
        "No media";

    currentTime.textContent =
        "00:00";

    totalTime.textContent =
        "00:00";

    seekBar.value = 0;

    textInput.value = "";

    textOverlay.textContent = "";

    textOverlay.style.display =
        "none";

    brightness.value = 100;

    contrast.value = 100;

    saturation.value = 100;

    blur.value = 0;

    applyFilters();

}

);

/* =====================================================
DELETE MEDIA
===================================================== */

deleteBtn.addEventListener(
"click",
function () {

    if (
        videoPreview.style.display === "none" &&
        photoPreview.style.display === "none"
    ) {

        alert("Delete karne ke liye media nahi hai.");

        return;

    }

    videoPreview.pause();

    videoPreview.removeAttribute("src");

    videoPreview.load();

    photoPreview.removeAttribute("src");

    videoPreview.style.display =
        "none";

    photoPreview.style.display =
        "none";

    emptyPreview.style.display =
        "block";

    mediaClip.textContent =
        "No media";

    seekBar.value = 0;

    currentTime.textContent =
        "00:00";

    totalTime.textContent =
        "00:00";

}

);

/* =====================================================
SPLIT
===================================================== */

splitBtn.addEventListener(
"click",
function () {

    if (!videoPreview.src) {

        alert(
            "Pehle video import karo."
        );

        return;

    }

    if (!videoPreview.duration) {

        alert(
            "Video load hone do."
        );

        return;

    }

    const percentage =
        (
            videoPreview.currentTime /
            videoPreview.duration
        ) * 100;

    mediaClip.textContent =
        "✂️ Split at " +
        formatTime(
            videoPreview.currentTime
        );

    mediaClip.style.background =
        "linear-gradient(90deg,#5148db " +
        percentage +
        "%,#e08a2e " +
        percentage +
        "%)";

}

);

/* =====================================================
UNDO / REDO
===================================================== */

undoBtn.addEventListener(
"click",
function () {

    alert(
        "Undo system next update mein add hoga."
    );

}

);

redoBtn.addEventListener(
"click",
function () {

    alert(
        "Redo system next update mein add hoga."
    );

}

);

/* =====================================================
EXPORT
===================================================== */

exportBtn.addEventListener(
"click",
function () {

    if (
        !currentFile
    ) {

        alert(
            "Pehle video ya photo import karo."
        );

        return;

    }

    alert(
        "Export system next update mein add hoga."
    );

}

);

/* =====================================================
TOOL BUTTONS
===================================================== */

document
.querySelectorAll(".tool")
.forEach(function (tool) {

    tool.addEventListener(
        "click",
        function () {

            document
                .querySelectorAll(".tool")
                .forEach(function (item) {

                    item.classList.remove(
                        "active"
                    );

                });

            this.classList.add("active");

            const feature =
                this.dataset.tool;

            const propertyTitle =
                document.getElementById(
                    "propertyTitle"
                );

            if (propertyTitle) {

                propertyTitle.textContent =
                    feature;

            }

        }
    );

});

/* =====================================================
INITIAL FILTER
===================================================== */

applyFilters();

console.log(
"Flix Video Editor loaded successfully."
);
