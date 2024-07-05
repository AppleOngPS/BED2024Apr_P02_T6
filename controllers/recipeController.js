const sql = require("mssql");
const fs = require("fs");
const path = require("path");
const dbConfig = require("../dbConfig");
const imagesDir = path.join(__dirname, "../public/images");

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
  console.log("Request body:", req.body);
  console.log("File:", req.file);

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

  try {
    const insertRequest = pool.request();
    insertRequest.input("name", sql.NVarChar, name);
    insertRequest.input("category", sql.NVarChar, category);
    insertRequest.input("description", sql.NVarChar, description);
    insertRequest.input("ingredients", sql.NVarChar, ingredients);
    insertRequest.input("calories", sql.Int, parseInt(calories));
    insertRequest.input("carbs", sql.Int, parseInt(carbs));
    insertRequest.input("protein", sql.Int, parseInt(protein));
    insertRequest.input("fats", sql.Int, parseInt(fats));
    insertRequest.input("image", sql.NVarChar, null);

    // Insert the recipe and get the inserted ID
    const result = await insertRequest.query(
      "INSERT INTO recipes (name, category, description, ingredients, calories, carbs, protein, fats, image) OUTPUT INSERTED.id VALUES (@name, @category, @description, @ingredients, @calories, @carbs, @protein, @fats, @image);"
    );

    console.log("Inserted recipe result:", result);

    const newId = result.recordset[0].id;

    if (req.file) {
      const newImageName = `recipe-${newId}.avif`;
      const oldPath = path.join(imagesDir, req.file.filename);
      const newPath = path.join(imagesDir, newImageName);

      console.log("Renaming image from", oldPath, "to", newPath);

      fs.renameSync(oldPath, newPath);

      const updateRequest = pool.request();
      updateRequest.input("image", sql.NVarChar, newImageName);
      updateRequest.input("id", sql.Int, newId);

      // Update the recipe with the new image name
      const updateResult = await updateRequest.query(
        "UPDATE recipes SET image = @image WHERE id = @id"
      );

      console.log("Updated recipe image result:", updateResult);
    }

    res.json({ id: newId, message: "Recipe added successfully" });
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
