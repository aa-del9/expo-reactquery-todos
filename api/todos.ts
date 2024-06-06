import axios from "axios";

const apiBaseUrl = process.env.EXPO_PUBLIC_TODO_API_URL;

export type Todo = {
  id: number;
  title: string;
  completed: boolean;
};

export const getTodos = async () => {
  try {
    const response = await axios.get(`${apiBaseUrl}`);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const postToDo = async (todo: Todo) => {
  const response = await axios.post<Todo>(`${apiBaseUrl}`, todo);
  console.log(response.data);
  return response.data;
};

export const deleteToDo = async (id: number) => {
  console.log(id);

  const response = await axios.delete(`${apiBaseUrl}/${id}`);
  console.log(response.data);
  return response.data;
};

export const updateToDo = async (todo: Todo) => {
  const response = await axios.put<Todo>(`${apiBaseUrl}/${todo.id}`, todo);
  console.log(response.data);
  return response.data;
};
