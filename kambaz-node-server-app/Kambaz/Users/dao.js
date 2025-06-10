import db from "../Database/index.js";
import { v4 as uuidv4 } from "uuid";

let { users } = db;

export const createUser = (user) => {
  const newUser = { ...user, _id: uuidv4() };
  users = [...users, newUser];
  return newUser;
};

export const findAllUsers = () => users;

export const findUserById = (userId) => users.find((user) => user._id === userId);

export const findUserByUsername = (username) => users.find((user) => user.username === username);

export const findUserByCredentials = (username, password) =>
  users.find((user) => user.username === username && user.password === password);

export const updateUser = (userId, updates) => {
  const userIndex = users.findIndex((user) => user._id === userId);
  if (userIndex === -1) {
    return null;
  }
  
  // Merge existing user data with updates
  const updatedUser = { ...users[userIndex], ...updates };
  users[userIndex] = updatedUser;
  
  return updatedUser;
};

export const deleteUser = (userId) => (users = users.filter((u) => u._id !== userId)); 