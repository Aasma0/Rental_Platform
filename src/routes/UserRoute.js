const express = require("express");
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  updateUserPassword,
  getUserStats, 
  upload,  
} = require("../controllers/UserControllers");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Register & Login
router.post("/register", registerUser);
router.post("/login", loginUser);

// Profile Management
router.get("/profile", authMiddleware, getUserProfile);
router.patch("/profile", authMiddleware, upload.single("profilePicture"), updateUserProfile);
router.patch("/profile/password", authMiddleware, updateUserPassword);
router.get("/stats", getUserStats); // Define route

module.exports = router;
