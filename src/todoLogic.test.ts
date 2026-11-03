import { describe, it, expect } from 'vitest';
import { createTodo } from './todoLogic';

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
