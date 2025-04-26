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

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
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
    img.src = "../assets/images/pc/" + wallpaper;
    img.alt = "Wallpaper";
    img.loading = "lazy";
    img.className = "previewable fade-in";
    img.addEventListener('click', () => {
      modalImage.src = "../assets/images/pc/" + wallpaper;
      downloadBtn.href = "../assets/images/pc/" + wallpaper;
      modal.classList.remove('hidden');
      categoryToggle.style.display = "none";
    });
    grid?.appendChild(img);
  });

  page++;
}

function setupInfiniteScroll() {
  window.addEventListener('scroll', () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000) {
      loadNextBatch();
    }
  });
}

// Flatten the categorized wallpapers into a single array
function flattenWallpapers(categories) {
  let allWallpapers = [];
  for (const category in categories) {
    for (const subcategory in categories[category]) {
      allWallpapers = allWallpapers.concat(categories[category][subcategory]);
    }
  }
  return allWallpapers;
}

fetch('../json/pc-wallpapers.json')
  .then(response => response.json())
  .then(data => {
    allWallpapers = shuffleArray(flattenWallpapers(data));
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
