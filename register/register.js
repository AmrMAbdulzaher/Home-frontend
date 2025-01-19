const API_BASE_URL = "https://home-backend-flame.vercel.app";

document.addEventListener("DOMContentLoaded", function () {
    const registerForm = document.getElementById("registerForm");
    const errorMessage = document.getElementById("register-error-message");

    registerForm.addEventListener("submit", async function (e) {
        e.preventDefault();

        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirm-password").value;

        // Validate fields
        if (!username || !password || !confirmPassword) {
            errorMessage.textContent = "Please fill in all fields.";
            return;
        }

        // Check if passwords match
        if (password !== confirmPassword) {
            errorMessage.textContent = "Passwords do not match.";
            return;
        }

        // Send registration request to the backend
        try {
            const response = await fetch(`${API_BASE_URL}/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (data.success) {
                alert("Registration successful! You can now login.");
                window.location.href = "/login.html"; // Redirect to login page
            } else {
                errorMessage.textContent = data.message || "Registration failed.";
            }
        } catch (error) {
            console.error("Registration error:", error);
            errorMessage.textContent = "An error occurred. Please try again.";
        }
    });
});