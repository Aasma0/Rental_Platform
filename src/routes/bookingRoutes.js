const express = require("express");
const { bookProperty, getBookings } = require("../controllers/bookingController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Route to book a property
router.post("/book/:propertyId", authMiddleware, bookProperty);

// Route to get all bookings
router.get("/", authMiddleware, getBookings);

module.exports = router;
