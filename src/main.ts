import './style.css'
import { createTodo, isValidTodoText, toggleTodo, searchTodos } from './todoLogic'
import type { Todo, Priority } from './todoLogic'

let todos: Todo[] = [ ];

const todoInput = document.getElementById('todo-input') as HTMLInputElement;
const todoForm = document.querySelector('.todo-form') as HTMLFormElement;
const todolist = document.getElementById('todo-list') as HTMLUListElement;
const errorMessage = document.getElementById('error-message') as HTMLParagraphElement;
const prioritySelect = document.getElementById('priority-select') as HTMLSelectElement;
const searchInput = document.getElementById('search-input') as HTMLInputElement;

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

renderTodos();


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
  renderTodos()
}

// clicking the text of a todo marks it as completed (or not completed again)
const addToggleListener = (li: HTMLLIElement, id: number): void => {
  const textSpan = li.querySelector('.todo-text');
  textSpan?.addEventListener('click', () => {
    todos = toggleTodo(todos, id);
    renderTodos();
  })
}

// end of code from 01-10 bde