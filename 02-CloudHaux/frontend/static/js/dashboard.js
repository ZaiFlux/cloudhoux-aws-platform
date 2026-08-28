const addFileBtn = document.getElementById("addFileBtn");
const fileInput = document.getElementById("fileInput");
const fileList = document.getElementById("fileList");

// Store files data
let allFiles = [];

// Load files from localStorage on page load
loadFilesFromStorage();

addFileBtn.addEventListener("click", () => {
  fileInput.click();
});

fileInput.addEventListener("change", () => {
  const files = fileInput.files;

  if (files.length === 0) {
    return;
  }

  for (const file of files) {
    const fileObj = {
      id: Date.now() + Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      dateAdded: new Date().toLocaleDateString(),
    };

    allFiles.push(fileObj);
    saveFilesToStorage();
  }

  displayAllFiles();
  fileInput.value = ""; // Reset input
});

// Function to display all files
function displayAllFiles() {
  fileList.innerHTML = "";

  if (allFiles.length === 0) {
    fileList.innerHTML = '<p class="no-files">No files uploaded yet</p>';
    return;
  }

  allFiles.forEach((file) => {
    const fileCard = document.createElement("div");
    fileCard.className = "file_card";

    fileCard.innerHTML = `
      <span class="file-name" data-id="${file.id}">${file.name}</span>
      <p>${(file.size / 1024).toFixed(2)} KB</p>
    `;

    fileList.appendChild(fileCard);
  });

  // Add event listeners for rename
  document.querySelectorAll(".file-name").forEach((nameElement) => {
    nameElement.addEventListener("click", function (e) {
      e.stopPropagation();
      enableRename(this);
    });
  });
}

// ==========================================
// RENAME FUNCTIONALITY
// ==========================================
function enableRename(element) {
  const currentName = element.textContent;
  const fileId = element.dataset.id;

  // Create input field
  const input = document.createElement("input");
  input.type = "text";
  input.value = currentName;
  input.className = "rename-input";
  input.maxLength = 100;

  // Replace span with input
  element.parentNode.replaceChild(input, element);
  input.focus();
  input.select();

  // Handle rename
  const handleRename = function () {
    const newName = input.value.trim();
    if (newName && newName !== currentName) {
      // Update the file name
      const file = allFiles.find((f) => f.id === fileId);
      if (file) {
        file.name = newName;
        saveFilesToStorage();
        displayAllFiles();
      }
    } else {
      // If no change or empty, revert to original
      const span = document.createElement("span");
      span.className = "file-name";
      span.dataset.id = fileId;
      span.textContent = currentName;
      input.parentNode.replaceChild(span, input);

      // Re-add click listener
      span.addEventListener("click", function (e) {
        e.stopPropagation();
        enableRename(this);
      });
    }
  };

  // Handle Enter key
  input.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      e.preventDefault();
      handleRename();
    } else if (e.key === "Escape") {
      // Cancel rename
      const span = document.createElement("span");
      span.className = "file-name";
      span.dataset.id = fileId;
      span.textContent = currentName;
      input.parentNode.replaceChild(span, input);

      span.addEventListener("click", function (e) {
        e.stopPropagation();
        enableRename(this);
      });
    }
  });

  // Handle blur (clicking away)
  input.addEventListener("blur", function () {
    handleRename();
  });
}

// ==========================================
// LOCAL STORAGE FUNCTIONS
// ==========================================
function saveFilesToStorage() {
  try {
    localStorage.setItem("allFiles", JSON.stringify(allFiles));
  } catch (e) {
    console.log("Storage not available");
  }
}

function loadFilesFromStorage() {
  try {
    const storedAll = localStorage.getItem("allFiles");
    if (storedAll) {
      allFiles = JSON.parse(storedAll);
      displayAllFiles();
    }
  } catch (e) {
    console.log("Storage load error");
  }
}

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
