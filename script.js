const mediaInput = document.getElementById("mediaInput");
const video = document.getElementById("videoPreview");
const image = document.getElementById("imagePreview");
const empty = document.getElementById("emptyPreview");

const playBtn = document.getElementById("playBtn");
const seek = document.getElementById("seekBar");
const currentTime = document.getElementById("currentTime");
const totalTime = document.getElementById("totalTime");

const muteBtn = document.getElementById("muteBtn");
const volume = document.getElementById("volume");

const clip = document.getElementById("timelineClip");

const textInput = document.getElementById("textInput");
const textSize = document.getElementById("textSize");
const textOverlay = document.getElementById("textOverlay");

const brightness = document.getElementById("brightness");
const contrast = document.getElementById("contrast");
const saturation = document.getElementById("saturation");
const blur = document.getElementById("blur");
const aspectRatio = document.getElementById("aspectRatio");

const newBtn = document.getElementById("newBtn");
const exportBtn = document.getElementById("exportBtn");

const splitBtn = document.getElementById("splitBtn");
const deleteBtn = document.getElementById("deleteBtn");
const undoBtn = document.getElementById("undoBtn");
const redoBtn = document.getElementById("redoBtn");

let mediaURL = null;
let history = [];
let historyPosition = -1;


/* =========================
   TIME
========================= */

function formatTime(seconds) {
    if (!isFinite(seconds)) return "00:00";

    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);

    return String(m).padStart(2, "0") +
        ":" +
        String(s).padStart(2, "0");
}


/* =========================
   IMPORT
========================= */

mediaInput.addEventListener("change", function () {

    const file = this.files[0];

    if (!file) return;

    if (mediaURL) {
        URL.revokeObjectURL(mediaURL);
    }

    mediaURL = URL.createObjectURL(file);

    console.log("FLIX IMPORT:", file.name);

    if (file.type.startsWith("video/")) {

        image.style.display = "none";
        video.style.display = "block";
        empty.style.display = "none";

        video.src = mediaURL;
        video.load();

        clip.textContent = "🎬 " + file.name;

    } else if (file.type.startsWith("image/")) {

        video.pause();
        video.removeAttribute("src");

        video.style.display = "none";
        image.style.display = "block";
        empty.style.display = "none";

        image.src = mediaURL;

        clip.textContent = "🖼 " + file.name;

    } else {

        alert("Sirf video ya image select karo.");

        return;
    }

    saveHistory();
});


/* =========================
   VIDEO LOADED
========================= */

video.addEventListener("loadedmetadata", function () {

    totalTime.textContent =
        formatTime(video.duration);

    currentTime.textContent = "00:00";

    seek.value = 0;
});


/* =========================
   VIDEO TIME
========================= */

video.addEventListener("timeupdate", function () {

    if (!video.duration) return;

    seek.value =
        (video.currentTime / video.duration) * 100;

    currentTime.textContent =
        formatTime(video.currentTime);

    totalTime.textContent =
        formatTime(video.duration);
});


/* =========================
   PLAY
========================= */

