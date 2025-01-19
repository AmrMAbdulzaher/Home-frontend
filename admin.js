document.addEventListener('DOMContentLoaded', function () {
    const userRequests = JSON.parse(localStorage.getItem('userRequests')) || [];
   // const archive = JSON.parse(localStorage.getItem('archive')) || {};


    const archive = JSON.parse(localStorage.getItem('archive')) || {
        "16/01/2025": [
            { item: "Cool PC", quantity: 2, username: "Amr", time: "19/01/2025 12:18 PM (GMT+2)" },
            { item: "Chips", quantity: 1, username: "Amr", time: "19/01/2025 12:30 PM (GMT+2)" }
        ],
        "17/01/2025": [
            { item: "Oreo", quantity: 1, username: "Karim", time: "19/01/2025 02:50 PM (GMT+2)" }
        ]
    };

    // Check if the user is logged in
    if (!sessionStorage.getItem("username")) {
        window.location.href = "../"; // Redirect to login if not logged in
    }

    // Load User Requests
    loadUserRequests();

    // Load Archive
    loadArchive();

    // Mark Request as Purchased
    function markAsPurchased(button, requestIndex) {
        button.textContent = 'Purchased';
        button.disabled = true;

        // Mark request as purchased in the userRequests array
        userRequests[requestIndex].purchased = true;

        // Save the updated userRequests to localStorage
        localStorage.setItem('userRequests', JSON.stringify(userRequests));
    }

    // Load User Requests
    function loadUserRequests() {
        const userRequestsList = document.getElementById('today-requests-list').getElementsByTagName('tbody')[0];
        userRequestsList.innerHTML = ''; // Clear current list

        userRequests.forEach((request, index) => {
            request.items.forEach(item => {
                const row = userRequestsList.insertRow();
                row.innerHTML = `
                    <td>${item.itemQuantity}</td>
                    <td>${item.itemName}</td>
                    <td>${request.username}</td>
                    <td>${request.timestamp}</td>
                    <td><button onclick="markAsPurchased(this, ${index})">Mark as Purchased</button></td>
                `;
            });
        });
    }

    // Load Archive
    function loadArchive() {
        const archiveList = document.getElementById('archive-list');
        archiveList.innerHTML = ''; // Clear current archive list

        for (let day in archive) {
            const dayItem = document.createElement('li');
            dayItem.textContent = day;
            dayItem.onclick = () => openArchiveModal(day);
            archiveList.appendChild(dayItem);
        }
    }

    // Open Archive Modal
    function openArchiveModal(day) {
        const modal = document.getElementById('archive-modal');
        const modalRequestsList = document.getElementById('modal-requests-list');
        const modalDay = document.getElementById('modal-day');
        modalRequestsList.innerHTML = ''; // Clear previous requests
        modalDay.textContent = day;

        archive[day].forEach(request => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <strong>${request.item}</strong> (Quantity: ${request.quantity}) - Requested by ${request.username} at ${request.time}
            `;
            modalRequestsList.appendChild(listItem);
        });

        modal.style.display = 'block';
    }

    // Close Modal
    document.querySelector('.close').onclick = function () {
        document.getElementById('archive-modal').style.display = 'none';
    }

    // Close modal when clicking outside of it
    document.addEventListener("click", function (event) {
        const modal = document.getElementById("archive-modal");
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });

    // Logout functionality
    document.getElementById('logout').onclick = function () {
        sessionStorage.removeItem('username');
        window.location.href = '../'; // Redirect to login page
    }
});


