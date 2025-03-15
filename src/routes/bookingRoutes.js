const express = require("express");
const { bookProperty, updateBooking, cancelBooking } = require("../controllers/bookingController");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/book/:propertyId", authMiddleware, bookProperty);
router.put("/update/:bookingId", authMiddleware, updateBooking);
router.delete("/cancel/:bookingId", authMiddleware, cancelBooking);

module.exports = router;
