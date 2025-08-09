let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks() {
    const list = document.getElementById("taskList");
    list.innerHTML = "";
    tasks.forEach((task, index) => {
        let li = document.createElement("li");
        li.className = task.completed ? "completed animate__animated animate__fadeIn" : "animate__animated animate__fadeIn";

        li.innerHTML = `
            <span>${task.text}</span>
            ${task.proof ? `<img src="${task.proof}" class="proof-thumb">` : ""}
            <div>
                <button onclick="markComplete(${index})"><i class="fa fa-check"></i></button>
                <button onclick="deleteTask(${index})"><i class="fa fa-trash"></i></button>
            </div>
        `;
        list.appendChild(li);
    });
}

function addTask() {
    const input = document.getElementById("taskInput");
    if (input.value.trim() === "") {
        Swal.fire("Oops!", "Please enter a task!", "warning");
        return;
    }
    tasks.push({ text: input.value, completed: false, proof: null });
    input.value = "";
    saveTasks();
    renderTasks();
}

function markComplete(index) {
    if (tasks[index].completed) {
        Swal.fire("Already Done!", "You already completed this task!", "info");
        return;
    }

    // Ask for proof
    let fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*,video/*";
    fileInput.capture = "environment"; // mobile camera

    fileInput.onchange = () => {
        let file = fileInput.files[0];
        if (file) {
            let proofURL = URL.createObjectURL(file);
            tasks[index].completed = true;
            tasks[index].proof = proofURL;
            saveTasks();
            renderTasks();
            Swal.fire("Nice!", "Task completed with proof!", "success");
        } else {
            Swal.fire("No Proof", "You must upload a picture or video!", "error");
        }
    };

    fileInput.click();
}

function deleteTask(index) {
    if (!tasks[index].completed) {
        Swal.fire("Punishment!", "You deleted an incomplete task! Do 20 push-ups!", "error");
    }
    tasks.splice(index, 1);
    saveTasks();
    renderTasks();
}

// Notifications
if ("Notification" in window && Notification.permission !== "denied") {
    Notification.requestPermission();
}
setInterval(() => {
    if (tasks.some(t => !t.completed)) {
        new Notification("Reminder", { body: "You still have tasks to finish!" });
    }
}, 60000); // every 1 min

renderTasks();
