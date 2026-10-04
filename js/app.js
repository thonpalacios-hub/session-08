const taskForm = document.querySelector("#taskForm");
const taskInput = document.querySelector("#taskInput");
const taskList = document.querySelector("#taskList");
const message = document.querySelector("#message");

let tasks = loadTasks();
renderTasks();

function validateTaskTitle(title) {
  const cleaned = title.trim();

  if (cleaned.length === 0) {
    return "Task title is required.";
  }
  if (cleaned.length < 3) {
    return "Task title must be at least 3 characters.";
  }

  //Challenge Duplicate Task Check
  const duplicate = tasks.some((task) => {
    return task.title.toLowerCase() === cleaned.toLowerCase();
  });

  if (duplicate) {
    return "That task already exists.";
  }

  return "";
}

function addTask(title) {
  const task = {
    id: Date.now(),
    title: title.trim(),
    completed: false,
  };

  tasks.push(task);
  saveTasks();
  renderTasks();
}

function toggleTask(id) {
  tasks = tasks.map((task) => {
    if (task.id === id) {
      return { ...task, completed: !task.completed };
    }

    return task;
  });

  saveTasks();
  renderTasks();
}

function deleteTask(id) {
  tasks = tasks.filter((task) => task.id !== id);
  saveTasks();
  renderTasks();
}

function editTask(id) {
  const selectedTask = tasks.find((task) => task.id === id);

  if (!selectedTask) {
    return;
  }

  const newTitle = prompt("Edit task title:", selectedTask.title);

  if (newTitle === null) {
    return;
  }

const cleaned = newTitle.trim();
if (cleaned.toLowerCase() !== selectedTask.title.toLowerCase()) {
  const error = validateTaskTitle(newTitle);

  if (error) {
    message.textContent = error;
    return;
  }
} else {
    if (cleaned.length === 0) {message.textContent = "Task title is required."; return;}
    if (cleaned.length < 3) {message.textContent = "Task title must be at least 3 characters."; return;}
}

  tasks = tasks.map((task) => {
    if (task.id === id) {
      return { ...task, title: newTitle.trim() };
    }
    return task;
  });

  saveTasks();
  renderTasks();
  message.textContent = "Task updated.";
}

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
  const savedTasks = localStorage.getItem("tasks");
  return savedTasks ? JSON.parse(savedTasks) : [];
}

function renderTasks() {
  taskList.innerHTML = "";

  tasks.forEach((task) => {
    const li = document.createElement("li");
    li.classList.add("task-item");

    if (task.completed) {
      li.classList.add("completed");
    }

    const title = document.createElement("span");
    title.classList.add("task-title");
    title.textContent = task.title;

    const doneBtn = document.createElement("button");
    doneBtn.textContent = task.completed ? "Undo" : "Done";
    doneBtn.dataset.action = "toggle";
    doneBtn.dataset.id = task.id;

    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.dataset.action = "edit";
    editBtn.dataset.id = task.id;

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.dataset.action = "delete";
    deleteBtn.dataset.id = task.id;

    li.append(title, doneBtn, editBtn, deleteBtn);
    taskList.appendChild(li);
  });
}

taskForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const title = taskInput.value;
  const error = validateTaskTitle(title);

  if (error) {
    message.textContent = error;
    return;
  }

  addTask(title);
  taskInput.value = "";
  message.textContent = "Task added successfully.";
  taskInput.focus();
});

taskList.addEventListener("click", (event) => {
  const action = event.target.dataset.action;
  const id = Number(event.target.dataset.id);

  if (!action) {
    return;
  }

  if (action === "toggle") {
    toggleTask(id);
  }
  if (action === "delete") {
    deleteTask(id);
  }
  if (action === "edit") {
    editTask(id);
  }
});
