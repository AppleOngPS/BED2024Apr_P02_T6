const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const cors = require("cors");
const path = require("path");
const dbConfig = require("./dbConfig");
const sql = require("mssql");

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage });

let pool;

async function startServer() {
  try {
    pool = await sql.connect(dbConfig);
    console.log("Database connection established successfully");
  } catch (err) {
    console.error("Database connection error:", err);
    process.exit(1);
  }
}
startServer();

// Serve images from the uploads directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// GET all recipes
app.get("/api/recipes", async (req, res) => {
  try {
    const request = pool.request();

    const result = await request.query("SELECT * FROM recipes;");
    console.log("Retrieved recipes:", result.recordset);
    res.json(result.recordset);
  } catch (error) {
    console.error("Error retrieving recipes:", error);
    res.status(500).json({ error: "Failed to retrieve recipes" });
  }
});

// GET recipe by ID
app.get("/api/recipes/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const request = pool.request();
    request.input("id", sql.Int, id);
    const result = await request.query("SELECT * FROM recipes WHERE id = @id");
    console.log("Retrieved recipe:", result.recordset[0]);
    res.json(result.recordset[0]);
  } catch (error) {
    console.error("Error retrieving recipe:", error);
    res.status(500).json({ error: "Failed to retrieve recipe" });
  }
});

// POST a new recipe
app.post("/api/recipes", upload.single("image"), async (req, res) => {
  const { name, category, description, ingredients } = req.body;
  const image = req.file ? req.file.path : null;
  try {
    const request = pool.request();
    request.input("name", sql.NVarChar, name);
    request.input("category", sql.NVarChar, category);
    request.input("description", sql.NVarChar, description);
    request.input("ingredients", sql.NVarChar, ingredients);
    request.input("image", sql.NVarChar, image);
    const result = await request.query(
      "INSERT INTO recipes (name, category, description, ingredients, image) VALUES (@name, @category, @description, @ingredients, @image)"
    );
    console.log("Added recipe:", result);
    res.json(result);
  } catch (error) {
    console.error("Error adding recipe:", error);
    res.status(500).json({ error: "Failed to add recipe" });
  }
});

// PUT (update) a recipe by ID
app.put("/api/recipes/:id", async (req, res) => {
  const { id } = req.params;
  const { name, category, description, ingredients } = req.body;
  try {
    const request = pool.request();
    request.input("id", sql.Int, id);
    request.input("name", sql.NVarChar, name);
    request.input("category", sql.NVarChar, category);
    request.input("description", sql.NVarChar, description);
    request.input("ingredients", sql.NVarChar, ingredients);
    const result = await request.query(
      "UPDATE recipes SET name = @name, category = @category, description = @description, ingredients = @ingredients WHERE id = @id"
    );
    console.log("Updated recipe:", result);
    res.json(result);
  } catch (error) {
    console.error("Error updating recipe:", error);
    res.status(500).json({ error: "Failed to update recipe" });
  }
});

// DELETE a recipe by ID
app.delete("/api/recipes/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const request = pool.request();
    request.input("id", sql.Int, id);
    const result = await request.query("DELETE FROM recipes WHERE id = @id");
    console.log("Deleted recipe:", result);
    res.json(result);
  } catch (error) {
    console.error("Error deleting recipe:", error);
    res.status(500).json({ error: "Failed to delete recipe" });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
