const addFileBtn = document.getElementById("addFileBtn");
const fileInput = document.getElementById("fileInput");

addFileBtn.addEventListener("click", () => {
  fileInput.click();
});


fileInput.addEventListener("change", () => {
  const files = fileInput.files;

  if (files.length === 0) {
    return;
  }

});
