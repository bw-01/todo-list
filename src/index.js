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
}

function displayTask() {}

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
  activeProject = project

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

let activeProject = new Project("Default");
projects.push(activeProject);
projects.push(new Project("P1"));
projects.push(new Project("P2"));
projects.push(new Project("P4"));
projects.push(new Project("P3"));

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

document.querySelector(".add-project").addEventListener("click", addProject);
document.querySelector(".projects-container").addEventListener("click", deleteProject);

document.querySelectorAll(".project").forEach((project) => {
  project.addEventListener("click", selectProject);
});

updateDisplay();
