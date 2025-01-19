document.addEventListener("DOMContentLoaded", function () {
    const logoutBtn = document.getElementById("logout");

    // Check if the user is logged in
    if (!sessionStorage.getItem("username")) {
        window.location.href = "../"; // Redirect to login if not logged in
    }

    // Function to manage "+" and "X" icon visibility
    function manageAddButtonVisibility() {
        const allRows = document.querySelectorAll(".order-item");
    
        allRows.forEach((row, index) => {
            const addButton = row.querySelector(".add-item");
            const deleteButton = row.querySelector(".delete-item");
    
            // Show "+" only for the last row
            if (index === allRows.length - 1) {
                addButton.style.display = "inline"; // Show "+" for the last row
            } else {
                addButton.style.display = "none"; // Hide "+" for other rows
            }
    
            // Show "X" only for rows after the first one
            if (index === 0) {
                deleteButton.style.display = "none"; // Hide "X" for the first row
            } else {
                deleteButton.style.display = "inline"; // Show "X" for other rows
            }
        });
    }
    

    // Function to handle deleting an item row
    function deleteItemRow(deleteButton) {
        const orderItem = deleteButton.closest(".order-item");
        orderItem.remove(); // Remove the selected row
        manageAddButtonVisibility(); // Recalculate "+" and "X" button positions
    }

    // Function to handle adding a new item row
    function addNewItemRow(e) {
        e.preventDefault(); // Prevent form submission if the "+" button is clicked

        // Create a new item row
        const orderItem = document.createElement("div");
        orderItem.classList.add("order-item");

        orderItem.innerHTML = `
            <div class="order-input">
                <label for="item-name">Item Name:</label>
                <input type="text" class="item-name" required>
            </div>
            <div class="order-input">
                <label for="item-quantity">Quantity:</label>
                <input type="number" class="item-quantity" min="1" required>
                <span class="add-item"><i class="fas fa-plus"></i></span> <!-- Green "+" button -->
                <span class="delete-item"><i class="fas fa-times"></i></span> <!-- Red "X" button -->
            </div>
        `;

        // Insert the new item before the "Submit Order" button
        const submitButton = document.querySelector('button[type="submit"]');
        submitButton.insertAdjacentElement("beforebegin", orderItem);

        // Add delete functionality to the new delete icon
        const deleteButton = orderItem.querySelector(".delete-item");
        deleteButton.addEventListener("click", function () {
            deleteItemRow(deleteButton);
        });

        // Add functionality to the new "+" icon
        const newAddButton = orderItem.querySelector(".add-item");
        newAddButton.addEventListener("click", addNewItemRow);

        // Recalculate button visibility
        manageAddButtonVisibility();
    }

    // Handle the green "+" button for the first item
    const firstAddButton = document.querySelector(".add-item");
    if (firstAddButton) {
        firstAddButton.addEventListener("click", addNewItemRow);
    }

    // Handle delete icon click for existing items
    document.querySelectorAll(".delete-item").forEach((deleteIcon) => {
        deleteIcon.addEventListener("click", function () {
            deleteItemRow(deleteIcon);
        });
    });

     // Handle form submission (save to backend)
     const orderForm = document.getElementById("orderForm");
     const confirmationMessage = document.getElementById("confirmation-message");
 
     orderForm.addEventListener("submit", async function (e) {
         e.preventDefault();
         const items = [];
         const username = sessionStorage.getItem("username");
 
         // Get all items from the form
         const orderItems = document.querySelectorAll(".order-item");
         orderItems.forEach((item) => {
             const itemName = item.querySelector(".item-name").value;
             const itemQuantity = item.querySelector(".item-quantity").value;
             items.push({ itemName, itemQuantity });
         });
 
         const response = await fetch(`${API_BASE_URL}/submit-order`, {
             method: "POST",
             headers: { "Content-Type": "application/json" },
             body: JSON.stringify({ username, items }),
         });
         const data = await response.json();
 
         if (data.success) {
             confirmationMessage.textContent = "Order submitted successfully!";
             confirmationMessage.style.color = "green";
             orderForm.reset();
         } else {
             confirmationMessage.textContent = "An error occurred. Please try again.";
             confirmationMessage.style.color = "red";
         }
     });

    // Handle logout
    logoutBtn.addEventListener("click", function () {
        sessionStorage.removeItem("username");
        window.location.href = "../"; // Redirect to login page
    });

    // Initial setup
    manageAddButtonVisibility();
});