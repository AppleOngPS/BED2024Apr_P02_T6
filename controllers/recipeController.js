// const sql = require("mssql");
// const fs = require("fs");
// const path = require("path");
// const dbConfig = require("../dbConfig");
// const imagesDir = path.join(__dirname, "../public/images");

// let pool;
// async function connectToDb() {
//   if (!pool) {
//     pool = await sql.connect(dbConfig);
//   }
// }

// const getAllRecipes = async (req, res) => {
//   await connectToDb();
//   try {
//     const request = pool.request();
//     const result = await request.query("SELECT * FROM recipes;");
//     console.log("Retrieved recipes:", result.recordset);
//     res.json(result.recordset);
//   } catch (error) {
//     console.error("Error retrieving recipes:", error);
//     res.status(500).json({ error: "Failed to retrieve recipes" });
//   }
// };

// const getRecipeById = async (req, res) => {
//   await connectToDb();
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
// };

// const createRecipe = async (req, res) => {
//   await connectToDb();
//   console.log("Request body:", req.body);
//   console.log("File:", req.file);

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

//   try {
//     // Check if a recipe with the same name already exists (case-insensitive)
//     const checkRequest = pool.request();
//     checkRequest.input("name", sql.NVarChar, name.toLowerCase());
//     const checkResult = await checkRequest.query(
//       "SELECT COUNT(*) AS count FROM recipes WHERE LOWER(name) = @name"
//     );

//     if (checkResult.recordset[0].count > 0) {
//       return res
//         .status(409)
//         .json({
//           error: "A recipe with this name already exists in the database.",
//         });
//     }

//     // If the name is unique, proceed with adding the recipe
//     const insertRequest = pool.request();
//     insertRequest.input("name", sql.NVarChar, name);
//     insertRequest.input("category", sql.NVarChar, category);
//     insertRequest.input("description", sql.NVarChar, description);
//     insertRequest.input("ingredients", sql.NVarChar, ingredients);
//     insertRequest.input("calories", sql.Int, parseInt(calories));
//     insertRequest.input("carbs", sql.Int, parseInt(carbs));
//     insertRequest.input("protein", sql.Int, parseInt(protein));
//     insertRequest.input("fats", sql.Int, parseInt(fats));
//     insertRequest.input("image", sql.NVarChar, null);

//     // Insert the recipe and get the inserted ID
//     const result = await insertRequest.query(
//       "INSERT INTO recipes (name, category, description, ingredients, calories, carbs, protein, fats, image) OUTPUT INSERTED.id VALUES (@name, @category, @description, @ingredients, @calories, @carbs, @protein, @fats, @image);"
//     );

//     console.log("Inserted recipe result:", result);

//     const newId = result.recordset[0].id;

//     if (req.file) {
//       const newImageName = `recipe-${newId}.avif`;
//       const oldPath = path.join(imagesDir, req.file.filename);
//       const newPath = path.join(imagesDir, newImageName);

//       console.log("Renaming image from", oldPath, "to", newPath);

//       fs.renameSync(oldPath, newPath);

//       const updateRequest = pool.request();
//       updateRequest.input("image", sql.NVarChar, newImageName);
//       updateRequest.input("id", sql.Int, newId);

//       // Update the recipe with the new image name
//       const updateResult = await updateRequest.query(
//         "UPDATE recipes SET image = @image WHERE id = @id"
//       );

//       console.log("Updated recipe image result:", updateResult);
//     }

//     res.json({ id: newId, message: "Recipe added successfully" });
//   } catch (error) {
//     console.error("Error adding recipe:", error);

//     // If an error occurred, remove the uploaded image if it exists
//     if (req.file) {
//       const filePath = path.join(imagesDir, req.file.filename);
//       fs.unlink(filePath, (err) => {
//         if (err) console.error("Error deleting uploaded file:", err);
//       });
//     }

//     res
//       .status(500)
//       .json({ error: "Failed to add recipe", details: error.message });
//   }
// };

// const updateRecipe = async (req, res) => {
//   await connectToDb();
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
// };

// const deleteRecipe = async (req, res) => {
//   await connectToDb();
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
// };

// module.exports = {
//   getAllRecipes,
//   getRecipeById,
//   createRecipe,
//   updateRecipe,
//   deleteRecipe,
// };

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

