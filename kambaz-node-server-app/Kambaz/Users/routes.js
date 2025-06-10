import * as dao from "./dao.js";

let currentUser = null;

export default function UserRoutes(app) {
  const createUser = (req, res) => {
    const user = dao.createUser(req.body);
    res.json(user);
  };

  const deleteUser = (req, res) => {
    const { userId } = req.params;
    dao.deleteUser(userId);
    res.sendStatus(200);
  };

  const findAllUsers = (req, res) => {
    const users = dao.findAllUsers();
    res.json(users);
  };

  const findUserById = (req, res) => {
    const { userId } = req.params;
    const user = dao.findUserById(userId);
    res.json(user);
  };

  const updateUser = (req, res) => {
    const { userId } = req.params;
    const status = dao.updateUser(userId, req.body);
    res.json(status);
  };

  const signup = (req, res) => {
    const user = dao.findUserByUsername(req.body.username);
    if (user) {
      res.status(400).json({
        message: "Username already in use"
      });
      return;
    }
    currentUser = dao.createUser(req.body);
    res.json(currentUser);
  };

  const signin = (req, res) => {
    const { username, password } = req.body;
    currentUser = dao.findUserByCredentials(username, password);
    if (!currentUser) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }
    res.json(currentUser);
  };

  const signout = (req, res) => {
    currentUser = null;
    res.sendStatus(200);
  };

  const profile = (req, res) => {
    if (!currentUser) {
      res.status(401).json({ message: "Not signed in" });
      return;
    }
    res.json(currentUser);
  };

  app.post("/api/users", createUser);
  app.get("/api/users", findAllUsers);
  app.get("/api/users/:userId", findUserById);
  app.put("/api/users/:userId", updateUser);
  app.delete("/api/users/:userId", deleteUser);
  app.post("/api/users/signup", signup);
  app.post("/api/users/signin", signin);
  app.post("/api/users/signout", signout);
  app.post("/api/users/profile", profile);
} 