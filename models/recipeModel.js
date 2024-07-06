const sql = require("mssql");
const dbConfig = require("../dbConfig");

class Recipe {
  constructor(
    id,
    name,
    category,
    description,
    ingredients,
    image,
    calories,
    carbs,
    protein,
    fats
  ) {
    this.id = id;
    this.name = name;
    this.category = category;
    this.description = description;
    this.ingredients = ingredients;
    this.image = image;
    this.calories = calories;
    this.carbs = carbs;
    this.protein = protein;
    this.fats = fats;
  }

  static async getAllRecipes() {
    const connection = await sql.connect(dbConfig);
    const sqlQuery = `SELECT * FROM recipes`;
    const request = connection.request();
    const result = await request.query(sqlQuery);
    connection.close();
    return result.recordset.map(
      (row) =>
        new Recipe(
          row.id,
          row.name,
          row.category,
          row.description,
          row.ingredients,
          row.image,
          row.calories,
          row.carbs,
          row.protein,
          row.fats
        )
    );
  }

  static async getRecipeById(id) {
    const connection = await sql.connect(dbConfig);
    const sqlQuery = `SELECT * FROM recipes WHERE id = @id`;
    const request = connection.request();
    request.input("id", sql.Int, id);
    const result = await request.query(sqlQuery);
    connection.close();
    return result.recordset[0]
      ? new Recipe(
          result.recordset[0].id,
          result.recordset[0].name,
          result.recordset[0].category,
          result.recordset[0].description,
          result.recordset[0].ingredients,
          result.recordset[0].image,
          result.recordset[0].calories,
          result.recordset[0].carbs,
          result.recordset[0].protein,
          result.recordset[0].fats
        )
      : null;
  }

  static async createRecipe(newRecipe) {
    try {
      const connection = await sql.connect(dbConfig);
      const sqlQuery = `
        INSERT INTO recipes (name, category, description, ingredients, image, calories, carbs, protein, fats)
        VALUES (@name, @category, @description, @ingredients, @image, @calories, @carbs, @protein, @fats);
        SELECT SCOPE_IDENTITY() AS recipeId;
      `;
      const request = connection.request();
      request.input("name", sql.NVarChar, newRecipe.name);
      request.input("category", sql.NVarChar, newRecipe.category);
      request.input("description", sql.Text, newRecipe.description);
      request.input("ingredients", sql.Text, newRecipe.ingredients);
      request.input("image", sql.NVarChar, newRecipe.image);
      request.input("calories", sql.Int, newRecipe.calories);
      request.input("carbs", sql.Int, newRecipe.carbs);
      request.input("protein", sql.Int, newRecipe.protein);
      request.input("fats", sql.Int, newRecipe.fats);
      const result = await request.query(sqlQuery);
      connection.close();
      const recipeId = result.recordset[0].recipeId;
      return this.getRecipeById(recipeId);
    } catch (error) {
      console.error("Error creating recipe:", error);
      throw error;
    }
  }

  static async updateRecipe(id, updatedRecipe) {
    try {
      const connection = await sql.connect(dbConfig);
      const sqlQuery = `
        UPDATE recipes 
        SET name = @name, 
            category = @category,
            description = @description,
            ingredients = @ingredients,
            image = @image,
            calories = @calories,
            carbs = @carbs,
            protein = @protein,
            fats = @fats
        WHERE id = @id
      `;
      const request = connection.request();
      request.input("id", sql.Int, id);
      request.input("name", sql.NVarChar, updatedRecipe.name);
      request.input("category", sql.NVarChar, updatedRecipe.category);
      request.input("description", sql.Text, updatedRecipe.description);
      request.input("ingredients", sql.Text, updatedRecipe.ingredients);
      request.input("image", sql.NVarChar, updatedRecipe.image);
      request.input("calories", sql.Int, updatedRecipe.calories);
      request.input("carbs", sql.Int, updatedRecipe.carbs);
      request.input("protein", sql.Int, updatedRecipe.protein);
      request.input("fats", sql.Int, updatedRecipe.fats);
      await request.query(sqlQuery);
      connection.close();
      return this.getRecipeById(id); // Return updated recipe data
    } catch (error) {
      console.error("Error updating recipe:", error);
      throw error;
    }
  }

  static async deleteRecipe(id) {
    try {
      const connection = await sql.connect(dbConfig);
      const sqlQuery = `DELETE FROM recipes WHERE id = @id`;
      const request = connection.request();
      request.input("id", sql.Int, id);
      const result = await request.query(sqlQuery);
      connection.close();
      return result.rowsAffected > 0; // Indicate success based on affected rows
    } catch (error) {
      console.error("Error deleting recipe:", error);
      throw error;
    }
  }
}

module.exports = Recipe;
