const sql = require("mssql");
const dbConfig = require("../dbConfig");

class User {
  constructor(name, password, email, contactNumber, age, height, weight, weightGoal, TargetCalarieIntake,point) {
    this.name = name;
    this.password = password;
    this.email = email;
    this.contactNumber = contactNumber;
    this.age = age;
    this.height = height;
    this.weight = weight;
    this.weightGoal = weightGoal;
    this.TargetCalarieIntake = TargetCalarieIntake;
    this.point = point;
  }

  static async getAllUsers() {
    const connection = await sql.connect(dbConfig);
    const sqlQuery = `SELECT * FROM AccountUser`;
    const request = connection.request();
    const result = await request.query(sqlQuery);
    connection.close();
    return result.recordset.map(
      (row) => new User(row.name, row.password, row.email, row.contactNumber, row.age, row.height, row.weight, row.weightGoal, row.TargetCalarieIntake,row.point)
    );
  }

  static async getUserById(id) {
    const connection = await sql.connect(dbConfig);
    const sqlQuery = `SELECT * FROM AccountUser WHERE id = @id`;
    const request = connection.request();
    request.input("id", sql.Int, id);
    const result = await request.query(sqlQuery);
    connection.close();
    return result.recordset[0]
      ? new User(
          result.recordset[0].name,
          result.recordset[0].password,
          result.recordset[0].email,
          result.recordset[0].contactNumber,
          result.recordset[0].age,
          result.recordset[0].height,
          result.recordset[0].weight,
          result.recordset[0].weightGoal,
          result.recordset[0].TargetCalarieIntake,
          result.recordset[0].point
        )
      : null;
  }

  static async createUserAccount(newUserAccount) {
    try {
      const connection = await sql.connect(dbConfig);
      const sqlQuery = `
        INSERT INTO AccountUser (name, password, email, contactNumber, age, height, weight, weightGoal, TargetCalarieIntake)
        VALUES (@name, @password, @email, @contactNumber, @age, @height, @weight, @weightGoal, @TargetCalarieIntake);
        SELECT SCOPE_IDENTITY() AS userId;
      `;
      const request = connection.request();
      request.input("name", sql.NVarChar, newUserAccount.name);
      request.input("password", sql.NVarChar, newUserAccount.password);
      request.input("email", sql.NVarChar, newUserAccount.email);
      request.input("contactNumber", sql.NVarChar, newUserAccount.contactNumber);
      request.input("age", sql.Int, newUserAccount.age);
      request.input("height", sql.Float, newUserAccount.height);
      request.input("weight", sql.Float, newUserAccount.weight);
      request.input("weightGoal", sql.Float, newUserAccount.weightGoal);
      request.input("TargetCalarieIntake", sql.Float, newUserAccount.TargetCalarieIntake);
      const result = await request.query(sqlQuery);
      connection.close();
      const userId = result.recordset[0].userId;
      return this.getUserById(userId);
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }

  static async getUserByNameAndPassword(name, password) {
    try {
      const connection = await sql.connect(dbConfig);
      const sqlQuery = 'SELECT * FROM AccountUser WHERE name = @name AND password = @password';
      const request = connection.request();
      request.input('name', sql.NVarChar, name);
      request.input('password', sql.NVarChar, password);
      const result = await request.query(sqlQuery);
      connection.close();
      return result.recordset.length > 0 ? result.recordset[0] : null;
    } catch (error) {
      console.error('Error retrieving user:', error);
      throw error;
    }
  }

  static async updateUserAccount(name, updateUser) {
    try {
      const connection = await sql.connect(dbConfig);
      const sqlQuery = `
        UPDATE AccountUser 
        SET name = @name, 
            email = @email,
            contactNumber = @contactNumber,
            age = @age,
            height = @height,
            weight = @weight,
            weightGoal = @weightGoal,
            TargetCalarieIntake = @TargetCalarieIntake
        WHERE name = @name`; // Assuming 'name' is the primary key or unique identifier
  
      const request = connection.request();
      request.input("name", sql.NVarChar, updateUser.name || name);
      request.input("email", sql.NVarChar, updateUser.email);
      request.input("contactNumber", sql.NVarChar, updateUser.contactNumber);
      request.input("age", sql.Int, updateUser.age);
      request.input("height", sql.Float, updateUser.height);
      request.input("weight", sql.Float, updateUser.weight);
      request.input("weightGoal", sql.Float, updateUser.weightGoal);
      request.input("TargetCalarieIntake", sql.Float, updateUser.TargetCalarieIntake);
  
      await request.query(sqlQuery);
  
      connection.close();
  
      return this.getUserByNameAndPassword(updateUser.name, updateUser.password); // Return updated user data
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  }
  static async deleteUser(name) {
    try {
      const connection = await sql.connect(dbConfig);
      const sqlQuery = `DELETE FROM AccountUser WHERE name = @name`;
      const request = connection.request();
      request.input("name", sql.NVarChar, name);
      const result = await request.query(sqlQuery);
      connection.close();
      return result.rowsAffected > 0; // Indicate success based on affected rows
    } catch (error) {
      console.error("Error deleting user:", error);
      throw error;
    }
  }
}

module.exports = User;