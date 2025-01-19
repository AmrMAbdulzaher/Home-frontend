document.getElementById('registerForm').addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent the default form submission

    // Get form values
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    // Clear any previous error messages
    document.getElementById('register-error-message').textContent = '';

    // Validate form inputs
    if (!username || !password || !confirmPassword) {
        displayErrorMessage('All fields are required.');
        return;
    }

    if (password !== confirmPassword) {
        displayErrorMessage('Passwords do not match.');
        return;
    }

    try {
        // Send a POST request to the /register endpoint
        const response = await fetch('https://home-backend-flame.vercel.app/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();

        if (response.ok) {
            // Registration successful
            alert('Registration successful! You can now log in.');
            window.location.href = '../'; // Redirect to login page
        } else {
            // Registration failed
            displayErrorMessage(data.message || 'Registration failed. Please try again.');
        }
    } catch (error) {
        console.error('Error during registration:', error);
        displayErrorMessage('An error occurred. Please try again.');
    }
});

function displayErrorMessage(message) {
    const errorMessageElement = document.getElementById('register-error-message');
    errorMessageElement.textContent = message;
    errorMessageElement.style.color = 'red';
}