import axiosWithCredentials, { REMOTE_SERVER } from "../../api/axios";

export const fetchWelcomeMessage = async () => {
  const response = await axiosWithCredentials.get(`/lab5/welcome`);
  return response.data;
};

const ASSIGNMENT_API = `/lab5/assignment`;
export const fetchAssignment = async () => {
  const response = await axiosWithCredentials.get(ASSIGNMENT_API);
  return response.data;
};

export const updateAssignment = async (assignment: any) => {
  const response = await axiosWithCredentials.put(ASSIGNMENT_API, assignment);
  return response.data;
};

const TODOS_API = `/lab5/todos`;
export const fetchTodos = async () => {
  const response = await axiosWithCredentials.get(TODOS_API);
  return response.data;
};

export const createTodo = async (todo: any) => {
  const response = await axiosWithCredentials.post(TODOS_API, todo);
  return response.data;
};

export const updateTodo = async (todo: any) => {
  const response = await axiosWithCredentials.put(`${TODOS_API}/${todo.id}`, todo);
  return response.data;
};

export const deleteTodo = async (todoId: string) => {
  const response = await axiosWithCredentials.delete(`${TODOS_API}/${todoId}`);
  return response.data;
};

