/* =====================================================
   FLIX VIDEO EDITOR - WORKING SCRIPT
===================================================== */

const mediaInput = document.getElementById("mediaInput");

const videoPreview = document.getElementById("videoPreview");
const imagePreview = document.getElementById("imagePreview");
const emptyPreview = document.getElementById("emptyPreview");

const playBtn = document.getElementById("playBtn");
const seekBar = document.getElementById("seekBar");
const currentTime = document.getElementById("currentTime");
const totalTime = document.getElementById("totalTime");

const muteBtn = document.getElementById("muteBtn");
const volume = document.getElementById("volume");

const timelineClip =
    document.getElementById("timelineClip");

const newBtn =
    document.getElementById("newBtn");

const exportBtn =
    document.getElementById("exportBtn");

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

const splitBtn =
    document.getElementById("splitBtn");

const deleteBtn =
    document.getElementById("deleteBtn");

const undoBtn =
    document.getElementById("undoBtn");

const redoBtn =
    document.getElementById("redoBtn");


let mediaURL = null;
let currentType = null;

let history = [];
let historyIndex = -1;


/* =====================================================
   HELPERS
===================================================== */

function formatTime(seconds) {

    if (!isFinite(seconds)) {
        return "00:00";
    }

    const minutes =
        Math.floor(seconds / 60);

    const secs =
        Math.floor(seconds % 60);

    return (
        String(minutes).padStart(2, "0") +
        ":" +
        String(secs).padStart(2, "0")
    );
}


function showVideo() {

    videoPreview.style.display = "block";
    imagePreview.style.display = "none";
    emptyPreview.style.display = "none";

}


function showImage() {

    videoPreview.style.display = "none";
    imagePreview.style.display = "block";
    emptyPreview.style.display = "none";

}


function showEmpty() {

    videoPreview.style.display = "none";
    imagePreview.style.display = "none";
    emptyPreview.style.display = "block";

}


/* =====================================================
   IMPORT VIDEO / IMAGE / AUDIO
===================================================== */

mediaInput.addEventListener("change", function () {

    const file = this.files[0];

    if (!file) return;

    console.log("Imported:", file.name);

    if (mediaURL) {
        URL.revokeObjectURL(mediaURL);
    }

    mediaURL =
        URL.createObjectURL(file);

    currentType = file.type;

    /* VIDEO */

    if (file.type.startsWith("video/")) {

        videoPreview.pause();

        videoPreview.src = mediaURL;

        videoPreview.load();

        showVideo();

        timelineClip.textContent =
            "🎬 " + file.name;

        videoPreview.currentTime = 0;

        saveHistory();

        return;
    }


    /* IMAGE */

    if (file.type.startsWith("image/")) {

        imagePreview.src = mediaURL;

        showImage();

        timelineClip.textContent =
            "🖼 " + file.name;

        saveHistory();

        return;
    }


    /* AUDIO */

    if (file.type.startsWith("audio/")) {

        videoPreview.src = mediaURL;

        videoPreview.load();

        showVideo();

        timelineClip.textContent =
            "🎵 " + file.name;

        saveHistory();

        return;
    }


    alert("Ye file type supported nahi hai.");

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
            (
                videoPreview.currentTime /
                videoPreview.duration
            ) * 100;

        currentTime.textContent =
            formatTime(
                videoPreview.currentTime
            );

        totalTime.textContent =
            formatTime(
                videoPreview.duration
            );

    }
);


/* =====================================================
   PLAY / PAUSE
===================================================== */

