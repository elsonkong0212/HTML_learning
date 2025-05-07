// index.js
import './style.css';
import { loadProjects, saveProjects } from './utils/storage';
import { renderProjects, renderTasks, bindUIEvents } from './ui/render';
import Project from './models/project';
import Task from './models/task';

let projects = loadProjects();
let currentProjectIndex = 0;

function initApp() {
  if (projects.length === 0) {
    projects.push(new Project('Inbox'));
  }

  renderProjects(projects, currentProjectIndex, switchProject);
  renderTasks(projects[currentProjectIndex], currentProjectIndex, saveAndRender);
  bindUIEvents(handleNewTask, handleNewProject);
}

function handleNewTask(taskData) {
  const task = new Task(taskData.title, taskData.description, taskData.dueDate, taskData.priority);
  projects[currentProjectIndex].addTask(task);
  saveAndRender();
}

function handleNewProject(name) {
  const newProject = new Project(name);
  projects.push(newProject);
  currentProjectIndex = projects.length - 1;
  saveAndRender();
}

function switchProject(index) {
  currentProjectIndex = index;
  saveAndRender();
}

function saveAndRender() {
  saveProjects(projects);
  renderProjects(projects, currentProjectIndex, switchProject);
  renderTasks(projects[currentProjectIndex], currentProjectIndex, saveAndRender);
}

initApp();