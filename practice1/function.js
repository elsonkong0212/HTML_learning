const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const taskDiscription = document.getElementById("taskDescription");

window.onload = function () {
  const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
  savedTasks.forEach(task => renderTask(task.text, task.distext, task.completed));
};

function addTask() {
  const taskText = taskInput.value.trim();
  if (taskText === "") return;
  const distext = taskDiscription.value.trim();
  if (distext === "") renderTask(taskText, "No discription", false);
  else renderTask(taskText, distext, false);

  saveTasks();
  taskInput.value = "";
  taskDiscription.value = "";
}

function renderTask(text, distext, completed) {
  const li = document.createElement("li");

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = completed;

  const span = document.createElement("span");
  span.textContent = text;

  const span2 = document.createElement("span");
  span2.textContent = distext;
  span2.style.fontSize = "12px";
  span2.style.fontStyle = "italic";

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "delete";

  checkbox.onchange = saveTasks;
  deleteBtn.onclick = () => {
    li.remove();
    saveTasks();
  };

  li.appendChild(checkbox);
  li.appendChild(span);
  li.appendChild(span2);
  li.appendChild(deleteBtn);
  taskList.appendChild(li);
}

function saveTasks() {
  const tasks = [];
  taskList.querySelectorAll("li").forEach(li => { 
    temp = li.querySelectorAll("span");
    const text = temp[0].textContent;
    const distext = temp[1].textContent;
    const completed = li.querySelector("input[type=checkbox]").checked;
    tasks.push({ text, distext, completed });
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}
