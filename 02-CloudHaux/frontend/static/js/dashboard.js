// ==========================================
// MERGED SCRIPT - Includes Context Menu + Storage
// ==========================================

document.addEventListener("DOMContentLoaded", function () {
  "use strict";

  // DOM Elements
  const fileInput = document.getElementById("fileInput");
  const addBtn = document.getElementById("addFileBtn");
  const fileList = document.getElementById("fileList");
  const recentFileList = document.getElementById("recentFileList");
  const favoritesFileList = document.getElementById("favoritesFileList");
  const searchInput = document.getElementById("globalSearch");
  const clearSearchBtn = document.getElementById("clearSearchBtn");
  const uploadStatus = document.getElementById("uploadStatus");

  // Data stores
  let allFiles = [];
  let favoriteFiles = [];
  let recentFiles = [];
  let fileIdCounter = 0;

  // Context Menu
  const contextMenu = document.getElementById("customContextMenu");
  let contextTargetElement = null;
  let contextTargetFile = null;

  // ==========================================
  // LOCAL STORAGE FUNCTIONS
  // ==========================================
  function saveFilesToStorage() {
    try {
      localStorage.setItem("allFiles", JSON.stringify(allFiles));
      localStorage.setItem("favoriteFiles", JSON.stringify(favoriteFiles));
      localStorage.setItem("recentFiles", JSON.stringify(recentFiles));
    } catch (e) {
      console.log("Storage not available");
    }
  }

  function loadFilesFromStorage() {
    try {
      const storedAll = localStorage.getItem("allFiles");
      const storedFavorites = localStorage.getItem("favoriteFiles");
      const storedRecent = localStorage.getItem("recentFiles");

      if (storedAll) {
        allFiles = JSON.parse(storedAll);
      }
      if (storedFavorites) {
        favoriteFiles = JSON.parse(storedFavorites);
      }
      if (storedRecent) {
        recentFiles = JSON.parse(storedRecent);
      }
    } catch (e) {
      console.log("Storage load error");
    }
  }

  // ==========================================
  // CONTEXT MENU FUNCTIONS
  // ==========================================
  function openContextMenu(x, y, element, fileData) {
    closeContextMenu();

    contextTargetElement = element;
    contextTargetFile = fileData;

    const menuWidth = 190;
    const menuHeight = 240;
    const maxX = window.innerWidth - menuWidth - 10;
    const maxY = window.innerHeight - menuHeight - 10;

    contextMenu.style.left = Math.min(x, maxX) + "px";
    contextMenu.style.top = Math.min(y, maxY) + "px";
    contextMenu.style.display = "block";
    contextMenu.classList.add("open");
  }

  function closeContextMenu() {
    contextMenu.style.display = "none";
    contextMenu.classList.remove("open");
    contextTargetElement = null;
    contextTargetFile = null;
  }

  function attachContextMenu(element, fileData) {
    element.removeEventListener("contextmenu", handleContextMenu);
    element._fileData = fileData;
    element.addEventListener("contextmenu", handleContextMenu);
  }

  function handleContextMenu(e) {
    e.preventDefault();
    e.stopPropagation();
    const fileData = this._fileData;
    if (fileData) {
      openContextMenu(e.clientX, e.clientY, this, fileData);
    }
  }

  // ==========================================
  // CONTEXT MENU ACTIONS
  // ==========================================
  document.getElementById("ccmOpen").addEventListener("click", function (e) {
    e.stopPropagation();
    if (contextTargetFile) alert("Opening: " + contextTargetFile.name);
    closeContextMenu();
  });

  document.getElementById("ccmShare").addEventListener("click", function (e) {
    e.stopPropagation();
    if (contextTargetFile) alert("Share: " + contextTargetFile.name);
    closeContextMenu();
  });

  document.getElementById("ccmMove").addEventListener("click", function (e) {
    e.stopPropagation();
    if (contextTargetFile) alert("Move: " + contextTargetFile.name);
    closeContextMenu();
  });

  document
    .getElementById("ccmFavorite")
    .addEventListener("click", function (e) {
      e.stopPropagation();
      if (contextTargetFile && contextTargetFile.id) {
        if (!favoriteFiles.some((f) => f.id === contextTargetFile.id)) {
          favoriteFiles.push(contextTargetFile);
          saveFilesToStorage();
          renderFavorites(searchInput.value.trim());
        }
      }
      closeContextMenu();
    });

  document.getElementById("ccmDelete").addEventListener("click", function (e) {
    e.stopPropagation();
    if (contextTargetFile && contextTargetFile.id) {
      if (contextTargetElement) {
        contextTargetElement.style.transition = "0.2s";
        contextTargetElement.style.transform = "scale(0.8)";
        contextTargetElement.style.opacity = "0";

        setTimeout(() => {
          allFiles = allFiles.filter((f) => f.id !== contextTargetFile.id);
          favoriteFiles = favoriteFiles.filter(
            (f) => f.id !== contextTargetFile.id,
          );
          recentFiles = recentFiles.filter(
            (f) => f.id !== contextTargetFile.id,
          );
          saveFilesToStorage();

          const q = searchInput.value.trim();
          if (q) performSearch(q);
          else renderAllSections("");

          closeContextMenu();
        }, 200);
      }
    }
    closeContextMenu();
  });

  // Close menu on outside click
  document.addEventListener("click", function (e) {
    if (
      contextMenu.style.display === "block" &&
      !contextMenu.contains(e.target)
    ) {
      closeContextMenu();
    }
  });

  document.addEventListener("scroll", closeContextMenu, true);
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeContextMenu();
  });

  // ==========================================
  // HELPERS
  // ==========================================
  function formatFileSize(bytes) {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }

  function getFileIcon(fileName) {
    const ext = fileName.split(".").pop().toLowerCase();
    const icons = {
      jpg: "fa-file-image",
      jpeg: "fa-file-image",
      png: "fa-file-image",
      gif: "fa-file-image",
      svg: "fa-file-image",
      bmp: "fa-file-image",
      webp: "fa-file-image",
      pdf: "fa-file-pdf",
      doc: "fa-file-word",
      docx: "fa-file-word",
      txt: "fa-file-alt",
      xls: "fa-file-excel",
      xlsx: "fa-file-excel",
      csv: "fa-file-csv",
      ppt: "fa-file-powerpoint",
      pptx: "fa-file-powerpoint",
      js: "fa-file-code",
      html: "fa-file-code",
      htm: "fa-file-code",
      css: "fa-file-code",
      json: "fa-file-code",
      xml: "fa-file-code",
      py: "fa-file-code",
      java: "fa-file-code",
      cpp: "fa-file-code",
      c: "fa-file-code",
      php: "fa-file-code",
      rb: "fa-file-code",
      go: "fa-file-code",
      rs: "fa-file-code",
      swift: "fa-file-code",
      kt: "fa-file-code",
      md: "fa-file-alt",
      zip: "fa-file-archive",
      rar: "fa-file-archive",
      "7z": "fa-file-archive",
      mp4: "fa-file-video",
      avi: "fa-file-video",
      mkv: "fa-file-video",
      mov: "fa-file-video",
      wmv: "fa-file-video",
      flv: "fa-file-video",
      mp3: "fa-file-audio",
      wav: "fa-file-audio",
      wma: "fa-file-audio",
      aac: "fa-file-audio",
      flac: "fa-file-audio",
    };
    return icons[ext] || "fa-file";
  }

  // ==========================================
  // RENAME FUNCTION
  // ==========================================
  function makeFileNameEditable(nameSpan, fileData, fileElement) {
    const currentName = nameSpan.textContent;
    const input = document.createElement("input");
    input.type = "text";
    input.className = "file-name-input";
    input.value = currentName;
    nameSpan.replaceWith(input);
    input.focus();
    input.select();

    function saveRename() {
      const newName = input.value.trim() || currentName;
      if (fileData) fileData.name = newName;
      const newSpan = document.createElement("span");
      newSpan.className = "file-name";
      newSpan.textContent = newName;
      newSpan.addEventListener("click", function (e) {
        e.stopPropagation();
        makeFileNameEditable(newSpan, fileData, fileElement);
      });
      input.replaceWith(newSpan);
      saveFilesToStorage();
      const q = searchInput.value.trim();
      if (q) performSearch(q);
      else renderAllSections("");
    }

    input.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        e.preventDefault();
        input.blur();
      } else if (e.key === "Escape") {
        const newSpan = document.createElement("span");
        newSpan.className = "file-name";
        newSpan.textContent = currentName;
        newSpan.addEventListener("click", function (e) {
          e.stopPropagation();
          makeFileNameEditable(newSpan, fileData, fileElement);
        });
        input.replaceWith(newSpan);
      }
    });
    input.addEventListener("blur", saveRename);
  }

  // ==========================================
  // CREATE FILE ELEMENT
  // ==========================================
  function createFileElement(file, highlightText = "") {
    const div = document.createElement("div");
    div.className = "file-item";
    div.dataset.fileId = file.id;
    div._fileData = file;

    const icon = document.createElement("i");
    icon.className = "fas " + getFileIcon(file.name);

    const name = document.createElement("span");
    name.className = "file-name";

    if (highlightText && highlightText.length > 0) {
      const lowerName = file.name.toLowerCase();
      const lowerQuery = highlightText.toLowerCase();
      if (lowerName.includes(lowerQuery)) {
        const idx = lowerName.indexOf(lowerQuery);
        const before = file.name.slice(0, idx);
        const match = file.name.slice(idx, idx + highlightText.length);
        const after = file.name.slice(idx + highlightText.length);
        name.innerHTML = `${before}<span class="highlight-match">${match}</span>${after}`;
      } else {
        name.textContent = file.name;
      }
    } else {
      name.textContent = file.name;
    }

    name.addEventListener("click", function (e) {
      e.stopPropagation();
      makeFileNameEditable(name, file, div);
    });

    const size = document.createElement("span");
    size.className = "file-size";
    size.textContent = formatFileSize(file.size);

    div.appendChild(icon);
    div.appendChild(name);
    div.appendChild(size);

    attachContextMenu(div, file);

    return div;
  }

  // ==========================================
  // RENDER FUNCTIONS
  // ==========================================
  function renderAllFiles(highlight = "") {
    fileList.innerHTML = "";
    if (allFiles.length === 0) {
      fileList.innerHTML =
        '<p style="color: #9ca3af; text-align: center; padding: 20px;">No files uploaded yet</p>';
      return;
    }
    const fragment = document.createDocumentFragment();
    allFiles.forEach((file) => {
      fragment.appendChild(createFileElement(file, highlight));
    });
    fileList.appendChild(fragment);
  }

  function renderFavorites(highlight = "") {
    favoritesFileList.innerHTML = "";
    if (favoriteFiles.length === 0) {
      favoritesFileList.innerHTML =
        '<p style="color: #9ca3af; text-align: center; padding: 10px; font-size: 13px;">No favorites yet</p>';
      return;
    }
    const fragment = document.createDocumentFragment();
    favoriteFiles.forEach((file) => {
      fragment.appendChild(createFileElement(file, highlight));
    });
    favoritesFileList.appendChild(fragment);
  }

  function renderRecent(highlight = "") {
    recentFileList.innerHTML = "";
    const recent = recentFiles.slice(0, 5);
    if (recent.length === 0) {
      recentFileList.innerHTML =
        '<p style="color: #9ca3af; text-align: center; padding: 10px; font-size: 13px;">No recent files</p>';
      return;
    }
    const fragment = document.createDocumentFragment();
    recent.forEach((file) => {
      fragment.appendChild(createFileElement(file, highlight));
    });
    recentFileList.appendChild(fragment);
  }

  function renderAllSections(highlight = "") {
    renderAllFiles(highlight);
    renderRecent(highlight);
    renderFavorites(highlight);
  }

  // ==========================================
  // SEARCH
  // ==========================================
  function performSearch(query) {
    const q = query.trim();
    if (q === "") {
      clearSearchBtn.style.display = "none";
      renderAllSections("");
      return;
    }
    clearSearchBtn.style.display = "inline-block";
    renderAllSections(q);
  }

  searchInput.addEventListener("input", function (e) {
    performSearch(this.value);
  });

  clearSearchBtn.addEventListener("click", function () {
    searchInput.value = "";
    clearSearchBtn.style.display = "none";
    renderAllSections("");
    searchInput.focus();
  });

  // ==========================================
  // FILE PROCESSING
  // ==========================================
  function processFiles(files) {
    const fileArray = Array.from(files);
    const totalFiles = fileArray.length;

    if (totalFiles === 0) return;

    uploadStatus.textContent = `Uploading ${totalFiles} files...`;
    uploadStatus.style.display = "inline-block";
    uploadStatus.classList.add("active");

    const CHUNK_SIZE = 10;
    let processedCount = 0;

    function processChunk(startIndex) {
      const endIndex = Math.min(startIndex + CHUNK_SIZE, totalFiles);

      for (let i = startIndex; i < endIndex; i++) {
        const file = fileArray[i];
        const fileData = {
          id: Date.now() + Math.random().toString(36).substr(2, 5) + i,
          name: file.name,
          size: file.size,
          type: file.type,
          lastModified: file.lastModified,
          webkitRelativePath: file.webkitRelativePath || file.name,
        };
        allFiles.push(fileData);
        recentFiles.unshift(fileData);
        if (recentFiles.length > 20) recentFiles.pop();
        processedCount++;
      }

      uploadStatus.textContent = `Uploading ${processedCount}/${totalFiles}...`;

      const q = searchInput.value.trim();
      if (q) performSearch(q);
      else renderAllSections("");

      if (endIndex < totalFiles) {
        requestAnimationFrame(() => {
          setTimeout(() => processChunk(endIndex), 50);
        });
      } else {
        uploadStatus.textContent = `✓ ${totalFiles} files uploaded`;
        saveFilesToStorage();
        setTimeout(() => {
          uploadStatus.classList.remove("active");
          setTimeout(() => {
            uploadStatus.textContent = "";
            uploadStatus.style.display = "none";
          }, 2000);
        }, 800);
      }
    }

    processChunk(0);
  }

  // ==========================================
  // EVENT LISTENERS
  // ==========================================
  addBtn.addEventListener("click", function (e) {
    e.stopPropagation();
    fileInput.value = "";
    fileInput.click();
  });

  fileInput.addEventListener("change", function (e) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    uploadStatus.style.display = "inline-block";
    uploadStatus.textContent = "Preparing...";
    uploadStatus.classList.add("active");

    setTimeout(() => {
      processFiles(files);
      fileInput.value = "";
    }, 100);
  });

  // Drag and drop
  fileList.addEventListener("dragover", function (e) {
    e.preventDefault();
    this.style.backgroundColor = "#f0f4ff";
  });

  fileList.addEventListener("dragleave", function (e) {
    e.preventDefault();
    this.style.backgroundColor = "#f9fafb";
  });

  fileList.addEventListener("drop", function (e) {
    e.preventDefault();
    this.style.backgroundColor = "#f9fafb";
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      uploadStatus.style.display = "inline-block";
      uploadStatus.textContent = "Preparing...";
      uploadStatus.classList.add("active");
      setTimeout(() => {
        processFiles(files);
      }, 100);
    }
  });

  // Category buttons
  document.getElementById("imagesBtn").addEventListener("click", function () {
    window.location.href = "images_page.html";
  });
  document
    .getElementById("documentsBtn")
    .addEventListener("click", function () {
      window.location.href = "documents_page.html";
    });
  document.getElementById("mediaBtn").addEventListener("click", function () {
    window.location.href = "media_page.html";
  });
  document.getElementById("audioBtn").addEventListener("click", function () {
    window.location.href = "audio_page.html";
  });
  document
    .getElementById("safeVaultBtn")
    .addEventListener("click", function () {
      window.location.href = "dashboard.html";
    });

  // ==========================================
  // INIT
  // ==========================================
  loadFilesFromStorage();
  renderAllSections("");
  clearSearchBtn.style.display = "none";
  uploadStatus.style.display = "none";

  console.log("Dashboard initialized with context menu + localStorage");
});
