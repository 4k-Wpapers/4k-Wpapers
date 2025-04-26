document.addEventListener('DOMContentLoaded', () => {
  const wallpaperGrid = document.getElementById('wallpaper-grid');
  const categoryTitle = document.getElementById('category-title');
  const modal = document.getElementById('previewModal');
  const modalImg = document.getElementById('modalImage');
  const downloadBtn = document.getElementById('downloadBtn');
  const closeModal = document.getElementById('closeModal');
  const themeToggle = document.getElementById('themeToggle');

  // Get category from URL parameter
  const urlParams = new URLSearchParams(window.location.search);
  const category = urlParams.get('cat');
  console.log('Selected category:', category); // Debug log

  // Set page title and category title
  document.title = `4k-Wpapers/PC💻 - ${category.charAt(0).toUpperCase() + category.slice(1)}`;
  categoryTitle.textContent = `${category.charAt(0).toUpperCase() + category.slice(1)} Wallpapers`;

  // Load wallpapers for the selected category
  fetch('../../json/pc-wallpapers.json')
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      console.log('Loaded JSON data:', data); // Debug log
      
      // Find the category (case-insensitive)
      const categoryKey = Object.keys(data).find(key => 
        key.toLowerCase() === category.toLowerCase()
      );
      
      if (!categoryKey) {
        console.log('Category not found. Available categories:', Object.keys(data));
        categoryTitle.textContent = 'Category not found';
        return;
      }

      // Get wallpapers for the selected category
      const categoryData = data[categoryKey];
      console.log('Category data:', categoryData); // Debug log

      // Get all wallpapers from subcategories
      let allWallpapers = [];
      Object.values(categoryData).forEach(subcategory => {
        if (Array.isArray(subcategory)) {
          allWallpapers = allWallpapers.concat(subcategory);
        }
      });
      
      console.log('All wallpapers for category:', allWallpapers); // Debug log
      
      if (allWallpapers.length === 0) {
        console.log('No wallpapers found in category');
        categoryTitle.textContent = 'No wallpapers found in this category';
        return;
      }

      // Display wallpapers
      allWallpapers.forEach(wallpaperPath => {
        const wallpaperItem = document.createElement('div');
        wallpaperItem.className = 'wallpaper-item loading';
        
        const img = document.createElement('img');
        const imagePath = `../assets/images/pc/${wallpaperPath}`;
        console.log('Loading image from path:', imagePath); // Debug log
        
        // Set up image loading
        img.onload = () => {
          wallpaperItem.classList.remove('loading');
          img.classList.add('loaded');
        };
        
        img.onerror = () => {
          console.error('Failed to load image:', imagePath);
          wallpaperItem.remove();
        };
        
        img.src = imagePath;
        img.alt = wallpaperPath;
        img.loading = 'lazy';
        
        wallpaperItem.appendChild(img);
        wallpaperGrid.appendChild(wallpaperItem);

        // Add click event to open modal
        img.addEventListener('click', () => {
          modalImg.src = img.src;
          downloadBtn.href = img.src;
          modal.classList.remove('hidden');
        });
      });
    })
    .catch(error => {
      console.error('Error loading wallpapers:', error);
      categoryTitle.textContent = 'Error loading wallpapers';
    });

  // Modal functionality
  closeModal.addEventListener('click', () => {
    modal.classList.add('hidden');
  });

  // Theme toggle functionality
  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    const isDark = document.body.classList.contains('dark');
    themeToggle.textContent = isDark ? '☀️' : '🌙';
  });
});
  