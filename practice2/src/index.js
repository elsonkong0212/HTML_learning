import Task from './task';
import Project from './project';

const project = new Project('個人待辦');

const task1 = new Task('學習 webpack', '完成 Odin Project 練習', '2025/05/10', '高');
const task2 = new Task('吃午餐', '12:30 前吃飯', '2025/05/07', '中');

project.addTask(task1);
project.addTask(task2);

console.log(project);
