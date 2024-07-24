const sql = require("mssql");
const User = require("../models/users");
const dbConfig = require("../dbConfig");

const createUser = async (req, res) => {
  try {
    const {
      name,
      password,
      email,
      contactNumber,
      age,
      height,
      weight,
      weightGoal,
      TargetCalarieIntake,
    } = req.body;
    const newUser = await User.createUserAccount({
      name,
      password,
      email,
      contactNumber,
      age,
      height,
      weight,
      weightGoal,
      TargetCalarieIntake,
    });
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
    res
      .status(500)
      .json({ message: "Error retrieving user", error: error.message });
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
  const { name, password } = req.query;
  try {
    const user = await User.getUserByNameAndPassword(name, password);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getUserByName = async (req, res) => {
  const { name } = req.query;
  try {
    const user = await User.getUserByName(name); // Implement this method in your User model

    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Error retrieving user by name:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateUser = async (req, res) => {
  try {
    const { name } = req.body; // Assuming you use name to identify the user to update
    const updateUserDetails = req.body;
    const updatedUser = await User.updateUserAccount(name, updateUserDetails);
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error updating user");
  }
};

const deleteUser = async (req, res) => {
  try {
    const { name, password } = req.query; // Extracting name and password from query parameters

    const connection = await sql.connect(dbConfig);
    const sqlQuery = `DELETE FROM AccountUser WHERE name = @name AND password = @password`;
    const request = connection.request();
    request.input("name", sql.NVarChar, name);
    request.input("password", sql.NVarChar, password);
    const result = await request.query(sqlQuery);

    connection.close();

    if (result.rowsAffected > 0) {
      res.status(204).send(); // Return 204 No Content for successful deletion
    } else {
      res.status(404).send("User not found"); // Return 404 Not Found if user does not exist
    }
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).send("Error deleting user");
  }
};


const updateUserPoints = async (req, res) => {
  const { id, name, point } = req.body;

  console.log('Received request to update points:', req.body);

  // Validate inputs
  if ((!id && !name) || !Number.isInteger(Number(point))) {
    return res.status(400).json({ error: "Invalid input data" });
  }

  try {
    // Case when `id` is provided
    if (id) {
      const connection = await sql.connect(dbConfig);
      const request = connection.request();
      request.input("id", sql.Int, Number(id));
      request.input("point", sql.Int, point);

      const result = await request.query(`
        UPDATE AccountUser
        SET point = ISNULL(point, 0) + @point
        WHERE id = @id
      `);

      console.log("Query executed successfully:", result);
      res.json({ success: true, result });
    }
    // Case when `name` is provided
    else if (name) {
      const success = await User.updateUserPoints(name, point);
      if (success) {
        res.status(200).json({ message: 'Points updated successfully' });
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    } else {
      res.status(400).json({ error: "Invalid input data" });
    }
  } catch (error) {
    console.error('Error updating points:', error);
    res.status(500).json({ message: 'Internal server error', details: error.message });
  }
};
module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  searchUsers,
  loginUser,
  getUserByName,
  updateUser,
  deleteUser,
  updateUserPoints,
};
