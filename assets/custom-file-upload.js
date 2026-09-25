document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form[novalidate]");
  if (form) {
    form.removeAttribute("novalidate");
  }

  const fileInput = document.getElementById("file-upload");
  const uploadButton = document.getElementById("upload-button");
  const removeButton = document.getElementById("remove-button");
  const uploadedImage = document.getElementById("uploaded-image");

  uploadButton.addEventListener("click", () => {
    fileInput.click();
  });

  fileInput.addEventListener("change", () => {
    const file = fileInput.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        uploadedImage.src = e.target.result;
        uploadedImage.style.display = "block";
        uploadButton.textContent = "File Uploaded";
        uploadButton.classList.add("uploaded");
        removeButton.style.display = "block";
      };
      reader.readAsDataURL(file);
    } else {
      resetFileInput();
    }
  });

  removeButton.addEventListener("click", (e) => {
    e.preventDefault();
    resetFileInput();
  });

  function resetFileInput() {
    fileInput.value = "";
    uploadedImage.style.display = "none";
    uploadButton.textContent = "Upload File";
    uploadButton.classList.remove("uploaded");
    removeButton.style.display = "none";
  }
});
