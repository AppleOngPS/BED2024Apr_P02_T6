// js/dbConfig.js
const mysql = require("mysql");

const db = mysql.createPool({
  host: "localhost",
  user: "booksapi_user", // Replace with your SQL Server login username
  password: "27D988332n07", // Replace with your SQL Server login password
  database: "BED_ass1", // Replace with your database name
  port: 1433, // Default MySQL port
  trustServerCertificate: true,
  options: {
    port: 1433, // Default SQL Server port
    connectionTimeout: 60000, // Connection timeout in milliseconds
  },
});

db.getConnection((err) => {
  if (err) {
    console.error("Error connecting to database:", err);
    return;
  }
  console.log("Connected to database");
});

module.exports = db;
