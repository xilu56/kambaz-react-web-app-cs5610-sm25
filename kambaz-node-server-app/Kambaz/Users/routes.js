import * as dao from "./dao.js";
import * as courseDao from "../Courses/dao.js";

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
    const userId = req.params.userId;
    const userUpdates = req.body;
    dao.updateUser(userId, userUpdates);
    const currentUser = dao.findUserById(userId);
    req.session["currentUser"] = currentUser;
    res.json(currentUser);
  };

  const signup = (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        res.status(400).json({ message: "Username and password are required" });
        return;
      }

      const existingUser = dao.findUserByUsername(username);
      if (existingUser) {
        res.status(400).json({ message: "Username already taken" });
        return;
      }

      const currentUser = dao.createUser(req.body);
      req.session["currentUser"] = currentUser;
      
      res.json({
        _id: currentUser._id,
        username: currentUser.username,
        firstName: currentUser.firstName,
        lastName: currentUser.lastName,
        role: currentUser.role,
        email: currentUser.email
      });
    } catch (error) {
      console.error("Signup error:", error);
      res.status(500).json({ message: "Internal server error during signup" });
    }
  };

  const signin = (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        res.status(400).json({ message: "Username and password are required" });
        return;
      }

      const currentUser = dao.findUserByCredentials(username, password);
      if (currentUser) {
        // Store user in session
        req.session.currentUser = currentUser;
        
        // Send user data back to client
        res.json({
          _id: currentUser._id,
          username: currentUser.username,
          firstName: currentUser.firstName,
          lastName: currentUser.lastName,
          role: currentUser.role,
          email: currentUser.email
        });
      } else {
        res.status(401).json({ message: "Invalid credentials" });
      }
    } catch (error) {
      console.error("Signin error:", error);
      res.status(500).json({ message: "Internal server error during signin" });
    }
  };

  const signout = (req, res) => {
    req.session.destroy();
    res.sendStatus(200);
  };

  const profile = (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) {
      res.sendStatus(401);
      return;
    }
    res.json(currentUser);
  };

  const updateProfile = (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) {
      res.status(401).json({ message: "Not signed in" });
      return;
    }

    const { userId, ...updateData } = req.body;
    const userIdToUpdate = userId || currentUser._id;
    
    // Update the user in the database
    const updatedUser = dao.updateUser(userIdToUpdate, updateData);
    if (updatedUser) {
      // Update the session with the new user data
      req.session["currentUser"] = updatedUser;
      res.json(updatedUser);
    } else {
      res.status(400).json({ message: "Failed to update profile" });
    }
  };

  const findCoursesForEnrolledUser = (req, res) => {
    let { userId } = req.params;
    if (userId === "current") {
      const currentUser = req.session["currentUser"];
      if (!currentUser) {
        res.sendStatus(401);
        return;
      }
      userId = currentUser._id;
    }
    const courses = courseDao.findCoursesForEnrolledUser(userId);
    res.json(courses);
  };

  // Register routes - IMPORTANT: specific routes before parameterized routes
  app.post("/api/users", createUser);
  app.get("/api/users", findAllUsers);
  app.post("/api/users/signup", signup);
  app.post("/api/users/signin", signin);
  app.post("/api/users/signout", signout);
  app.post("/api/users/profile", profile);
  app.put("/api/users/profile", updateProfile);
  app.get("/api/users/:userId/courses", findCoursesForEnrolledUser);
  app.get("/api/users/:userId", findUserById);
  app.put("/api/users/:userId", updateUser);
  app.delete("/api/users/:userId", deleteUser);
} 