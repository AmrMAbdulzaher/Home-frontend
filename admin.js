document.addEventListener('DOMContentLoaded', function () {
    const API_BASE_URL = "https://home-backend-flame.vercel.app"; // Your deployed backend URL
    const logoutBtn = document.getElementById("logout");

    // Check if the user is logged in
    if (!sessionStorage.getItem("username")) {
        window.location.href = "../"; // Redirect to login if not logged in
    }

    async function loadTodayRequests() {
        try {
            const response = await fetch(`${API_BASE_URL}/today-requests`);
            if (!response.ok) {
                throw new Error('Failed to fetch today\'s requests');
            }
            const requests = await response.json();
    
            const tbody = document.querySelector("#today-requests-list tbody");
            tbody.innerHTML = "";
    
            requests.forEach((request) => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${request.quantity}</td>
                    <td>${request.item_name}</td>
                    <td>${request.username}</td> <!-- Display username -->
                    <td>${new Date(request.timestamp).toLocaleString()}</td>
                `;
                tbody.appendChild(row);
            });
        } catch (error) {
            console.error('Error loading today\'s requests:', error);
        }
    }

    // Fetch archives
    async function loadArchives() {
        try {
            const response = await fetch(`${API_BASE_URL}/archives`);
            if (!response.ok) {
                throw new Error('Failed to fetch archives');
            }
            const archives = await response.json();

            const archiveList = document.getElementById("archive-list");
            archiveList.innerHTML = "";

            archives.forEach((archive) => {
                const li = document.createElement("li");
                li.textContent = `${archive.item_name} (Quantity: ${archive.quantity}) - ${archive.username} at ${new Date(archive.timestamp).toLocaleString()}`;
                li.onclick = () => openArchiveModal(archive.timestamp.split('T')[0]); // Open modal on click
                archiveList.appendChild(li);
            });
        } catch (error) {
            console.error('Error loading archives:', error);
        }
    }




    // Open Archive Modal
    async function openArchiveModal(day) {
        try {
            const response = await fetch(`${API_BASE_URL}/archives?day=${day}`);
            if (!response.ok) {
                throw new Error('Failed to fetch archive details');
            }
            const archiveDetails = await response.json();
    
            const modal = document.getElementById("archive-modal");
            const modalDay = document.getElementById("modal-day");
            const modalRequestsList = document.getElementById("modal-requests-list");
    
            modalDay.textContent = day;
            modalRequestsList.innerHTML = "";
    
            archiveDetails.forEach((request) => {
                const li = document.createElement("li");
                li.textContent = `${request.item_name} (Quantity: ${request.quantity}) - Requested by ${request.username} at ${new Date(request.timestamp).toLocaleString()}`;
                modalRequestsList.appendChild(li);
            });
    
            modal.style.display = "block";
        } catch (error) {
            console.error('Error opening archive modal:', error);
        }
    }

    // Close Modal
    document.querySelector(".close").onclick = function () {
        document.getElementById("archive-modal").style.display = "none";
    };

    // Close modal when clicking outside of it
    window.onclick = function (event) {
        const modal = document.getElementById("archive-modal");
        if (event.target === modal) {
            modal.style.display = "none";
        }
    };

    // Logout functionality
    logoutBtn.addEventListener("click", function () {
        sessionStorage.removeItem("username");
        window.location.href = "../"; // Redirect to login page
    });

    // Load data on page load
    loadTodayRequests();
    loadArchives();
});