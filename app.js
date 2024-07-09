// const express = require("express");
// const bodyParser = require("body-parser");
// const multer = require("multer");
// const cors = require("cors");
// const path = require("path");
// const fs = require("fs");
// const dbConfig = require("./dbConfig");
// const sql = require("mssql");

// const app = express();
// const port = 3000;

// app.use(cors());
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

// // Ensure images directory exists
// const imagesDir = "./images";
// if (!fs.existsSync(imagesDir)) {
//   fs.mkdirSync(imagesDir, { recursive: true });
// }

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, imagesDir);
//   },
//   filename: function (req, file, cb) {
//     cb(
//       null,
//       file.fieldname + "-" + Date.now() + path.extname(file.originalname)
//     );
//   },
// });

// const upload = multer({ storage: storage });

// let pool;

// async function startServer() {
//   try {
//     pool = await sql.connect(dbConfig);
//     console.log("Database connection established successfully");
//   } catch (err) {
//     console.error("Database connection error:", err);
//     process.exit(1);
//   }
// }
// startServer();

// // Serve images from the images directory
// app.use("/images", express.static(imagesDir));

// // GET all recipes
// app.get("/api/recipes", async (req, res) => {
//   try {
//     const request = pool.request();

//     const result = await request.query("SELECT * FROM recipes;");
//     console.log("Retrieved recipes:", result.recordset);
//     res.json(result.recordset);
//   } catch (error) {
//     console.error("Error retrieving recipes:", error);
//     res.status(500).json({ error: "Failed to retrieve recipes" });
//   }
// });

// // GET recipe by ID
// app.get("/api/recipes/:id", async (req, res) => {
//   const { id } = req.params;
//   try {
//     const request = pool.request();
//     request.input("id", sql.Int, id);
//     const result = await request.query("SELECT * FROM recipes WHERE id = @id");
//     console.log("Retrieved recipe:", result.recordset[0]);
//     res.json(result.recordset[0]);
//   } catch (error) {
//     console.error("Error retrieving recipe:", error);
//     res.status(500).json({ error: "Failed to retrieve recipe" });
//   }
// });

// // POST a new recipe
// app.post("/api/recipes", upload.single("image"), async (req, res) => {
//   const {
//     name,
//     category,
//     description,
//     ingredients,
//     calories,
//     carbs,
//     protein,
//     fats,
//   } = req.body;

//   const request = pool.request();

//   // Get the current max ID
//   const maxIdResult = await request.query(
//     "SELECT MAX(id) AS maxId FROM recipes"
//   );
//   const maxId = maxIdResult.recordset[0].maxId || 0;
//   const newId = maxId + 1;

//   try {
//     const request = pool.request();

//     request.input("id", sql.Int, newId);
//     request.input("name", sql.NVarChar, name);
//     request.input("category", sql.NVarChar, category);
//     request.input("description", sql.NVarChar, description);
//     request.input("ingredients", sql.NVarChar, ingredients);
//     request.input("calories", sql.Int, calories);
//     request.input("carbs", sql.Int, carbs);
//     request.input("protein", sql.Int, protein);
//     request.input("fats", sql.Int, fats);
//     request.input("image", sql.NVarChar, null); // Initially, set image to null

//     // Insert the recipe without the image
//     const result = await request.query(
//       "INSERT INTO recipes (name, category, description, ingredients, calories, carbs, protein, fats, image) OUTPUT INSERTED.id VALUES (@name, @category, @description, @ingredients, @calories, @carbs, @protein, @fats, @image)"
//     );

//     if (req.file) {
//       const newImageName = `recipe-${newId}.avif`;
//       const oldPath = path.join(imagesDir, req.file.filename);
//       const newPath = path.join(imagesDir, newImageName);

//       fs.renameSync(oldPath, newPath); // Rename the file to the new image name

//       // Update the recipe with the new image name
//       await request.query("UPDATE recipes SET image = @image WHERE id = @id", {
//         image: newImageName,
//         id: newId,
//       });
//     }

//     console.log("Added recipe:", result);
//     res.json(result);
//   } catch (error) {
//     console.error("Error adding recipe:", error);
//     res
//       .status(500)
//       .json({ error: "Failed to add recipe", details: error.message });
//   }
// });

// // PUT (update) a recipe by ID
// app.put("/api/recipes/:id", async (req, res) => {
//   const { id } = req.params;
//   const { name, category, description, ingredients } = req.body;
//   try {
//     const request = pool.request();
//     request.input("id", sql.Int, id);
//     request.input("name", sql.NVarChar, name);
//     request.input("category", sql.NVarChar, category);
//     request.input("description", sql.NVarChar, description);
//     request.input("ingredients", sql.NVarChar, ingredients);
//     const result = await request.query(
//       "UPDATE recipes SET name = @name, category = @category, description = @description, ingredients = @ingredients WHERE id = @id"
//     );
//     console.log("Updated recipe:", result);
//     res.json(result);
//   } catch (error) {
//     console.error("Error updating recipe:", error);
//     res.status(500).json({ error: "Failed to update recipe" });
//   }
// });

// // DELETE a recipe by ID
// app.delete("/api/recipes/:id", async (req, res) => {
//   const { id } = req.params;
//   try {
//     const request = pool.request();
//     request.input("id", sql.Int, id);
//     const result = await request.query("DELETE FROM recipes WHERE id = @id");
//     console.log("Deleted recipe:", result);
//     res.json(result);
//   } catch (error) {
//     console.error("Error deleting recipe:", error);
//     res.status(500).json({ error: "Failed to delete recipe" });
//   }
// });

// app.listen(port, () => {
//   console.log(`Server running on port ${port}`);
// });
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

app.get("/api/recipes/search", recipeController.searchRecipesByIngredient);

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
