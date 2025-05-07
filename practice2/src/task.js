export default class Task {
    constructor(title, description, dueDate, priority) {
      this.title = title;
      this.description = description;
      this.dueDate = dueDate;
      this.priority = priority;//mission classification
      this.completed = false;
    }
  
    toggleComplete() {
      this.completed = !this.completed;
    }
  }
  