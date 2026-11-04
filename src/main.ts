import './style.css'
import { createTodo, isValidTodoText, toggleTodo } from './todoLogic'
import type { Todo } from './todoLogic'

let todos: Todo[] = [ ];

const todoInput = document.getElementById('todo-input') as HTMLInputElement;
const todoForm = document.querySelector('.todo-form') as HTMLFormElement;
const todolist = document.getElementById('todo-list') as HTMLUListElement;
const errorMessage = document.getElementById('error-message') as HTMLParagraphElement;

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

const addTodo = (text: string): void => {
  const newTodo: Todo = createTodo(text);
  todos.push(newTodo);
  console.log(`todo added: ${todos}`);

  renderTodos();
}


const renderTodos = (): void => {
  // clears the current list - test
  todolist.innerHTML = '';

  todos.forEach(todo => {
const li = document.createElement('li');
li.className = 'todo-item';
if (todo.completed) {
  li.classList.add('completed');
}
li.innerHTML = `
<span>${todo.text}</span>
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
    addTodo(text)
    todoInput.value = '' //clears the input field after adding a todo
    hideError()
  } else {
    showError()
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
  renderTodos()
}

// clicking the text of a todo marks it as completed (or not completed again)
const addToggleListener = (li: HTMLLIElement, id: number): void => {
  const textSpan = li.querySelector('span');
  textSpan?.addEventListener('click', () => {
    todos = toggleTodo(todos, id);
    renderTodos();
  })
}

// end of code from 01-10 bde