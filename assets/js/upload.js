// Category and subcategory mapping
const categorySubcategories = {
  'Space': ['Galaxy', 'Moon', 'Moonlight'],
  'Anime': ['Characters'],
  'Digital Art': ['Abstract', 'Graphics', 'Illustration'],
  'Gaming': ['Superhero'],
  'Windows': ['Windows 11'],
  'Uncategorized': ['General']
};

// DOM Elements
const wallpaperTypeSelect = document.getElementById('wallpaperType');
const categorySelect = document.getElementById('category');
const subcategorySelect = document.getElementById('subcategory');
const fileInput = document.getElementById('wallpapers');
const previewContainer = document.getElementById('imagePreviews');
const clearButton = document.getElementById('clearSelection');
const generateButton = document.getElementById('generateCode');
const copyButton = document.getElementById('copyCode');
const codeOutput = document.getElementById('generatedCode');

// Update subcategories when category changes
categorySelect.addEventListener('change', () => {
  const selectedCategory = categorySelect.value;
  const subcategories = categorySubcategories[selectedCategory] || ['General'];
  
  subcategorySelect.innerHTML = '';
  subcategories.forEach(subcategory => {
    const option = document.createElement('option');
    option.value = subcategory;
    option.textContent = subcategory;
    subcategorySelect.appendChild(option);
  });
});

// Handle file selection and preview
fileInput.addEventListener('change', () => {
  previewContainer.innerHTML = '';
  const files = fileInput.files;
  
  if (files.length === 0) return;
  
  for (const file of files) {
    if (!file.type.startsWith('image/')) {
      alert('Please select only image files.');
      return;
    }
    
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      alert('File size should be less than 10MB.');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = document.createElement('img');
      img.src = e.target.result;
      img.className = 'preview-image';
      previewContainer.appendChild(img);
    };
    reader.readAsDataURL(file);
  }
});

// Clear selection
clearButton.addEventListener('click', () => {
  fileInput.value = '';
  previewContainer.innerHTML = '';
  codeOutput.value = '';
});

// Generate code
generateButton.addEventListener('click', () => {
  const files = fileInput.files;
  if (files.length === 0) {
    alert('Please select at least one image.');
    return;
  }
  
  const wallpaperType = wallpaperTypeSelect.value;
  const category = categorySelect.value;
  const subcategory = subcategorySelect.value;
  
  let generatedCode = [];
  for (const file of files) {
    const fileName = file.name;
    generatedCode.push(`"${fileName}"`);
  }
  
  codeOutput.value = `[\n  ${generatedCode.join(',\n  ')}\n]`;
});

// Copy code to clipboard
copyButton.addEventListener('click', () => {
  codeOutput.select();
  document.execCommand('copy');
  alert('Code copied to clipboard!');
});