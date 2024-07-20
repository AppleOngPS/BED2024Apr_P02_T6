const sql = require("mssql");
const dbConfig = require("../dbConfig");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { text } = require("body-parser");

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage }).single("image");

// Helper function to get the connection pool
async function getConnectionPool() {
  const pool = await sql.connect(dbConfig);
  return pool;
}

// Create a new post
const createPost = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      console.error("Error uploading file:", err);
      return res.status(500).json({ error: err.message });
    }
    try {
      const { title, category, message } = req.body;
      let content = null;
      if (req.file) {
        content = req.file.filename; // Save the filename to the database
      }

      const pool = await getConnectionPool();
      await pool
        .request()
        .input("title", sql.NVarChar, title)
        .input("category", sql.NVarChar, category)
        .input("content", sql.VarBinary(sql.MAX), content) // Use NVarChar for filenames
        .input("message", sql.NVarChar(sql.MAX), message)
        .query(
          "INSERT INTO Posts (title, category, content, message) VALUES (@title, @category, @content, @message)"
        );

      res.status(201).json({ message: "Post created successfully" });
    } catch (err) {
      console.error("Error creating post:", err);
      res.status(500).json({ error: err.message });
    }
  });
};

// Get all posts
const getPosts = async (req, res) => {
  try {
    const pool = await getConnectionPool();
    const result = await pool.request().query("SELECT * FROM Posts");
    res.json(result.recordset);
  } catch (err) {
    console.error("Error fetching posts:", err);
    res.status(500).json({ error: err.message });
  }
};

// Get post by ID
const getPostById = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await getConnectionPool();
    const result = await pool
      .request()
      .input("id", sql.Int, id)
      .query("SELECT * FROM Posts WHERE id = @id");

    if (result.recordset.length === 0) {
      res.status(404).json({ error: "Post not found" });
    } else {
      res.json(result.recordset[0]);
    }
  } catch (err) {
    console.error("Error fetching post by ID:", err);
    res.status(500).json({ error: err.message });
  }
};

// Update a post
const updatePost = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      console.error("Error uploading file:", err);
      return res.status(500).json({ error: err.message });
    }
    try {
      const { id } = req.params;
      const { title, category, message } = req.body;
      let content = null;
      if (req.file) {
        content = fs.readFileSync(req.file.path);
      }

      const pool = await getConnectionPool();
      await pool
        .request()
        .input("id", sql.Int, id)
        .input("title", sql.NVarChar, title)
        .input("category", sql.NVarChar(50), category)
        .input("content", sql.VarBinary(sql.MAX), content)
        .input("message", text, message)
        .query(
          "UPDATE Posts SET title = @title, category = @category, content = @content, message = @message WHERE id = @id"
        );

      res.json({ message: "Post updated successfully" });
    } catch (err) {
      console.error("Error updating post:", err);
      res.status(500).json({ error: err.message });
    }
  });
};

// Delete a post
const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await getConnectionPool();
    await pool
      .request()
      .input("id", sql.Int, id)
      .query("DELETE FROM Posts WHERE id = @id");

    res.json({ message: "Post deleted successfully" });
  } catch (err) {
    console.error("Error deleting post:", err);
    res.status(500).json({ error: err.message });
  }
};

// Get quiz questions
const getQuizQuestions = async () => {
  try {
    const pool = await sql.connect(dbConfig);
    console.log("Connected to database"); // Debug log
    const query = `
      SELECT q.question_id, q.question_text, a.answer_id, a.answer_text, a.is_correct
      FROM quiz_questions q
      JOIN quiz_answers a ON q.question_id = a.question_id
    `;
    const result = await pool.request().query(query);
    console.log("Query executed successfully", result.recordset); // Debug log
    return result.recordset;
  } catch (error) {
    console.error("Error fetching quiz questions:", error); // Detailed log
    throw error;
  } finally {
    sql.close(); // Ensure the connection is closed
  }
};
module.exports = {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
  getQuizQuestions,
};
