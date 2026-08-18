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

// ==========================================
// REDIRECT: Images button → images_page.html
// ==========================================
const imagesBtn = document.getElementById("imagesBtn");

if (imagesBtn) {
  imagesBtn.addEventListener("click", function () {
    window.location.href = "images_page.html";
  });
}

// ==========================================
// REDIRECT: Documents button → documents_page.html
// ==========================================
const documentsBtn = document.getElementById("documentsBtn");

if (documentsBtn) {
  documentsBtn.addEventListener("click", function () {
    window.location.href = "documents_page.html";
  });
}

// ==========================================
// REDIRECT: Media button → media_page.html
// ==========================================
const mediaBtn = document.getElementById("mediaBtn");

if (mediaBtn) {
  mediaBtn.addEventListener("click", function () {
    window.location.href = "media_page.html";
  });
}

// ==========================================
// REDIRECT: Audio button → audio_page.html
// ==========================================
const audioBtn = document.getElementById("audioBtn");

if (audioBtn) {
  audioBtn.addEventListener("click", function () {
    window.location.href = "audio_page.html";
  });
}

// ==========================================
// REDIRECT: Safe Vault button → safe_vault.html
// ==========================================
const safeVaultBtn = document.getElementById("safeVaultBtn");

if (safeVaultBtn) {
  safeVaultBtn.addEventListener("click", function () {
    window.location.href = "safe_vault.html";
  });
}
