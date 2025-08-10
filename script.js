if (Notification.permission !== "granted") {
    Notification.requestPermission();
}

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
            ${task.deadline ? `<small>Deadline: ${new Date(task.deadline).toLocaleString()}</small>` : ""}
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
    const deadlineInput = document.getElementById("taskDeadline");
    if (input.value.trim() === "") {
        Swal.fire("Oops!", "Please enter a task!", "warning");
        return;
    }
    const deadlineValue = deadlineInput.value ? new Date(deadlineInput.value) : null;
    tasks.push({ text: input.value, completed: false, proof: null,deadline: deadlineValue });
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

const punishments = [
    "Do 10 push-ups right now!",
    "No snacks for the next 2 hours.",
    "Write ‘I will not delete tasks’ 10 times.",
    "Stand up and stretch for 1 minute.",
    "Sing your favorite song loudly.",
    "Drink a full glass of water.",
    "No social media for the next hour.",
    "Dance for 30 seconds — yes, right now.",
    "Text a friend and tell them you’re procrastinating.",
    "Walk around your room 3 times."
];

function deleteTask(index) {
    if (index < 0 || index >= tasks.length) return;

    // Pick a random punishment
    const punishment = punishments[Math.floor(Math.random() * punishments.length)];
    alert(`Punishment for deleting this task: ${punishment}`);

    tasks.splice(index, 1);
    saveTasks();
    renderTasks();
}


// Notifications
if ("Notification" in window && Notification.permission !== "denied") {
    Notification.requestPermission();
}


renderTasks();

setInterval(() => {
    let now = new Date();

    tasks.forEach(task => {
        if (!task.deadline || task.completed) return;

        let timeDiff = (task.deadline - now) / 60000; // in minutes

        if (timeDiff <= 60 && timeDiff > 59) {
            notify(`Task "${task.title}" is due in 1 hour!`);
        } else if (timeDiff <= 30 && timeDiff > 29) {
            notify(`Task "${task.title}" is due in 30 minutes!`);
        } else if (timeDiff <= 15 && timeDiff > 14) {
            notify(`Task "${task.title}" is due in 15 minutes!`);
        } else if (timeDiff <= 5 && timeDiff > 4) {
            notify(`Task "${task.title}" is due in 5 minutes!`);
        }
    });
}, 60000); // check every minute

function notify(message) {
    if (Notification.permission === "granted") {
        new Notification(message);
    }
}

