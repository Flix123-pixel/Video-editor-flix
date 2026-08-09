/* =====================================================
   FLIX VIDEO EDITOR - WORKING SCRIPT
===================================================== */

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


/* =====================================================
   TIME
===================================================== */

function formatTime(seconds) {

    if (!Number.isFinite(seconds)) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const secondsLeft = Math.floor(seconds % 60);

    return String(minutes).padStart(2, "0") +
        ":" +
        String(secondsLeft).padStart(2, "0");
}


/* =====================================================
   IMPORT VIDEO / IMAGE / AUDIO
===================================================== */

mediaInput.addEventListener("change", function () {

    const file = this.files[0];

    if (!file) return;

    if (mediaURL) {
        URL.revokeObjectURL(mediaURL);
        mediaURL = null;
    }

    mediaURL = URL.createObjectURL(file);

    console.log("Imported:", file.name);
    console.log("Type:", file.type);

    /* VIDEO */

    if (file.type.startsWith("video/")) {

        image.style.display = "none";

        video.style.display = "block";

        empty.style.display = "none";

        video.src = mediaURL;

        video.load();

        clip.textContent = "🎬 " + file.name;

        seek.value = 0;

        currentTime.textContent = "00:00";

        totalTime.textContent = "00:00";

        return;
    }


    /* IMAGE */

    if (file.type.startsWith("image/")) {

        video.pause();

        video.removeAttribute("src");

        video.load();

        video.style.display = "none";

        image.style.display = "block";

        empty.style.display = "none";

        image.src = mediaURL;

        clip.textContent = "🖼 " + file.name;

        currentTime.textContent = "00:00";

        totalTime.textContent = "00:00";

        return;
    }


    /* AUDIO */

    if (file.type.startsWith("audio/")) {

        alert(
            "Audio files can be imported, but this preview currently supports video and images."
        );

        return;
    }


    alert("Please select a valid video or image file.");

});


/* =====================================================
   VIDEO ERROR
===================================================== */

video.addEventListener("error", function () {

    console.error("Video error:", video.error);

    alert(
        "This video format cannot be played in your browser. Please try an MP4 video encoded with H.264."
    );

});


/* =====================================================
   VIDEO LOADED
===================================================== */

video.addEventListener("loadedmetadata", function () {

    if (!Number.isFinite(video.duration)) return;

    totalTime.textContent =
        formatTime(video.duration);

    currentTime.textContent =
        "00:00";

    seek.value = 0;

});


/* =====================================================
   VIDEO TIME
===================================================== */

video.addEventListener("timeupdate", function () {

    if (!Number.isFinite(video.duration)) return;

    const percent =
        (video.currentTime / video.duration) * 100;

    seek.value = percent;

    currentTime.textContent =
        formatTime(video.currentTime);

    totalTime.textContent =
        formatTime(video.duration);

});


/* =====================================================
   PLAY / PAUSE
===================================================== */

