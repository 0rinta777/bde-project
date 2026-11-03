// Pure todo logic: no DOM code here, so it can be tested with Vitest.

//structure of the data schema
export interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

export const createTodo = (text: string): Todo => {
  return {
    id: Date.now(),
    text: text,
    completed: false
  };
};
