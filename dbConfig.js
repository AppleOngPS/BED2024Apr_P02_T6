const sql = require("mssql");

module.exports = {
  user: "asg1", // Replace with your SQL Server login username
  password: "1234", // Replace with your SQL Server login password
  server: "localhost", // Ensure this is the correct server address
  database: "asg1_db",
  options: {
    trustServerCertificate: true,
    port: 1433, // Default SQL Server port
    connectionTimeout: 60000, // Connection timeout in milliseconds
  },
};
