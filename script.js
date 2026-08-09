"use strict";

/* =========================================
   FLIX VIDEO EDITOR
========================================= */

const fileInput = document.getElementById("mediaInput");

const video = document.getElementById("videoPreview");
const image = document.getElementById("imagePreview");
const emptyPreview = document.getElementById("emptyPreview");

const playBtn = document.getElementById("playBtn");
const seekBar = document.getElementById("seekBar");
const currentTime = document.getElementById("currentTime");
const totalTime = document.getElementById("totalTime");

const muteBtn = document.getElementById("muteBtn");
const volume = document.getElementById("volume");

const newBtn = document.getElementById("newBtn");
const exportBtn = document.getElementById("exportBtn");
const deleteBtn = document.getElementById("deleteBtn");

const timelineClip = document.getElementById("timelineClip");

const textInput = document.getElementById("textInput");
const textSize = document.getElementById("textSize");
const textOverlay = document.getElementById("textOverlay");

const brightness = document.getElementById("brightness");
const contrast = document.getElementById("contrast");
const saturation = document.getElementById("saturation");
const blur = document.getElementById("blur");

const aspectRatio = document.getElementById("aspectRatio");
const speedSelect = document.getElementById("speedSelect");

const stickerSelect = document.getElementById("stickerSelect");
const stickerOverlay = document.getElementById("stickerOverlay");

const undoBtn = document.getElementById("undoBtn");
const redoBtn = document.getElementById("redoBtn");

const exportModal = document.getElementById("exportModal");
const exportProgress = document.getElementById("exportProgress");
const exportPercent = document.getElementById("exportPercent");
const exportStatus = document.getElementById("exportStatus");
const cancelExportBtn = document.getElementById("cancelExportBtn");


/* =========================================
   STATE
========================================= */

let mediaURL = null;
let currentFile = null;
let currentType = "";

let history = [];
let historyIndex = -1;

let exportRecorder = null;
let exportAnimation = null;
let exportCancelled = false;


/* =========================================
   HELPERS
========================================= */

function formatTime(seconds) {

    if (!Number.isFinite(seconds)) {
        return "00:00";
    }

    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);

    return (
        String(min).padStart(2, "0") +
        ":" +
        String(sec).padStart(2, "0")
    );
}


function hasVideo() {
    return (
        currentFile &&
        currentType.startsWith("video/")
    );
}


function hasMedia() {
    return !!currentFile;
}


function showEmpty() {

    emptyPreview.style.display = "block";
    video.style.display = "none";
    image.style.display = "none";

}


function showVideo() {

    emptyPreview.style.display = "none";
    video.style.display = "block";
    image.style.display = "none";

}


function showImage() {

    emptyPreview.style.display = "none";
    video.style.display = "none";
    image.style.display = "block";

}


/* =========================================
   IMPORT MEDIA
========================================= */

fileInput.addEventListener("change", function () {

    const file = this.files[0];

    if (!file) return;


    if (
        !file.type.startsWith("video/") &&
        !file.type.startsWith("image/") &&
        !file.type.startsWith("audio/")
    ) {

        alert("Unsupported media file.");
        fileInput.value = "";
        return;

    }


    if (mediaURL) {
        URL.revokeObjectURL(mediaURL);
    }


    currentFile = file;
    currentType = file.type;

    mediaURL = URL.createObjectURL(file);


    if (file.type.startsWith("video/")) {

        video.pause();

        video.src = mediaURL;

        video.load();

        showVideo();

        timelineClip.textContent =
            "🎬 " + file.name;

        playBtn.textContent = "▶";

        seekBar.value = 0;

        currentTime.textContent = "00:00";
        totalTime.textContent = "00:00";

        return;

    }


    if (file.type.startsWith("image/")) {

        image.src = mediaURL;

        showImage();

        timelineClip.textContent =
            "🖼 " + file.name;

        return;

    }


    if (file.type.startsWith("audio/")) {

        alert(
            "Audio file imported. Audio-track editing will be added with the full timeline engine."
        );

        return;

    }

});


/* =========================================
   VIDEO METADATA
========================================= */

video.addEventListener("loadedmetadata", function () {

    totalTime.textContent =
        formatTime(video.duration);

    currentTime.textContent =
        "00:00";

    seekBar.value = 0;

    video.playbackRate =
        Number(speedSelect.value);

});