// const getAllRecipes = async (req, res) => {
//   await connectToDb();
//   try {
//     const request = pool.request();
//     const result = await request.query("SELECT * FROM recipes;");
//     res.json(result.recordset);
//   } catch (error) {
//     res.status(500).json({ error: "Failed to retrieve recipes" });
//   }
// };
const getAllRecipes = async (req, res) => {
  await connectToDb();
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 16;
    const offset = (page - 1) * limit;

    const request = pool.request();
    request.input("offset", sql.Int, offset);
    request.input("limit", sql.Int, limit);

    const countResult = await request.query(
      "SELECT COUNT(*) AS totalCount FROM recipes"
    );
    const totalCount = countResult.recordset[0].totalCount;

    const result = await request.query(`
      SELECT * FROM recipes
      ORDER BY id
      OFFSET @offset ROWS
      FETCH NEXT @limit ROWS ONLY
    `);

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

    if (req.file) {
      const newImageName = `recipe-${newId}.avif`;
      const oldPath = path.join(imagesDir, req.file.filename);
      const newPath = path.join(imagesDir, newImageName);

      fs.renameSync(oldPath, newPath);

      const updateRequest = pool.request();
      updateRequest.input("image", sql.NVarChar, newImageName);
      updateRequest.input("id", sql.Int, newId);
      await updateRequest.query(
        "UPDATE recipes SET image = @image WHERE id = @id"
      );
    }

    res.json({ id: newId, message: "Recipe added successfully" });
  } catch (error) {
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
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 16;
    const offset = (page - 1) * limit;

    const request = pool.request();
    request.input("category", sql.NVarChar, category);
    request.input("offset", sql.Int, offset);
    request.input("limit", sql.Int, limit);

    const countResult = await request.query(`
      SELECT COUNT(*) AS totalCount 
      FROM recipes 
      WHERE category = @category
    `);
    const totalCount = countResult.recordset[0].totalCount;

    const result = await request.query(`
      SELECT * FROM recipes
      WHERE category = @category
      ORDER BY id
      OFFSET @offset ROWS
      FETCH NEXT @limit ROWS ONLY
    `);

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
  if (!min && !max) {
    return res.status(400).json({
      error: "Please provide at the minimum and maximum calorie value.",
    });
  }
  if ((min && !max) || (!min && max)) {
    return res
      .status(400)
      .json({
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

    const countResult = await request.query(
      "SELECT COUNT(*) AS totalCount FROM recipes WHERE calories BETWEEN @min AND @max"
    );
    const totalCount = countResult.recordset[0].totalCount;

    const result = await request.query(
      `SELECT * FROM recipes 
       WHERE calories BETWEEN @min AND @max 
       ORDER BY id 
       OFFSET @offset ROWS 
       FETCH NEXT @limit ROWS ONLY`
    );

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

  if (!min && !max) {
    return res.status(400).json({
      error: "Please provide the minimum and maximum nutrient value.",
    });
  }
  if ((min && !max) || (!min && max)) {
    return res
      .status(400)
      .json({
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

    const validNutrients = ["calories", "carbs", "protein", "fats"];
    if (!validNutrients.includes(nutrient)) {
      return res.status(400).json({ error: "Invalid nutrient specified" });
    }

    const countResult = await request.query(
      `SELECT COUNT(*) AS totalCount FROM recipes WHERE ${nutrient} BETWEEN @min AND @max`
    );
    const totalCount = countResult.recordset[0].totalCount;

    const result = await request.query(
      `SELECT * FROM recipes 
       WHERE ${nutrient} BETWEEN @min AND @max 
       ORDER BY id 
       OFFSET @offset ROWS 
       FETCH NEXT @limit ROWS ONLY`
    );

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

  if (!ingredient || ingredient.trim() === "") {
    return res
      .status(400)
      .json({ error: "Please provide an ingredient to search for." });
  }

  const offset = (page - 1) * limit;

  if (!ingredient) {
    return res.status(400).json({ error: "Ingredient parameter is required" });
  }
  try {
    console.log("Searching for ingredient:", ingredient);
    const request = pool.request();
    request.input("ingredient", sql.NVarChar, `%${ingredient.trim()}%`);
    request.input("offset", sql.Int, offset);
    request.input("limit", sql.Int, parseInt(limit));

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

    res.json({
      recipes: result.recordset,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalCount / parseInt(limit)),
      totalRecipes: totalCount,
    });
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
  getAllRecipes, //
  getRecipeById, //
  createRecipe, //
  updateRecipe, //
  deleteRecipe, //
  getRecipeByName, //
  getRecipesByCategory, //
  getRandomRecipe, //
  getRecipeCount, //
  getRecipesByCalorieRange, //
  getRecipesByNutrientRange, //
  searchRecipesByIngredient, //
};
