/* =====================================================
   FLIX VIDEO EDITOR - COMPLETE SCRIPT
===================================================== */

const mediaInput = document.getElementById("mediaInput");

const video = document.getElementById("videoPreview");
const image = document.getElementById("imagePreview");
const emptyPreview = document.getElementById("emptyPreview");

const playBtn = document.getElementById("playBtn");
const seekBar = document.getElementById("seekBar");
const currentTime = document.getElementById("currentTime");
const totalTime = document.getElementById("totalTime");

const muteBtn = document.getElementById("muteBtn");
const volume = document.getElementById("volume");

const timelineClip =
    document.getElementById("timelineClip");

const textInput =
    document.getElementById("textInput");

const textSize =
    document.getElementById("textSize");

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

const textOverlay =
    document.getElementById("textOverlay");

const newBtn =
    document.getElementById("newBtn");

const exportBtn =
    document.getElementById("exportBtn");

const splitBtn =
    document.getElementById("splitBtn");

const deleteBtn =
    document.getElementById("deleteBtn");

const undoBtn =
    document.getElementById("undoBtn");

const redoBtn =
    document.getElementById("redoBtn");


let mediaURL = null;
let currentFile = null;

let history = [];
let future = [];


/* =====================================================
   TIME FORMAT
===================================================== */

function formatTime(seconds) {

    if (!isFinite(seconds)) {
        return "00:00";
    }

    const min =
        Math.floor(seconds / 60);

    const sec =
        Math.floor(seconds % 60);

    return (
        String(min).padStart(2, "0") +
        ":" +
        String(sec).padStart(2, "0")
    );
}


/* =====================================================
   IMPORT VIDEO / IMAGE / AUDIO
===================================================== */

mediaInput.addEventListener("change", function () {

    const file = this.files[0];

    if (!file) return;

    currentFile = file;

    console.log("Imported:", file.name);
    console.log("Type:", file.type);

    if (mediaURL) {
        URL.revokeObjectURL(mediaURL);
    }

    mediaURL =
        URL.createObjectURL(file);


    /* ---------- VIDEO ---------- */

    if (file.type.startsWith("video/")) {

        image.style.display = "none";

        video.pause();

        video.src = mediaURL;

        video.style.display = "block";

        emptyPreview.style.display = "none";

        video.load();

        timelineClip.textContent =
            "🎬 " + file.name;

        saveState();

        return;
    }


    /* ---------- IMAGE ---------- */

    if (file.type.startsWith("image/")) {

        video.pause();

        video.removeAttribute("src");

        video.style.display = "none";

        image.src = mediaURL;

        image.style.display = "block";

        emptyPreview.style.display = "none";

        timelineClip.textContent =
            "🖼 " + file.name;

        currentTime.textContent =
            "00:00";

        totalTime.textContent =
            "00:00";

        saveState();

        return;
    }


    /* ---------- AUDIO ---------- */

    if (file.type.startsWith("audio/")) {

        alert(
            "Audio import ho gaya. Audio preview ke liye browser audio player use karega."
        );

        timelineClip.textContent =
            "🎵 " + file.name;

        return;
    }


    alert("Ye file supported nahi hai.");

});


/* =====================================================
   VIDEO LOADED
===================================================== */

video.addEventListener("loadedmetadata", function () {

    totalTime.textContent =
        formatTime(video.duration);

    currentTime.textContent =
        "00:00 / " +
        formatTime(video.duration);

    seekBar.value = 0;

});


/* =====================================================
   VIDEO TIME UPDATE
===================================================== */

video.addEventListener("timeupdate", function () {

    if (!video.duration) return;

    seekBar.value =
        (video.currentTime / video.duration) * 100;

    currentTime.textContent =
        formatTime(video.currentTime) +
        " / " +
        formatTime(video.duration);

});


/* =====================================================
   PLAY / PAUSE
===================================================== */