playBtn.addEventListener("click", function () {

    if (!video.src) {
        alert("Pehle video import karo.");
        return;
    }

    if (video.paused) {
        video.play();
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
   VOLUME
========================= */

volume.addEventListener("input", function () {

    video.volume =
        Number(this.value) / 100;

    if (video.volume > 0) {
        video.muted = false;
        muteBtn.textContent = "🔊";
    }
});


/* =========================
   MUTE
========================= */

muteBtn.addEventListener("click", function () {

    video.muted = !video.muted;

    muteBtn.textContent =
        video.muted ? "🔇" : "🔊";
});


/* =========================
   TEXT
========================= */

function updateText() {

    textOverlay.textContent =
        textInput.value;

    textOverlay.style.fontSize =
        textSize.value + "px";

    textOverlay.style.display =
        textInput.value.trim()
            ? "block"
            : "none";
}


textInput.addEventListener("input", function () {
    updateText();
    saveHistory();
});


textSize.addEventListener("input", function () {
    updateText();
});


/* =========================
   FILTERS
========================= */

function updateFilters() {

    video.style.filter =
        "brightness(" + brightness.value + "%) " +
        "contrast(" + contrast.value + "%) " +
        "saturate(" + saturation.value + "%) " +
        "blur(" + blur.value + "px)";

    image.style.filter =
        "brightness(" + brightness.value + "%) " +
        "contrast(" + contrast.value + "%) " +
        "saturate(" + saturation.value + "%) " +
        "blur(" + blur.value + "px)";
}


brightness.addEventListener("input", updateFilters);
contrast.addEventListener("input", updateFilters);
saturation.addEventListener("input", updateFilters);
blur.addEventListener("input", updateFilters);


/* =========================
   ASPECT RATIO
========================= */

aspectRatio.addEventListener("change", function () {

    const value = this.value;

    video.style.aspectRatio = value;
    image.style.aspectRatio = value;

    if (value === "auto") {
        video.style.aspectRatio = "auto";
        image.style.aspectRatio = "auto";
    }
});


/* =========================
   SPLIT
========================= */

splitBtn.addEventListener("click", function () {

    if (!video.src) {
        alert("Pehle video import karo.");
        return;
    }

    if (!video.duration) {
        alert("Video load hone do.");
        return;
    }

    const percent =
        (video.currentTime / video.duration) * 100;

    clip.style.background =
        "linear-gradient(90deg,#5148db " +
        percent +
        "%,#756dff " +
        percent +
        "%)";

    clip.textContent =
        "🎬 Clip 1  ✂  " +
        formatTime(video.currentTime) +
        "  |  Clip 2";

    saveHistory();
});


/* =========================
   DELETE
========================= */

deleteBtn.addEventListener("click", function () {

    if (!mediaURL) {
        alert("Pehle media import karo.");
        return;
    }

    video.pause();

    video.removeAttribute("src");
    video.load();

    image.removeAttribute("src");

    video.style.display = "none";
    image.style.display = "none";
    empty.style.display = "block";

    clip.textContent =
        "No media imported";

    seek.value = 0;

    currentTime.textContent =
        "00:00";

    totalTime.textContent =
        "00:00";

    URL.revokeObjectURL(mediaURL);

    mediaURL = null;

    mediaInput.value = "";

    saveHistory();
});


/* =========================
   NEW
========================= */

newBtn.addEventListener("click", function () {

    video.pause();

    video.removeAttribute("src");
    video.load();

    image.removeAttribute("src");

    video.style.display = "none";
    image.style.display = "none";
    empty.style.display = "block";

    clip.textContent =
        "No media imported";

    textInput.value = "";
    textOverlay.textContent = "";
    textOverlay.style.display = "none";

    brightness.value = 100;
    contrast.value = 100;
    saturation.value = 100;
    blur.value = 0;

    aspectRatio.value = "auto";

    updateFilters();
    updateText();

    seek.value = 0;

    currentTime.textContent = "00:00";
    totalTime.textContent = "00:00";

    if (mediaURL) {
        URL.revokeObjectURL(mediaURL);
        mediaURL = null;
    }

    mediaInput.value = "";

    history = [];
    historyPosition = -1;

    saveHistory();
});


/* =========================
   HISTORY
========================= */

function getState() {

    return {
        text: textInput.value,
        textSize: textSize.value,
        brightness: brightness.value,
        contrast: contrast.value,
        saturation: saturation.value,
        blur: blur.value,
        aspect: aspectRatio.value
    };
}


function saveHistory() {

    const state =
        JSON.stringify(getState());

    history =
        history.slice(0, historyPosition + 1);

    history.push(state);

    historyPosition =
        history.length - 1;

    if (history.length > 30) {
        history.shift();
        historyPosition--;
    }
}


function restoreState(state) {

    const data =
        JSON.parse(state);

    textInput.value = data.text;
    textSize.value = data.textSize;
    brightness.value = data.brightness;
    contrast.value = data.contrast;
    saturation.value = data.saturation;
    blur.value = data.blur;
    aspectRatio.value = data.aspect;

    updateText();
    updateFilters();

    video.style.aspectRatio = data.aspect;
    image.style.aspectRatio = data.aspect;
}


undoBtn.addEventListener("click", function () {

    if (historyPosition <= 0) return;

    historyPosition--;

    restoreState(
        history[historyPosition]
    );
});


redoBtn.addEventListener("click", function () {

    if (
        historyPosition >=
        history.length - 1
    ) return;

    historyPosition++;

    restoreState(
        history[historyPosition]
    );
});


/* =========================
   EXPORT
========================= */

exportBtn.addEventListener("click", async function () {

    if (!video.src) {
        alert("Pehle video import karo.");
        return;
    }

    if (!video.captureStream) {
        alert(
            "Is browser mein video export supported nahi hai."
        );
        return;
    }

    try {

        const stream =
            video.captureStream();

        const chunks = [];

        const recorder =
            new MediaRecorder(stream);

        recorder.ondataavailable =
            function (event) {

                if (event.data.size) {
                    chunks.push(event.data);
                }
            };

        recorder.onstop =
            function () {

                const blob =
                    new Blob(chunks, {
                        type: "video/webm"
                    });

                const url =
                    URL.createObjectURL(blob);

                const link =
                    document.createElement("a");

                link.href = url;
                link.download =
                    "flix-video.webm";

                document.body.appendChild(link);

                link.click();

                link.remove();

                URL.revokeObjectURL(url);
            };

        video.currentTime = 0;

        recorder.start();

        await video.play();

        video.onended = function () {

            if (recorder.state !== "inactive") {
                recorder.stop();
            }

        };

    } catch (error) {

        console.error(error);

        alert("Export nahi ho paya.");

    }
});


/* =========================
   SIDEBAR
========================= */

document
    .querySelectorAll(".tool")
    .forEach(function (tool) {

        tool.addEventListener("click", function () {

            document
                .querySelectorAll(".tool")
                .forEach(function (x) {
                    x.classList.remove("active");
                });

            this.classList.add("active");

            const name =
                this.dataset.tool;

            if (name === "text") {
                textInput.focus();
            }

            if (name === "filters") {
                brightness.focus();
            }

        });

    });


/* =========================
   START
========================= */

video.volume = 1;

updateFilters();

updateText();

saveHistory();

console.log(
    "✅ FLIX VIDEO EDITOR READY"
);a
