const express = require("express");
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  updateUserPassword,
  upload,  // Ensure upload middleware is imported
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

module.exports = router;