/* =========================================
   PLAY / PAUSE
========================================= */

playBtn.addEventListener("click", function () {

    if (!hasVideo()) {

        alert("Please import a video first.");
        return;

    }


    if (video.paused) {

        video.play().catch(function (error) {

            console.error(error);

        });

    } else {

        video.pause();

    }

});


video.addEventListener("play", function () {

    playBtn.textContent = "⏸";

});


video.addEventListener("pause", function () {

    playBtn.textContent = "▶";

});


video.addEventListener("ended", function () {

    playBtn.textContent = "▶";

});


/* =========================================
   TIME UPDATE
========================================= */

video.addEventListener("timeupdate", function () {

    if (!Number.isFinite(video.duration)) {
        return;
    }

    seekBar.value =
        (video.currentTime / video.duration) * 100;

    currentTime.textContent =
        formatTime(video.currentTime);

});


/* =========================================
   SEEK
========================================= */

seekBar.addEventListener("input", function () {

    if (!hasVideo()) return;

    if (!Number.isFinite(video.duration)) return;

    video.currentTime =
        (Number(this.value) / 100) *
        video.duration;

});


/* =========================================
   VOLUME
========================================= */

volume.addEventListener("input", function () {

    const value =
        Number(this.value) / 100;

    video.volume = value;

    video.muted = value === 0;

    muteBtn.textContent =
        video.muted ? "🔇" : "🔊";

});


/* =========================================
   MUTE
========================================= */

muteBtn.addEventListener("click", function () {

    if (!hasVideo()) return;

    video.muted = !video.muted;

    muteBtn.textContent =
        video.muted ? "🔇" : "🔊";

});


/* =========================================
   FILTERS
========================================= */

function getFilterString() {

    return (
        "brightness(" + brightness.value + "%) " +
        "contrast(" + contrast.value + "%) " +
        "saturate(" + saturation.value + "%) " +
        "blur(" + blur.value + "px)"
    );

}


function applyFilters() {

    const filter = getFilterString();

    video.style.filter = filter;
    image.style.filter = filter;

}


brightness.addEventListener("input", function () {

    applyFilters();
    saveState();

});

contrast.addEventListener("input", function () {

    applyFilters();
    saveState();

});

saturation.addEventListener("input", function () {

    applyFilters();
    saveState();

});

blur.addEventListener("input", function () {

    applyFilters();
    saveState();

});


/* =========================================
   TEXT
========================================= */

textInput.addEventListener("input", function () {

    textOverlay.textContent =
        this.value;

    textOverlay.style.display =
        this.value.trim()
            ? "block"
            : "none";

    saveState();

});


textSize.addEventListener("input", function () {

    textOverlay.style.fontSize =
        this.value + "px";

    saveState();

});


/* =========================================
   SPEED
========================================= */

speedSelect.addEventListener("change", function () {

    const speed =
        Number(this.value);

    if (hasVideo()) {

        video.playbackRate = speed;

    }

    saveState();

});


/* =========================================
   ASPECT RATIO
========================================= */

aspectRatio.addEventListener("change", function () {

    applyAspectRatio();

    saveState();

});


function applyAspectRatio() {

    const value = aspectRatio.value;

    if (value === "auto") {

        video.style.aspectRatio = "";
        image.style.aspectRatio = "";

    } else {

        video.style.aspectRatio = value;
        image.style.aspectRatio = value;

    }

}


/* =========================================
   STICKERS
========================================= */

stickerSelect.addEventListener("change", function () {

    stickerOverlay.textContent =
        this.value;

    stickerOverlay.style.display =
        this.value ? "block" : "none";

});


/* =========================================
   NEW PROJECT
========================================= */

newBtn.addEventListener("click", resetProject);

function resetProject() {

    if (mediaURL) {

        URL.revokeObjectURL(mediaURL);
        mediaURL = null;

    }


    currentFile = null;
    currentType = "";


    video.pause();
    video.removeAttribute("src");
    video.load();

    image.removeAttribute("src");


    showEmpty();


    timelineClip.textContent =
        "No media imported";


    playBtn.textContent = "▶";

    seekBar.value = 0;

    currentTime.textContent = "00:00";
    totalTime.textContent = "00:00";


    textInput.value = "";
    textOverlay.textContent = "";
    textOverlay.style.display = "none";


    stickerSelect.value = "";
    stickerOverlay.textContent = "";
    stickerOverlay.style.display = "none";


    brightness.value = 100;
    contrast.value = 100;
    saturation.value = 100;
    blur.value = 0;


    speedSelect.value = 1;
    aspectRatio.value = "auto";


    video.playbackRate = 1;

    applyFilters();
    applyAspectRatio();


    fileInput.value = "";


    history = [];
    historyIndex = -1;

    saveState();

}


