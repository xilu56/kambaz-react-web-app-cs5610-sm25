import PathParameters from "../src/Labs/Lab5/PathParameters.js";
import QueryParameters from "../src/Labs/Lab5/QueryParameters.js";
import WorkingWithObjects from "../src/Labs/Lab5/WorkingWithObjects.js";

export default function Lab5(app) {
  app.get("/lab5/welcome", (req, res) => {
    res.send("Welcome to Lab 5");
  });

  app.get("/lab5/hello", (req, res) => {
    res.send("Hello from Lab 5!");
  });

  // Working with Objects
  const assignment = {
    id: 1,
    title: "NodeJS Assignment",
    description: "Create a NodeJS server with ExpressJS",
    due: "2021-10-10",
    completed: false,
    score: 0,
  };

  const module = {
    id: "CS5610",
    name: "Web Development", 
    description: "Learn full-stack web development",
    course: "CS5610"
  };

  app.get("/lab5/assignment", (req, res) => {
    res.json(assignment);
  });

  app.get("/lab5/assignment/title", (req, res) => {
    res.json(assignment.title);
  });

  app.get("/lab5/assignment/title/:newTitle", (req, res) => {
    const { newTitle } = req.params;
    assignment.title = newTitle;
    res.json(assignment);
  });

  app.get("/lab5/module", (req, res) => {
    res.json(module);
  });

  app.get("/lab5/module/name", (req, res) => {
    res.json(module.name);
  });

  app.get("/lab5/module/name/:newName", (req, res) => {
    const { newName } = req.params;
    module.name = newName;
    res.json(module);
  });

  // Working with Arrays
  let todos = [
    { id: 1, title: "Task 1", description: "Description 1", due: "2021-10-10", completed: false },
    { id: 2, title: "Task 2", description: "Description 2", due: "2021-10-15", completed: true },
    { id: 3, title: "Task 3", description: "Description 3", due: "2021-10-20", completed: false },
  ];

  app.get("/lab5/todos", (req, res) => {
    res.json(todos);
  });

  app.get("/lab5/todos/:id", (req, res) => {
    const { id } = req.params;
    const todo = todos.find((t) => t.id == id);
    if (todo) {
      res.json(todo);
    } else {
      res.status(404).json({ message: "Todo not found" });
    }
  });

  app.get("/lab5/todos/create", (req, res) => {
    const newTodo = {
      id: new Date().getTime(),
      title: "New Task",
      description: "New Description",
      due: "2021-10-25",
      completed: false,
    };
    todos.push(newTodo);
    res.json(newTodo);
  });

  app.get("/lab5/todos/:id/delete", (req, res) => {
    const { id } = req.params;
    const todoIndex = todos.findIndex((t) => t.id == id);
    if (todoIndex !== -1) {
      const deletedTodo = todos.splice(todoIndex, 1)[0];
      res.json(deletedTodo);
    } else {
      res.status(404).json({ message: "Todo not found" });
    }
  });

  app.get("/lab5/todos/:id/title/:title", (req, res) => {
    const { id, title } = req.params;
    const todo = todos.find((t) => t.id == id);
    if (todo) {
      todo.title = title;
      res.json(todo);
    } else {
      res.status(404).json({ message: "Todo not found" });
    }
  });

  app.get("/lab5/todos/:id/description/:description", (req, res) => {
    const { id, description } = req.params;
    const todo = todos.find((t) => t.id == id);
    if (todo) {
      todo.description = description;
      res.json(todo);
    } else {
      res.status(404).json({ message: "Todo not found" });
    }
  });

  app.get("/lab5/todos/:id/completed/:completed", (req, res) => {
    const { id, completed } = req.params;
    const todo = todos.find((t) => t.id == id);
    if (todo) {
      todo.completed = completed === "true";
      res.json(todo);
    } else {
      res.status(404).json({ message: "Todo not found" });
    }
  });

  PathParameters(app);
  QueryParameters(app);
  WorkingWithObjects(app);
} 