const User = require("../models/UserModels");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

// Register User
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
      role: role,
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

// Login User
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
        role: user.role, // Include role in payload
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
          token: token,
          role: user.role, // Include role in response
        });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id); // Assuming `req.user.id` is set by `authMiddleware`
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    res.json({ user });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Server error" });
  }
};

// Update the logged-in user's profile
const updateUserProfile = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Optionally update the password here
    if (password) {
      user.password = password; // Hash password before saving (already done in the model)
    }

    user.name = name;
    user.email = email;

    await user.save();
    res.json({ msg: "Profile updated successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Server error" });
  }
};

module.exports = { registerUser, loginUser, getUserProfile, updateUserProfile };