playBtn.addEventListener(
    "click",
    function () {

        if (!videoPreview.src) {

            alert("Pehle video import karo.");

            return;
        }

        if (videoPreview.paused) {

            videoPreview.play();

        } else {

            videoPreview.pause();

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
            (
                Number(this.value) / 100
            ) *
            videoPreview.duration;

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
   TEXT
===================================================== */

function updateText() {

    textOverlay.textContent =
        textInput.value;

    textOverlay.style.fontSize =
        textSize.value + "px";

    if (textInput.value.trim() === "") {

        textOverlay.style.display = "none";

    } else {

        textOverlay.style.display = "block";

    }

}


textInput.addEventListener(
    "input",
    function () {

        updateText();
        saveHistory();

    }
);


textSize.addEventListener(
    "input",
    function () {

        updateText();

    }
);


/* =====================================================
   FILTERS
===================================================== */

function updateFilters() {

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

aspectRatio.addEventListener(
    "change",
    function () {

        if (this.value === "auto") {

            videoPreview.style.aspectRatio =
                "auto";

            imagePreview.style.aspectRatio =
                "auto";

        } else {

            videoPreview.style.aspectRatio =
                this.value;

            imagePreview.style.aspectRatio =
                this.value;

        }

    }
);


/* =====================================================
   SPLIT
===================================================== */

splitBtn.addEventListener(
    "click",
    function () {

        if (!videoPreview.src) {

            alert("Pehle video import karo.");

            return;
        }

        if (!videoPreview.duration) {

            alert("Video abhi load ho raha hai.");

            return;
        }

        const position =
            videoPreview.currentTime;

        const total =
            videoPreview.duration;

        const percent =
            (position / total) * 100;

        timelineClip.innerHTML =
            "🎬 Clip 1 &nbsp; | &nbsp; ✂ Split @ " +
            formatTime(position) +
            " &nbsp; | &nbsp; Clip 2";

        timelineClip.style.background =
            "linear-gradient(90deg,#5148db " +
            percent +
            "%,#756dff " +
            percent +
            "%)";

        saveHistory();

    }
);


/* =====================================================
   DELETE
===================================================== */

deleteBtn.addEventListener(
    "click",
    function () {

        if (!mediaURL) {

            alert("Delete karne ke liye media import karo.");

            return;
        }

        if (
            !confirm(
                "Current media delete karna hai?"
            )
        ) {
            return;
        }

        videoPreview.pause();

        videoPreview.removeAttribute("src");

        videoPreview.load();

        imagePreview.removeAttribute("src");

        showEmpty();

        timelineClip.textContent =
            "No media imported";

        currentTime.textContent =
            "00:00";

        totalTime.textContent =
            "00:00";

        seekBar.value = 0;

        if (mediaURL) {

            URL.revokeObjectURL(mediaURL);

            mediaURL = null;

        }

        mediaInput.value = "";

        saveHistory();

    }
);


/* =====================================================
   NEW PROJECT
===================================================== */

newBtn.addEventListener(
    "click",
    function () {

        videoPreview.pause();

        videoPreview.removeAttribute("src");

        videoPreview.load();

        imagePreview.removeAttribute("src");

        showEmpty();

        timelineClip.textContent =
            "No media imported";

        textInput.value = "";

        textOverlay.textContent = "";

        textOverlay.style.display =
            "none";

        seekBar.value = 0;

        currentTime.textContent =
            "00:00";

        totalTime.textContent =
            "00:00";

        brightness.value = 100;
        contrast.value = 100;
        saturation.value = 100;
        blur.value = 0;

        updateFilters();

        aspectRatio.value = "auto";

        videoPreview.style.aspectRatio =
            "auto";

        imagePreview.style.aspectRatio =
            "auto";

        if (mediaURL) {

            URL.revokeObjectURL(mediaURL);

            mediaURL = null;

        }

        mediaInput.value = "";

        history = [];
        historyIndex = -1;

        saveHistory();

    }
);


/* =====================================================
   UNDO / REDO
===================================================== */

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


function saveHistory() {

    const state =
        JSON.stringify(getState());

    if (
        historyIndex >= 0 &&
        history[historyIndex] === state
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
        data.aspectRatio;

    updateText();

    updateFilters();

    if (
        aspectRatio.value === "auto"
    ) {

        videoPreview.style.aspectRatio =
            "auto";

        imagePreview.style.aspectRatio =
            "auto";

    } else {

        videoPreview.style.aspectRatio =
            aspectRatio.value;

        imagePreview.style.aspectRatio =
            aspectRatio.value;

    }

}


undoBtn.addEventListener(
    "click",
    function () {

        if (historyIndex <= 0) {

            return;

        }

        historyIndex--;

        restoreState(
            history[historyIndex]
        );

    }
);


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

        restoreState(
            history[historyIndex]
        );

    }
);


/* =====================================================
   EXPORT
===================================================== */

exportBtn.addEventListener(
    "click",
    async function () {

        if (!videoPreview.src) {

            alert(
                "Pehle ek video import karo."
            );

            return;
        }

        if (
            !videoPreview.captureStream ||
            !window.MediaRecorder
        ) {

            alert(
                "Is browser mein direct video export supported nahi hai."
            );

            return;
        }

        try {

            const oldTime =
                videoPreview.currentTime;

            const stream =
                videoPreview.captureStream();

            const chunks = [];

            const recorder =
                new MediaRecorder(
                    stream,
                    {
                        mimeType:
                            "video/webm"
                    }
                );


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
                                type:
                                    "video/webm"
                            }
                        );

                    const url =
                        URL.createObjectURL(
                            blob
                        );

                    const a =
                        document.createElement(
                            "a"
                        );

                    a.href = url;

                    a.download =
                        "flix-video.webm";

                    document.body.appendChild(a);

                    a.click();

                    a.remove();

                    URL.revokeObjectURL(url);

                    videoPreview.currentTime =
                        oldTime;

                    playBtn.textContent = "▶";

                };


            videoPreview.currentTime = 0;

            recorder.start();

            await videoPreview.play();


            videoPreview.onended =
                function () {

                    if (
                        recorder.state !==
                        "inactive"
                    ) {

                        recorder.stop();

                    }

                };


        } catch (error) {

            console.error(error);

            alert(
                "Export mein problem aayi. Browser console check karo."
            );

        }

    }
);


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

                this.classList.add("active");

                const selectedTool =
                    this.dataset.tool;

                console.log(
                    "Selected tool:",
                    selectedTool
                );

                if (
                    selectedTool ===
                    "text"
                ) {

                    textInput.focus();

                }

                if (
                    selectedTool ===
                    "filters"
                ) {

                    brightness.focus();

                }

                if (
                    selectedTool ===
                    "thumbnail"
                ) {

                    alert(
                        "Thumbnail Maker selected. Media import karke use karo."
                    );

                }

            }
        );

    });


/* =====================================================
   VIDEO ERROR
===================================================== */

videoPreview.addEventListener(
    "error",
    function () {

        console.error(
            "Video error:",
            videoPreview.error
        );

        alert(
            "Video browser mein play nahi ho raha. MP4 (H.264) video try karo."
        );

    }
);


/* =====================================================
   INITIAL SETTINGS
===================================================== */

videoPreview.volume = 1;

updateFilters();

updateText();

saveHistory();

console.log(
    "FLIX VIDEO EDITOR SCRIPT LOADED SUCCESSFULLY"
);
