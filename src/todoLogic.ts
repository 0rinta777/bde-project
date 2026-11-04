// Pure todo logic: no DOM code here, so it can be tested with Vitest.

//structure of the data schema
export interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

// A todo text is only valid if it has at least one character that is not a space
export const isValidTodoText = (text: string): boolean => {
  return text.trim().length > 0;
};

export const createTodo =(text: string): Todo => {
  return {
    id: Date.now(),
    text: text,
    completed: false
  };
};

// Returns a new list where the todo with this id has its completed status flipped
export const toggleTodo = (todos: Todo[], id: number): Todo[] => {
  return todos.map(todo => {
    if (todo.id === id) {
      return { ...todo, completed: !todo.completed };
    }
    return todo;
  });
};
