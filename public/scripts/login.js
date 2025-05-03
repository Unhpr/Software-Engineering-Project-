document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("loginForm");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const errorMsg = document.getElementById("errorMsg");
  
    form.addEventListener("submit", function (e) {
      const email = emailInput.value;
      const password = passwordInput.value;
  
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
      if (!emailRegex.test(email)) {
        e.preventDefault();
        errorMsg.textContent = "Please enter a valid email address.";
        return;
      }
  
      if (password.length < 6) {
        e.preventDefault();
        errorMsg.textContent = "Password must be at least 6 characters long.";
        return;
      }
  
    
      errorMsg.textContent = "";
    });
  });
  