import "./styles.css";

let projects = [];

class Project {
  constructor(name) {
    this.name = name;
    this.tasks = [];
  }

  addTask(task) {
    this.tasks.push(task);
  }

  deleteTask(title) {
    this.tasks = this.tasks.filter((task) => task.title !== title);
  }
}

class Task {
  constructor(title, description, dueDate, priority) {
    this.title = title;
    this.description = description;
    this.dueDate = dueDate;
    this.priority = priority;
    this.completed = false;
  }

  taskCompleted() {
    this.completed = true;
  }
}

function updateDisplay() {
  displayProjects();
  updateHeader();
  displayTasks();
}

function displayProjects() {
  const projectItems = document.querySelector(".projects");
  projectItems.textContent = "";

  projects.forEach((project) => {
    const projectDiv = document.createElement("div");
    projectDiv.classList.add("project");

    if (activeProject && activeProject.name === project.name) {
      projectDiv.classList.add("active");
    }

    const projectTitleDiv = document.createElement("div");
    projectTitleDiv.classList.add("project-title");
    projectTitleDiv.textContent = project.name;
    projectDiv.append(projectTitleDiv);

    if (!activeProject || activeProject.name !== project.name) {
      const deleteButton = document.createElement("button");
      deleteButton.classList.add("delete");

      deleteButton.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
            <path d="M16 9v10H8V9h8m-1.5-6h-5l-1 1H5v2h14V4h-3.5l-1-1z"/>
        </svg>
      `;

      deleteButton.addEventListener("click", (event) => {
        event.stopPropagation(); // Stop the event from bubbling up and selecting the project
        deleteProject(event);
      });

      projectDiv.append(deleteButton);
    }

    projectDiv.addEventListener("click", selectProject);

    projectItems.appendChild(projectDiv);
  });
}

function addProject() {
  const title = prompt("Please enter the project name");
  if (!title) {
    return;
  }

  const project = new Project(title);
  projects.push(project);
  activeProject = project;

  updateDisplay();
}

function deleteProject(event) {
  if (event.target.closest(".delete")) {
    const project = event.target.closest(".project");
    if (project) {
      const title = project.querySelector(".project-title").textContent;

      const index = projects.findIndex((p) => p.name === title);
      if (index > -1 && title !== activeProject.name) {
        projects.splice(index, 1);
      }
    }
  }

  updateDisplay();
}

function selectProject(event) {
  const projectItems = document.querySelectorAll(".project");

  projectItems.forEach((project) => {
    project.classList.remove("active");
  });

  const selectedProject = event.currentTarget;
  selectedProject.classList.add("active");

  const selectedProjectTitle = selectedProject.querySelector(".project-title").textContent;
  activeProject = projects.find((project) => project.name === selectedProjectTitle);
}

function updateHeader() {
  const projectHeader = document.querySelector(".header h1");
  projectHeader.textContent = `Project: ${activeProject.name}`;
}

let activeProject = new Project("Default");
projects.push(activeProject);
projects.push(new Project("P1"));
projects.push(new Project("P2"));
projects.push(new Project("P4"));
projects.push(new Project("P3"));

const task1 = new Task(
  "Buy groceries",
  "Buy milk, bread, and eggs from the store",
  "2024-10-15",
  "High"
);

const task2 = new Task(
  "Finish project report",
  "Complete the final draft of the project report for submission",
  "2024-10-20",
  "Medium"
);

const task3 = new Task(
  "Doctor's appointment",
  "Visit Dr. Smith for a routine check-up",
  "2024-10-18",
  "Low"
);

const task4 = new Task(
  "Team meeting",
  "Attend the monthly team sync meeting to discuss progress",
  "2024-10-10",
  "High"
);

const task5 = new Task(
  "Pay electricity bill",
  "Pay the monthly electricity bill before the due date",
  "2024-10-12",
  "Medium"
);

activeProject.addTask(task1);
activeProject.addTask(task2);
activeProject.addTask(task3);
projects[1].addTask(task4);
projects[1].addTask(task5);

function displayTasks() {
  const tasksContainer = document.querySelector(".tasks-container");
  tasksContainer.textContent = "";

  activeProject.tasks.forEach((task, index) => {
    const taskDiv = document.createElement("div");
    taskDiv.classList.add("task");

    const taskLeftDiv = document.createElement("div");
    taskLeftDiv.classList.add("task-left");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    const titleDiv = document.createElement("div");
    titleDiv.classList.add("title");
    titleDiv.textContent = task.title;
    const descriptionDiv = document.createElement("div");
    descriptionDiv.classList.add("description");
    descriptionDiv.textContent = task.description;

    taskLeftDiv.append(checkbox, titleDiv, descriptionDiv);

    const taskRightDiv = document.createElement("div");
    taskRightDiv.classList.add("task-right");
    const dueDateDiv = document.createElement("div");
    dueDateDiv.classList.add("due");
    dueDateDiv.textContent = task.dueDate;
    const priorityDiv = document.createElement("div");
    priorityDiv.classList.add("priority");
    priorityDiv.textContent = task.priority;

    const editButton = document.createElement("button");
    editButton.classList.add("edit");
    editButton.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
        <path d="M3 17.25V21h3.75l11.04-11.04-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
      </svg>
    `;

    const deleteButton = document.createElement("button");
    deleteButton.classList.add("delete");
    deleteButton.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
        <path d="M16 9v10H8V9h8m-1.5-6h-5l-1 1H5v2h14V4h-3.5l-1-1z"/>
      </svg>
    `;
    deleteButton.addEventListener("click", () => deleteTask(index));

    taskRightDiv.append(dueDateDiv, priorityDiv, editButton, deleteButton);

    taskDiv.append(taskLeftDiv, taskRightDiv);

    tasksContainer.appendChild(taskDiv);
  });
}

function addTask(event) {
  const taskFormContainer = document.querySelector(".task-form-container");
  taskFormContainer.style.display = "block";

  const taskForm = document.querySelector(".task-form");
  taskForm.addEventListener("submit", submitTask);

  const cancelButton = document.querySelector(".task-cancel");
  cancelButton.addEventListener("click", () => {
    taskFormContainer.style.display = "none";
  });
}

function submitTask(event) {
  event.preventDefault();

  const title = document.getElementById("task-title").value;
  const description = document.getElementById("task-description").value;
  const dueDate = document.getElementById("task-due-date").value;
  const priority = document.getElementById("task-priority").value;

  const task = new Task(title, description, dueDate, priority);
  activeProject.addTask(task);

  document.querySelector(".task-form").reset();
  document.querySelector(".task-form-container").style.display = "none";

  displayTasks();
}

function deleteTask(index) {
    activeProject.tasks.splice(index, 1);
    displayTasks();
}

document.querySelector(".add-project").addEventListener("click", addProject);
document.querySelector(".projects-container").addEventListener("click", deleteProject);
document.querySelector(".add-task").addEventListener("click", addTask);

document.querySelectorAll(".project").forEach((project) => {
  project.addEventListener("click", selectProject);
});

updateDisplay();
