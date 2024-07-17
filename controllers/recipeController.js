const sql = require("mssql");
const fs = require("fs");
const path = require("path");
const dbConfig = require("../dbConfig");
const imagesDir = path.join(__dirname, "../public/images");

let pool;
// Use a singleton pattern for database connection to avoid multiple connections
async function connectToDb() {
  if (!pool) {
    pool = await sql.connect(dbConfig);
  }
}

const getAllRecipes = async (req, res) => {
  await connectToDb();
  try {
    // Implement pagination to limit the number of results and improve performance
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 16;
    const offset = (page - 1) * limit;

    const request = pool.request();
    request.input("offset", sql.Int, offset);
    request.input("limit", sql.Int, limit);

    // Get total count for pagination metadata
    const countResult = await request.query(
      "SELECT COUNT(*) AS totalCount FROM recipes"
    );
    const totalCount = countResult.recordset[0].totalCount;

    // Use OFFSET-FETCH for efficient pagination in SQL Server
    const result = await request.query(`
      SELECT * FROM recipes
      ORDER BY id
      OFFSET @offset ROWS
      FETCH NEXT @limit ROWS ONLY
    `);

    // Return pagination metadata along with the results
    res.json({
      recipes: result.recordset,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
      totalRecipes: totalCount,
    });
  } catch (error) {
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
    res.json(result.recordset[0]);
  } catch (error) {
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

  try {
    // Check for existing recipe with the same name to avoid duplicates
    const checkRequest = pool.request();
    checkRequest.input("name", sql.NVarChar, name.toLowerCase());
    const checkResult = await checkRequest.query(
      "SELECT COUNT(*) AS count FROM recipes WHERE LOWER(name) = @name"
    );

    if (checkResult.recordset[0].count > 0) {
      return res.status(409).json({
        error: "A recipe with this name already exists in the database.",
      });
    }

    // Insert new recipe
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

    const result = await insertRequest.query(
      "INSERT INTO recipes (name, category, description, ingredients, calories, carbs, protein, fats, image) OUTPUT INSERTED.id VALUES (@name, @category, @description, @ingredients, @calories, @carbs, @protein, @fats, @image);"
    );

    const newId = result.recordset[0].id;

    // Handle image upload if provided
    if (req.file) {
      const newImageName = `recipe-${newId}.avif`;
      const oldPath = path.join(imagesDir, req.file.filename);
      const newPath = path.join(imagesDir, newImageName);

      fs.renameSync(oldPath, newPath);

      // Update the recipe with the new image name
      const updateRequest = pool.request();
      updateRequest.input("image", sql.NVarChar, newImageName);
      updateRequest.input("id", sql.Int, newId);
      await updateRequest.query(
        "UPDATE recipes SET image = @image WHERE id = @id"
      );
    }

    res.json({ id: newId, message: "Recipe added successfully" });
  } catch (error) {
    // Clean up uploaded file if an error occurs during recipe creation
    if (req.file) {
      const filePath = path.join(imagesDir, req.file.filename);
      fs.unlink(filePath, (err) => {
        if (err) console.error("Error deleting uploaded file:", err);
      });
    }
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
    res.json(result);
  } catch (error) {
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
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to delete recipe" });
  }
};

const getRecipeByName = async (req, res) => {
  await connectToDb();
  const { name } = req.params;
  try {
    const request = pool.request();
    request.input("name", sql.NVarChar, name);
    // Use LIKE for partial name matching
    const result = await request.query(
      "SELECT TOP 1 * FROM recipes WHERE name LIKE @name + '%'"
    );
    if (result.recordset.length === 0) {
      res.status(404).json({ error: "Recipe not found" });
    } else {
      res.json(result.recordset[0]);
    }
  } catch (error) {
    console.error("Error in getRecipeByName:", error);
    res.status(500).json({ error: "Failed to retrieve recipe" });
  }
};

const getRecipesByCategory = async (req, res) => {
  await connectToDb();
  const { category } = req.params;
  try {
    // Implement pagination for category-based results
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 16;
    const offset = (page - 1) * limit;

    const request = pool.request();
    request.input("category", sql.NVarChar, category);
    request.input("offset", sql.Int, offset);
    request.input("limit", sql.Int, limit);

    // Get total count for pagination metadata
    const countResult = await request.query(`
      SELECT COUNT(*) AS totalCount 
      FROM recipes 
      WHERE category = @category
    `);
    const totalCount = countResult.recordset[0].totalCount;

    // Use OFFSET-FETCH for efficient pagination in SQL Server
    const result = await request.query(`
      SELECT * FROM recipes
      WHERE category = @category
      ORDER BY id
      OFFSET @offset ROWS
      FETCH NEXT @limit ROWS ONLY
    `);

    // Return pagination metadata along with the results
    res.json({
      recipes: result.recordset,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
      totalRecipes: totalCount,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve recipes" });
  }
};

const getRandomRecipe = async (req, res) => {
  try {
    await connectToDb();
    const request = pool.request();
    // Use NEWID() for random selection in SQL Server
    const result = await request.query(
      "SELECT TOP 1 * FROM recipes ORDER BY NEWID()"
    );
    if (result.recordset.length === 0) {
      res.status(404).json({ error: "No recipes found" });
    } else {
      res.json(result.recordset[0]);
    }
  } catch (error) {
    console.error("Error in getRandomRecipe:", error);
    res.status(500).json({
      error: "Failed to retrieve random recipe",
      details: error.message,
    });
  }
};

const getRecipeCount = async (req, res) => {
  try {
    await connectToDb();
    const request = pool.request();
    const result = await request.query("SELECT COUNT(*) AS count FROM recipes");
    res.json({ count: result.recordset[0].count });
  } catch (error) {
    console.error("Error in getRecipeCount:", error);
    res.status(500).json({
      error: "Failed to retrieve recipe count",
      details: error.message,
    });
  }
};

const getRecipesByCalorieRange = async (req, res) => {
  await connectToDb();
  const { min, max, page = 1, limit = 16 } = req.query;
  const offset = (page - 1) * limit;

  // Validate input parameters
  if (!min && !max) {
    return res.status(400).json({
      error: "Please provide at least the minimum or maximum calorie value.",
    });
  }
  if ((min && !max) || (!min && max)) {
    return res.status(400).json({
      error:
        "Please provide both minimum and maximum calorie values for a range search.",
    });
  }

  try {
    const request = pool.request();
    request.input("min", sql.Int, parseInt(min));
    request.input("max", sql.Int, parseInt(max));
    request.input("offset", sql.Int, offset);
    request.input("limit", sql.Int, parseInt(limit));

    // Get total count for pagination metadata
    const countResult = await request.query(
      "SELECT COUNT(*) AS totalCount FROM recipes WHERE calories BETWEEN @min AND @max"
    );
    const totalCount = countResult.recordset[0].totalCount;

    // Use OFFSET-FETCH for efficient pagination in SQL Server
    const result = await request.query(
      `SELECT * FROM recipes 
       WHERE calories BETWEEN @min AND @max 
       ORDER BY id 
       OFFSET @offset ROWS 
       FETCH NEXT @limit ROWS ONLY`
    );

    // Return pagination metadata along with the results
    res.json({
      recipes: result.recordset,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalCount / limit),
      totalRecipes: totalCount,
    });
  } catch (error) {
    console.error("Error in getRecipesByCalorieRange:", error);
    res.status(500).json({ error: "Failed to retrieve recipes" });
  }
};

const getRecipesByNutrientRange = async (req, res) => {
  await connectToDb();
  const { nutrient, min, max, page = 1, limit = 16 } = req.query;

  // Validate input parameters
  if (!min && !max) {
    return res.status(400).json({
      error: "Please provide the minimum and maximum nutrient value.",
    });
  }
  if ((min && !max) || (!min && max)) {
    return res.status(400).json({
      error: `Please provide both minimum and maximum ${nutrient} values for a range search.`,
    });
  }

  const offset = (page - 1) * limit;

  try {
    const request = pool.request();
    request.input("min", sql.Int, parseInt(min));
    request.input("max", sql.Int, parseInt(max));
    request.input("offset", sql.Int, offset);
    request.input("limit", sql.Int, parseInt(limit));

    // Validate nutrient parameter
    const validNutrients = ["calories", "carbs", "protein", "fats"];
    if (!validNutrients.includes(nutrient)) {
      return res.status(400).json({ error: "Invalid nutrient specified" });
    }

    // Get total count for pagination metadata
    const countResult = await request.query(
      `SELECT COUNT(*) AS totalCount FROM recipes WHERE ${nutrient} BETWEEN @min AND @max`
    );
    const totalCount = countResult.recordset[0].totalCount;

    // Use OFFSET-FETCH for efficient pagination in SQL Server
    const result = await request.query(
      `SELECT * FROM recipes 
       WHERE ${nutrient} BETWEEN @min AND @max 
       ORDER BY id 
       OFFSET @offset ROWS 
       FETCH NEXT @limit ROWS ONLY`
    );

    // Return pagination metadata along with the results
    res.json({
      recipes: result.recordset,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalCount / limit),
      totalRecipes: totalCount,
    });
  } catch (error) {
    console.error("Error in getRecipesByNutrientRange:", error);
    res.status(500).json({ error: "Failed to retrieve recipes" });
  }
};

const searchRecipesByIngredient = async (req, res) => {
  await connectToDb();
  const { ingredient, page = 1, limit = 16 } = req.query;

  // Validate input parameters
  if (!ingredient || ingredient.trim() === "") {
    return res
      .status(400)
      .json({ error: "Please provide an ingredient to search for." });
  }

  const offset = (page - 1) * limit;

  try {
    console.log("Searching for ingredient:", ingredient);
    const request = pool.request();
    request.input("ingredient", sql.NVarChar, `%${ingredient.trim()}%`);
    request.input("offset", sql.Int, offset);
    request.input("limit", sql.Int, parseInt(limit));

    // Get total count for pagination metadata
    const countQuery = `
      SELECT COUNT(*) AS totalCount FROM recipes 
      WHERE description LIKE '%' + @ingredient + '%'
      OR EXISTS (
        SELECT value 
        FROM STRING_SPLIT(CAST(ingredients AS NVARCHAR(MAX)), ',') 
        WHERE TRIM(value) LIKE '%' + @ingredient + '%'
      )
    `;
    const countResult = await request.query(countQuery);
    const totalCount = countResult.recordset[0].totalCount;

    // Use OFFSET-FETCH for efficient pagination in SQL Server
    // Search in both description and ingredients fields
    const query = ` 
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
    console.log("Executing query:", query);
    const result = await request.query(query);
    console.log("Query result:", result);
    //pagination math for this function
    res.json({
      recipes: result.recordset,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalCount / parseInt(limit)),
      totalRecipes: totalCount,
    });
    //error handling if there is any internal server error
  } catch (error) {
    console.error("Error in searchRecipesByIngredient:", error);
    res.status(500).json({
      error: "Failed to search recipes",
      details: error.message,
      stack: error.stack,
    });
  }
};

module.exports = {
  getAllRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  getRecipeByName,
  getRecipesByCategory,
  getRandomRecipe,
  getRecipeCount,
  getRecipesByCalorieRange,
  getRecipesByNutrientRange,
  searchRecipesByIngredient,
};
