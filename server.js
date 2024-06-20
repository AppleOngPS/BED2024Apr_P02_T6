const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const cors = require("cors");
const path = require("path");
const db = require("./js/dbConfig");

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

// CRUD operations for recipes

// GET all recipes
app.get("/api/recipes", (req, res) => {
  const sql = "SELECT * FROM recipes";
  db.query(sql, (err, result) => {
    if (err) {
      console.error("Error fetching recipes:", err);
      res.status(500).send("Error fetching recipes");
      return;
    }
    res.send(result);
  });
});

// GET recipe by ID
app.get("/api/recipes/:id", (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM recipes WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Error fetching recipe:", err);
      res.status(500).send("Error fetching recipe");
      return;
    }
    res.send(result[0]);
  });
});

// POST a new recipe
app.post("/api/recipes", upload.single("image"), (req, res) => {
  const { name, category, description, ingredients } = req.body;
  const image = req.file ? req.file.path : null;
  const sql =
    "INSERT INTO recipes (name, category, description, ingredients, image) VALUES (?, ?, ?, ?, ?)";
  db.query(
    sql,
    [name, category, description, ingredients, image],
    (err, result) => {
      if (err) {
        console.error("Error adding recipe:", err);
        res.status(500).send("Error adding recipe");
        return;
      }
      res.send(result);
    }
  );
});

// PUT (update) a recipe by ID
app.put("/api/recipes/:id", (req, res) => {
  const { id } = req.params;
  const { name, category, description, ingredients } = req.body;
  const sql =
    "UPDATE recipes SET name = ?, category = ?, description = ?, ingredients = ? WHERE id = ?";
  db.query(
    sql,
    [name, category, description, ingredients, id],
    (err, result) => {
      if (err) {
        console.error("Error updating recipe:", err);
        res.status(500).send("Error updating recipe");
        return;
      }
      res.send(result);
    }
  );
});

// DELETE a recipe by ID
app.delete("/api/recipes/:id", (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM recipes WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Error deleting recipe:", err);
      res.status(500).send("Error deleting recipe");
      return;
    }
    res.send(result);
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
