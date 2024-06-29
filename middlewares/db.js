const sql = require("mssql");

const dbConfig = {
  user: "asg1",
  password: "1234",
  server: "localhost",
  database: "asg1_db",
  trustServerCertificate: true,
  options: {
    port: 1433,
    connectionTimeout: 60000,
  },
};

const poolPromise = new sql.ConnectionPool(dbConfig)
  .connect()
  .then((pool) => {
    console.log("Connected to SQL Server");
    return pool;
  })
  .catch((err) => {
    console.error("Database Connection Failed!", err);
    process.exit(1);
  });

module.exports = {
  sql,
  poolPromise,
};
