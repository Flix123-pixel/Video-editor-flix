/* =====================================================
   FLIX VIDEO EDITOR - CLEAN SCRIPT
===================================================== */

"use strict";


/* =====================================================
   ELEMENTS
===================================================== */

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

const timelineClip = document.getElementById("timelineClip");

const textInput = document.getElementById("textInput");
const textSize = document.getElementById("textSize");
const textOverlay = document.getElementById("textOverlay");

const brightness = document.getElementById("brightness");
const contrast = document.getElementById("contrast");
const saturation = document.getElementById("saturation");
const blur = document.getElementById("blur");

const aspectRatio = document.getElementById("aspectRatio");

const undoBtn = document.getElementById("undoBtn");
const redoBtn = document.getElementById("redoBtn");
const splitBtn = document.getElementById("splitBtn");
const deleteBtn = document.getElementById("deleteBtn");


/* =====================================================
   STATE
===================================================== */

let mediaURL = null;
let currentType = null;

let history = [];
let historyIndex = -1;


/* =====================================================
   HELPER
===================================================== */

function formatTime(seconds) {

    if (!Number.isFinite(seconds)) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const secondsLeft = Math.floor(seconds % 60);

    return (
        String(minutes).padStart(2, "0") +
        ":" +
        String(secondsLeft).padStart(2, "0")
    );
}


function showEmpty() {

    emptyPreview.style.display = "block";

    video.style.display = "none";
    image.style.display = "none";

}


function showVideo() {

    emptyPreview.style.display = "none";

    image.style.display = "none";
    video.style.display = "block";

}


function showImage() {

    emptyPreview.style.display = "none";

    video.style.display = "none";
    image.style.display = "block";

}


/* =====================================================
   IMPORT MEDIA
===================================================== */

fileInput.addEventListener("change", function () {

    const file = this.files[0];

    if (!file) {
        return;
    }


    if (mediaURL) {
        URL.revokeObjectURL(mediaURL);
        mediaURL = null;
    }


    mediaURL = URL.createObjectURL(file);

    currentType = file.type;


    /* VIDEO */

    if (file.type.startsWith("video/")) {

        video.pause();

        video.src = mediaURL;

        video.load();

        showVideo();

        timelineClip.textContent =
            "🎬 " + file.name;

        video.currentTime = 0;

        playBtn.textContent = "▶";

        saveHistory();

        return;
    }


    /* IMAGE */

    if (file.type.startsWith("image/")) {

        image.src = mediaURL;

        showImage();

        timelineClip.textContent =
            "🖼 " + file.name;

        saveHistory();

        return;
    }


    alert("This file type is not supported.");

});


/* =====================================================
   VIDEO LOADED
===================================================== */

video.addEventListener("loadedmetadata", function () {

    totalTime.textContent =
        formatTime(video.duration);

    currentTime.textContent =
        "00:00";

    seekBar.value = 0;

});


/* =====================================================
   VIDEO ERROR
===================================================== */

video.addEventListener("error", function () {

    console.error("Video error:", video.error);

    alert(
        "This video could not be played. Please try an MP4 video encoded with H.264."
    );

});


/* =====================================================
   PLAY / PAUSE
===================================================== */

playBtn.addEventListener("click", function () {

    if (!video.src || currentType === null) {

        alert("Please import a video first.");

        return;
    }


    if (!currentType.startsWith("video/")) {

        alert("Play is available for video files only.");

        return;
    }


    if (video.paused) {

        video.play()
            .then(function () {

                playBtn.textContent = "⏸";

            })
            .catch(function (error) {

                console.error(error);

                alert("The video could not be played.");

            });

    } else {

        video.pause();

        playBtn.textContent = "▶";

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


/* =====================================================
   TIME UPDATE
===================================================== */

video.addEventListener("timeupdate", function () {

    if (!video.duration) {
        return;
    }


    seekBar.value =
        (video.currentTime / video.duration) * 100;


    currentTime.textContent =
        formatTime(video.currentTime);

});


/* =====================================================
   SEEK
===================================================== */

seekBar.addEventListener("input", function () {

    if (!video.duration) {
        return;
    }


    video.currentTime =
        (Number(this.value) / 100) *
        video.duration;

});


/* =====================================================
   MUTE
===================================================== */

muteBtn.addEventListener("click", function () {

    if (!video.src) {
        return;
    }


    video.muted = !video.muted;


    muteBtn.textContent =
        video.muted ? "🔇" : "🔊";

});


/* =====================================================
   VOLUME
===================================================== */

volume.addEventListener("input", function () {

    video.volume =
        Number(this.value) / 100;


    if (video.volume === 0) {

        video.muted = true;

        muteBtn.textContent = "🔇";

    } else {

        video.muted = false;

        muteBtn.textContent = "🔊";

    }

});


/* =====================================================
   FILTERS
===================================================== */

function applyFilters() {

    const filterString =
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


    video.style.filter = filterString;

    image.style.filter = filterString;

}


brightness.addEventListener("input", function () {

    applyFilters();

});


contrast.addEventListener("input", function () {

    applyFilters();

});


saturation.addEventListener("input", function () {

    applyFilters();

});


blur.addEventListener("input", function () {

    applyFilters();

});


/* =====================================================
   TEXT
===================================================== */

textInput.addEventListener("input", function () {

    textOverlay.textContent = this.value;


    if (this.value.trim() === "") {

        textOverlay.style.display = "none";

    } else {

        textOverlay.style.display = "block";

    }


    saveHistory();

});


textSize.addEventListener("input", function () {

    textOverlay.style.fontSize =
        this.value + "px";

});


/* =====================================================
   ASPECT RATIO
===================================================== */

aspectRatio.addEventListener("change", function () {

    const value = this.value;


    if (value === "auto") {

        video.style.aspectRatio = "auto";
        image.style.aspectRatio = "auto";

    } else {

        video.style.aspectRatio = value;
        image.style.aspectRatio = value;

    }

});


/* =====================================================
   SIDEBAR TOOLS
===================================================== */

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


            const toolName =
                this.dataset.tool;


            console.log(
                "Selected tool:",
                toolName
            );


            if (toolName === "media") {

                fileInput.click();

            }


            if (toolName === "text") {

                textInput.focus();

            }


            if (toolName === "filters") {

                brightness.focus();

            }


            if (toolName === "speed") {

                alert(
                    "Speed controls will be added next."
                );

            }


            if (toolName === "thumbnail") {

                alert(
                    "Thumbnail Maker will be added next."
                );

            }


            if (toolName === "ai") {

                alert(
                    "AI tools will be connected separately."
                );

            }

        });

    });


