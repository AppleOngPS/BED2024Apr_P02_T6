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

const updateRewards = async (req, res) => {
  try {
    const { name } = req.body; // Assuming you use name to identify the reward to update
    const updateRewardDetails = req.body;
    const updatedReward = await Reward.updateRewards(name, updateRewardDetails);
    res.status(200).json(updatedReward);
  } catch (error) {
    console.error("Error updating reward:", error);
    res.status(500).send("Error updating reward");
  }
};

const deleteReward = async (req, res) => {
  try {
    const { name, password } = req.query; // Extracting name and password from query parameters

    const connection = await sql.connect(dbConfig);
    const sqlQuery = `DELETE FROM rewards WHERE name = @name AND password = @password`;
    const request = connection.request();
    request.input("name", sql.NVarChar, name);
    request.input("password", sql.NVarChar, password);
    const result = await request.query(sqlQuery);

    connection.close();

    if (result.rowsAffected > 0) {
      res.status(204).send(); // Return 204 No Content for successful deletion
    } else {
      res.status(404).send("Reward not found"); // Return 404 Not Found if reward does not exist
    }
  } catch (error) {
    console.error("Error deleting reward:", error);
    res.status(500).send("Error deleting reward");
  }
};

module.exports = {
  getAllRewards,
  getRewardsById,
  updateRewards,
  deleteReward,
};
