import { format } from 'date-fns';
import Task from '../models/task.js';

const sidebar = document.querySelector('.sidebar');
const contentSection = document.querySelector('.content');
const newTaskBtn = document.querySelector('.new-task-btn');
const dialog = document.getElementById('task-dialog');
const form = document.getElementById('task-form');
const cancelBtn = document.getElementById('cancel-dialog');

export function renderProjects(projects, currentIndex, switchCallback) {
  sidebar.innerHTML = '';

  projects.forEach((project, idx) => {
    const div = document.createElement('div');
    div.className = 'project-title';
    div.textContent = `> ${project.name}`;
    if (idx === currentIndex) {
      div.style.fontWeight = 'bold';
    }
    div.addEventListener('click', () => {
      switchCallback(idx);
    });
    sidebar.appendChild(div);
  });

  const addBtn = document.createElement('button');
  addBtn.className = 'new-project-btn';
  addBtn.textContent = 'New Project';
  addBtn.addEventListener('click', () => {
    const name = prompt('請輸入專案名稱：');
    if (name) switchCallback(projects.length, name);
  });
  sidebar.appendChild(addBtn);
}

export function renderTasks(project, projectIndex, updateCallback) {
  // 清除原有任務
  const oldTasks = contentSection.querySelectorAll('.task');
  oldTasks.forEach((t) => t.remove());

  // 排序任務
  project.tasks.sort((a, b) => {
    const dA = new Date(a.dueDate);
    const dB = new Date(b.dueDate);
    if (!isNaN(dA) && !isNaN(dB) && dA - dB !== 0) return dA - dB;
    return Number(a.priority) - Number(b.priority);
  });

  project.tasks.forEach((task, index) => {
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
      updateCallback();
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
      project.removeTask(index);
      updateCallback();
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

    contentSection.insertBefore(taskDiv, newTaskBtn);
  });
}

export function bindUIEvents(onNewTask, onNewProject) {
  newTaskBtn.addEventListener('click', () => {
    dialog.showModal();
  });

  cancelBtn.addEventListener('click', () => {
    dialog.close();
    form.reset();
  });

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

    onNewTask({ title, description, dueDate, priority });
    form.reset();
    dialog.close();
  });
}
