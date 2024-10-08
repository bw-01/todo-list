import "./styles.css";
import { format } from "date-fns";

let projects = []; // array to hold all projects
let editingTaskIndex = null; // tracks the index of a task if its being edited
let activeProject = null;

// Project class that holds tasks specific to each project
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

// Class to hold individual tasks and their properties
class Task {
  constructor(title, description, dueDate, priority) {
    this.title = title;
    this.description = description;
    this.dueDate = dueDate;
    this.priority = priority;
    this.completed = false;
  }
}

// Trigger the display update for each section of the DOM
function updateDisplay() {
  displayProjects();
  updateHeader();
  displayTasks();
}

// Close forms when esc key is pressed
function handleEscape(event) {
  if (event.key === "Escape") {
    document.querySelector(".overlay").style.display = "none";

    document.querySelector(".task-form").reset();
    document.querySelector(".task-form-container").style.display = "none";
    editingTaskIndex = null;

    document.querySelector(".project-form").reset();
    document.querySelector(".project-form-container").style.display = "none";
  }
}

// Display the list of projects in the UI
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
        event.stopPropagation(); // Stop the event from bubbling up and selecting the project instead
        deleteProject(event);
      });

      projectDiv.append(deleteButton);
    }

    projectDiv.addEventListener("click", selectProject);

    projectItems.appendChild(projectDiv);
  });
}

// Control display of the project form
function addProject() {
  const projectFormContainer = document.querySelector(".project-form-container");
  projectFormContainer.style.display = "block";

  const overlay = document.querySelector(".overlay");
  overlay.style.display = "block";

  document.getElementById("project-name").focus();

  const projectForm = document.querySelector(".project-form");
  projectForm.removeEventListener("submit", submitProject);
  projectForm.addEventListener("submit", submitProject);

  const cancelButton = document.querySelector(".project-cancel");
  cancelButton.addEventListener("click", () => {
    overlay.style.display = "none";
    document.querySelector(".project-form").reset();
    projectFormContainer.style.display = "none";
  });
}

// Create the project and set it to active
function submitProject(event) {
  event.preventDefault();

  const projectName = document.getElementById("project-name").value;
  if (!projectName) {
    alert("Please enter a project name");
    return;
  }

  if (projects.find((project) => project.name.toLowerCase() === projectName.toLowerCase())) {
    alert("Project name already exists. Please choose a unique name");
    return;
  }

  const project = new Project(projectName);
  projects.push(project);
  activeProject = project;

  document.querySelector(".overlay").style.display = "none";
  document.querySelector(".project-form").reset();
  document.querySelector(".project-form-container").style.display = "none";

  saveData();
  updateDisplay();
}

// Delete a project when its delete button is clicked
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

  saveData();
  updateDisplay();
}

// Set the active project when the user selects it
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

// Display all the tasks and their elements for the currently active project in the UI
function displayTasks() {
  const tasksContainer = document.querySelector(".tasks-container");
  tasksContainer.textContent = "";

  if (activeProject.tasks.length === 0) {
    const noTaskDiv = document.createElement("div");
    noTaskDiv.classList.add("no-task-message");
    noTaskDiv.textContent =
      "Welcome to your new project. To get started, click the below button and create your first task.";
    tasksContainer.appendChild(noTaskDiv);
    return;
  }

  activeProject.tasks.forEach((task, index) => {
    const taskDiv = document.createElement("div");
    taskDiv.classList.add("task");
    if (task.completed) {
      taskDiv.classList.add("completed");
    }

    const taskLeftDiv = document.createElement("div");
    taskLeftDiv.classList.add("task-left");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.addEventListener("change", () => {
      taskCompleted(index, checkbox.checked);
    });

    const taskDetailsDiv = document.createElement("div");
    taskDetailsDiv.classList.add("task-details");

    const titleDiv = document.createElement("div");
    titleDiv.classList.add("title");
    titleDiv.textContent = task.title;

    const descriptionDiv = document.createElement("div");
    descriptionDiv.classList.add("description");
    descriptionDiv.textContent = task.description;

    taskDetailsDiv.append(titleDiv, descriptionDiv);
    taskLeftDiv.append(checkbox, taskDetailsDiv);

    const taskRightDiv = document.createElement("div");
    taskRightDiv.classList.add("task-right");

    const taskMetaDiv = document.createElement("div");
    taskMetaDiv.classList.add("task-meta");

    const dueDateDiv = document.createElement("div");
    dueDateDiv.classList.add("due");
    const formattedDate = format(new Date(task.dueDate), "d MMM yyyy");
    dueDateDiv.innerHTML = `<span class="label">Due: </span><span class="due-date">${formattedDate}</span>`;

    const priorityDiv = document.createElement("div");
    priorityDiv.classList.add("priority");
    priorityDiv.innerHTML = `<span class="label">Priority: </span><span class="priority-level ${task.priority.toLowerCase()}">${
      task.priority
    }</span>`;

    taskMetaDiv.append(dueDateDiv, priorityDiv);
    taskRightDiv.append(taskMetaDiv);

    const editButton = document.createElement("button");
    editButton.classList.add("edit");
    editButton.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
        <path d="M3 17.25V21h3.75l11.04-11.04-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
      </svg>
    `;
    editButton.addEventListener("click", () => editTask(index));

    const deleteButton = document.createElement("button");
    deleteButton.classList.add("delete");
    deleteButton.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
        <path d="M16 9v10H8V9h8m-1.5-6h-5l-1 1H5v2h14V4h-3.5l-1-1z"/>
      </svg>
    `;
    deleteButton.addEventListener("click", () => deleteTask(index));

    taskRightDiv.append(editButton, deleteButton);

    taskDiv.append(taskLeftDiv, taskRightDiv);

    tasksContainer.appendChild(taskDiv);
  });
}

