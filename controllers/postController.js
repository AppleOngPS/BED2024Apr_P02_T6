const sql = require("mssql");
const dbConfig = require("../dbConfig");

// Helper function to get the connection pool
async function getConnectionPool() {
  const pool = await sql.connect(dbConfig);
  return pool;
}

// Create a new post
const createPost = async (req, res) => {
  try {
    const { title, category, message, userDetails } = req.body;

    if (!title || !category || !message || !userDetails) {
      throw new Error("Missing required fields");
    }

    const user = JSON.parse(userDetails);
    const pool = await getConnectionPool();

    // Fetch the user's name from the AccountUser table
    const userResult = await pool
      .request()
      .input("userId", sql.Int, user.id)
      .query("SELECT name FROM AccountUser WHERE id = @userId");

    if (userResult.recordset.length === 0) {
      throw new Error("User not found");
    }

    const userName = userResult.recordset[0].name;

    await pool
      .request()
      .input("title", sql.NVarChar, title)
      .input("category", sql.NVarChar, category)
      .input("message", sql.NVarChar(sql.MAX), message)
      .input("username", sql.NVarChar, userName)
      .query(
        "INSERT INTO Posts (title, category, message, username) VALUES (@title, @category, @message, @username)"
      );

    res.status(201).json({ message: "Post created successfully" });
  } catch (err) {
    console.error("Error creating post:", err);
    res.status(500).json({ error: err.message });
  }
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
  try {
    const { id } = req.params;
    const { title, category, message } = req.body;

    const pool = await getConnectionPool();
    await pool
      .request()
      .input("id", sql.Int, id)
      .input("title", sql.NVarChar, title)
      .input("category", sql.NVarChar(50), category)
      .input("message", sql.NVarChar(sql.MAX), message)
      .query(
        "UPDATE Posts SET title = @title, category = @category, message = @message WHERE id = @id"
      );

    res.json({ message: "Post updated successfully" });
  } catch (err) {
    console.error("Error updating post:", err);
    res.status(500).json({ error: err.message });
  }
};

// Delete a post
const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await getConnectionPool();

    // First, delete associated likes
    await pool
      .request()
      .input("postId", sql.Int, id)
      .query("DELETE FROM PostLikes WHERE post_id = @postId");

    // Then, delete the post
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

// Like a post
const likePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    const pool = await getConnectionPool();

    // Check if the user has already liked the post
    const existingLike = await pool
      .request()
      .input("postId", sql.Int, id)
      .input("userId", sql.Int, userId)
      .query(
        "SELECT * FROM PostLikes WHERE post_id = @postId AND user_id = @userId"
      );

    if (existingLike.recordset.length > 0) {
      return res
        .status(400)
        .json({ error: "User has already liked this post" });
    }

    // Insert a new like
    await pool
      .request()
      .input("postId", sql.Int, id)
      .input("userId", sql.Int, userId)
      .query(
        "INSERT INTO PostLikes (post_id, user_id) VALUES (@postId, @userId)"
      );

    // Update the likes count in the Posts table
    await pool
      .request()
      .input("postId", sql.Int, id)
      .query("UPDATE Posts SET likes = likes + 1 WHERE id = @postId");

    res.json({ message: `Liked post with ID: ${id}` });
  } catch (err) {
    console.error("Error liking post:", err);
    res
      .status(500)
      .json({ error: `Failed to like post with ID: ${req.params.id}` });
  }
};

const addComment = async (req, res) => {
  try {
    const { postId, comment, userDetails } = req.body;
    const user = JSON.parse(userDetails);

    const pool = await getConnectionPool();
    await pool
      .request()
      .input("postId", sql.Int, postId)
      .input("userId", sql.Int, user.id)
      .input("username", sql.NVarChar, user.name)
      .input("comment", sql.NVarChar(sql.MAX), comment)
      .query(
        "INSERT INTO Comments (postId, userId, username, comment) VALUES (@postId, @userId, @username, @comment)"
      );

    res.status(201).json({ message: "Comment added successfully" });
  } catch (err) {
    console.error("Error adding comment:", err);
    res.status(500).json({ error: err.message });
  }
};
const getComments = async (req, res) => {
  try {
    console.log("Fetching comments for post ID:", req.params.postId); // Debugging log
    const { postId } = req.params;
    const pool = await getConnectionPool();
    const result = await pool
      .request()
      .input("postId", sql.Int, postId)
      .query("SELECT * FROM Comments WHERE postId = @postId");

    if (result.recordset.length === 0) {
      res.status(404).json({ error: "Comments not found" });
    } else {
      res.json(result.recordset);
    }
  } catch (err) {
    console.error("Error fetching comments:", err);
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
  likePost,
  addComment,
  getComments,
  getQuizQuestions,
};
