document.addEventListener('DOMContentLoaded', function () {

     // Fetch today's requests
     async function loadTodayRequests() {
        const response = await fetch(`${API_BASE_URL}/today-requests`);
        const requests = await response.json();

        const tbody = document.querySelector("#today-requests-list tbody");
        tbody.innerHTML = "";

        requests.forEach((request) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${request.quantity}</td>
                <td>${request.item_name}</td>
                <td>${request.username}</td>
                <td>${new Date(request.timestamp).toLocaleString()}</td>
            `;
            tbody.appendChild(row);
        });
    }


 // Fetch archives
 async function loadArchives() {
    const response = await fetch(`${API_BASE_URL}/archives`);
    const archives = await response.json();

    const archiveList = document.getElementById("archive-list");
    archiveList.innerHTML = "";

    archives.forEach((archive) => {
        const li = document.createElement("li");
        li.textContent = `${archive.item_name} (Quantity: ${archive.quantity}) - ${archive.username} at ${new Date(archive.timestamp).toLocaleString()}`;
        archiveList.appendChild(li);
    });
}
    // Check if the user is logged in
    if (!sessionStorage.getItem("username")) {
        window.location.href = "../"; // Redirect to login if not logged in
    }

   // Load data on page load
   loadTodayRequests();
   loadArchives();
  // Handle logout
  logoutBtn.addEventListener("click", function () {
    sessionStorage.removeItem("username");
    window.location.href = "../";
});
/*
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
    });*/

    // Logout functionality
    
});


