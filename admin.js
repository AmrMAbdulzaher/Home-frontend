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
                    <td>${request.username}</td>
                    <td>${formatTimestamp(request.local_timestamp)}</td> <!-- Use local_timestamp -->
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
            const archiveDates = await response.json();
    
            const archiveList = document.getElementById("archive-list");
            const noArchivesMessage = document.getElementById("no-archives-message"); // Get the message element
    
            archiveList.innerHTML = ""; // Clear previous items
    
            if (archiveDates.length === 0) {
                noArchivesMessage.style.display = "block"; // Show the message
            } else {
                noArchivesMessage.style.display = "none"; // Hide the message
                archiveDates.forEach((archive) => {
                    const formattedDate = formatDate(archive.archive_date); // Format as DD/MM/YYYY for display
    
                    const li = document.createElement("li");
                    li.textContent = formattedDate; // Display the formatted date
                    li.onclick = () => openArchiveModal(archive.archive_date); // Pass the original date (YYYY-MM-DD) to the modal
                    archiveList.appendChild(li);
                });
            }
        } catch (error) {
            console.error('Error loading archives:', error);
        }
    }

    // Open Archive Modal
    async function openArchiveModal(date) {
        try {
            console.log("Fetching archive details for date:", date); // Debugging log
            const response = await fetch(`${API_BASE_URL}/archive-details?date=${date}`);
            if (!response.ok) {
                throw new Error('Failed to fetch archive details');
            }
            const archiveDetails = await response.json();
            console.log("Archive details:", archiveDetails); // Debugging log
    
            const modal = document.getElementById("archive-modal");
            const modalDay = document.getElementById("modal-day");
            const modalRequestsList = document.getElementById("modal-requests-list");
    
            // Format the date as DD/MM/YYYY for display
            const formattedDate = formatDate(date);
            modalDay.textContent = formattedDate; // Display the formatted date
            modalRequestsList.innerHTML = ""; // Clear previous details
    
            if (archiveDetails.length === 0) {
                // Display a message if no requests are found
                const li = document.createElement("li");
                li.textContent = "No requests found for this date.";
                modalRequestsList.appendChild(li);
            } else {
                // Display each request in the modal
                archiveDetails.forEach((request) => {
                    const li = document.createElement("li");
                    // Format the timestamp as DD/MM/YYYY, HH:MM:SS
                    const formattedTimestamp = formatTimestamp(request.timestamp);
                    li.textContent = `${request.item_name} (Quantity: ${request.quantity}) - Requested by ${request.username} at ${formattedTimestamp}`;
                    modalRequestsList.appendChild(li);
                });
            }
    
            modal.style.display = "block"; // Show the modal
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

function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0'); // Ensure 2 digits
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    const options = {
        timeZone: "Africa/Cairo", // Convert to Africa/Cairo timezone
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
    };
    return new Intl.DateTimeFormat("en-GB", options).format(date); // Format as DD/MM/YYYY, HH:MM:SS AM/PM
}