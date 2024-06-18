module.exports = {
    user: "BED_user", // Replace with your SQL Server login username
    password: "hello123", // Replace with your SQL Server login password
    server: "localhost",
    database: "bed_Asg1",
    trustServerCertificate: true,
    options: {
      port: 1433, // Default SQL Server port
      connectionTimeout: 60000, // Connection timeout in milliseconds
    },
  };
  