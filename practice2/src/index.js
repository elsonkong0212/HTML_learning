import './style.css';
import { format } from 'date-fns';

const dialog = document.getElementById('task-dialog');
const form = document.getElementById('task-form');
const cancelBtn = document.getElementById('cancel-dialog');

// 預設資料
let projects = loadFromStorage() || [
  { name: 'Inbox', tasks: [] }
];
let currentProjectIndex = 0;

// DOM 元素
const contentSection = document.querySelector('.content');
const newTaskBtn = document.querySelector('.new-task-btn');
const sidebar = document.querySelector('.sidebar');

// 載入與儲存
function saveToStorage() {
  localStorage.setItem('todo-projects', JSON.stringify(projects));
}

function loadFromStorage() {
  const data = localStorage.getItem('todo-projects');
  return data ? JSON.parse(data) : null;
}

// 建立任務 DOM 元素
function createTaskElement(task, taskIndex) {
  const taskDiv = document.createElement('div');
  taskDiv.className = 'task';

  const taskInfo = document.createElement('div');
  taskInfo.className = 'task-info';

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = task.completed;
  checkbox.addEventListener('change', () => {
    task.completed = checkbox.checked;
    taskDiv.classList.toggle('completed', checkbox.checked);
    saveToStorage();
  });

  const priorityDot = document.createElement('span');
  priorityDot.className = `priority-dot priority-${task.priority}`;

  const title = document.createElement('span');
  title.className = 'task-title';
  title.textContent = task.title;

  const dueDate = document.createElement('div');
  dueDate.className = 'task-desc';
  const dateObj = new Date(task.dueDate);
  dueDate.textContent = isNaN(dateObj)
    ? '日期格式錯誤'
    : format(dateObj, 'yyyy/MM/dd (EEE)');

  if (!isNaN(dateObj) && dateObj < new Date()) {
    dueDate.style.color = 'red';
    dueDate.style.fontWeight = 'bold';
  }

  const desc = document.createElement('div');
  desc.className = 'task-desc';
  desc.textContent = task.description;

  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'delete-btn';
  deleteBtn.textContent = '🗑️';
  deleteBtn.addEventListener('click', () => {
    projects[currentProjectIndex].tasks.splice(taskIndex, 1);
    saveToStorage();
    renderTasks();
  });

  taskInfo.appendChild(checkbox);
  taskInfo.appendChild(priorityDot);
  taskInfo.appendChild(title);

  taskDiv.appendChild(taskInfo);
  taskDiv.appendChild(dueDate);
  taskDiv.appendChild(desc);
  taskDiv.appendChild(deleteBtn);

  if (task.completed) {
    taskDiv.classList.add('completed');
  }

  return taskDiv;
}

// 渲染任務
function renderTasks() {
  // 清除原有任務
  const oldTasks = contentSection.querySelectorAll('.task');
  oldTasks.forEach((t) => t.remove());

  // 排序任務：先依到期日升冪，再依 priority 升冪
  const tasks = projects[currentProjectIndex].tasks;
  tasks.sort((a, b) => {
    const dateA = new Date(a.dueDate);
    const dateB = new Date(b.dueDate);
    if (!isNaN(dateA) && !isNaN(dateB) && dateA - dateB !== 0) {
      return dateA - dateB;
    }
    return Number(a.priority) - Number(b.priority);
  });

  // 顯示所有任務
  tasks.forEach((task, index) => {
    const taskElement = createTaskElement(task, index);
    contentSection.insertBefore(taskElement, newTaskBtn);
  });
}

// 渲染專案側邊欄
function renderProjects() {
  sidebar.innerHTML = '';

  projects.forEach((project, idx) => {
    const div = document.createElement('div');
    div.className = 'project-title';
    div.textContent = `> ${project.name}`;
    if (idx === currentProjectIndex) {
      div.style.fontWeight = 'bold';
    }
    div.addEventListener('click', () => {
      currentProjectIndex = idx;
      renderProjects();
      renderTasks();
    });
    sidebar.appendChild(div);
  });

  const addBtn = document.createElement('button');
  addBtn.className = 'new-project-btn';
  addBtn.textContent = 'New Project';
  addBtn.addEventListener('click', () => {
    const name = prompt('請輸入專案名稱：');
    if (name) {
      projects.push({ name, tasks: [] });
      currentProjectIndex = projects.length - 1;
      saveToStorage();
      renderProjects();
      renderTasks();
    }
  });

  sidebar.appendChild(addBtn);
}

// 點擊新增任務按鈕，開啟 dialog
newTaskBtn.addEventListener('click', () => {
  dialog.showModal();
});

// 取消 dialog
cancelBtn.addEventListener('click', () => {
  dialog.close();
  form.reset();
});

// 表單提交後建立任務
form.addEventListener('submit', (e) => {
  e.preventDefault();

  const title = document.getElementById('task-title').value;
  const description = document.getElementById('task-desc').value;
  const dueDate = document.getElementById('task-date').value;
  const priority = document.getElementById('task-priority').value;

  const dateObj = new Date(dueDate);
  if (!title || isNaN(dateObj.getTime())) {
    alert('請輸入有效的標題與日期');
    return;
  }

  const newTask = {
    title,
    description,
    dueDate,
    priority,
    completed: false,
  };

  projects[currentProjectIndex].tasks.push(newTask);
  saveToStorage();
  form.reset();
  dialog.close();
  renderTasks();
});

// 初始化
renderProjects();
renderTasks();
