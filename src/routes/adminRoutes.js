const express = require("express");
const router = express.Router();
const { disableUser, deleteUser, getUsers } = require("../controllers/adminController");

// Debugging logs
console.log("disableUser:", disableUser);
console.log("deleteUser:", deleteUser);
console.log("getUsers:", getUsers);

// Get all users (Admin Only)
router.get("/users", getUsers);

// Disable a user (Admin Only)
router.patch("/users/disable/:id", disableUser);

// Delete a user (Admin Only)
router.delete("/users/:id", deleteUser);

module.exports = router;
