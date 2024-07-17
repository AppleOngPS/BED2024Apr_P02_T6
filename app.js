// Import required modules
const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const recipeController = require("./controllers/recipeController");
const validateRecipe = require("./middlewares/validateRecipe");
const sql = require("mssql");

// Initialize Express app
const app = express();
const port = 3000;

// Middleware setup
app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.json()); // Parse JSON request bodies
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded request bodies

// Create images directory if it doesn't exist
const imagesDir = path.join(__dirname, "public", "images");
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

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

// Define API routes
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
  upload.single("image"), // Handle single file upload with field name "image"
  validateRecipe, // Middleware to validate recipe data
  recipeController.createRecipe
);

// PUT route for updating an existing recipe
app.put("/api/recipes/:id", validateRecipe, recipeController.updateRecipe);

// DELETE route for removing a recipe
app.delete("/api/recipes/:id", recipeController.deleteRecipe);

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

// Graceful shutdown: close SQL connection on SIGINT (Ctrl+C)
process.on("SIGINT", async () => {
  try {
    await sql.close();
    process.exit(0);
  } catch (err) {
    process.exit(1);
  }
});