// Open the new task form to allow the user to add a task
function addTask() {
  const taskFormContainer = document.querySelector(".task-form-container");
  taskFormContainer.style.display = "block";

  const overlay = document.querySelector(".overlay");
  overlay.style.display = "block";

  document.getElementById("task-title").focus();

  const taskForm = document.querySelector(".task-form");
  taskForm.removeEventListener("submit", submitTask);
  taskForm.addEventListener("submit", submitTask);

  const cancelButton = document.querySelector(".task-cancel");
  cancelButton.addEventListener("click", () => {
    overlay.style.display = "none";
    document.querySelector(".task-form").reset();
    taskFormContainer.style.display = "none";
  });
}

// Submit the enw task form and create a task
function submitTask(event) {
  event.preventDefault();

  const title = document.getElementById("task-title").value;
  const description = document.getElementById("task-description").value;
  const dueDate = document.getElementById("task-due-date").value;
  const priority = document.getElementById("task-priority").value;

  const task = new Task(title, description, dueDate, priority);
  activeProject.addTask(task);

  document.querySelector(".overlay").style.display = "none";
  document.querySelector(".task-form").reset();
  document.querySelector(".task-form-container").style.display = "none";

  saveData();
  displayTasks();
}

// Delete a task from a project
function deleteTask(index) {
  activeProject.tasks.splice(index, 1);
  saveData();
  displayTasks();
}

// Set a task to completed when its checkbox is checked and move it to end of list
function taskCompleted(index, checkedState) {
  activeProject.tasks[index].completed = checkedState;
  activeProject.tasks.sort((a, b) => a.completed - b.completed);
  saveData();
  displayTasks();
}

// Show the task form with pre-filled task data for editing
function editTask(index) {
  const taskFormContainer = document.querySelector(".task-form-container");
  const taskForm = document.querySelector(".task-form");

  const overlay = document.querySelector(".overlay");
  overlay.style.display = "block";

  taskForm.querySelector("h2").textContent = "Edit Task";
  taskForm.querySelector(".task-submit").textContent = "Submit";

  const task = activeProject.tasks[index];

  document.getElementById("task-title").value = task.title;
  document.getElementById("task-description").value = task.description;
  document.getElementById("task-due-date").value = task.dueDate;
  document.getElementById("task-priority").value = task.priority;

  taskFormContainer.style.display = "block";
  editingTaskIndex = index;

  // Reset the event listener to prevent duplicates
  taskForm.removeEventListener("submit", submitTask);
  taskForm.removeEventListener("submit", submitEditedTask);
  taskForm.addEventListener("submit", submitEditedTask);

  const cancelButton = document.querySelector(".task-cancel");
  cancelButton.addEventListener("click", () => {
    overlay.style.display = "none";
    taskFormContainer.style.display = "none";
    editingTaskIndex = null;
    taskForm.reset();
    taskForm.querySelector("h2").textContent = "Add New Task";
  });
}

// Submit the edited task form
function submitEditedTask(event) {
  event.preventDefault();

  if (editingTaskIndex !== null) {
    const task = activeProject.tasks[editingTaskIndex];
    task.title = document.getElementById("task-title").value;
    task.description = document.getElementById("task-description").value;
    task.dueDate = document.getElementById("task-due-date").value;
    task.priority = document.getElementById("task-priority").value;

    document.querySelector(".overlay").style.display = "none";
    document.querySelector(".task-form-container").style.display = "none";
    document.querySelector(".task-form").reset();
    editingTaskIndex = null;

    saveData();
    displayTasks();
  }
}

// Update the header with the currently active project
function updateHeader() {
  const projectHeader = document.querySelector(".header h1");
  projectHeader.textContent = `Project: ${activeProject.name}`;
}

// Save data when projects or tasks change
function saveData() {
  localStorage.setItem("projects", JSON.stringify(projects));
}

// Load project data when site loads
function loadData() {
  const storedData = localStorage.getItem("projects");

  if (storedData) {
    projects = JSON.parse(storedData).map((projectData) => {
      const project = new Project(projectData.name);
      project.tasks = projectData.tasks.map((task) => {
        const newTask = new Task(task.title, task.description, task.dueDate, task.priority);
        newTask.completed = task.completed;
        return newTask;
      });
      return project;
    });

    if (projects.length > 0) {
      activeProject = projects[0];
    }
  } else {
    // load some default data for first use
    activeProject = new Project("Default");
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
    activeProject.addTask(task4);
    activeProject.addTask(task5);

    projects.push(activeProject);
  }
}

document.addEventListener("keydown", handleEscape);
document.querySelector(".add-project").addEventListener("click", addProject);
document.querySelector(".projects-container").addEventListener("click", deleteProject);
document.querySelector(".add-task").addEventListener("click", addTask);

document.querySelectorAll(".project").forEach((project) => {
  project.addEventListener("click", selectProject);
});

window.addEventListener("DOMContentLoaded", () => {
  loadData();
  updateDisplay();
});
