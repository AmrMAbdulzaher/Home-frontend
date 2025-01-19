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

    // Handle form submission (save to localStorage)
    const orderForm = document.getElementById("orderForm");
    const confirmationMessage = document.getElementById("confirmation-message");

    orderForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const items = [];
        const username = sessionStorage.getItem("username"); // Get the current logged-in user
        let hasError = false;

        // Get all items from the form
        const orderItems = document.querySelectorAll(".order-item");

        orderItems.forEach((item) => {
            const itemNameInput = item.querySelector(".item-name");
            const itemQuantityInput = item.querySelector(".item-quantity");
            const itemName = itemNameInput.value.trim();
            const itemQuantity = itemQuantityInput.value.trim();

            // Validate item name (letters, spaces, and optional symbols)
            if (!/^[a-zA-Z\s\-.,'()]+$/.test(itemName)) {
                hasError = true;
                itemNameInput.style.border = "1px solid red";
                confirmationMessage.textContent = "Item name can only contain letters, spaces, and symbols like -.,'().";
                confirmationMessage.style.color = "red";
            } else {
                itemNameInput.style.border = ""; // Reset border if valid
            }

            // Validate item quantity (must be a positive number)
            if (!itemQuantity || isNaN(itemQuantity) || parseInt(itemQuantity) <= 0) {
                hasError = true;
                itemQuantityInput.style.border = "1px solid red";
                confirmationMessage.textContent = "Quantity must be a positive number.";
                confirmationMessage.style.color = "red";
            } else {
                itemQuantityInput.style.border = ""; // Reset border if valid
            }

            if (!hasError) {
                items.push({ itemName, itemQuantity });
            }
        });

        if (hasError) {
            return; // Stop submission if there are errors
        }

        // Store orders in localStorage (adding the current username and timestamp)
        if (items.length > 0) {
            try {
                const existingOrders = JSON.parse(localStorage.getItem("userRequests")) || [];
                const timestamp = new Date().toLocaleString(); // Get current date and time
                existingOrders.push({
                    username,
                    timestamp,
                    items,
                });
                localStorage.setItem("userRequests", JSON.stringify(existingOrders));

                confirmationMessage.textContent = "Order added successfully!";
                confirmationMessage.style.color = "green";
                orderForm.reset();
            } catch (error) {
                console.error("Error saving to localStorage:", error);
                confirmationMessage.textContent = "An error occurred while saving your order. Please try again.";
                confirmationMessage.style.color = "red";
            }
        } else {
            confirmationMessage.textContent = "Please provide both item name and quantity.";
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