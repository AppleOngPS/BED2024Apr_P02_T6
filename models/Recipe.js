const express = require("express");
const sql = require("mssql");
const dbConfig = require("../dbConfig");

class Recipe {
  constructor(
    id,
    name,
    category,
    description,
    ingredients,
    calories,
    carbs,
    protein,
    fats,
    image
  ) {
    this.id = id;
    this.name = name;
    this.category = category;
    this.description = description;
    this.ingredients = ingredients;
    this.calories = calories;
    this.carbs = carbs;
    this.protein = protein;
    this.fats = fats;
    this.image = image;
  }

  static async getAllRecipes(page = 1, limit = 16) {
    const connection = await sql.connect(dbConfig);
    const offset = (page - 1) * limit;

    const countQuery = `SELECT COUNT(*) AS totalCount FROM recipes`;
    const countRequest = connection.request();
    const countResult = await countRequest.query(countQuery);
    const totalCount = countResult.recordset[0].totalCount;

    const sqlQuery = `
      SELECT * FROM recipes
      ORDER BY id
      OFFSET @offset ROWS
      FETCH NEXT @limit ROWS ONLY
    `;

    const request = connection.request();
    request.input("offset", sql.Int, offset);
    request.input("limit", sql.Int, limit);
    const result = await request.query(sqlQuery);

    connection.close();

    return {
      recipes: result.recordset.map(
        (row) =>
          new Recipe(
            row.id,
            row.name,
            row.category,
            row.description,
            row.ingredients,
            row.calories,
            row.carbs,
            row.protein,
            row.fats,
            row.image
          )
      ),
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
      totalRecipes: totalCount,
    };
  }

  static async getRecipeById(id) {
    const connection = await sql.connect(dbConfig);

    const sqlQuery = `SELECT * FROM recipes WHERE id = @id`;

    const request = connection.request();
    request.input("id", sql.Int, id);
    const result = await request.query(sqlQuery);

    connection.close();

    if (result.recordset[0]) {
      const row = result.recordset[0];
      return new Recipe(
        row.id,
        row.name,
        row.category,
        row.description,
        row.ingredients,
        row.calories,
        row.carbs,
        row.protein,
        row.fats,
        row.image
      );
    }
    return null;
  }

  static async createRecipe(newRecipeData) {
    const connection = await sql.connect(dbConfig);

    const sqlQuery = `
      INSERT INTO recipes (name, category, description, ingredients, calories, carbs, protein, fats, image)
      VALUES (@name, @category, @description, @ingredients, @calories, @carbs, @protein, @fats, @image);
      SELECT SCOPE_IDENTITY() AS id;
    `;

    const request = connection.request();
    request.input("name", sql.NVarChar, newRecipeData.name);
    request.input("category", sql.NVarChar, newRecipeData.category);
    request.input("description", sql.NVarChar, newRecipeData.description);
    request.input("ingredients", sql.NVarChar, newRecipeData.ingredients);
    request.input("calories", sql.Int, newRecipeData.calories);
    request.input("carbs", sql.Int, newRecipeData.carbs);
    request.input("protein", sql.Int, newRecipeData.protein);
    request.input("fats", sql.Int, newRecipeData.fats);
    request.input("image", sql.NVarChar, newRecipeData.image);

    const result = await request.query(sqlQuery);

    connection.close();

    return this.getRecipeById(result.recordset[0].id);
  }

  static async updateRecipe(id, updatedRecipeData) {
    const connection = await sql.connect(dbConfig);

    const sqlQuery = `
      UPDATE recipes 
      SET name = @name, category = @category, description = @description, 
          ingredients = @ingredients, calories = @calories, carbs = @carbs, 
          protein = @protein, fats = @fats, image = @image
      WHERE id = @id
    `;

    const request = connection.request();
    request.input("id", sql.Int, id);
    request.input("name", sql.NVarChar, updatedRecipeData.name);
    request.input("category", sql.NVarChar, updatedRecipeData.category);
    request.input("description", sql.NVarChar, updatedRecipeData.description);
    request.input("ingredients", sql.NVarChar, updatedRecipeData.ingredients);
    request.input("calories", sql.Int, updatedRecipeData.calories);
    request.input("carbs", sql.Int, updatedRecipeData.carbs);
    request.input("protein", sql.Int, updatedRecipeData.protein);
    request.input("fats", sql.Int, updatedRecipeData.fats);
    request.input("image", sql.NVarChar, updatedRecipeData.image);

    await request.query(sqlQuery);

    connection.close();

    return this.getRecipeById(id);
  }

  static async deleteRecipe(id) {
    const connection = await sql.connect(dbConfig);

    const sqlQuery = `DELETE FROM recipes WHERE id = @id`;

    const request = connection.request();
    request.input("id", sql.Int, id);
    const result = await request.query(sqlQuery);

    connection.close();

    return result.rowsAffected > 0;
  }

