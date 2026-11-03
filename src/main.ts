import './style.css'
import { createTodo } from './todoLogic'
import type { Todo } from './todoLogic'

let todos: Todo[] = [ ];

const todoInput = document.getElementById('todo-input') as HTMLInputElement;
const todoForm = document.querySelector('.todo-form') as HTMLFormElement;
const todolist = document.getElementById('todo-list') as HTMLUListElement;

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
li.innerHTML = `
<span>${todo.text}</span>
<button>remove</button>
`
addRemoveButtonListener(li, todo.id);
todolist.appendChild(li);
})
}

renderTodos();


todoForm.addEventListener('submit', (event: Event) => {
  event.preventDefault();

  const text = todoInput .value.trim();

  if (text !== '') {
    addTodo(text)
    todoInput.value = '' //clears the input field after adding a todo
 }
})



const addRemoveButtonListener = (li:HTMLLIElement, id: number) :void => { //this is helper in folder which fires and action or function 
  const removeButton = li.querySelector('button');
  removeButton?.addEventListener('click', () => removeTodo(id))
}

const removeTodo = (id:number):void => {
  todos = todos.filter(todo => todo.id !== id)
  renderTodos()
}

// end of code from 01-10 bde