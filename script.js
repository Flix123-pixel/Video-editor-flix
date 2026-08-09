"use strict";

/* =========================================
   FLIX VIDEO EDITOR - WORKING SCRIPT
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


/* =========================================
   STATE
========================================= */

let mediaURL = null;
let currentFile = null;
let currentType = "";

let history = [];
let historyIndex = -1;


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


/* =========================================
   PREVIEW
========================================= */

function showEmpty() {

    emptyPreview.style.display = "flex";
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
   IMPORT
========================================= */

fileInput.addEventListener("change", function () {

    const file = this.files[0];

    if (!file) return;


    if (
        !file.type.startsWith("video/") &&
        !file.type.startsWith("image/")
    ) {

        alert(
            "Please select a supported video or image file."
        );

        fileInput.value = "";
        return;
    }


    if (mediaURL) {
        URL.revokeObjectURL(mediaURL);
    }


    currentFile = file;
    currentType = file.type;

    mediaURL = URL.createObjectURL(file);


    /* VIDEO */

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


    /* IMAGE */

    if (file.type.startsWith("image/")) {

        image.src = mediaURL;

        showImage();

        timelineClip.textContent =
            "🖼 " + file.name;

    }

});


/* =========================================
   VIDEO METADATA
========================================= */

video.addEventListener(
    "loadedmetadata",
    function () {

        totalTime.textContent =
            formatTime(video.duration);

        currentTime.textContent =
            "00:00";

        seekBar.value = 0;

    }
);


/* =========================================
   VIDEO ERROR
========================================= */

video.addEventListener(
    "error",
    function () {

        console.error(
            "Video error:",
            video.error
        );

        alert(
            "This video could not be played. Please try an MP4 video encoded with H.264."
        );

    }
);


/* =========================================
   PLAY / PAUSE
========================================= */

playBtn.addEventListener(
    "click",
    function () {

        if (!hasVideo()) {

            alert(
                "Please import a video first."
            );

            return;
        }


        if (video.paused) {

            video.play()
                .catch(function (error) {

                    console.error(error);

                    alert(
                        "The video could not be played."
                    );

                });

        } else {

            video.pause();

        }

    }
);


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


video.addEventListener(
    "ended",
    function () {

        playBtn.textContent = "▶";

    }
);


/* =========================================
   TIME
========================================= */

video.addEventListener(
    "timeupdate",
    function () {

        if (!Number.isFinite(video.duration)) {
            return;
        }


        seekBar.value =
            (video.currentTime / video.duration) * 100;


        currentTime.textContent =
            formatTime(video.currentTime);

    }
);


/* =========================================
   SEEK
========================================= */

seekBar.addEventListener(
    "input",
    function () {

        if (!hasVideo()) return;

        if (!Number.isFinite(video.duration)) {
            return;
        }


        video.currentTime =
            (Number(this.value) / 100) *
            video.duration;

    }
);


/* =========================================
   VOLUME
========================================= */

volume.addEventListener(
    "input",
    function () {

        const value =
            Number(this.value) / 100;

        video.volume = value;

        video.muted = value === 0;

        muteBtn.textContent =
            video.muted ? "🔇" : "🔊";

    }
);


/* =========================================
   MUTE
========================================= */

muteBtn.addEventListener(
    "click",
    function () {

        if (!hasVideo()) return;

        video.muted = !video.muted;

        muteBtn.textContent =
            video.muted ? "🔇" : "🔊";

    }
);


/* =========================================
   FILTERS
========================================= */

function applyFilters() {

    const filter =
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


    video.style.filter = filter;
    image.style.filter = filter;

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


/* =========================================
   TEXT
========================================= */

textInput.addEventListener(
    "input",
    function () {

        textOverlay.textContent =
            this.value;

        textOverlay.style.display =
            this.value.trim()
                ? "block"
                : "none";

    }
);


textSize.addEventListener(
    "input",
    function () {

        textOverlay.style.fontSize =
            this.value + "px";

    }
);


/* =========================================
   ASPECT RATIO
========================================= */

aspectRatio.addEventListener(
    "change",
    function () {

        if (this.value === "auto") {

            video.style.aspectRatio = "";
            image.style.aspectRatio = "";

        } else {

            video.style.aspectRatio =
                this.value;

            image.style.aspectRatio =
                this.value;

        }

    }
);


/* =========================================
   NEW PROJECT
========================================= */

newBtn.addEventListener(
    "click",
    function () {

        if (mediaURL) {

            URL.revokeObjectURL(
                mediaURL
            );

        }

        mediaURL = null;
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

        currentTime.textContent =
            "00:00";

        totalTime.textContent =
            "00:00";


        textInput.value = "";

        textOverlay.textContent = "";

        textOverlay.style.display =
            "none";


        brightness.value = 100;
        contrast.value = 100;
        saturation.value = 100;
        blur.value = 0;

        aspectRatio.value = "auto";


        applyFilters();


        fileInput.value = "";

    }
);


/* =========================================
   DELETE
========================================= */

deleteBtn.addEventListener(
    "click",
    function () {

        if (!hasMedia()) {

            alert(
                "There is no media to delete."
            );

            return;
        }

        newBtn.click();

    }
);


/* =========================================
   SPLIT
========================================= */

splitBtn.addEventListener(
    "click",
    function () {

        if (!hasVideo()) {

            alert(
                "Please import a video first."
            );

            return;
        }


        const position =
            formatTime(video.currentTime);


        timelineClip.textContent =
            "✂ Split at " + position;

    }
);


/* =========================================
   SAVE STATE
========================================= */

function getState() {

    return {

        text: textInput.value,

        textSize: textSize.value,

        brightness: brightness.value,

        contrast: contrast.value,

        saturation: saturation.value,

        blur: blur.value,

        aspectRatio: aspectRatio.value

    };

}


function applyState(state) {

    if (!state) return;


    textInput.value =
        state.text;

    textSize.value =
        state.textSize;

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


    textOverlay.style.fontSize =
        state.textSize + "px";


    applyFilters();


    if (state.aspectRatio === "auto") {

        video.style.aspectRatio = "";
        image.style.aspectRatio = "";

    } else {

        video.style.aspectRatio =
            state.aspectRatio;

        image.style.aspectRatio =
            state.aspectRatio;

    }

}


function saveState() {

    const state = getState();

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


/* =========================================
   UNDO
========================================= */

undoBtn.addEventListener(
    "click",
    function () {

        if (historyIndex <= 0) {

            return;
        }


        historyIndex--;

        applyState(
            history[historyIndex]
        );

    }
);


/* =========================================
   REDO
========================================= */

redoBtn.addEventListener(
    "click",
    function () {

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

    }
);


/* =========================================
   SIDEBAR TOOLS
========================================= */

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


                if (name === "audio") {

                    alert(
                        "Audio panel is ready for the next feature."
                    );

                }


                if (name === "stickers") {

                    alert(
                        "Sticker feature will be added next."
                    );

                }


                if (name === "transition") {

                    alert(
                        "Transition feature will be added next."
                    );

                }


                if (name === "speed") {

                    alert(
                        "Speed feature will be added next."
                    );

                }


                if (name === "crop") {

                    alert(
                        "Crop feature will be added next."
                    );

                }


                if (name === "ai") {

                    alert(
                        "AI tools will be added next."
                    );

                }


                if (name === "thumbnail") {

                    alert(
                        "Thumbnail Maker will be added next."
                    );

                }

            }
        );

    });


