document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("loginForm");
    const errorMessage = document.getElementById("login-error-message");

    // Hardcoded username-password pairs
    const users = {
        admin: "adminpass",
        user: "userpass",
    };

    loginForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const username = document.getElementById("username").value.trim();
        const password = document.getElementById("password").value.trim();

        // Validate empty fields
        if (!username || !password) {
            errorMessage.textContent = "Please fill in both username and password.";
            return;
        }

        // Validate credentials
        if (users[username] && users[username] === password) {
            sessionStorage.setItem("username", username); // Save the username in sessionStorage
            if (username === "admin") {
                window.location.href = "/admin"; // Redirect to admin dashboard
            } else {
                window.location.href = "/dashboard"; // Redirect to user dashboard
            }
        } else {
            errorMessage.textContent = "Incorrect username or password!";
        }
    });
});