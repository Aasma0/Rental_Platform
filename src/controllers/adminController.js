const User = require("../models/UserModels");

// Get all users (Admin only)
const getUsers = async (req, res) => {
    try {
      const users = await User.find({}, { password: 0 }); // Exclude the password field
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ message: "Error fetching users" });
    }
  };

// Disable a user (Admin only)
const disableUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.disabled = true;
    await user.save();
    res.status(200).json({ message: "User disabled successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error disabling user" });
  }
};

// Delete a user (Admin only)
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await user.remove();
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user" });
  }
};

module.exports = { getUsers, disableUser, deleteUser };
