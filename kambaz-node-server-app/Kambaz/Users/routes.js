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
    const updatedUser = dao.updateUser(userId, req.body);
    res.json(updatedUser);
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

  const updateProfile = (req, res) => {
    // Accept userId in the request body
    const { userId, ...updateData } = req.body;
    
    if (!userId) {
      res.status(400).json({ message: "User ID is required" });
      return;
    }
    
    // Update the user in the database
    const updatedUser = dao.updateUser(userId, updateData);
    if (updatedUser) {
      // If this is the current user, update the session as well
      if (currentUser && currentUser._id === userId) {
        currentUser = updatedUser;
      }
      res.json(updatedUser);
    } else {
      res.status(400).json({ message: "Failed to update profile" });
    }
  };

  // Register routes - IMPORTANT: specific routes before parameterized routes
  app.post("/api/users", createUser);
  app.get("/api/users", findAllUsers);
  app.post("/api/users/signup", signup);
  app.post("/api/users/signin", signin);
  app.post("/api/users/signout", signout);
  app.post("/api/users/profile", profile);
  app.put("/api/users/profile", updateProfile);  // This MUST come before the parameterized route
  app.get("/api/users/:userId", findUserById);
  app.put("/api/users/:userId", updateUser);
  app.delete("/api/users/:userId", deleteUser);
} 