/* =========================================
   DELETE
========================================= */

deleteBtn.addEventListener("click", function () {

    if (!hasMedia()) {

        alert("There is no media to delete.");
        return;

    }

    resetProject();

});


/* =========================================
   HISTORY
========================================= */

function getState() {

    return {

        text: textInput.value,
        textSize: textSize.value,

        brightness: brightness.value,
        contrast: contrast.value,
        saturation: saturation.value,
        blur: blur.value,

        speed: speedSelect.value,
        aspectRatio: aspectRatio.value,

        sticker: stickerSelect.value

    };

}


function applyState(state) {

    if (!state) return;


    textInput.value =
        state.text || "";

    textSize.value =
        state.textSize || 40;


    brightness.value =
        state.brightness || 100;

    contrast.value =
        state.contrast || 100;

    saturation.value =
        state.saturation || 100;

    blur.value =
        state.blur || 0;


    speedSelect.value =
        state.speed || 1;

    aspectRatio.value =
        state.aspectRatio || "auto";


    stickerSelect.value =
        state.sticker || "";


    textOverlay.textContent =
        textInput.value;

    textOverlay.style.display =
        textInput.value.trim()
            ? "block"
            : "none";

    textOverlay.style.fontSize =
        textSize.value + "px";


    stickerOverlay.textContent =
        stickerSelect.value;

    stickerOverlay.style.display =
        stickerSelect.value
            ? "block"
            : "none";


    if (hasVideo()) {

        video.playbackRate =
            Number(speedSelect.value);

    }


    applyFilters();
    applyAspectRatio();

}


function saveState() {

    const state = getState();

    const last =
        history[historyIndex];

    if (
        last &&
        JSON.stringify(last) ===
        JSON.stringify(state)
    ) {

        return;

    }


    history =
        history.slice(
            0,
            historyIndex + 1
        );


    history.push(state);

    historyIndex =
        history.length - 1;


    if (history.length > 30) {

        history.shift();

        historyIndex--;

    }

}


undoBtn.addEventListener("click", function () {

    if (historyIndex <= 0) return;

    historyIndex--;

    applyState(
        history[historyIndex]
    );

});


redoBtn.addEventListener("click", function () {

    if (
        historyIndex >=
        history.length - 1
    ) {

        return;

    }


    historyIndex++;

    applyState(
        history[historyIndex]
    );

});


/* =========================================
   SIDEBAR
========================================= */

document
.querySelectorAll(".tool")
.forEach(function (tool) {

    tool.addEventListener("click", function () {

        document
        .querySelectorAll(".tool")
        .forEach(function (item) {

            item.classList.remove("active");

        });


        this.classList.add("active");


        const name =
            this.dataset.tool;


        if (name === "media") {

            fileInput.click();

        }


        if (name === "text") {

            textInput.focus();

        }


        if (name === "filters") {

            brightness.focus();

        }


        if (name === "speed") {

            speedSelect.focus();

        }


        if (name === "stickers") {

            stickerSelect.focus();

        }


        if (name === "crop") {

            toggleCrop();

        }


        if (name === "audio") {

            alert(
                "Audio import is available. Full multi-track audio editing requires the timeline engine."
            );

        }


        if (name === "transition") {

            alert(
                "Transition controls will work between multiple timeline clips once the multi-clip timeline is added."
            );

        }


        if (name === "ai") {

            alert(
                "AI Tools need an AI processing service/API. The editor UI is ready for connecting one."
            );

        }


        if (name === "thumbnail") {

            createThumbnail();

        }

    });

});


/* =========================================
   BASIC CROP MODE
========================================= */

let cropMode = false;

