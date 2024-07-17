const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const recipeController = require("./controllers/recipeController");
const validateRecipe = require("./middlewares/validateRecipe");
const sql = require("mssql");

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const imagesDir = path.join(__dirname, "public", "images");
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, imagesDir);
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage });

app.use("/public/images", express.static(imagesDir));

// Existing routes
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

app.post(
  "/api/recipes",
  upload.single("image"),
  validateRecipe,
  recipeController.createRecipe
);
app.put("/api/recipes/:id", validateRecipe, recipeController.updateRecipe);
app.delete("/api/recipes/:id", recipeController.deleteRecipe);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

process.on("SIGINT", async () => {
  try {
    await sql.close();
    process.exit(0);
  } catch (err) {
    process.exit(1);
  }
});
