import "./styles.css";

class Project {
  constructor(TodoItem) {
    this.TodoItem = TodoItem;
  }
}

class TodoItem {
  constructor(title, description, dueDate, priority) {
    this.title = title;
    this.description = description;
    this.dueDate = dueDate;
    this.priority = priority;
  }
}
