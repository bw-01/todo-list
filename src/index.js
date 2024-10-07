import "./styles.css";

let projects = [];

class Project {
  constructor(name) {
    this.name = name;
    this.tasks = [];
  }

  addTask(task) {
    this.todoItems.push(task);
  }

  deleteTask(title) {
    this.todoItems = this.todoItems.filter((task) => task.title !== title);
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

function displayTask() {}

function addProject() {
  const title = prompt("Please enter the project name");
  if (!title) {
    return;
  }

  projects.push(new Project(title));

  displayProjects();
}

function deleteProject(event) {
    if (event.target.closest(".delete")) {
        const project = event.target.closest(".project");
        if (project) {
            const title = project.querySelector(".project-title").textContent;
            const index = projects.findIndex(p => p.name === title);
            if (index > -1 && projects.length > 1) {
                projects.splice(index, 1);
            }
        }
    }

    displayProjects();
}

function displayProjects() {
  const projectItems = document.querySelector(".projects");
  projectItems.textContent = "";

  projects.forEach((project) => {
    const projectDiv = document.createElement("div");
    projectDiv.classList.add("project");

    const projectTitleDiv = document.createElement("div");
    projectTitleDiv.classList.add("project-title");
    projectTitleDiv.textContent = project.name;

    const deleteButton = document.createElement("button");
    deleteButton.classList.add("delete");

    deleteButton.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
            <path fill="white" d="M16 9v10H8V9h8m-1.5-6h-5l-1 1H5v2h14V4h-3.5l-1-1z"/>
        </svg>
    `;

    projectDiv.append(projectTitleDiv, deleteButton);

    projectItems.appendChild(projectDiv);
  });
}

projects.push(new Project("Default"));
projects.push(new Project("P1"));

document.querySelector(".add-project").addEventListener("click", addProject);
document.querySelector(".projects-container").addEventListener("click", deleteProject);

displayProjects();
