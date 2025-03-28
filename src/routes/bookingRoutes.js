const express = require("express");
const router = express.Router();
const {
  bookProperty,
  updateBooking,
  cancelBooking,
  getBookedDates,
  getMyBookings,
  confirmBookingPayment
} = require("../controllers/bookingController");
const authMiddleware = require("../middleware/authMiddleware");

// Add payment confirmation route
router.put("/confirm/:id", authMiddleware, confirmBookingPayment);

// Existing routes
router.post("/book/:propertyId", authMiddleware, bookProperty);
router.put("/update/:bookingId", authMiddleware, updateBooking);
router.delete("/cancel/:bookingId", authMiddleware, cancelBooking);
router.get("/booked-dates/:propertyId", getBookedDates);
router.get("/my-bookings", authMiddleware, getMyBookings);

// Property route
router.get("/property/:propertyId", async (req, res) => {
  try {
    const property = await Property.findById(req.params.propertyId);
    if (!property) {
      return res.status(404).json({ message: "Property not found." });
    }
    res.status(200).json(property);
  } catch (error) {
    res.status(500).json({ 
      message: "Server error",
      error: process.env.NODE_ENV === "development" ? error.message : null
    });
  }
});

module.exports = router;