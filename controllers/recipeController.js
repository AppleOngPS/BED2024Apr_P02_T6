const sql = require("mssql");
const fs = require("fs");
const path = require("path");
const dbConfig = require("../dbConfig");

let pool;
async function connectToDb() {
  if (!pool) {
    pool = await sql.connect(dbConfig);
  }
}

const getAllRecipes = async (req, res) => {
  await connectToDb();
  try {
    const request = pool.request();
    const result = await request.query("SELECT * FROM recipes;");
    console.log("Retrieved recipes:", result.recordset);
    res.json(result.recordset);
  } catch (error) {
    console.error("Error retrieving recipes:", error);
    res.status(500).json({ error: "Failed to retrieve recipes" });
  }
};

const getRecipeById = async (req, res) => {
  await connectToDb();
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
};

const createRecipe = async (req, res) => {
  await connectToDb();
  const {
    name,
    category,
    description,
    ingredients,
    calories,
    carbs,
    protein,
    fats,
  } = req.body;
  const request = pool.request();
  const maxIdResult = await request.query(
    "SELECT MAX(id) AS maxId FROM recipes"
  );
  const maxId = maxIdResult.recordset[0].maxId || 0;
  const newId = maxId + 1;

  try {
    request.input("id", sql.Int, newId);
    request.input("name", sql.NVarChar, name);
    request.input("category", sql.NVarChar, category);
    request.input("description", sql.NVarChar, description);
    request.input("ingredients", sql.NVarChar, ingredients);
    request.input("calories", sql.Int, calories);
    request.input("carbs", sql.Int, carbs);
    request.input("protein", sql.Int, protein);
    request.input("fats", sql.Int, fats);
    request.input("image", sql.NVarChar, null);

    const result = await request.query(
      "INSERT INTO recipes (id, name, category, description, ingredients, calories, carbs, protein, fats, image) VALUES (@id, @name, @category, @description, @ingredients, @calories, @carbs, @protein, @fats, @image)"
    );

    if (req.file) {
      const newImageName = `recipe-${newId}.avif`;
      const oldPath = path.join("./images", req.file.filename);
      const newPath = path.join("./images", newImageName);
      fs.renameSync(oldPath, newPath);

      await request.query("UPDATE recipes SET image = @image WHERE id = @id", {
        image: newImageName,
        id: newId,
      });
    }

    console.log("Added recipe:", result);
    res.json(result);
  } catch (error) {
    console.error("Error adding recipe:", error);
    res
      .status(500)
      .json({ error: "Failed to add recipe", details: error.message });
  }
};

const updateRecipe = async (req, res) => {
  await connectToDb();
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
};

const deleteRecipe = async (req, res) => {
  await connectToDb();
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
};

module.exports = {
  getAllRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe,
};
