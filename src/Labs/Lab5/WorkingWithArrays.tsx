import { useState, useEffect } from "react";
import { FormControl, ListGroup, Button } from "react-bootstrap";
import { FaPlusCircle } from "react-icons/fa";
import { FaPencil, FaTrash } from "react-icons/fa6";
import { TiDelete } from "react-icons/ti";
import * as client from "./client";
const REMOTE_SERVER = import.meta.env.VITE_REMOTE_SERVER;

interface Todo {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

export default function WorkingWithArrays() {
  const API = `${REMOTE_SERVER}/lab5/todos`;
  const [errorMessage, setErrorMessage] = useState(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [todo, setTodo] = useState({
    id: "1", 
    title: "NodeJS Assignment",
    description: "Create a NodeJS server with ExpressJS",
    due: "2021-09-09",
    completed: false,
  });

  const fetchTodos = async () => {
    try {
      const data = await client.fetchTodos();
      setTodos(data);
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  };

  const createTodo = async () => {
    try {
      const data = await client.createTodo();
      setTodos([...todos, data]);
      setErrorMessage(null);
    } catch (error: any) {
      setErrorMessage(error.response?.data?.message || "Error creating todo");
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
      const data = await client.postTodo(newTodo);
      setTodos([...todos, data]);
    } catch (error) {
      console.error("Error creating todo:", error);
    }
  };

  const deleteTodoById = async (todoId: string) => {
    try {
      const todoToDelete = todos.find(t => t.id === todoId);
      if (todoToDelete) {
        await client.deleteTodo(todoToDelete);
        setTodos(todos.filter(t => t.id !== todoId));
      }
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  const deleteTodoAsync = async (todoToDelete: Todo) => {
    try {
      await client.deleteTodo(todoToDelete);
      const newTodos = todos.filter((t) => t.id !== todoToDelete.id);
      setTodos(newTodos);
      setErrorMessage(null);
    } catch (error: any) {
      console.log(error);
      setErrorMessage(error.response?.data?.message || `Unable to delete Todo with ID ${todoToDelete.id}`);
    }
  };

  const updateTodoAsync = async (todoToUpdate: Todo) => {
    try {
      await client.updateTodo(todoToUpdate);
      setTodos(todos.map((t) => (t.id === todoToUpdate.id ? todoToUpdate : t)));
      setErrorMessage(null);
    } catch (error: any) {
      setErrorMessage(error.response?.data?.message || `Unable to update Todo with ID ${todoToUpdate.id}`);
    }
  };

  const editTodo = (todoToEdit: Todo) => {
    const updatedTodos = todos.map(
      (t) => t.id === todoToEdit.id ? { ...todoToEdit, editing: true } : { ...t, editing: false }
    );
    setTodos(updatedTodos);
  };

  useEffect(() => {
    fetchTodos();
  }, []);
  
  return (
    <div id="wd-working-with-arrays">
      <h3>Working with Arrays</h3>
      
      {errorMessage && (
        <div id="wd-todo-error-message" className="alert alert-danger mb-2 mt-2">
          {errorMessage}
        </div>
      )}

      <h4>
        Todos
        <FaPlusCircle 
          onClick={createTodo} 
          className="text-success float-end fs-3" 
          id="wd-create-todo" 
        />
      </h4>

      <div className="mb-3">
        <Button 
          className="btn btn-primary me-2"
          onClick={fetchTodos}
        >
          Get Todos
        </Button>
        <Button 
          className="btn btn-success me-2"
          onClick={createNewTodo}
        >
          Create Todo
        </Button>
      </div>

      <ListGroup>
        {todos.map((todoItem) => (
          <ListGroup.Item key={todoItem.id}>
            <FaPencil 
              onClick={() => editTodo(todoItem)} 
              className="text-primary float-end me-2 mt-1" 
            />
            <FaTrash 
              onClick={() => deleteTodoById(todoItem.id)}
              className="text-danger float-end mt-1" 
              id="wd-remove-todo"
            />
            <TiDelete 
              onClick={() => deleteTodoAsync(todoItem)} 
              className="text-danger float-end me-2 fs-3" 
              id="wd-delete-todo" 
            />
            <input 
              type="checkbox" 
              defaultChecked={todoItem.completed} 
              className="form-check-input me-2 float-start"
              onChange={(e) => updateTodoAsync({ ...todoItem, completed: e.target.checked })} 
            />
            {!(todoItem as any).editing ? (
              <span style={{ textDecoration: todoItem.completed ? "line-through" : "none" }}>
                {todoItem.title}
              </span>
            ) : (
              <FormControl 
                className="w-50 float-start" 
                defaultValue={todoItem.title}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    updateTodoAsync({ ...todoItem, editing: false } as any);
                  }
                }}
                onChange={(e) =>
                  updateTodoAsync({ ...todoItem, title: e.target.value })
                }
              />
            )}
          </ListGroup.Item>
        ))}
      </ListGroup>
      <hr />
      
      <h4>Retrieving Arrays</h4>
      <a id="wd-retrieve-todos" className="btn btn-primary" href={API}>
        Get Todos 
      </a>
      <hr/>
      
      <h4>Retrieving an Item from an Array by ID</h4>
      <a id="wd-retrieve-todo-by-id" className="btn btn-primary float-end" href={`${API}/${todo.id}`}>
        Get Todo by ID
      </a>
      <FormControl id="wd-todo-id" defaultValue={todo.id} className="w-50"
        onChange={(e) => setTodo({ ...todo, id: e.target.value })} />
      <hr />
      
      <h4>Filtering Array Items</h4>
      <a id="wd-retrieve-completed-todos" className="btn btn-primary me-2"
         href={`${API}?completed=true`}>
        Get Completed Todos
      </a>
      <a id="wd-retrieve-incompleted-todos" className="btn btn-primary"
         href={`${API}?completed=false`}>
        Get Incompleted Todos
      </a>
      <hr/>
      
      <h4>Creating new Items in an Array</h4>
      <a id="wd-create-todo" className="btn btn-primary"
         href={`${API}/create`}>
        Create Todo
      </a>
      <hr/>
      
      <h4>Deleting from an Array</h4>
      <div className="mb-2">
        <h5>Simple Delete (GET request)</h5>
        <a id="wd-delete-todo-with-id" className="btn btn-primary float-end" 
           href={`${API}/${todo.id}/delete`}>
          Delete Todo with ID = {todo.id} 
        </a>
        <FormControl defaultValue={todo.id} className="w-50" 
          onChange={(e) => setTodo({ ...todo, id: e.target.value })}/>
      </div>
      <hr/>
      
      <h4>Updating an Item in an Array</h4>
      <div className="mb-2">
        <h5>Simple Title Update (GET request)</h5>
        <a href={`${API}/${todo.id}/title/${todo.title}`} className="btn btn-primary float-end">
          Update Title
        </a>
        <FormControl defaultValue={todo.id} className="w-25 float-start me-2"
          onChange={(e) => setTodo({ ...todo, id: e.target.value })}/>
        <FormControl defaultValue={todo.title} className="w-50 float-start"
          onChange={(e) => setTodo({ ...todo, title: e.target.value }) }/>
        <br /><br />
      </div>
      <hr />
      
      <h4>Updating Description</h4>
      <a href={`${API}/${todo.id}/description/${todo.description}`} className="btn btn-primary float-end">
        Update Description
      </a>
      <FormControl defaultValue={todo.id} className="w-25 float-start me-2"
        onChange={(e) => setTodo({ ...todo, id: e.target.value })}/>
      <FormControl defaultValue={todo.description} className="w-50 float-start"
        onChange={(e) => setTodo({ ...todo, description: e.target.value }) }/>
      <br /><br /><hr />
      
      <h4>Updating Completed Status</h4>
      <a href={`${API}/${todo.id}/completed/${todo.completed}`} className="btn btn-primary float-end">
        Update Completed
      </a>
      <FormControl defaultValue={todo.id} className="w-25 float-start me-2"
        onChange={(e) => setTodo({ ...todo, id: e.target.value })}/>
      <label className="form-check-label float-start">
        <input 
          type="checkbox" 
          className="form-check-input me-2"
          checked={todo.completed}
          onChange={(e) => setTodo({ ...todo, completed: e.target.checked })}
        />
        Completed
      </label>
      <br /><br /><hr />
    </div>
  );
}
