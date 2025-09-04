const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");


window.onload = loadTasks;

addBtn.addEventListener("click", addTask);

function addTask() {
    const taskText = taskInput.value.trim();
    const deadlineInput = document.getElementById("deadlineInput");
    const deadline = deadlineInput.value;

    if (taskText === "") return;

    const li = document.createElement("li");
    li.setAttribute("data-deadline", deadline);

    li.innerHTML = `
    <span class="task-text">${taskText}</span>
    <span class="task-deadline">締切：${deadline || "なし"}</span>
    <div>
        <button onclick="toggleComplete(this)">✔</button>
        <button onclick="editTask(this)">✎</button>
        <button onclick="deleteTask(this)">✖</button>
    </div>
    `;

    taskList.appendChild(li);

    taskInput.value = "";
    deadlineInput.value = "";
    sortTasksByDeadline();
    saveTasks();
    updateDeadlineColor(li);
}

function editTask(button){
    const li = button.parentElement.parentElement;
    const taskTextSpan = li.querySelector(".task-text");
    const deadlineSpan = li.querySelector(".task-deadline");

    const currentText = taskTextSpan.textContent;
    const currentDeadline = li.getAttribute("data-deadline");

    const newText = prompt("タスク内容を編集:", currentText);
    if (newText === null || newText.trim() === "") return;

    const newDeadline = prompt("締切を編集 (YYYY-MM-DD形式、空欄でなし):", currentDeadline || "");
  // 値を更新
    taskTextSpan.textContent = newText;
    li.setAttribute("data-deadline", newDeadline);
    deadlineSpan.textContent = "締切： " + (newDeadline || "なし");

  // 並び替えも更新
    sortTaskByDeadline();
    updateDeadlineColor(li);
}

function updateDeadlineColor(li) {
    const deadline = li.getAttribute("data-deadline");
    const span = li.querySelector(".task-deadline");

    if (deadline) {
        const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
        if (deadline < today) {
        span.style.color = "red"; // 期限切れ
        } else {
        span.style.color = "gray"; // 期限内
        }
    } else {
        span.style.color = "gray"; // 締切なし
    }
}

function sortTasksByDeadline(){
    const list = document.getElementById("taskList");
    const tasks = Array.from(list.children);

    tasks.sort((a,b) => {
        const dateA = a.getAttribute("data-deadline");
        const dateB = b.getAttribute("data-deadline");

        if(!dateA && !dateB) return 0;
        if(!dateA) return 1;
        if(!dateB) return -1;
        return dateA.localeCompare(dateB);
    });
    tasks.forEach(task => list.appendChild(task));
}

function toggleComplete(button) {
    button.classList.toggle("done-btn");

    if(button.classList.contains("done-btn")){
        button.style.backgroundColor = "lightgreen";
        button.style.color = "white";
    }else{
        button.style.backgroundColor = "";
        button.style.color = "";
    }

    saveTasks();
}

function saveTasks() {
    const tasks = [];
    document.querySelectorAll("#taskList li").forEach(li => {
    tasks.push({
        text: li.querySelector(".task-text").textContent,
        deadline: li.getAttribute("data-deadline"),
        done: li.querySelector("button").classList.contains("done-btn")
    });
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
}


function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.forEach(task => {
    const li = document.createElement("li");
    li.setAttribute("data-deadline", task.deadline);
    li.innerHTML = `
        <span class="task-text">${task.text}</span>
        <span class="task-deadline">締切 ${task.deadline || "なし"}</span>
        <div>
            <button onclick="toggleComplete(this)" class="${task.done ? "done-btn" : ""}">✔</button>
            <button onclick="editTask(this)">✎</button>
            <button onclick="deleteTask(this)">✖</button>
        </div>
    `;
    document.getElementById("taskList").appendChild(li);
    updateDeadlineColor(li);
    });
    sortTasksByDeadline();
}

window.onload = loadTasks;