  static async getRecipesByCategory(category, page = 1, limit = 16) {
    const connection = await sql.connect(dbConfig);
    const offset = (page - 1) * limit;

    const countQuery = `SELECT COUNT(*) AS totalCount FROM recipes WHERE category = @category`;
    const countRequest = connection.request();
    countRequest.input("category", sql.NVarChar, category);
    const countResult = await countRequest.query(countQuery);
    const totalCount = countResult.recordset[0].totalCount;

    const sqlQuery = `
      SELECT * FROM recipes
      WHERE category = @category
      ORDER BY id
      OFFSET @offset ROWS
      FETCH NEXT @limit ROWS ONLY
    `;

    const request = connection.request();
    request.input("category", sql.NVarChar, category);
    request.input("offset", sql.Int, offset);
    request.input("limit", sql.Int, limit);
    const result = await request.query(sqlQuery);

    connection.close();

    return {
      recipes: result.recordset.map(
        (row) =>
          new Recipe(
            row.id,
            row.name,
            row.category,
            row.description,
            row.ingredients,
            row.calories,
            row.carbs,
            row.protein,
            row.fats,
            row.image
          )
      ),
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
      totalRecipes: totalCount,
    };
  }

  static async getRecipesByCalorieRange(min, max, page = 1, limit = 16) {
    const connection = await sql.connect(dbConfig);
    const offset = (page - 1) * limit;

    const countQuery = `SELECT COUNT(*) AS totalCount FROM recipes WHERE calories BETWEEN @min AND @max`;
    const countRequest = connection.request();
    countRequest.input("min", sql.Int, min);
    countRequest.input("max", sql.Int, max);
    const countResult = await countRequest.query(countQuery);
    const totalCount = countResult.recordset[0].totalCount;

    const sqlQuery = `
      SELECT * FROM recipes
      WHERE calories BETWEEN @min AND @max
      ORDER BY id
      OFFSET @offset ROWS
      FETCH NEXT @limit ROWS ONLY
    `;

    const request = connection.request();
    request.input("min", sql.Int, min);
    request.input("max", sql.Int, max);
    request.input("offset", sql.Int, offset);
    request.input("limit", sql.Int, limit);
    const result = await request.query(sqlQuery);

    connection.close();

    return {
      recipes: result.recordset.map(
        (row) =>
          new Recipe(
            row.id,
            row.name,
            row.category,
            row.description,
            row.ingredients,
            row.calories,
            row.carbs,
            row.protein,
            row.fats,
            row.image
          )
      ),
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
      totalRecipes: totalCount,
    };
  }

  static async searchRecipesByIngredient(ingredient, page = 1, limit = 16) {
    const connection = await sql.connect(dbConfig);
    const offset = (page - 1) * limit;

    const countQuery = `
      SELECT COUNT(*) AS totalCount FROM recipes 
      WHERE description LIKE '%' + @ingredient + '%'
      OR EXISTS (
        SELECT value 
        FROM STRING_SPLIT(CAST(ingredients AS NVARCHAR(MAX)), ',') 
        WHERE TRIM(value) LIKE '%' + @ingredient + '%'
      )
    `;
    const countRequest = connection.request();
    countRequest.input("ingredient", sql.NVarChar, `%${ingredient.trim()}%`);
    const countResult = await countRequest.query(countQuery);
    const totalCount = countResult.recordset[0].totalCount;

    const sqlQuery = `
      SELECT * FROM recipes 
      WHERE description LIKE '%' + @ingredient + '%'
      OR EXISTS (
        SELECT value 
        FROM STRING_SPLIT(CAST(ingredients AS NVARCHAR(MAX)), ',') 
        WHERE TRIM(value) LIKE '%' + @ingredient + '%'
      )
      ORDER BY id
      OFFSET @offset ROWS
      FETCH NEXT @limit ROWS ONLY
    `;

    const request = connection.request();
    request.input("ingredient", sql.NVarChar, `%${ingredient.trim()}%`);
    request.input("offset", sql.Int, offset);
    request.input("limit", sql.Int, limit);
    const result = await request.query(sqlQuery);

    connection.close();

    return {
      recipes: result.recordset.map(
        (row) =>
          new Recipe(
            row.id,
            row.name,
            row.category,
            row.description,
            row.ingredients,
            row.calories,
            row.carbs,
            row.protein,
            row.fats,
            row.image
          )
      ),
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
      totalRecipes: totalCount,
    };
  }

  static async getRandomRecipe() {
    const connection = await sql.connect(dbConfig);

    const sqlQuery = `SELECT TOP 1 * FROM recipes ORDER BY NEWID()`;

    const request = connection.request();
    const result = await request.query(sqlQuery);

    connection.close();

    if (result.recordset[0]) {
      const row = result.recordset[0];
      return new Recipe(
        row.id,
        row.name,
        row.category,
        row.description,
        row.ingredients,
        row.calories,
        row.carbs,
        row.protein,
        row.fats,
        row.image
      );
    }
    return null;
  }

  static async getRecipeCount() {
    const connection = await sql.connect(dbConfig);

    const sqlQuery = `SELECT COUNT(*) AS count FROM recipes`;

    const request = connection.request();
    const result = await request.query(sqlQuery);

    connection.close();

    return result.recordset[0].count;
  }
}

module.exports = Recipe;
