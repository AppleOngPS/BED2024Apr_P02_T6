const sql = require("mssql");
const fs = require("fs");
const path = require("path");
const dbConfig = require("../dbConfig");

const getTargetCalories = async (req, res) => {
  try {
    const name = req.query.name; // Get username from query parameter
    const pool = await sql.connect(dbConfig);
    const result = await pool
      .request()
      .input("name", sql.VarChar, name)
      .query("SELECT TargetCalarieIntake FROM AccountUser WHERE name = @name");

    if (result.recordset.length > 0) {
      res.json({ targetCalories: result.recordset[0].TargetCalarieIntake });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  } finally {
    sql.close();
  }
};

module.exports = {
  getTargetCalories,
};
