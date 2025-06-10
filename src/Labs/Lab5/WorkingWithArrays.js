let todos = [ { id: 1, title: "Task 1", completed: false },  { id: 2, title: "Task 2", completed: true },
              { id: 3, title: "Task 3", completed: false },  { id: 4, title: "Task 4", completed: true }, ];

export default function WorkingWithArrays(app) {
    

  app.get("/lab5/todos", (req, res) => {
    const { completed } = req.query;
    if (completed !== undefined) {
      const completedBool = completed === "true";
      const completedTodos = todos.filter(
        (t) => t.completed === completedBool);
      res.json(completedTodos);
      return;
    }

    res.json(todos);
  });
  
  app.get("/lab5/todos/create", (req, res) => {
    console.log("Create todo route hit!");
    const newTodo = {
      id: new Date().getTime(),
      title: "New Task",
      completed: false,
    };
    todos.push(newTodo);
    console.log("New todo created:", newTodo);
    console.log("All todos now:", todos);
    res.json(todos);
  });
  
  app.get("/lab5/todos/:id", (req, res) => {
    const { id } = req.params;
    const todo = todos.find((t) => t.id === parseInt(id));
    res.json(todo);
  });
  //create a new todo with id 1
    app.get("/lab5/todos/:id/update", (req, res) => {
        const { id } = req.params;
        const todoIndex = todos.findIndex((t) => t.id === parseInt(id));
        if (todoIndex !== -1) {
        todos[todoIndex].title = "Updated Task";
        todos[todoIndex].completed = !todos[todoIndex].completed;
        res.json(todos[todoIndex]);
        } else {
        res.status(404).send("Todo not found");
        }
    });
  app.get("/lab5/todos/:id/delete", (req, res) => {
    const { id } = req.params;
    const todoIndex = todos.findIndex((t) => t.id === parseInt(id));
    todos.splice(todoIndex, 1);
    res.json(todos);
  });

  app.get("/lab5/todos/reset", (req, res) => {
    todos = [
      { id: 1, title: "Task 1", completed: false },
      { id: 2, title: "Task 2", completed: true },
      { id: 3, title: "Task 3", completed: false },
      { id: 4, title: "Task 4", completed: true },
    ];
    console.log("Todos reset to original state");
    res.json(todos);
  });
  app.get("/lab5/todos/:id/title/:title", (req, res) => {
    const { id, title } = req.params;
    const todo = todos.find((t) => t.id === parseInt(id));
    todo.title = title;
    res.json(todos);
  });
    app.post("/lab5/todos", (req, res) => {
    const newTodo = { ...req.body,  id: new Date().getTime() };
    todos.push(newTodo);
    res.json(newTodo);
  });


};
