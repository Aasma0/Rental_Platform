const express = require('express');
const { registerUser, loginUser, getUserProfile, updateUserProfile } = require('../controllers/UserControllers');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// Register User
router.post('/register', registerUser);

// Login User
router.post('/login', loginUser);

// Route for getting user profile
router.get("/profile", authMiddleware, getUserProfile);

// Route for updating user profile
router.patch("/profile", authMiddleware, updateUserProfile);  // Corrected route

module.exports = router;
