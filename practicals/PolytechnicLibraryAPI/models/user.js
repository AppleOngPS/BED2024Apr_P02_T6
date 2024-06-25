const sql = require("mssql");
const dbConfig = require("../dbConfig");

class User {
  constructor(username,passwordHash,role) {
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

  static async getUserById(id) {
    const connection = await sql.connect(dbConfig);
    const sqlQuery = `SELECT * FROM users WHERE id = @id`;
    const request = connection.request();
    request.input("id", id);
    const result = await request.query(sqlQuery);
    connection.close();
    return result.recordset[0]
      ? new User(
          result.recordset[0].username,
          result.recordset[0].passwordHash,
          result.recordset[0].role,
          
        )
      : null;
  }

  static async createUserAccount(newUserAccount) {
    try {
      const connection = await sql.connect(dbConfig);
      
      const sqlQuery = `
        INSERT INTO users (username,passwordHash)
        VALUES (@username, @passwordHash);
        SELECT SCOPE_IDENTITY() AS userId;`;
  
      const request = connection.request();
      request.input("username", newUserAccount.username);
      request.input("passwordHash", newUserAccount.passwordHash);

  
      const result = await request.query(sqlQuery);
  
      connection.close();
  
      const userId = result.recordset[0].userId; // Access the userId from the result
  
      return this.getUserById(userId); // Return the newly created user
    } catch (error) {
      console.error("Error creating user:", error);
      throw error; // Re-throw the error to be caught by the caller (usersController)
    }
  }

  static async getUserByNameAndPassword(username, passwordHash) {
    try {
      const connection = await sql.connect(dbConfig);
      const sqlQuery = 'SELECT * FROM users WHERE username = @username AND passwordHash = @passwordHash';
      const request = connection.request();
      request.input('name', sql.NVarChar, username);
      request.input('password', sql.NVarChar, passwordHash);
      const result = await request.query(sqlQuery);
      connection.close();
      return result.recordset.length > 0 ? result.recordset[0] : null;
    } catch (error) {
      console.error('Error retrieving user:', error);
      throw error; // Throw error to be caught by the controller
    }
  }
}

module.exports = User;
