const sql = require("mssql");
const dbConfig = require("../dbConfig");

class Reward {
  constructor(name, description, redeemed) {
    this.name = name;
    this.description = description;
    this.redeemed = redeemed;
  }

  static async getAllRewards() {
    const connection = await sql.connect(dbConfig);
    const sqlQuery = `SELECT * FROM rewards`;
    const request = connection.request();
    const result = await request.query(sqlQuery);
    connection.close();
    return result.recordset.map(
      (row) => new Reward(row.name, row.description, row.redeemed)
    );
  }

  static async getRewardsById(id) {
    const connection = await sql.connect(dbConfig);
    const sqlQuery = `SELECT * FROM rewards WHERE id = @id`;
    const request = connection.request();
    request.input("id", sql.Int, id);
    const result = await request.query(sqlQuery);
    connection.close();
    return result.recordset[0]
      ? new Reward(
          result.recordset[0].name,
          result.recordset[0].description,
          result.recordset[0].redeemed
        )
      : null;
  }

  static async updateRewards(name, updateData) {
    try {
      const connection = await sql.connect(dbConfig);
      const sqlQuery = `
        UPDATE rewards 
        SET 
            description = @description,
            redeemed = @redeemed
        WHERE name = @name`; // Assuming 'name' is the primary key or unique identifier
  
      const request = connection.request();
      request.input("name", sql.NVarChar, name);
      request.input("description", sql.NVarChar, updateData.description);
      request.input("redeemed", sql.NVarChar, updateData.redeemed);
    
      await request.query(sqlQuery);
      connection.close();
  
      return this.getAllRewards(); // Return updated rewards data
    } catch (error) {
      console.error("Error updating rewards:", error);
      throw error;
    }
  }

  static async deleteReward(name) {
    try {
      const connection = await sql.connect(dbConfig);
      const sqlQuery = `DELETE FROM rewards WHERE name = @name`;
      const request = connection.request();
      request.input("name", sql.NVarChar, name);
      const result = await request.query(sqlQuery);
      connection.close();
      return result.rowsAffected > 0; // Indicate success based on affected rows
    } catch (error) {
      console.error("Error deleting rewards:", error);
      throw error;
    }
  }
}

module.exports = Reward;
