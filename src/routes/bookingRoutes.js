const express = require("express");
const {
  bookProperty,
  updateBooking,
  cancelBooking,
  getBookedDates,
} = require("../controllers/bookingController");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/book/:propertyId", authMiddleware, bookProperty);
router.put("/update/:bookingId", authMiddleware, updateBooking);
router.delete("/cancel/:bookingId", authMiddleware, cancelBooking);
router.get("/booked-dates/:propertyId", getBookedDates);
module.exports = router;
