import './style.css'
import { createTodo, isValidTodoText, toggleTodo, searchTodos, parseTodos, sortByPriority } from './todoLogic'
import type { Todo, Priority } from './todoLogic'
import { getThemeColor } from './themeLogic'

// the name (key) we save the todos under in localStorage
const STORAGE_KEY = 'todos';

// load the saved todos when the page opens (empty list if nothing is saved)
let todos: Todo[] = parseTodos(localStorage.getItem(STORAGE_KEY));

// save the whole list as text, because localStorage can only store strings
const saveTodos = (): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

const todoInput = document.getElementById('todo-input') as HTMLInputElement;
const todoForm = document.querySelector('.todo-form') as HTMLFormElement;
const todolist = document.getElementById('todo-list') as HTMLUListElement;
const errorMessage = document.getElementById('error-message') as HTMLParagraphElement;
const prioritySelect = document.getElementById('priority-select') as HTMLSelectElement;
const searchInput = document.getElementById('search-input') as HTMLInputElement;
const sortButton = document.getElementById('sort-button') as HTMLButtonElement;
const clearButton = document.getElementById('clear-button') as HTMLButtonElement;
const colorPicker = document.getElementById('color-picker') as HTMLInputElement;

// the name (key) we save the theme color under in localStorage
const THEME_KEY = 'themeColor';

// changes the --navy CSS variable, so every button, outline and label gets the new color
const applyThemeColor = (color: string): void => {
  document.documentElement.style.setProperty('--navy', color);
  colorPicker.value = color;
}

// use the saved theme color when the page opens (or the default navy)
applyThemeColor(getThemeColor(localStorage.getItem(THEME_KEY)));

// when the user picks a color: use it right away and save it
colorPicker.addEventListener('input', () => {
  applyThemeColor(colorPicker.value);
  localStorage.setItem(THEME_KEY, colorPicker.value);
})

// shows the red border and the error text
const showError = (): void => {
  todoInput.classList.add('input-error');
  errorMessage.style.display = 'block';
}

// removes the red border and hides the error text
const hideError = (): void => {
  todoInput.classList.remove('input-error');
  errorMessage.style.display = 'none';
}

const addTodo = (text: string, priority: Priority): void => {
  const newTodo: Todo = createTodo(text, priority);
  todos.push(newTodo);
  console.log(`todo added: ${todos}`);

  saveTodos();
  renderTodos();
}


const renderTodos = (): void => {
  // clears the current list - test
  todolist.innerHTML = '';

  // only show the todos that match the search field
  const visibleTodos: Todo[] = searchTodos(todos, searchInput.value);

  visibleTodos.forEach(todo => {
const li = document.createElement('li');
li.className = 'todo-item';
if (todo.completed) {
  li.classList.add('completed');
}
// priority is optional, so only show the badge if the todo has one
const priorityBadge = todo.priority
  ? `<span class="priority-badge priority-${todo.priority}">${todo.priority}</span>`
  : '';
li.innerHTML = `
${priorityBadge}
<span class="todo-text">${todo.text}</span>
<button>remove</button>
`
addRemoveButtonListener(li, todo.id);
addToggleListener(li, todo.id);
todolist.appendChild(li);
})
}


todoForm.addEventListener('submit', (event: Event) => {
  event.preventDefault();

  const text = todoInput.value.trim();

  if (isValidTodoText(text)) {
    // a <select> value is always a string, so we tell TypeScript it is a Priority
    const priority = prioritySelect.value as Priority;
    addTodo(text, priority)
    todoInput.value = '' //clears the input field after adding a todo
    hideError()
  } else {
    showError()
  }
})

// update the list every time the user types in the search field
searchInput.addEventListener('input', () => {
  renderTodos()
})

// sort the list by priority, save the new order and show it
sortButton.addEventListener('click', () => {
  todos = sortByPriority(todos)
  saveTodos()
  renderTodos()
})

// remove all todos from the list and from local storage
clearButton.addEventListener('click', () => {
  // ask first, so the user doesn't delete everything by accident
  const sure: boolean = confirm('Are you sure you want to delete all todos?');
  if (sure) {
    todos = []
    localStorage.removeItem(STORAGE_KEY)
    renderTodos()
  }
})

// as soon as the user starts typing again, the error goes away
todoInput.addEventListener('input', () => {
  hideError()
})



const addRemoveButtonListener = (li:HTMLLIElement, id: number) :void => { //this is helper in folder which fires and action or function 
  const removeButton = li.querySelector('button');
  removeButton?.addEventListener('click', () => removeTodo(id))
}

const removeTodo = (id:number):void => {
  todos = todos.filter(todo => todo.id !== id)
  saveTodos()
  renderTodos()
}

// clicking the text of a todo marks it as completed (or not completed again)
const addToggleListener = (li: HTMLLIElement, id: number): void => {
  const textSpan = li.querySelector('.todo-text');
  textSpan?.addEventListener('click', () => {
    todos = toggleTodo(todos, id);
    saveTodos();
    renderTodos();
  })
}

// draw the saved todos when the page opens.
// This must be at the end: renderTodos uses the listener functions above,
// and a const function can't be used before the line where it is created.
renderTodos();

// end of code from 01-10 bde