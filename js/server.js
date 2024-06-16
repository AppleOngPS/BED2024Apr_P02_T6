const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const multer = require("multer");
const cors = require("cors");
const path = require("path");

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const db = mysql.createConnection({
  user: "booksapi_user", // Replace with your SQL Server login username
  password: "27D988332n07", // Replace with your SQL Server login password
  server: "localhost",
  database: "bed_db",
});

db.connect((err) => {
  if (err) throw err;
  console.log("Connected to database");
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage });

app.get("/api/foods", (req, res) => {
  const sql = "SELECT * FROM food_items";
  db.query(sql, (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

app.post("/api/foods", upload.single("image"), (req, res) => {
  const { name, group_type, description, nutrients } = req.body;
  const image = req.file ? req.file.path : null;
  const sql =
    "INSERT INTO food_items (name, group_type, description, nutrients, image) VALUES (?, ?, ?, ?, ?)";
  db.query(
    sql,
    [name, group_type, description, nutrients, image],
    (err, result) => {
      if (err) throw err;
      res.send(result);
    }
  );
});

app.delete("/api/foods/:id", (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM food_items WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
