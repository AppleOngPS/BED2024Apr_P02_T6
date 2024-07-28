const express = require("express");
const bodyParser = require("body-parser");
const sql = require("mssql");
const path = require("path");
const dbConfig = require("./dbConfig");
const cors = require("cors");
const fs = require("fs");
const multer = require("multer");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger-output.json"); // Import generated spec

const postController = require("./controllers/postController");
const usersController = require("./controllers/usersController");
const rewardsController = require("./controllers/rewardController");
const recipeController = require("./controllers/recipeController");
const validateRecipe = require("./middlewares/validateRecipe");

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Create images directory if it doesn't exist
const imagesDir = path.join(__dirname, "public", "images");
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, imagesDir); // Set destination folder for uploaded files
  },
  filename: function (req, file, cb) {
    // Generate unique filename for uploaded files
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage });

// Serve static files from the images directory
app.use("/public/images", express.static(imagesDir));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));
// Serve the HTML file
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});
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

// User routes
app.post("/users", usersController.createUser); // Create user
app.get("/users", usersController.getAllUsers); // Get all users
app.get("/users/:id", usersController.getUserById); // Get user by ID
app.get("/users/search", usersController.searchUsers); // Search users
app.get("/login", usersController.loginUser); // Login user
app.get("/user/:userId", usersController.getUserById); // Get user details by ID
app.put("/users", usersController.updateUser); // Update user
app.delete("/users", usersController.deleteUser); // Delete user
app.put("/users/points", usersController.updateUserPoints); // Route to update user points

// Rewards routes
app.get("/rewards", rewardsController.getAllRewards); // Get all rewards
app.get("/rewards/:id", rewardsController.getRewardsById); // Get reward by ID
app.post("/redeem/:id", rewardsController.redeemReward); // Redeem reward by ID
app.delete("/rewards/:id", rewardsController.deleteReward); // Delete reward

// Community routes
app.post("/community", postController.createPost);
app.get("/community", postController.getPosts);
app.get("/community/:id", postController.getPostById);
app.put("/community/:id", postController.updatePost);
app.delete("/community/:id", postController.deletePost);
app.post("/community/like/:id", postController.likePost);
// Add logging middleware for the /community/comment route
app.post(
  "/community/comment",
  (req, res, next) => {
    console.log("Received request to add comment"); // Log for debugging
    next();
  },
  postController.addComment
);

app.get("/community/comments/:postId", postController.getComments);
// Recipe routes
app.get("/api/recipes/random", recipeController.getRandomRecipe);
app.get("/api/recipes/count", recipeController.getRecipeCount);
app.get("/api/recipes/calories", recipeController.getRecipesByCalorieRange);
app.get("/api/recipes/nutrient", recipeController.getRecipesByNutrientRange);
app.get(
  "/api/recipes/category/:category",
  recipeController.getRecipesByCategory
);
app.get("/api/recipes/name/:name", recipeController.getRecipeByName);
app.get("/api/recipes/search", recipeController.searchRecipesByIngredient);
app.get("/api/recipes", recipeController.getAllRecipes);
app.get("/api/recipes/:id", recipeController.getRecipeById);

// POST route for creating a new recipe with image upload
app.post(
  "/api/recipes",
  upload.single("image"),
  validateRecipe,
  recipeController.createRecipe
);

// PUT route for updating an existing recipe
app.put("/api/recipes/:id", validateRecipe, recipeController.updateRecipe);

// DELETE route for removing a recipe
app.delete("/api/recipes/:id", recipeController.deleteRecipe);

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