playBtn.addEventListener("click", function () {

    if (!video.src) {

        alert("Pehle video import karo.");

        return;
    }

    if (video.paused) {

        video.play()
            .catch(function () {

                alert("Video play nahi ho pa raha.");

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

seekBar.addEventListener("input", function () {

    if (!video.duration) return;

    video.currentTime =
        (Number(this.value) / 100) *
        video.duration;

});


/* =====================================================
   MUTE
===================================================== */

muteBtn.addEventListener("click", function () {

    if (!video.src) return;

    video.muted =
        !video.muted;

    muteBtn.textContent =
        video.muted
            ? "🔇"
            : "🔊";

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
   FILTER SYSTEM
===================================================== */

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

    image.style.filter =
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
   TEXT
===================================================== */

textInput.addEventListener("input", function () {

    textOverlay.textContent =
        this.value;

    if (this.value.trim() !== "") {

        textOverlay.style.display =
            "block";

    } else {

        textOverlay.style.display =
            "none";

    }

    saveState();

});


/* TEXT SIZE */

textSize.addEventListener("input", function () {

    textOverlay.style.fontSize =
        this.value + "px";

});


/* =====================================================
   ASPECT RATIO
===================================================== */

aspectRatio.addEventListener("change", function () {

    const ratio = this.value;

    if (ratio === "auto") {

        video.style.aspectRatio = "auto";
        image.style.aspectRatio = "auto";

        return;
    }

    video.style.aspectRatio = ratio;
    image.style.aspectRatio = ratio;

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
                .forEach(function (x) {

                    x.classList.remove("active");

                });

            this.classList.add("active");

            const selectedTool =
                this.dataset.tool;

            console.log(
                "Selected tool:",
                selectedTool
            );


            /* TEXT */

            if (selectedTool === "text") {

                textInput.focus();

                return;
            }


            /* FILTERS */

            if (selectedTool === "filters") {

                brightness.focus();

                return;
            }


            /* AUDIO */

            if (selectedTool === "audio") {

                alert(
                    "Audio tool selected. Import button se audio file add kar sakte ho."
                );

                return;
            }


            /* SPEED */

            if (selectedTool === "speed") {

                alert(
                    "Speed tool ready hai. Video playback controls ke saath use kiya ja sakta hai."
                );

                return;
            }


            /* CROP */

            if (selectedTool === "crop") {

                alert(
                    "Crop tool selected."
                );

                return;
            }


            /* AI */

            if (selectedTool === "ai") {

                alert(
                    "AI Tools selected. Real AI generation ke liye external AI API/backend chahiye."
                );

                return;
            }


            /* THUMBNAIL */

            if (selectedTool === "thumbnail") {

                alert(
                    "Thumbnail Maker selected."
                );

                return;
            }


            /* STICKERS */

            if (selectedTool === "stickers") {

                textOverlay.textContent = "⭐";

                textOverlay.style.display =
                    "block";

                return;
            }


            /* TRANSITION */

            if (selectedTool === "transition") {

                alert(
                    "Transition tool selected."
                );

                return;
            }

        });

    });


/* =====================================================
   SPLIT
===================================================== */

splitBtn.addEventListener("click", function () {

    if (!video.src || !video.duration) {

        alert(
            "Pehle video import karo."
        );

        return;
    }

    const percent =
        (video.currentTime /
        video.duration) * 100;


    timelineClip.style.width =
        percent + "%";


    timelineClip.textContent =
        "✂ Clip 1 | " +
        formatTime(video.currentTime);


    saveState();

});


/* =====================================================
   DELETE
===================================================== */

deleteBtn.addEventListener("click", function () {

    if (!currentFile) {

        alert(
            "Delete karne ke liye media import karo."
        );

        return;
    }


    video.pause();

    video.removeAttribute("src");

    video.load();

    image.removeAttribute("src");


    video.style.display =
        "none";

    image.style.display =
        "none";

    emptyPreview.style.display =
        "flex";


    timelineClip.textContent =
        "No media imported";


    currentFile = null;

    mediaInput.value = "";


    currentTime.textContent =
        "00:00";

    totalTime.textContent =
        "00:00";

    seekBar.value = 0;


    textInput.value = "";

    textOverlay.textContent = "";

    textOverlay.style.display =
        "none";


    saveState();

});


/* =====================================================
   NEW PROJECT
===================================================== */

newBtn.addEventListener("click", function () {

    video.pause();

    video.removeAttribute("src");

    video.load();

    image.removeAttribute("src");


    video.style.display =
        "none";

    image.style.display =
        "none";

    emptyPreview.style.display =
        "flex";


    timelineClip.textContent =
        "No media imported";


    mediaInput.value = "";

    currentFile = null;


    currentTime.textContent =
        "00:00";

    totalTime.textContent =
        "00:00";

    seekBar.value = 0;


    textInput.value = "";

    textOverlay.textContent = "";

    textOverlay.style.display =
        "none";


    /* RESET FILTERS */

    brightness.value = 100;
    contrast.value = 100;
    saturation.value = 100;
    blur.value = 0;

    applyFilters();


    /* RESET ASPECT */

    aspectRatio.value = "auto";

    video.style.aspectRatio =
        "auto";

    image.style.aspectRatio =
        "auto";


    history = [];
    future = [];


    saveState();

});


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

        aspect: aspectRatio.value,

        time: video.currentTime || 0

    };

}


function saveState() {

    history.push(
        getState()
    );

    if (history.length > 30) {

        history.shift();

    }

    future = [];

}


function restoreState(state) {

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
        state.aspect;


    textOverlay.textContent =
        state.text;

    textOverlay.style.fontSize =
        state.textSize + "px";

    textOverlay.style.display =
        state.text
            ? "block"
            : "none";


    applyFilters();


    if (state.aspect === "auto") {

        video.style.aspectRatio =
            "auto";

        image.style.aspectRatio =
            "auto";

    } else {

        video.style.aspectRatio =
            state.aspect;

        image.style.aspectRatio =
            state.aspect;

    }


    if (
        video.duration &&
        state.time <= video.duration
    ) {

        video.currentTime =
            state.time;

    }

}


/* UNDO */

undoBtn.addEventListener("click", function () {

    if (history.length <= 1) {

        return;
    }

    const current =
        history.pop();

    future.push(current);


    const previous =
        history[history.length - 1];

    restoreState(previous);

});


/* REDO */

redoBtn.addEventListener("click", function () {

    if (!future.length) {

        return;
    }

    const state =
        future.pop();

    history.push(state);

    restoreState(state);

});


/* =====================================================
   EXPORT VIDEO
===================================================== */

exportBtn.addEventListener("click", async function () {

    if (!video.src) {

        alert(
            "Export karne ke liye pehle video import karo."
        );

        return;
    }


    if (!video.captureStream) {

        alert(
            "Is browser mein video export support nahi hai."
        );

        return;
    }


    try {

        const stream =
            video.captureStream();


        const recorder =
            new MediaRecorder(
                stream,
                {
                    mimeType:
                        "video/webm"
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
                    document.createElement("a");

                a.href = url;

                a.download =
                    "flix-video.webm";

                document.body.appendChild(a);

                a.click();

                a.remove();

                setTimeout(function () {

                    URL.revokeObjectURL(url);

                }, 1000);


                alert(
                    "Export complete! Video save ho gaya."
                );

            };


        video.currentTime = 0;

        video.muted = false;

        recorder.start();

        video.play();


        video.onended =
            function () {

                recorder.stop();

            };


    } catch (error) {

        console.error(error);

        alert(
            "Export mein problem aayi."
        );

    }

});


/* =====================================================
   VIDEO ERROR
===================================================== */

video.addEventListener("error", function () {

    console.error(
        "Video error:",
        video.error
    );

    alert(
        "Video browser mein play nahi ho raha. MP4 H.264 format try karo."
    );

});


/* =====================================================
   INITIAL STATE
===================================================== */

video.style.display = "none";
image.style.display = "none";

emptyPreview.style.display = "flex";

applyFilters();

saveState();

console.log(
    "FLIX VIDEO EDITOR READY"
);
