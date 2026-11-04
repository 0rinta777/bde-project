import { describe, it, expect } from 'vitest';
import { createTodo, isValidTodoText, toggleTodo, searchTodos, parseTodos, sortByPriority } from './todoLogic';
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

describe('priority', () => {
  // the priority we choose is saved on the todo
  it('creates a todo with the given priority', () => {
    const todo = createTodo('Study for exam', 'high');
    expect(todo.priority).toBe('high');
  });

  // if no priority is given, medium is used
  it('uses medium as the default priority', () => {
    const todo = createTodo('Buy milk');
    expect(todo.priority).toBe('medium');
  });

  // toggling completed should not remove or change the priority
  it('keeps the priority when a todo is toggled', () => {
    const todos: Todo[] = [{ id: 1, text: 'Study', completed: false, priority: 'low' }];
    const result = toggleTodo(todos, 1);
    expect(result[0].priority).toBe('low');
  });

  // the union type only allows 'low' | 'medium' | 'high'.
  // The ts-expect-error comment below tells TypeScript we EXPECT an error on the next line.
  // If 'urgent' was ever allowed, tsc would fail the build because the error is missing.
  it('only allows low, medium or high (checked by TypeScript)', () => {
    // @ts-expect-error 'urgent' is not a valid Priority
    const todo = createTodo('Something', 'urgent');
    expect(todo).toBeDefined();
  });
});

describe('searchTodos', () => {
  // a small test list with three todos
  const todos: Todo[] = [
    { id: 1, text: 'Buy milk', completed: false },
    { id: 2, text: 'Walk the dog', completed: false },
    { id: 3, text: 'Buy bread', completed: true },
  ];

  // only todos that contain the search text are returned
  it('returns only the todos that match', () => {
    const result = searchTodos(todos, 'buy');
    expect(result.length).toBe(2);
  });

  // capital letters should not matter
  it('is not case-sensitive', () => {
    const result = searchTodos(todos, 'MILK');
    expect(result[0].text).toBe('Buy milk');
  });

  // an empty search shows all todos
  it('returns all todos when the search is empty', () => {
    const result = searchTodos(todos, '');
    expect(result.length).toBe(3);
  });

  // nothing matches, so the list is empty
  it('returns an empty list when nothing matches', () => {
    const result = searchTodos(todos, 'pizza');
    expect(result).toEqual([]);
  });

  // searching should never delete todos from the original list
  it('does not change the original list', () => {
    searchTodos(todos, 'buy');
    expect(todos.length).toBe(3);
  });
});

describe('parseTodos', () => {
  // the first time the app opens, nothing is saved yet (getItem returns null)
  it('returns an empty list when nothing is saved', () => {
    expect(parseTodos(null)).toEqual([]);
  });

  // saving and loading again should give back the same todos
  it('loads todos that were saved with JSON.stringify', () => {
    const todos: Todo[] = [
      { id: 1, text: 'Buy milk', completed: true, priority: 'high' },
    ];
    const saved = JSON.stringify(todos);
    expect(parseTodos(saved)).toEqual(todos);
  });

  // broken text should not crash the app
  it('returns an empty list when the saved text is not valid JSON', () => {
    expect(parseTodos('this is not json')).toEqual([]);
  });

  // valid JSON, but not a list, so it can't be our todos
  it('returns an empty list when the saved data is not a list', () => {
    expect(parseTodos('{"text": "hello"}')).toEqual([]);
  });
});

describe('sortByPriority', () => {
  // a list that is NOT in priority order
  const todos: Todo[] = [
    { id: 1, text: 'Low task', completed: false, priority: 'low' },
    { id: 2, text: 'No priority task', completed: false },
    { id: 3, text: 'High task', completed: false, priority: 'high' },
    { id: 4, text: 'Medium task', completed: false, priority: 'medium' },
  ];

  // high first, then medium, then low, and todos without a priority last
  it('sorts high, then medium, then low, then no priority', () => {
    const result = sortByPriority(todos);
    const order = result.map(todo => todo.id);
    expect(order).toEqual([3, 4, 1, 2]);
  });

  // sorting should not change the original list
  it('does not change the original list', () => {
    sortByPriority(todos);
    expect(todos[0].id).toBe(1);
  });

  // no todos should get lost while sorting
  it('keeps all todos', () => {
    const result = sortByPriority(todos);
    expect(result.length).toBe(4);
  });
});
