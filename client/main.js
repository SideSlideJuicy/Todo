// Status buttons
const doneButtons = document.querySelectorAll(".status");

// Counters
const upcomingTaskCounter = document.getElementById("upcoming-task-counter");
const doneTaskCounter = document.getElementById("done-task-counter");

doneButtons.forEach(button => {
    button.addEventListener("click", () => {
        const taskContainer = button.closest(".task");
        const taskId = button.getAttribute("data-task-id");

        // console.log("Task ID:", taskId);

        // When the button text content is "Done" and the button is pressed
        if (button.textContent === "Done"){

            // Update the Upcoming Task Counter value
            upcomingTaskCounter.textContent = Number(upcomingTaskCounter.textContent) - 1;
            // Update the Done Task Counter value
            doneTaskCounter.textContent = Number(doneTaskCounter.textContent) + 1;

            // Make an AJAX (fetch) request to update the task status
            fetch(`/${taskId}/status`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ status: "Done" }) // New status
            })
            .then(response => response.json())
            .then(data => {
                if (data.message === "Status updated successfully") {
                    // Move the task element to the "Done" section
                    const doneTasksSection = document.getElementById("done-tasks");
                    doneTasksSection.appendChild(taskContainer);

                    // Update the button text to "Undone"
                    button.textContent = "Undone";

                    // Hide & show task list sections
                    const upcomingSection = document.getElementById("upcoming-list");
                    const doneSection = document.getElementById("done-list");

                    // Check if the "Upcoming" section has tasks
                    if (!hasTasks(upcomingSection)) {
                        hideSection(upcomingSection);
                    }
                    else{
                        showSection(upcomingSection);
                    }

                    // Check if the "Done" section has tasks
                    if (!hasTasks(doneSection)) {
                        hideSection(doneSection);
                    }
                    else{
                        showSection(doneSection);
                    }

                    function hasTasks(section) {
                        // Check if a section has tasks by counting the number of task elements
                        const taskElements = section.querySelectorAll(".task");
                        return taskElements.length > 0;
                    }
                    
                    function hideSection(section) {
                        // Add a class to hide the section
                        section.classList.add("hidden");
                    }

                    function showSection(section) {
                        // Remove a class to show the section
                        section.classList.remove("hidden");
                    }

                } else {
                    console.error("Status update failed:", data.message);
                }
            })
            .catch(error => {
                console.error("Error updating task status:", error);
            });
        }

        // When the button text content is "Undone" and the button is pressed
        else if(button.textContent === "Undone"){

            // Update the Upcoming Task Counter value
            upcomingTaskCounter.textContent = Number(upcomingTaskCounter.textContent) + 1;
            // Update the Done Task Counter value
            doneTaskCounter.textContent = Number(doneTaskCounter.textContent) - 1;

            // Make an AJAX (fetch) request to update the task status
            fetch(`/${taskId}/status`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ status: "Undone" }) // New status
            })
            .then(response => response.json())
            .then(data => {
                if (data.message === "Status updated successfully") {
                    // Move the task element to the "Done" section
                    const upcomingTasksSection = document.getElementById("upcoming-tasks");
                    upcomingTasksSection.appendChild(taskContainer);

                    // Update the button text to "Done"
                    button.textContent = "Done";

                    // Hide & show task list sections
                    const upcomingSection = document.getElementById("upcoming-list");
                    const doneSection = document.getElementById("done-list");

                    // Check if the "Upcoming" section has tasks
                    if (!hasTasks(upcomingSection)) {
                        hideSection(upcomingSection);
                    }
                    else{
                        showSection(upcomingSection);
                    }

                    // Check if the "Done" section has tasks
                    if (!hasTasks(doneSection)) {
                        hideSection(doneSection);
                    }
                    else{
                        showSection(doneSection);
                    }

                    function hasTasks(section) {
                        // Check if a section has tasks by counting the number of task elements
                        const taskElements = section.querySelectorAll(".task");
                        return taskElements.length > 0;
                    }
                    
                    function hideSection(section) {
                        // Add a class to hide the section
                        section.classList.add("hidden");
                    }

                    function showSection(section) {
                        // Remove a class to show the section
                        section.classList.remove("hidden");
                    }

                } else {
                    console.error("Status update failed:", data.message);
                }
            })
            .catch(error => {
                console.error("Error updating task status:", error);
            });
        }
    });
});

// Search field
const searchField = document.getElementById("search-field");

searchField.addEventListener("input", () => {
    const hasContent = searchField.value.length > 0;
    searchField.classList.toggle("filledin", hasContent);
});

document.getElementById('clear-btn').onclick = function() {
    searchField.value = "";
    searchField.classList = "search-field clearable";
};

const searchForm = document.getElementById("search-form");

searchForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const searchQuery = searchField.value;
    window.location.href = `/search?q=${searchQuery}`;
});

// Delete button
const deleteButton = document.querySelectorAll(".delete")

deleteButton.forEach((button, i) => {
    button.addEventListener("click", () => {
        const taskId = `/${button.classList[1]}`

        fetch(taskId, {
            method: "DELETE"
        })
        window.location.href = "/"
    })
})

// Edit button
const editButton = document.querySelectorAll(".edit");

editButton.forEach(button => {
    button.addEventListener("click", () => {
        const taskContainer = button.closest(".task");
        const taskInput = taskContainer.querySelector(".text");
        const taskId = button.getAttribute("data-task-id"); // Get the task ID from data attribute

        if (button.textContent === "Edit") {
            // Change "Edit" button text to "Save"
            button.textContent = "Save";

            // Enable editing of the task input field
            taskInput.removeAttribute("readonly");
        }
        
        else if (button.textContent === "Save") {
            // Change "Save" button text to "Edit"
            button.textContent = "Edit";

            // Disable editing of the task input field
            taskInput.setAttribute("readonly", true);

            // Send a PUT request to update the task
            fetch(`/${taskId}`, {
                method: "PUT",
                headers: {
                "Content-Type": "application/json"
                },
                body: JSON.stringify({ updatedTaskValue: taskInput.value })
            })
            .then(response => {
                if (!response.ok) {
                console.error("Error updating task");
                }
            })
            .catch(error => {
                console.error("Network error:", error);
            });
        }
    });
});

// Hide & show task list sections
document.addEventListener("DOMContentLoaded", function () {
    const upcomingSection = document.getElementById("upcoming-list");
    const doneSection = document.getElementById("done-list");

    // Check if the "Upcoming" section has tasks
    if (!hasTasks(upcomingSection)) {
        hideSection(upcomingSection);
    }
    else{
        showSection(upcomingSection);
    }

    // Check if the "Done" section has tasks
    if (!hasTasks(doneSection)) {
        hideSection(doneSection);
    }
    else{
        showSection(doneSection);
    }
});

function hasTasks(section) {
    // Check if a section has tasks by counting the number of task elements
    const taskElements = section.querySelectorAll(".task");
    return taskElements.length > 0;
}

function hideSection(section) {
    // Add a class to hide the section
    section.classList.add("hidden");
}

function showSection(section) {
    // Remove a class to show the section
    section.classList.remove("hidden");
}







