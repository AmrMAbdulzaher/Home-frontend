const API_BASE_URL = "https://home-backend-flame.vercel.app";

document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("loginForm");
    const errorMessage = document.getElementById("login-error-message");

    loginForm.addEventListener("submit", async function (e) {
        e.preventDefault();

        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        // Validate empty fields
        if (!username || !password) {
            errorMessage.textContent = "Please fill in both username and password.";
            return;
        }

        const response = await fetch(`${API_BASE_URL}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        });
        const data = await response.json();

        if (data.success) {
            sessionStorage.setItem("username", username);
            if (username === "admin") {
                window.location.href = "/admin"; // Redirect to admin dashboard
            } else {
                window.location.href = "/dashboard"; // Redirect to user dashboard
            }
        } else {
            errorMessage.textContent = data.message;
        }
    });
});