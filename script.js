const mediaInput = document.getElementById("mediaInput");
const videoPreview = document.getElementById("videoPreview");
const photoPreview = document.getElementById("photoPreview");
const emptyPreview = document.getElementById("emptyPreview");
const mediaClip = document.getElementById("mediaClip");

mediaInput.addEventListener("change", function () {

const file = this.files[0];

if (!file) {
    return;
}

console.log("Selected file:", file.name);
console.log("File type:", file.type);

const url = URL.createObjectURL(file);

/* VIDEO */

if (file.type.startsWith("video/")) {

    photoPreview.style.display = "none";

    videoPreview.style.display = "block";

    emptyPreview.style.display = "none";

    videoPreview.src = url;

    videoPreview.controls = true;

    videoPreview.load();

    mediaClip.textContent =
        "🎬 " + file.name;

    console.log("Video loaded:", url);
}

/* PHOTO */

else if (file.type.startsWith("image/")) {

    videoPreview.style.display = "none";

    photoPreview.style.display = "block";

    emptyPreview.style.display = "none";

    photoPreview.src = url;

    mediaClip.textContent =
        "🖼️ " + file.name;

    console.log("Photo loaded:", url);
}

else {

    alert("Ye video/photo file nahi hai.");

}

});

videoPreview.addEventListener("loadeddata", function () {

console.log("VIDEO PREVIEW READY");

});

videoPreview.addEventListener("error", function () {

console.log(
    "VIDEO ERROR:",
    videoPreview.error
);

alert(
    "Video browser mein load nahi ho pa raha."
);

});
