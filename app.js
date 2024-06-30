const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const fs = require("fs");
const postRoutes = require("./routes/postRoutes");
const postController = require("./controllers/postController");

const app = express();

// Middleware to parse JSON bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files from the css directory
app.use("/css", express.static(path.join(__dirname, "css")));

// Ensure the uploads directory exists
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

app.use("/uploads", express.static(uploadsDir));

// Routes
app.use("/posts", postRoutes);

// Serve HTML files
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "html", "community.html"));
});

app.get("/community-page.html", (req, res) => {
  res.sendFile(path.join(__dirname, "html", "community-page.html"));
});

app.get("/community.html", (req, res) => {
  res.sendFile(path.join(__dirname, "html", "community.html"));
});

app.get("/quiz.html", (req, res) => {
  res.sendFile(path.join(__dirname, "html", "quiz.html"));
});

// Endpoint to fetch quiz data
app.get("/fetch_quiz", async (req, res) => {
  try {
    const questions = await postController.getQuizQuestions();
    res.json(questions);
  } catch (err) {
    console.error("Error fetching quiz questions:", err);
    res.status(500).send("Server error");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
