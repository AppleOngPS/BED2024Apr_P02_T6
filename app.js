const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const fs = require("fs");
const postRoutes = require("./routes/postRoutes");

const app = express();

// Middleware to parse JSON bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(__dirname));

// Ensure the uploads directory exists
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

app.use("/uploads", express.static(uploadsDir));

// Routes
app.use("/posts", postRoutes);

// Serve HTML and CSS files
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "community.html"));
});

app.get("/community", (req, res) => {
  res.sendFile(path.join(__dirname, "community-page.html"));
});

app.get("/styles.css", (req, res) => {
  res.sendFile(path.join(__dirname, "styles.css"));
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
