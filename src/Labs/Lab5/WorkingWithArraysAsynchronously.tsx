import { useState, useEffect } from "react";
import { TiDelete } from "react-icons/ti";
import { ListGroup } from "react-bootstrap";
import { FaPlusCircle } from "react-icons/fa";
import { FaTrash } from "react-icons/fa";
import { FaPencil } from "react-icons/fa6";
import { FormControl } from "react-bootstrap";
import * as client from "./client";
export default function WorkingWithArraysAsynchronously() {
  const [todos, setTodos] = useState<any[]>([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const createTodo = async () => {
    const todos = await client.createTodo();
    setTodos(todos);
  };
  const postTodo = async () => {
    const newTodo = await client.postTodo({ title: "New Posted Todo", completed: false, });
    setTodos([...todos, newTodo]);
  };

  const fetchTodos = async () => {
    const todos = await client.fetchTodos();
    setTodos(todos);
  };
  const removeTodo = async (todo: any) => {
    const updatedTodos = await client.removeTodo(todo);
    setTodos(updatedTodos);
  };
  const deleteTodo = async (todo: any) => {
    try {
      await client.deleteTodo(todo);
      const newTodos = todos.filter((t) => t.id !== todo.id);
      setTodos(newTodos);
    } catch (error: any) {
      console.log(error);
      setErrorMessage(error.response.data.message);
    }
  };
const editTodo = (todo: any) => {
    const updatedTodos = todos.map(
      (t) => t.id === todo.id ? { ...todo, editing: true } : t );
    setTodos(updatedTodos);
  };
  const updateTodo = async (todo: any) => {
    try {
      await client.updateTodo(todo);
      setTodos(todos.map((t) => (t.id === todo.id ? todo : t)));
    } catch (error: any) {
      setErrorMessage(error.response.data.message);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);
  return (
    <div id="wd-asynchronous-arrays">
      <h3>Working with Arrays Asynchronously</h3>
      {errorMessage && (<div id="wd-todo-error-message" className="alert alert-danger mb-2 mt-2">{errorMessage}</div>)}
      <h4>Todos</h4>
    <FaPlusCircle onClick={createTodo} className="text-success float-end fs-3"
                         id="wd-create-todo" />
    <FaPlusCircle onClick={postTodo}   className="text-primary float-end fs-3 me-3" id="wd-post-todo"   />
      <ListGroup>
        {todos.map((todo) => (
          <ListGroup.Item key={todo.id}>

    <FaPencil
      onClick={() => editTodo(todo)}
      className="text-primary float-end me-2 mt-1"
    />

    <TiDelete
    onClick={() => updateTodo({ ...todo, editing: false })}
    className="text-danger float-end me-2 fs-3 mt-1"
    />


    <FaTrash
      onClick={() => deleteTodo(todo)}
      className="text-danger float-end me-2 mt-1"
      id="wd-delete-todo"
    />


  <input
    type="checkbox"
    checked={todo.completed}
    className="form-check-input me-2 float-start"
    onChange={(e) =>
      updateTodo({ ...todo, completed: e.target.checked })
    }
  />

  {/* 标题或编辑框 */}
  {!todo.editing ? (
    <span
      className="float-start"
      style={{
        textDecoration: todo.completed ? "line-through" : "none",
      }}
    >
      {todo.title}
    </span>
  ) : (
    <FormControl
      className="w-50 float-start"
      defaultValue={todo.title}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          updateTodo({ ...todo, editing: false });
        }
      }}
      onChange={(e) =>
        updateTodo({ ...todo, title: e.target.value })
      }
    />
  )}
</ListGroup.Item>
        ))}
      </ListGroup>
    </div>
);}