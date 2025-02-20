const express = require("express");
const router = express.Router();
const { createProperty } = require("../controllers/PropertyController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/create", authMiddleware, createProperty);

module.exports = router;
