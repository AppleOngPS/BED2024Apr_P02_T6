//const express = require("express");
//const booksController = require("./controllers/booksController");
const sql = require("mssql");
const dbConfig = require("./dbConfig");

module.exports = {
  user: "booksapi_user", // Replace with your SQL Server login username
  password: "27D988332n07", // Replace with your SQL Server login password
  server: "localhost",
  database: "bed_db",
  trustServerCertificate: true,
  options: {
    port: 1433, // Default SQL Server port
    connectionTimeout: 60000, // Connection timeout in milliseconds
  },
};
