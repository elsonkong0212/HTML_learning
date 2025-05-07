import Project from '../models/project.js';
import Task from '../models/task.js';

const STORAGE_KEY = 'todo-projects';

export function saveProjects(projects) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
}

export function loadProjects() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    return parsed.map((p) => {
      const project = new Project(p.name);
      project.tasks = (p.tasks || []).map(
        (t) => new Task(t.title, t.description, t.dueDate, t.priority)
      );
      // 若你要保留完成狀態：
      project.tasks.forEach((task, i) => {
        task.completed = p.tasks[i].completed || false;
      });
      return project;
    });
  } catch {
    return [];
  }
}
