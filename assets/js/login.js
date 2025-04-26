document.getElementById('loginForm').addEventListener('submit', function (event) {
  event.preventDefault(); // Prevent form submission

  // Hardcoded username and password
  const validUsername = 'Abhishek';
  const validPassword = 'ABHI@9821';

  // Get input values
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  // Validate credentials
  if (username === validUsername && password === validPassword) {
    // Redirect to upload page if valid
    window.location.href = 'upload.html';
  } else {
    // Show error message if invalid
    const errorMessage = document.getElementById('errorMessage');
    errorMessage.style.display = 'block';
  }
});