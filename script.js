const taskInput = document.getElementById("taskInput");
const deadlineInput = document.getElementById("deadlineInput");
const priorityInput = document.getElementById("priorityInput");
const addBtn = document.getElementById("addBtn");
const clearAllBtn = document.getElementById("clearAllBtn");
const todoList = document.getElementById("todoList");
const doneList = document.getElementById("doneList");

// --- PROFILE ---
const avatar = document.getElementById("avatar");
const profileName = document.getElementById("profileName");
const profileRole = document.getElementById("profileRole");
const nameInput = document.getElementById("nameInput");
const roleInput = document.getElementById("roleInput");
const saveProfileBtn = document.getElementById("saveProfileBtn");

function loadProfile() {
  const profile = JSON.parse(localStorage.getItem("profile")) || null;
  if (profile) {
    profileName.textContent = profile.name;
    profileRole.textContent = profile.role;
    avatar.textContent = profile.name.charAt(0).toUpperCase();
    nameInput.value = profile.name;
    roleInput.value = profile.role;
  }
}

saveProfileBtn.addEventListener("click", () => {
  const name = nameInput.value.trim() || "User";
  const role = roleInput.value.trim() || "Pengguna";
  const profile = { name, role };
  localStorage.setItem("profile", JSON.stringify(profile));
  loadProfile();
});

// --- TO-DO LIST ---
function getTasks() {
  return JSON.parse(localStorage.getItem("tasks")) || [];
}

function saveTasks(tasks) {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks() {
  const tasks = getTasks();
  todoList.innerHTML = "";
  doneList.innerHTML = "";

  tasks.forEach((task) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span>${task.text} 
        <small>(${task.priority}${task.deadline ? ", deadline: " + task.deadline : ""})</small>
      </span>
      <div class="action-buttons">
        <button class="doneBtn">${task.done ? "↺" : "✓"}</button>
        <button class="deleteBtn">🗑</button>
      </div>
    `;

    if (task.deadline && new Date(task.deadline) < new Date() && !task.done) {
      li.classList.add("overdue");
    }

    if (task.done) {
      li.classList.add("done");
      doneList.appendChild(li);
    } else {
      todoList.appendChild(li);
    }

    li.querySelector(".doneBtn").addEventListener("click", () => {
      let updatedTasks = getTasks();
      const t = updatedTasks.find(t => t.id === task.id);
      t.done = !t.done;
      saveTasks(updatedTasks);
      renderTasks();
    });

    li.querySelector(".deleteBtn").addEventListener("click", () => {
      let updatedTasks = getTasks().filter(t => t.id !== task.id);
      saveTasks(updatedTasks);
      renderTasks();
    });
  });
}

addBtn.addEventListener("click", () => {
  const taskText = taskInput.value.trim();
  const deadline = deadlineInput.value;
  const priority = priorityInput.value;

  if (taskText === "") {
    alert("Tugas tidak boleh kosong!");
    return;
  }

  const newTask = {
    id: Date.now(),
    text: taskText,
    deadline: deadline,
    priority: priority,
    done: false
  };

  let tasks = getTasks();
  tasks.push(newTask);
  saveTasks(tasks);
  renderTasks();

  taskInput.value = "";
  deadlineInput.value = "";
  priorityInput.value = "Low";
});

clearAllBtn.addEventListener("click", () => {
  if (confirm("Hapus semua tugas?")) {
    saveTasks([]);
    renderTasks();
  }
});

window.addEventListener("DOMContentLoaded", () => {
  loadProfile();
  renderTasks();
});