function toggleCrop() {

    cropMode = !cropMode;

    if (!hasMedia()) {

        alert("Import media first.");
        cropMode = false;
        return;

    }


    if (cropMode) {

        video.style.objectFit = "cover";
        image.style.objectFit = "cover";

        video.style.maxWidth = "75%";
        image.style.maxWidth = "75%";

        video.style.maxHeight = "75%";
        image.style.maxHeight = "75%";

        alert(
            "Crop preview ON. Choose an Aspect Ratio to change the crop frame."
        );

    } else {

        video.style.objectFit = "contain";
        image.style.objectFit = "contain";

        video.style.maxWidth = "92%";
        image.style.maxWidth = "92%";

        video.style.maxHeight = "88%";
        image.style.maxHeight = "88%";

    }

}


/* =========================================
   THUMBNAIL
========================================= */

function createThumbnail() {

    if (!hasVideo()) {

        alert("Import a video first.");
        return;

    }


    const canvas =
        document.createElement("canvas");

    canvas.width = 1280;
    canvas.height = 720;


    const ctx =
        canvas.getContext("2d");


    const oldTime =
        video.currentTime;


    video.pause();


    const scale =
        Math.min(
            canvas.width / video.videoWidth,
            canvas.height / video.videoHeight
        );


    const width =
        video.videoWidth * scale;

    const height =
        video.videoHeight * scale;


    const x =
        (canvas.width - width) / 2;

    const y =
        (canvas.height - height) / 2;


    ctx.fillStyle = "#000";
    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    ctx.filter =
        getFilterString();


    ctx.drawImage(
        video,
        x,
        y,
        width,
        height
    );


    ctx.filter = "none";


    if (textInput.value.trim()) {

        ctx.fillStyle = "#fff";

        ctx.font =
            "bold " +
            Math.max(
                30,
                Number(textSize.value) * 2
            ) +
            "px Arial";

        ctx.textAlign = "center";

        ctx.textBaseline = "middle";

        ctx.shadowColor = "#000";
        ctx.shadowBlur = 12;


        ctx.fillText(
            textInput.value,
            canvas.width / 2,
            canvas.height - 90
        );

    }


    canvas.toBlob(function (blob) {

        if (!blob) {

            alert("Thumbnail could not be created.");
            return;

        }


        const url =
            URL.createObjectURL(blob);


        const link =
            document.createElement("a");

        link.href = url;

        link.download =
            "flix-thumbnail.png";


        document.body.appendChild(link);

        link.click();

        link.remove();


        setTimeout(function () {

            URL.revokeObjectURL(url);

        }, 2000);

    }, "image/png");


    video.currentTime = oldTime;

}


/* =========================================
   CANVAS EXPORT
========================================= */

function getCanvasSize() {

    let width =
        video.videoWidth || 1280;

    let height =
        video.videoHeight || 720;


    const ratio =
        aspectRatio.value;


    if (ratio === "16/9") {

        width = 1280;
        height = 720;

    }


    if (ratio === "9/16") {

        width = 720;
        height = 1280;

    }


    if (ratio === "1/1") {

        width = 1080;
        height = 1080;

    }


    if (ratio === "21/9") {

        width = 1260;
        height = 540;

    }


    return {
        width,
        height
    };

}


function drawVideoToCanvas(
    ctx,
    canvas
) {

    const width =
        canvas.width;

    const height =
        canvas.height;


    ctx.fillStyle = "#000";

    ctx.fillRect(
        0,
        0,
        width,
        height
    );


    ctx.filter =
        getFilterString();


    const vw =
        video.videoWidth;

    const vh =
        video.videoHeight;


    const scale =
        Math.min(
            width / vw,
            height / vh
        );


    const drawWidth =
        vw * scale;

    const drawHeight =
        vh * scale;


    const x =
        (width - drawWidth) / 2;

    const y =
        (height - drawHeight) / 2;


    ctx.drawImage(
        video,
        x,
        y,
        drawWidth,
        drawHeight
    );


    ctx.filter = "none";


    /* TEXT */

    if (textInput.value.trim()) {

        const size =
            Number(textSize.value) *
            Math.max(
                1,
                width / 800
            );


        ctx.font =
            "bold " +
            size +
            "px Arial";

        ctx.textAlign =
            "center";

        ctx.textBaseline =
            "middle";

        ctx.fillStyle =
            "#fff";

        ctx.shadowColor =
            "#000";

        ctx.shadowBlur =
            12;


    
