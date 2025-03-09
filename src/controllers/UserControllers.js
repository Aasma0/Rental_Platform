const User = require("../models/UserModels");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: "User already exists" });
    }
    user = new User({
      name: name,
      email: email,
      password: password,
      role: role

    });
    await user.save();
    res.status(201).json({
      msg: "User registered successfully",
      user: user,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ msg: err.message });
  }
};
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const payload = {
      user: {
        id: user.id,
        role: user.role, // ✅ Include role in payload
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
      (err, token) => {
        if (err) throw err;
        res.json({
          msg: "User logged in successfully",
token: token, // Remove the "Bearer" prefix
          role: user.role, // ✅ Include role in response
        });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};


// Function to update user profile
const updateProfile = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Get the user by their ID from the token (provided by middleware)
    const user = await User.findById(req.user.id); 
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Update profile fields if provided
    if (name) user.name = name;
    if (email) user.email = email;

    if (password) {
      // If password is updated, hash it
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    await user.save(); // Save the updated user

    res.status(200).json({ msg: "Profile updated successfully", user });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Server error" });
  }
};

module.exports = {
  registerUser,
  loginUser,
  updateProfile,
};
