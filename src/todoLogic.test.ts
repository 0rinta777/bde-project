import { describe, it, expect } from 'vitest';
import { createTodo, isValidTodoText, toggleTodo } from './todoLogic';
import type { Todo } from './todoLogic';

describe('createTodo', () => {
  // the new todo should keep the text we gave it
  it('uses the given text', () => {
    const todo = createTodo('Buy milk');
    expect(todo.text).toBe('Buy milk');
  });

  // a brand new todo should not be done yet
  it('is not completed when created', () => {
    const todo = createTodo('Buy milk');
    expect(todo.completed).toBe(false);
  });

  // every todo needs a number id so we can find and remove it later
  it('gets a number as id', () => {
    const todo = createTodo('Buy milk');
    expect(typeof todo.id).toBe('number');
  });
});

describe('isValidTodoText', () => {
  // normal text is allowed
  it('returns true for normal text', () => {
    expect(isValidTodoText('Buy milk')).toBe(true);
  });

  // an empty input should show the error
  it('returns false for an empty string', () => {
    expect(isValidTodoText('')).toBe(false);
  });

  // only spaces counts as empty too
  it('returns false for only spaces', () => {
    expect(isValidTodoText('   ')).toBe(false);
  });
});

describe('toggleTodo', () => {
  // a small test list with two todos
  const todos: Todo[] = [
    { id: 1, text: 'Buy milk', completed: false },
    { id: 2, text: 'Walk the dog', completed: true },
  ];

  // a todo that is not done becomes done
  it('marks a not completed todo as completed', () => {
    const result = toggleTodo(todos, 1);
    expect(result[0].completed).toBe(true);
  });

  // a todo that is done becomes not done again
  it('marks a completed todo as not completed', () => {
    const result = toggleTodo(todos, 2);
    expect(result[1].completed).toBe(false);
  });

  // only the clicked todo should change
  it('does not change the other todos', () => {
    const result = toggleTodo(todos, 1);
    expect(result[1]).toEqual(todos[1]);
  });

  // the original list stays the same, we get a new list back
  it('does not change the original list', () => {
    toggleTodo(todos, 1);
    expect(todos[0].completed).toBe(false);
  });
});
