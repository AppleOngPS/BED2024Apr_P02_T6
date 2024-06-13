const account = require("./signupModel");

const getAllUserAccount = async (req, res) => {
  try {
    const useraccount = await account.getAllUserAccount();
    res.json(useraccount);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving user account");
  }
};

const getUserAccountById = async (req, res) => {
  const UserAccountId = parseInt(req.params.id);
  try {
    const Account = await account.getUserAccountById(UserAccountId);
    if (!Account) {
      return res.status(404).send("Book not found");
    }
    res.json(book);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving user account");
  }
};
const createUserAccount = async (req, res) => {
  const newuseracccount = req.body;
  try {
    const createUserAccount = await account.createUserAccount(newuseracccount);
    res.status(201).json(createUserAccount);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error creating User Account");
  }
};
const updateUserAcccount = async (req, res) => {
  const UserAccountId = parseInt(req.params.id);
  const newUserAccountData = req.body;

  try {
    const updatedUserAccount = await account.updateUserAcccount(UserAccountId, newUserAccountData);
    if (!updatedUserAccount) {
      return res.status(404).send("User Account not found");
    }
    res.json(updatedUserAccount);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error updating User Account");
  }
};

module.exports = {
    getAllUserAccount,
    getUserAccountById,
    createUserAccount,
    updateUserAcccount,
    
  };
  