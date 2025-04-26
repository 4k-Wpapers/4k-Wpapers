// Loading overlay
const loadingOverlay = document.querySelector('.loading-overlay');

// Hide loading overlay when everything is loaded
window.addEventListener('load', () => {
  setTimeout(() => {
    loadingOverlay.classList.add('hidden');
  }, 500);
});

// Dark Mode Toggle
const themeToggle = document.getElementById("themeToggle");
const body = document.body;

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    body.classList.toggle("dark");
    const isDark = body.classList.contains("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");
    themeToggle.textContent = isDark ? "☀️" : "🌙";
  });

  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    body.classList.add("dark");
    themeToggle.textContent = "☀️";
  } else {
    themeToggle.textContent = "🌙";
  }
}

const modal = document.getElementById('previewModal');
const modalImage = document.getElementById('modalImage');
const closeModal = document.getElementById('closeModal');
const downloadBtn = document.getElementById('downloadBtn');
const categoryToggle = document.getElementById("categoryToggle");
const categoryPanel = document.getElementById("categoryPanel");
const grid = document.getElementById("wallpaper-grid");

closeModal.addEventListener('click', () => {
  modal.classList.add('hidden');
  modalImage.src = "";
  if (!categoryPanel.classList.contains("show")) {
    categoryToggle.style.display = "flex";
  }
});

modal.addEventListener('click', (event) => {
  if (event.target === modal) {
    modal.classList.add('hidden');
    modalImage.src = "";
    if (!categoryPanel.classList.contains("show")) {
      categoryToggle.style.display = "flex";
    }
  }
});

window.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !modal.classList.contains("hidden")) {
    modal.classList.add("hidden");
    modalImage.src = "";
    if (!categoryPanel.classList.contains("show")) {
      categoryToggle.style.display = "flex";
    }
  }
});

function shuffleArray(arr) {
  return arr.sort(() => 0.5 - Math.random());
}

let page = 0;
const limit = 20;
let allWallpapers = [];

function loadNextBatch() {
  const start = page * limit;
  const end = start + limit;
  const batch = allWallpapers.slice(start, end);

  batch.forEach((wallpaper) => {
    const img = document.createElement("img");
    // Check if the image is from mobile or PC directory based on the filename
    const isMobile = !wallpaper.includes('uhdpaper.com') && !wallpaper.includes('Windows 11') && !wallpaper.includes('174428');
    const imagePath = isMobile ? `assets/images/mobile/${wallpaper}` : `assets/images/pc/${wallpaper}`;
    
    img.src = imagePath;
    img.alt = "Wallpaper";
    img.loading = "lazy";
    img.className = "previewable fade-in";
    img.addEventListener('click', () => {
      modalImage.src = imagePath;
      downloadBtn.href = imagePath;
      modal.classList.remove('hidden');
      categoryToggle.style.display = "none";
    });
    grid?.appendChild(img);
  });

  page++;
}

function setupInfiniteScroll() {
  const sentinel = document.createElement("div");
  sentinel.id = "scrollSentinel";
  grid?.after(sentinel);

  const observer = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      loadNextBatch();
    }
  }, {
    rootMargin: "200px"
  });

  observer.observe(sentinel);
}

fetch('../json/wallpapers.json')
  .then(response => response.json())
  .then(data => {
    allWallpapers = shuffleArray(data);
    loadNextBatch();
    setupInfiniteScroll();
  })
  .catch(err => console.error("Failed to load wallpapers:", err));

// Category toggle panel
categoryToggle.addEventListener("click", () => {
  categoryPanel.classList.toggle("show");
  if (categoryPanel.classList.contains("show")) {
    categoryToggle.style.display = "none";
  }
});

const closeCategory = document.getElementById("closeCategory");
if (closeCategory) {
  closeCategory.addEventListener("click", () => {
    categoryPanel.classList.remove("show");
    if (modal.classList.contains("hidden")) {
      categoryToggle.style.display = "flex";
    }
  });
}

document.addEventListener("click", (e) => {
  if (
    categoryPanel.classList.contains("show") &&
    !categoryPanel.contains(e.target) &&
    e.target !== categoryToggle
  ) {
    categoryPanel.classList.remove("show");
    if (modal.classList.contains("hidden")) {
      categoryToggle.style.display = "flex";
    }
  }
});
