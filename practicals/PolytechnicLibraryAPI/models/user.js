

const sql = require("mssql");
const dbConfig = require("../dbConfig");

class User {
  constructor(username, passwordHash, role) {
    this.username = username;
    this.passwordHash = passwordHash;
    this.role = role;
  }

  static async getAllUsers() {
    const connection = await sql.connect(dbConfig);
    const sqlQuery = `SELECT * FROM users`;
    const request = connection.request();
    const result = await request.query(sqlQuery);
    connection.close();
    return result.recordset.map(
      (row) => new User(row.username, row.passwordHash, row.role)
    );
  }

  static async getUserById(userId) {
    const connection = await sql.connect(dbConfig);
    const sqlQuery = `SELECT * FROM users WHERE user_id = @userId`;
    const request = connection.request();
    request.input("userId", sql.Int, userId);
    const result = await request.query(sqlQuery);
    connection.close();
    return result.recordset[0]
      ? new User(
          result.recordset[0].username,
          result.recordset[0].passwordHash,
          result.recordset[0].role
        )
      : null;
  }

  static async createUserAccount(newUserAccount) {
    try {
      const connection = await sql.connect(dbConfig);
      const sqlQuery = `
        INSERT INTO users (username, passwordHash, role)
        VALUES (@username, @passwordHash, @role);
        SELECT SCOPE_IDENTITY() AS user_id;
      `;
      const request = connection.request();
      request.input("username", sql.NVarChar, newUserAccount.username);
      request.input("passwordHash", sql.NVarChar, newUserAccount.passwordHash);
      request.input("role", sql.NVarChar, newUserAccount.role || 'member'); // Default role

      const result = await request.query(sqlQuery);
      connection.close();
      const userId = result.recordset[0].user_id;
      return this.getUserById(userId);
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }

  static async getUserByNameAndPassword(name, password) {
    try {
      const connection = await sql.connect(dbConfig);
      const sqlQuery = 'SELECT * FROM users WHERE username = @username AND passwordHash = @passwordHash';
      const request = connection.request();
      request.input('username', sql.NVarChar, name);
      request.input('passwordHash', sql.NVarChar, password);
      const result = await request.query(sqlQuery);
      connection.close();
      return result.recordset.length > 0 ? result.recordset[0] : null;
    } catch (error) {
      console.error('Error retrieving user:', error);
      throw error;
    }
  }
}

module.exports = User;