/* =========================================
   EXPORT
========================================= */

exportBtn.addEventListener(
    "click",
    function () {

        if (!hasVideo()) {

            alert(
                "Please import a video first."
            );

            return;
        }


        if (
            typeof video.captureStream !==
            "function"
        ) {

            alert(
                "Video export is not supported by this browser."
            );

            return;
        }


        if (
            typeof MediaRecorder ===
            "undefined"
        ) {

            alert(
                "Video export is not supported by this browser."
            );

            return;
        }


        const types = [

            "video/webm;codecs=vp9",

            "video/webm;codecs=vp8",

            "video/webm"

        ];


        let mimeType = "";


        for (
            let i = 0;
            i < types.length;
            i++
        ) {

            if (
                MediaRecorder.isTypeSupported(
                    types[i]
                )
            ) {

                mimeType =
                    types[i];

                break;

            }

        }


        if (!mimeType) {

            alert(
                "This browser cannot export the video."
            );

            return;
        }


        const oldTime =
            video.currentTime;


        const stream =
            video.captureStream();


        const recorder =
            new MediaRecorder(
                stream,
                {
                    mimeType: mimeType
                }
            );


        const chunks = [];


        recorder.ondataavailable =
            function (event) {

                if (
                    event.data &&
                    event.data.size > 0
                ) {

                    chunks.push(
                        event.data
                    );

                }

            };


        recorder.onstop =
            function () {

                const blob =
                    new Blob(
                        chunks,
                        {
                            type: mimeType
                        }
                    );


                const url =
                    URL.createObjectURL(blob);


                const link =
                    document.createElement("a");


                link.href = url;

                link.download =
                    "flix-video.webm";


                document.body.appendChild(
                    link
                );

                link.click();

                link.remove();


                setTimeout(
                    function () {

                        URL.revokeObjectURL(
                            url
                        );

                    },
                    1000
                );

            };


        video.currentTime = 0;


        recorder.start();


        video.play()
            .catch(function (error) {

                console.error(error);

                recorder.stop();

            });


        video.addEventListener(
            "ended",
            function stopRecording() {

                if (
                    recorder.state !==
                    "inactive"
                ) {

                    recorder.stop();

                }

                video.removeEventListener(
                    "ended",
                    stopRecording
                );

                video.currentTime =
                    oldTime;

            }
        );

    }
);


/* =========================================
   INITIALIZE
========================================= */

showEmpty();

applyFilters();

saveState();


/* =========================================
   CLEANUP
========================================= */

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