/* =====================================================
   NEW PROJECT
===================================================== */

newBtn.addEventListener("click", function () {

    if (mediaURL) {

        URL.revokeObjectURL(mediaURL);

        mediaURL = null;

    }


    video.pause();

    video.removeAttribute("src");

    video.load();


    image.removeAttribute("src");


    showEmpty();


    currentType = null;


    timelineClip.textContent =
        "No media imported";


    playBtn.textContent = "▶";

    seekBar.value = 0;

    currentTime.textContent = "00:00";

    totalTime.textContent = "00:00";


    textInput.value = "";

    textOverlay.textContent = "";

    textOverlay.style.display = "none";


    brightness.value = 100;
    contrast.value = 100;
    saturation.value = 100;
    blur.value = 0;


    applyFilters();


    aspectRatio.value = "auto";


    fileInput.value = "";


    saveHistory();

});


/* =====================================================
   DELETE
===================================================== */

deleteBtn.addEventListener("click", function () {

    if (!currentType) {

        alert("There is no media to delete.");

        return;
    }


    newBtn.click();

});


/* =====================================================
   SPLIT
===================================================== */

splitBtn.addEventListener("click", function () {

    if (!video.src || !video.duration) {

        alert("Please import a video first.");

        return;
    }


    const current =
        video.currentTime;


    const total =
        video.duration;


    const percent =
        (current / total) * 100;


    timelineClip.textContent =
        "✂ Split at " +
        formatTime(current);


    timelineClip.style.background =
        "linear-gradient(90deg,#5148db " +
        percent +
        "%,#756dff " +
        percent +
        "%)";


    saveHistory();

});


/* =====================================================
   UNDO / REDO
===================================================== */

function getState() {

    return {

        text: textInput.value,

        brightness: brightness.value,

        contrast: contrast.value,

        saturation: saturation.value,

        blur: blur.value,

        aspectRatio: aspectRatio.value

    };

}


function restoreState(state) {

    if (!state) {
        return;
    }


    textInput.value =
        state.text;


    brightness.value =
        state.brightness;


    contrast.value =
        state.contrast;


    saturation.value =
        state.saturation;


    blur.value =
        state.blur;


    aspectRatio.value =
        state.aspectRatio;


    textOverlay.textContent =
        state.text;


    textOverlay.style.display =
        state.text.trim()
        ? "block"
        : "none";


    applyFilters();


    if (state.aspectRatio === "auto") {

        video.style.aspectRatio = "auto";
        image.style.aspectRatio = "auto";

    } else {

        video.style.aspectRatio =
            state.aspectRatio;

        image.style.aspectRatio =
            state.aspectRatio;

    }

}


function saveHistory() {

    const state =
        getState();


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

    if (historyIndex <= 0) {

        return;
    }


    historyIndex--;

    restoreState(
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

    restoreState(
        history[historyIndex]
    );

});


/* =====================================================
   EXPORT
===================================================== */

exportBtn.addEventListener("click", async function () {

    if (!video.src || !currentType?.startsWith("video/")) {

        alert("Please import a video first.");

        return;
    }


    if (!video.captureStream) {

        alert(
            "Video export is not supported by this browser."
        );

        return;
    }


    try {

        const stream =
            video.captureStream();


        const mimeTypes = [

            "video/webm;codecs=vp9",

            "video/webm;codecs=vp8",

            "video/webm"

        ];


        let selectedType = "";


        for (const type of mimeTypes) {

            if (
                MediaRecorder.isTypeSupported(type)
            ) {

                selectedType = type;

                break;

            }

        }


        if (!selectedType) {

            alert(
                "This browser cannot create an exported video."
            );

            return;
        }


        const recorder =
            new MediaRecorder(
                stream,
                {
                    mimeType: selectedType
                }
            );


        const chunks = [];


        recorder.ondataavailable =
            function (event) {

                if (event.data.size > 0) {

                    chunks.push(event.data);

                }

            };


        recorder.onstop =
            function () {

                const blob =
                    new Blob(
                        chunks,
                        {
                            type: selectedType
                        }
                    );


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


                setTimeout(function () {

                    URL.revokeObjectURL(url);

                }, 1000);

            };


        video.currentTime = 0;


        recorder.start();


        video.play();


        video.onended =
            function () {

                recorder.stop();

            };


    } catch (error) {

        console.error(
            "Export error:",
            error
        );


        alert(
            "Export failed. Please try another video."
        );

    }

});


/* =====================================================
   INITIALIZE
===================================================== */

showEmpty();

applyFilters();

saveHistory();


/* =====================================================
   CLEANUP
===================================================== */

window.addEventListener(
    "beforeunload",
    function () {

        if (mediaURL) {

            URL.revokeObjectURL(mediaURL);

        }

    }
);
