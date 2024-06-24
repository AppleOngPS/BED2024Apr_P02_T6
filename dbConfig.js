module.exports = {
  user: "booksapi_user", // Replace with your SQL Server login username
  password: "27D988332n07", // Replace with your SQL Server login password
  server: "localhost",
  database: "BED_ass1",
  trustServerCertificate: true,
  options: {
    port: 1433, // Default SQL Server port
    connectionTimeout: 60000, // Connection timeout in milliseconds
  },
};

//module.exports = db;
