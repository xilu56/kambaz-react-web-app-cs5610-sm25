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

};
