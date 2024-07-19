// const sql = require("mssql");
// const dbConfig = require("../dbConfig");

// class Reward {
//   constructor(name, description, redeemed,point) {
//     this.name = name;
//     this.description = description;
//     this.redeemed = redeemed;
//     this.point=point;
//   }

//   static async getAllRewards() {
//     const connection = await sql.connect(dbConfig);
//     const sqlQuery = `SELECT * FROM rewards`;
//     const request = connection.request();
//     const result = await request.query(sqlQuery);
//     connection.close();
//     return result.recordset.map(
//       (row) => new Reward(row.name, row.description, row.redeemed,row.point)
//     );
//   }

//   static async getRewardsById(id) {
//     const connection = await sql.connect(dbConfig);
//     const sqlQuery = `SELECT * FROM rewards WHERE id = @id`;
//     const request = connection.request();
//     request.input("id", sql.Int, id);
//     const result = await request.query(sqlQuery);
//     connection.close();
//     return result.recordset[0]
//       ? new Reward(
//           result.recordset[0].name,
//           result.recordset[0].description,
//           result.recordset[0].redeemed,
//           result.recordset[0].point,
//         )
//       : null;
//   }

//   static async redeemableRewards(userId) {
//     try {
//       const connection = await sql.connect(dbConfig);
//       const sqlQuery = `
//         SELECT 
//             u.id AS UserId,
//             u.name AS UserName,
//             r.id AS RewardId,
//             r.name AS RewardName,
//             r.description AS RewardDescription,
//             r.redeemed AS IsRedeemed,
//             r.point AS RequiredPoints,
//             u.point AS UserPoints
//         FROM 
//             AccountUser u
//         JOIN 
//             rewards r ON u.point >= r.point
//         WHERE 
//             u.id = @userId
//             AND r.redeemed = 'N';`;
  
//       const request = connection.request();
//       request.input('userId', sql.Int, userId);
//       const result = await request.query(sqlQuery);
//       connection.close();
  
//       return result.recordset.map(row => ({
//         userId: row.UserId,
//         userName: row.UserName,
//         rewardId: row.RewardId,
//         rewardName: row.RewardName,
//         rewardDescription: row.RewardDescription,
//         isRedeemed: row.IsRedeemed === 'Y',
//         requiredPoints: row.RequiredPoints,
//         userPoints: row.UserPoints
//       }));
//     } catch (error) {
//       console.error('Error fetching redeemable rewards:', error);
//       throw error;
//     }
//   }

// static async redeemRewardById(id) {
//   const connection = await sql.connect(dbConfig);
//   const sqlQuery = `UPDATE rewards SET redeemed = 'Y' WHERE id = @id`;
//   const request = connection.request();
//   request.input("id", sql.Int, id);
//   await request.query(sqlQuery);
//   connection.close();
// }

  
  

 

// }

// module.exports = Reward;
// reward.js

const sql = require("mssql");
const dbConfig = require("../dbConfig");

class Reward {
  constructor(id, name, description, redeemed, point) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.redeemed = redeemed;
    this.point = point;
  }

  static async getAllRewards() {
    const connection = await sql.connect(dbConfig);
    const sqlQuery = `SELECT * FROM rewards`;
    const result = await connection.query(sqlQuery);
    connection.close();
    return result.recordset.map(
      (row) =>
        new Reward(
          row.id,
          row.name,
          row.description,
          row.redeemed,
          row.point
        )
    );
  }

  static async getRewardById(id) {
    const connection = await sql.connect(dbConfig);
    const sqlQuery = `SELECT * FROM rewards WHERE id = @id`;
    const request = connection.request();
    request.input("id", sql.Int, id);
    const result = await request.query(sqlQuery);
    connection.close();
    return result.recordset[0]
      ? new Reward(
          result.recordset[0].id,
          result.recordset[0].name,
          result.recordset[0].description,
          result.recordset[0].redeemed,
          result.recordset[0].point
        )
      : null;
  }

  static async redeemRewardById(id) {
    const connection = await sql.connect(dbConfig);
    const sqlQuery = `UPDATE rewards SET redeemed = 'Y' WHERE id = @id`;
    const request = connection.request();
    request.input("id", sql.Int, id);
    const result = await request.query(sqlQuery);
    connection.close();
  }

  static async redeemableRewards(userId) {
    try {
      const connection = await sql.connect(dbConfig);
      const sqlQuery = `
        SELECT 
            u.id AS UserId,
            u.name AS UserName,
            r.id AS RewardId,
            r.name AS RewardName,
            r.description AS RewardDescription,
            r.redeemed AS IsRedeemed,
            r.point AS RequiredPoints,
            u.point AS UserPoints
        FROM 
            AccountUser u
        JOIN 
            rewards r ON u.point >= r.point
        WHERE 
            u.id = @userId
            AND r.redeemed = 'N';`;

      const request = connection.request();
      request.input('userId', sql.Int, userId);
      const result = await request.query(sqlQuery);
      connection.close();

      return result.recordset.map(row => ({
        userId: row.UserId,
        userName: row.UserName,
        rewardId: row.RewardId,
        rewardName: row.RewardName,
        rewardDescription: row.RewardDescription,
        isRedeemed: row.IsRedeemed === 'Y',
        requiredPoints: row.RequiredPoints,
        userPoints: row.UserPoints
      }));
    } catch (error) {
      console.error('Error fetching redeemable rewards:', error);
      throw error;
    }
  }
}

module.exports = Reward;
