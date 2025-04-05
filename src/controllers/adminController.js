const User = require("../models/UserModels");
const Booking = require("../models/BookingModel")
const Property = require("../models/PropertyModel")

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

    // Check for associated data
    const hasBookings = await Booking.exists({ user: user._id });
    const hasProperties = await Property.exists({ owner: user._id });
    
    if (hasBookings || hasProperties) {
      return res.status(400).json({ 
        message: "Cannot delete user with existing bookings or properties"
      });
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted successfully" });
    
  } catch (error) {
    console.error("Delete User Error:", error);
    res.status(500).json({ 
      message: "Server Error",
      error: process.env.NODE_ENV === "development" ? error.message : null
    });
  }
};

module.exports = { getUsers, disableUser, deleteUser };
