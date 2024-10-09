# Task Tracker - To-Do List Application

A simple yet functional to-do list application for managing tasks and projects. This project features a clean user interface for adding, editing, and managing tasks and projects, all stored locally using `localStorage`.

## Features

- Add, edit, and delete tasks within a project
- Add, edit, and delete projects
- Mark tasks as completed and sort them accordingly
- Tasks persist across page reloads using `localStorage`
- Dynamic task and project display with live updates
- Task completion dates and priorities
- Form validation (e.g., required fields, limited text length)

## Technologies Used

- **HTML** for structure
- **CSS** for styling
- **JavaScript** for dynamic functionality
- **date-fns** for date formatting
- **localStorage** for persistent data storage

## Installation

### Prerequisites

Ensure you have Node.js with npm installed.

### Steps

1. Clone the repository:
   git clone https://github.com/bw-01/todo-list.git

2. Navigate to the project folder:
   cd todo-list

3. Install dependencies:
   npm install

4. Start the development server with:
   npm run dev
   
5. Open the web server at http://localhost:8080/ in your browser.

## Project Structure

```plaintext
.
├── index.html         # Main HTML structure
├── src
│   ├── index.js       # Main JavaScript logic
│   └── styles.css     # Main styling
├── package.json       # Node dependencies and scripts
└── README.md          # Project documentation