playBtn.addEventListener("click", function () {

    if (!video.src) {

        alert("Please import a video first.");

        return;
    }

    if (video.paused) {

        video.play().catch(function (error) {

            console.error("Play error:", error);

            alert(
                "The video could not be played."
            );

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


/* =====================================================
   SEEK
===================================================== */

seek.addEventListener("input", function () {

    if (!Number.isFinite(video.duration)) {
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

    if (video.volume > 0) {

        video.muted = false;

        muteBtn.textContent = "🔊";

    }

});


/* =====================================================
   TEXT
===================================================== */

function updateText() {

    textOverlay.textContent =
        textInput.value;

    textOverlay.style.fontSize =
        textSize.value + "px";

    if (textInput.value.trim() !== "") {

        textOverlay.style.display = "block";

    } else {

        textOverlay.style.display = "none";

    }

}


textInput.addEventListener("input", function () {

    updateText();

    saveHistory();

});


textSize.addEventListener("input", function () {

    updateText();

});


/* =====================================================
   FILTERS
===================================================== */

function updateFilters() {

    const filter =
        "brightness(" + brightness.value + "%) " +
        "contrast(" + contrast.value + "%) " +
        "saturate(" + saturation.value + "%) " +
        "blur(" + blur.value + "px)";

    video.style.filter = filter;

    image.style.filter = filter;

}


brightness.addEventListener(
    "input",
    updateFilters
);

contrast.addEventListener(
    "input",
    updateFilters
);

saturation.addEventListener(
    "input",
    updateFilters
);

blur.addEventListener(
    "input",
    updateFilters
);


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
   SPLIT
===================================================== */

splitBtn.addEventListener("click", function () {

    if (!video.src) {

        alert("Please import a video first.");

        return;
    }

    if (!Number.isFinite(video.duration)) {

        alert("Please wait until the video has finished loading.");

        return;
    }

    const percent =
        (video.currentTime / video.duration) * 100;

    clip.style.background =
        "linear-gradient(90deg, #5148db 0%, #5148db " +
        percent +
        "%, #756dff " +
        percent +
        "%, #756dff 100%)";

    clip.textContent =
        "🎬 Clip 1 | ✂ Split at " +
        formatTime(video.currentTime) +
        " | Clip 2";

    saveHistory();

});


/* =====================================================
   DELETE
===================================================== */

deleteBtn.addEventListener("click", function () {

    if (!mediaURL) {

        alert("There is no media to delete.");

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

});


/* =====================================================
   NEW PROJECT
===================================================== */

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

    seek.value = 0;

    currentTime.textContent = "00:00";

    totalTime.textContent = "00:00";

    updateFilters();

    updateText();

    if (mediaURL) {

        URL.revokeObjectURL(mediaURL);

        mediaURL = null;

    }

    mediaInput.value = "";

    history = [];

    historyPosition = -1;

    saveHistory();

});


/* =====================================================
   HISTORY
===================================================== */

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
        history.slice(
            0,
            historyPosition + 1
        );

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

    textInput.value =
        data.text;

    textSize.value =
        data.textSize;

    brightness.value =
        data.brightness;

    contrast.value =
        data.contrast;

    saturation.value =
        data.saturation;

    blur.value =
        data.blur;

    aspectRatio.value =
        data.aspect;

    updateText();

    updateFilters();

    if (data.aspect === "auto") {

        video.style.aspectRatio = "auto";

        image.style.aspectRatio = "auto";

    } else {

        video.style.aspectRatio =
            data.aspect;

        image.style.aspectRatio =
            data.aspect;

    }

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
    ) {
        return;
    }

    historyPosition++;

    restoreState(
        history[historyPosition]
    );

});


/* =====================================================
   EXPORT
===================================================== */

exportBtn.addEventListener("click", async function () {

    if (!video.src) {

        alert("Please import a video first.");

        return;
    }

    if (!video.captureStream) {

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

    try {

        video.pause();

        video.currentTime = 0;

        const stream =
            video.captureStream();

        let mimeType = "";

        if (
            MediaRecorder.isTypeSupported(
                "video/webm;codecs=vp9"
            )
        ) {

            mimeType =
                "video/webm;codecs=vp9";

        } else if (
            MediaRecorder.isTypeSupported(
                "video/webm;codecs=vp8"
            )
        ) {

            mimeType =
                "video/webm;codecs=vp8";

        } else {

            mimeType =
                "video/webm";

        }

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

                if (event.data.size > 0) {

                    chunks.push(
                        event.data
                    );

                }

            };


        recorder.onerror =
            function (event) {

                console.error(
                    "Recorder error:",
                    event
                );

                alert(
                    "The video could not be exported."
                );

            };


        recorder.onstop =
            function () {

                if (!chunks.length) {

                    alert(
                        "No video data was generated."
                    );

                    return;
                }

                const blob =
                    new Blob(
                        chunks,
                        {
                            type:
                                mimeType
                        }
                    );

                const url =
                    URL.createObjectURL(
                        blob
                    );

                const link =
                    document.createElement(
                        "a"
                    );

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


        recorder.start();

        await video.play();

        video.onended =
            function () {

                if (
                    recorder.state !==
                    "inactive"
                ) {

                    recorder.stop();

                }

            };

    } catch (error) {

        console.error(
            "Export error:",
            error
        );

        alert(
            "The video could not be exported."
        );

    }

});


/* =====================================================
   SIDEBAR TOOLS
===================================================== */

document
    .querySelectorAll(".tool")
    .forEach(function (tool) {

        tool.addEventListener(
            "click",
            function () {

                document
                    .querySelectorAll(".tool")
                    .forEach(
                        function (item) {

                            item.classList.remove(
                                "active"
                            );

                        }
                    );

                this.classList.add(
                    "active"
                );


                const toolName =
                    this.dataset.tool;


                if (
                    toolName ===
                    "text"
                ) {

                    textInput.focus();

                }


                if (
                    toolName ===
                    "filters"
                ) {

                    brightness.focus();

                }

            }
        );

    });


/* =====================================================
   START
===================================================== */

video.volume = 1;

updateFilters();

updateText();

saveHistory();

console.log(
    "FLIX VIDEO EDITOR READY"
);
