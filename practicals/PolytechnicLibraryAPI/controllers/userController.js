const express = require("express");
const router = express.Router();
const User = require("../models/users");

const createUser = async (req, res) => {
  try {
    const { username,passwordHash,role } = req.body;
    const newUser = await User.createUserAccount({ username,passwordHash,role });
    res.status(201).json(newUser);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).send("Error creating user");
  }
};


const getAllUsers = async (req, res) => {
  try {
    const users = await User.getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    console.error("Error retrieving users:", error);
    res.status(500).send("Error retrieving users");
  }
};

const getUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.getUserById(userId);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Error retrieving user:", error);
    res.status(500).json({ message: "Error retrieving user", error: error.message });
  }
};

const searchUsers = async (req, res) => {
  const searchTerm = req.query.searchTerm;

  try {
    const users = await User.searchUsers(searchTerm);
    res.json(users);
  } catch (error) {
    console.error("Error searching users:", error);
    res.status(500).json({ message: "Error searching users" });
  }
};

const loginUser = async (req, res) => {
  const { name, password } = req.query; // Retrieve username and password from query params

  try {
    const user = await User.getUserByNameAndPassword(name, password); // Assuming a method to fetch user by name and password

    if (user) {
      res.status(200).json(user); // Return user data if found
    } else {
      res.status(404).json({ message: 'User not found' }); // User not found
    }
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  searchUsers,
  loginUser,
};
