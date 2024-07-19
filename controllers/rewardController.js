const sql = require("mssql");
const Reward = require("../models/rewards"); // Adjust the path if necessary
const dbConfig = require("../dbConfig");

const getAllRewards = async (req, res) => {
  try {
    const rewards = await Reward.getAllRewards();
    res.status(200).json(rewards);
  } catch (error) {
    console.error("Error retrieving rewards:", error);
    res.status(500).send("Error retrieving rewards");
  }
};

const getRewardsById = async (req, res) => {
  try {
    const rewardId = req.params.id;
    const reward = await Reward.getRewardsById(rewardId);
    if (reward) {
      res.status(200).json(reward);
    } else {
      res.status(404).json({ message: "Reward not found" });
    }
  } catch (error) {
    console.error("Error retrieving reward:", error);
    res.status(500).json({ message: "Error retrieving reward", error: error.message });
  }
};



// Function to fetch user points - Replace with your actual implementation
const getUserPoints = async () => {
  try {
    const connection = await sql.connect(dbConfig);
    const sqlQuery = `SELECT point FROM AccountUser WHERE id = @userId`; // Assuming you have userId available
    const request = connection.request();
    request.input("userId", sql.Int, /* Replace with actual userId */);
    const result = await request.query(sqlQuery);
    connection.close();
    return result.recordset.length > 0 ? result.recordset[0].point : 0;
  } catch (error) {
    console.error("Error fetching user points:", error);
    throw error;
  }
};

const redeemReward = async (req, res) => {
  const rewardId = req.params.id;
  try {
    await Reward.redeemRewardById(rewardId); // Update database to mark reward as redeemed
    res.status(200).json({ message: "Reward redeemed successfully" });
  } catch (error) {
    console.error("Error redeeming reward:", error);
    res.status(500).json({ error: "Failed to redeem reward" });
  }
};
const deleteReward = async (req, res) => {
  const rewardId = req.params.id;
  try {
    const result = await Reward.deleteRewardById(rewardId);
    if (result) {
      res.status(200).json({ message: "Reward deleted successfully" });
    } else {
      res.status(404).json({ message: "Reward not found" });
    }
  } catch (error) {
    console.error("Error deleting reward:", error);
    res.status(500).json({ error: "Failed to delete reward" });
  }
};





module.exports = {
  getAllRewards,
  getRewardsById,
  getUserPoints,
  redeemReward,
  deleteReward,
};
