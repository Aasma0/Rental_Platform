const express = require('express');

const router = express.Router();
const {
  bookProperty,
  confirmBookingPayment,
  updateBooking,
  cancelBooking,
  getBookedDates,
  getMyBookings,
  getAllProperties,
  getMyTransactions,
  getTransactionById,
  getAllTransactions
} = require('../controllers/bookingController');
const authMiddleware = require('../middleware/authMiddleware');

// Existing routes
router.post('/book/:propertyId', authMiddleware, bookProperty);
router.put('/confirm/:id', authMiddleware, confirmBookingPayment);
router.put('/update/:bookingId', authMiddleware, updateBooking);
router.delete('/cancel/:bookingId', authMiddleware, cancelBooking);
router.get('/booked-dates/:propertyId', getBookedDates);
router.get('/my-bookings', authMiddleware, getMyBookings);
router.get('/properties', getAllProperties);

// New transaction routes
router.get('/my-transactions', authMiddleware, getMyTransactions);
// router.get('/transactions/:id', authMiddleware, getTransactionById);
// router.get('/admin/transactions', authMiddleware, getAllTransactions);

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