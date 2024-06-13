const sql = require("mssql"); // If using Microsoft SQL Server
const dbConfig = require("./dbConfig");

class account {
  constructor(id, name,password,email,contactNumber) {
    this.id = id;
    this.name = name;
    this.password = password;
    this.email = email;
    this.contactNumber = contactNumber
  }

  static async getAllUserAccount() {
    const connection = await sql.connect(dbConfig);

    const sqlQuery = `SELECT * FROM AccountUser`; // Replace with your actual table name

    const request = connection.request();
    const result = await request.query(sqlQuery);

    connection.close();

    return result.recordset.map(
      (row) => new account(row.id, row.name, row.password,row.email,row.contactNumber)
    ); // Convert rows to Book objects
  }

  static async getUserAccountById(id) {
    const connection = await sql.connect(dbConfig);

    const sqlQuery = `SELECT * FROM AccountUser WHERE id = @id`; // Parameterized query

    const request = connection.request();
    request.input("id", id);
    const result = await request.query(sqlQuery);

    connection.close();

    return result.recordset[0]
      ? new userAccount(
          result.recordset[0].id,
          result.recordset[0].name,
          result.recordset[0].password,
          result.recordset[0].email,
          result.recordset[0].contactNumber,
          
        )
      : null; // Handle book not found
  }

  static async createUserAccount(newUserAccountData) {
    const connection = await sql.connect(dbConfig); // Use dbConfig for connection

    const sqlQuery = `INSERT INTO AccountUser (name,password,email,contactNumber) VALUES (@name, @password,@email,@contactNumber); SELECT SCOPE_IDENTITY() AS id;`;

    const request = connection.request();
    request.input("name", newUserAccountData.name);
    request.input("password", newUserAccountData.password);
    request.input("email", newUserAccountData.email);
    request.input("contactNumber", newUserAccountData.contactNumber);
    
    

    const result = await request.query(sqlQuery);

    connection.close();

    return this.getUserAccountById(result.recordset[0].id); // Return the newly created book
  }

  static async updateUserAcccount(id, newUserAccountData) {
    const connection = await sql.connect(dbConfig);

    const sqlQuery = `UPDATE Books SET name = @name, password = @password,email = @email,contactNumber = @contactNumber WHERE id = @id`; // Parameterized query

    const request = connection.request();
    request.input("id", id);
    request.input("name", newUserAccountData.name || null); // Handle optional fields
    request.input("password", newUserAccountData.password || null);
    request.input("email", newUserAccountData.email|| null);
    request.input("contactNumber", newUserAccountData.contactNumber|| null);
    await request.query(sqlQuery);

    connection.close();

    return this.getUserAccountById(id); // returning the updated book data
  }


}

module.exports = account;
