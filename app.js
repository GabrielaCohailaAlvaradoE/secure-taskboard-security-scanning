"use strict";

const storageKey = "secure-taskboard.tasks.v1";
const form = document.querySelector("#task-form");
const titleInput = document.querySelector("#task-title");
const list = document.querySelector("#task-list");
const message = document.querySelector("#form-message");
const emptyState = document.querySelector("#empty-state");
const clearCompleted = document.querySelector("#clear-completed");

function loadTasks() {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || "[]");
    return Array.isArray(saved) ? saved.filter((task) => typeof task?.title === "string") : [];
  } catch {
    return [];
  }
}

let tasks = loadTasks();

function saveTasks() {
  localStorage.setItem(storageKey, JSON.stringify(tasks));
}

function makeTaskElement(task) {
  const item = document.createElement("li");
  item.className = `task${task.done ? " done" : ""}`;

  const check = document.createElement("input");
  check.type = "checkbox";
  check.checked = Boolean(task.done);
  check.id = `task-${task.id}`;
  check.addEventListener("change", () => {
    task.done = check.checked;
    saveTasks();
    render();
  });

  const label = document.createElement("label");
  label.htmlFor = check.id;
  // textContent prevents user-supplied titles from being interpreted as HTML.
  label.textContent = task.title;

  const remove = document.createElement("button");
  remove.className = "delete";
  remove.type = "button";
  remove.textContent = "Eliminar";
  remove.setAttribute("aria-label", `Eliminar ${task.title}`);
  remove.addEventListener("click", () => {
    tasks = tasks.filter((current) => current.id !== task.id);
    saveTasks();
    render();
  });

  item.append(check, label, remove);
  return item;
}

function render() {
  list.replaceChildren(...tasks.map(makeTaskElement));
  emptyState.hidden = tasks.length > 0;
  clearCompleted.hidden = !tasks.some((task) => task.done);
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const title = titleInput.value.trim();
  if (!title) {
    message.textContent = "Escribe un título para continuar.";
    message.className = "message error";
    titleInput.focus();
    return;
  }
  tasks.unshift({ id: crypto.randomUUID(), title, done: false });
  saveTasks();
  form.reset();
  message.textContent = "Tarea agregada localmente.";
  message.className = "message";
  render();
});

clearCompleted.addEventListener("click", () => {
  tasks = tasks.filter((task) => !task.done);
  saveTasks();
  render();
});

render();
