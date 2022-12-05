document.getElementById("imageUpload").onclick = function() {
    let xhhtp = new XMLHttpRequest();

    const selectedImage = document.getElementById("selectedImage");
    const imageStatus = document.getElementById("imageStatus");
    const progressDiv = document.getElementById("progressDiv");
    const progressBar = document.getElementById("progressBar");

    xhhtp.onreadystatechange = function() {
        imageStatus.innerHTML = this.responseText;
    };
    xhhtp.open("POST", "/dashboard/image-upload");
    xhhtp.upload.onprogress = function(e) {
        if (e.lengthComputable) {
            let result = Math.floor((e.loaded / e.total) * 100);
            // console.log("result", result + "%");
            if (result !== 100) {
                progressBar.innerHTML = result + "%";
                progressBar.style = "width :" + result + "%";
            } else {
                progressDiv.style = "display:none";
            }
        }
    };
    let formData = new FormData();

    if (selectedImage.files.length > 0) {
        progressDiv.style = "display:block";
        formData.append("image", selectedImage.files[0]);
        xhhtp.send(formData);
    } else {
        imageStatus.innerHTML = "برای آپلود باید عکسی انتخاب کنید.";
    }
};