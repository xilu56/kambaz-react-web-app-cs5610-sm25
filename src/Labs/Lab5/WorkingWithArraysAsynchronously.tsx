import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import * as client from "./client";

interface Todo {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

export default function WorkingWithArraysAsynchronously() {
  const [todos, setTodos] = useState<Todo[]>([]);

  const fetchTodos = async () => {
    try {
      const data = await client.fetchTodos();
      setTodos(data);
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  };

  const createNewTodo = async () => {
    try {
      const newTodo: Todo = {
        id: new Date().getTime().toString(),
        title: "New Todo",
        completed: false,
        description: "New Todo Description"
      };
      const data = await client.createTodo(newTodo);
      setTodos([...todos, data]);
    } catch (error) {
      console.error("Error creating todo:", error);
    }
  };

  const deleteTodoById = async (todoId: string) => {
    try {
      await client.deleteTodo(todoId);
      setTodos(todos.filter(t => t.id !== todoId));
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <div>
      <h3>Working with Arrays Asynchronously</h3>
      <div className="mb-3">
        <Button 
          className="btn btn-success me-2"
          onClick={createNewTodo}
        >
          Create Todo
        </Button>
      </div>

      <ul className="list-group">
        {todos.map((todo) => (
          <li key={todo.id} className="list-group-item d-flex justify-content-between align-items-center">
            <div>
              <h4>{todo.title}</h4>
              <p className="mb-0">{todo.description}</p>
              <small>Completed: {todo.completed ? "Yes" : "No"}</small>
            </div>
            <Button 
              className="btn btn-danger"
              onClick={() => deleteTodoById(todo.id)}
            >
              Delete
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}
