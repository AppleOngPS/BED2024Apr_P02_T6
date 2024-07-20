const express = require("express");
const bodyParser = require("body-parser");
const sql = require("mssql");
const path = require("path");
const dbConfig = require("./dbConfig");
const cors = require("cors");
const fs = require("fs");
//const postRoutes = require("./routes/postRoutes");
const postController = require("./controllers/postController");

const usersController = require("./controllers/usersController");
const rewardsController = require("./controllers/rewardController");

const app = express();
const port = 3000;

// CRUD routes
app.post("/posts", postController.createPost);
app.get("/posts", postController.getPosts);
app.get("/posts/:id", postController.getPostById);
app.put("/posts/:id", postController.updatePost);
app.delete("/posts/:id", postController.deletePost);

module.exports = app;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Serve static files from the css directory
//app.use("/css", express.static(path.join(__dirname, "css")));

// Ensure the uploads directory exists
// const uploadsDir = path.join(__dirname, "uploads");
// if (!fs.existsSync(uploadsDir)) {
//   fs.mkdirSync(uploadsDir);
// }

//app.use("/uploads", express.static(uploadsDir));

// Routes
//app.use("/posts", postRoutes);

// Middleware to parse JSON requests
app.use(express.json());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));

// Routes to serve HTML files from the 'public/html' directory
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "html", "community.html"));
});

app.get("/community-page.html", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "html", "community-page.html"));
});

app.get("/community.html", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "html", "community.html"));
});

app.get("/quiz.html", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "html", "quiz.html"));
});

// Endpoint to fetch quiz data
app.get("/fetch_quiz", async (req, res) => {
  try {
    const questions = await postController.getQuizQuestions();
    res.json(questions);
  } catch (err) {
    console.error("Error fetching quiz questions:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Routes
app.post("/users", usersController.createUser); // Create user
app.get("/users", usersController.getAllUsers); // Get all users
app.get("/users/:id", usersController.getUserById); // Get user by ID
app.get("/users/search", usersController.searchUsers); // Search users
app.get("/login", usersController.loginUser); // Login user
app.get("/user/:userId", usersController.getUserById); // Get user details by ID
app.get("/users", usersController.getUserByName); // Get user by Name
app.put("/users", usersController.updateUser); // Update user
app.delete("/users", usersController.deleteUser); // Delete user

app.get("/rewards", rewardsController.getAllRewards); // Get all rewards
app.get("/rewards/:id", rewardsController.getRewardsById); // Get reward by ID
app.post("/redeem/:id", rewardsController.redeemReward); // Redeem reward by ID
app.delete("/rewards/:id", rewardsController.deleteReward); //delete reward

app.post("/community", postController.createPost);
app.get("/community", postController.getPosts);
app.get("/community/:id", postController.getPostById);
app.put("/community/:id", postController.updatePost);
app.delete("/community/:id", postController.deletePost);

// Serve the HTML file
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.post("/update_points", async (req, res) => {
  const { points, name } = req.body; // Use 'name' to match your database schema

  try {
    const connection = await sql.connect(dbConfig);
    const request = connection.request();
    request.input("name", sql.VarChar, name);
    request.input("points", sql.Int, points);

    // Update the point column by adding the new points to the existing points
    await request.query(
      "UPDATE AccountUser SET point = ISNULL(point, 0) + @points WHERE name = @name"
    );

    connection.close();
    res.json({ message: "Points updated successfully." });
  } catch (error) {
    console.error("Error updating points:", error);
    res.status(500).send("Failed to update points");
  }
});

// Start server and connect to database
app.listen(port, async () => {
  try {
    await sql.connect(dbConfig);
    console.log("Database connection established successfully");
  } catch (err) {
    console.error("Database connection error:", err);
    process.exit(1);
  }

  console.log(`Server listening on port ${port}`);
});

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("Server is gracefully shutting down");
  try {
    await sql.close();
    console.log("Database connection closed");
    process.exit(0);
  } catch (err) {
    console.error("Error closing database connection:", err);
    process.exit(1);
  }
});
