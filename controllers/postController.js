const { sql, poolPromise } = require("../dbConfig");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

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

// Create a new post
const createPost = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    try {
      const { title, category, message } = req.body;
      let content = null;
      if (req.file) {
        content = req.file.filename; // Save the filename to the database
      }

      const pool = await poolPromise;
      await pool
        .request()
        .input("title", sql.NVarChar, title)
        .input("category", sql.NVarChar, category)
        .input("content", sql.VarBinary(sql.MAX), content)
        .input("message", sql.NVarChar(sql.MAX), message)
        .query(
          "INSERT INTO Posts (title, category, content, message) VALUES (@title, @category, @content, @message)"
        );

      res.status(201).json({ message: "Post created successfully" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
};

// Get all posts
const getPosts = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query("SELECT * FROM Posts");
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// Get post by ID
const getPostById = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("id", sql.Int, id)
      .query("SELECT * FROM Posts WHERE id = @id");

    res.json(result.recordset[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// Update a post
const updatePost = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(500).send(err.message);
    }
    try {
      const { id } = req.params;
      const { title, category, message } = req.body;
      let content = null;
      if (req.file) {
        content = fs.readFileSync(req.file.path);
      }

      const pool = await poolPromise;
      await pool
        .request()
        .input("id", sql.Int, id)
        .input("title", sql.NVarChar, title)
        .input("category", sql.NVarChar, category)
        .input("content", sql.VarBinary(sql.MAX), content)
        .input("message", sql.NVarChar(sql.MAX), message)
        .query(
          "UPDATE Posts SET title = @title, category = @category, content = @content, message = @message WHERE id = @id"
        );

      res.json({ message: "Post updated successfully" });
    } catch (err) {
      res.status(500).send(err.message);
    }
  });
};

// Delete a post
const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await poolPromise;
    await pool
      .request()
      .input("id", sql.Int, id)
      .query("DELETE FROM Posts WHERE id = @id");

    res.json({ message: "Post deleted successfully" });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// Function to get quiz questions
const getQuizQuestions = async () => {
  const pool = await poolPromise;
  const query = `
      SELECT q.question_id, q.question_text, a.answer_id, a.answer_text, a.is_correct
      FROM quiz_questions q
      JOIN quiz_answers a ON q.question_id = a.question_id
  `;
  const result = await pool.request().query(query);
  return result.recordset;
};

module.exports = {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
  getQuizQuestions,
};
