const addFileBtn = document.getElementById("addFileBtn");
const fileInput = document.getElementById("fileInput");
const fileList = document.getElementById("fileList");

addFileBtn.addEventListener("click", () => {
  fileInput.click();
});

fileInput.addEventListener("change", () => {
  const files = fileInput.files;

  if (files.length === 0) {
    return;
  }

  for (const file of files) {
    const fileCard = document.createElement("div");
    fileCard.className = "file_card";

    fileCard.innerHTML = `
            <h3>${file.name}</h3>
            <p>${(file.size / 1024).toFixed(2)} KB</p>
        `;

    fileList.appendChild(fileCard);
  }
});
