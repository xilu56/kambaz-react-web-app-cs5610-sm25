import PathParameters from "../src/Labs/Lab5/PathParameters.js";
import QueryParameters from "../src/Labs/Lab5/QueryParameters.js";
import WorkingWithObjects from "../src/Labs/Lab5/WorkingWithObjects.js";
import WorkingWithArrays from "../src/Labs/Lab5/WorkingWithArrays.js";

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
  

  PathParameters(app);
  QueryParameters(app);
  WorkingWithObjects(app);
  WorkingWithArrays(app);

} 