const Booking = require("../models/BookingModel");
const Property = require("../models/PropertyModel");

// Helper function to get payment method label
const getPaymentMethodLabel = (paymentType) => {
  switch (paymentType) {
    case 'pay_full': return 'Full Payment';
    case 'pay_deposit': return 'Deposit Payment';
    case 'pay_later': return 'Pay at Check-in';
    default: return 'Unknown Payment Method';
  }
};

exports.bookProperty = async (req, res) => {
  try {
    const propertyId = req.params.propertyId;
    const { startDate, endDate, paymentType, paidAmount, depositAmount, remainingBalance } = req.body;

    // Validate input
    if (!startDate || !endDate || !paymentType) {
      return res.status(400).json({ message: "Missing required booking information" });
    }

    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    // Calculate days based on property's pricing unit
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

    if (days <= 0) {
      return res.status(400).json({ message: "Invalid date range" });
    }

    // Calculate total price
    let totalPrice;
    switch (property.pricingUnit || "Per Day") {
      case "Per Week":
        totalPrice = property.price * Math.ceil(days / 7);
        break;
      case "Per Month":
        totalPrice = property.price * Math.ceil(days / 30);
        break;
      default: // Per Day
        totalPrice = property.price * days;
    }

    // Determine payment status based on payment type
    let paymentStatus;
    if (paymentType === "pay_later") {
      paymentStatus = "pending";
    } else if (paymentType === "pay_deposit") {
      paymentStatus = "partially_paid";
    } else {
      paymentStatus = "pending"; // Will be updated to "paid" after successful payment
    }

    // Create booking with all required fields
    // Create booking with all required fields
const booking = new Booking({
  user: req.user.id,
  property: propertyId,
  startDate,
  endDate,
  totalPrice,
  paymentType,
  paymentStatus,
  depositAmount: depositAmount || 0,
  remainingBalance: Math.max(0, (remainingBalance || (totalPrice - (paidAmount || 0))))
});

    await booking.save();
    
    res.status(201).json({ 
      message: "Booking created successfully", 
      booking 
    });
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({ 
      message: "Internal Server Error",
      error: error.message
    });
  }
};

// Confirm booking payment
exports.confirmBookingPayment = async (req, res) => {
  try {
    const { paymentIntentId, status } = req.body;
    const bookingId = req.params.id;

    if (!paymentIntentId) {
      return res.status(400).json({ error: "Missing payment intent ID" });
    }

    if (!status || !["pending", "partially_paid", "paid"].includes(status)) {
      return res.status(400).json({ error: "Invalid payment status" });
    }

    const booking = await Booking.findById(bookingId);
    
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }
    
    // Verify this booking belongs to the authenticated user
    if (booking.user.toString() !== req.user.id) {
      return res.status(403).json({ error: "Unauthorized access to this booking" });
    }

    const updatedBooking = await Booking.findByIdAndUpdate(
      bookingId,
      { 
        paymentStatus: status, 
        paymentIntentId 
      },
      { new: true }
    );

    res.json({
      success: true,
      message: "Payment confirmed successfully",
      booking: updatedBooking
    });
  } catch (error) {
    console.error("Error confirming payment:", error);
    res.status(500).json({ 
      error: "Error confirming payment", 
      details: error.message 
    });
  }
};

// Update a booking
exports.updateBooking = async (req, res) => {
  try {
    const { startDate, endDate } = req.body;
    const bookingId = req.params.bookingId;
    const userId = req.user.id;

    const booking = await Booking.findOne({ _id: bookingId, user: userId });

    if (!booking) {
      return res
        .status(404)
        .json({ message: "Booking not found or unauthorized." });
    }

    // Check for overlapping bookings
    const overlappingBooking = await Booking.findOne({
      property: booking.property,
      _id: { $ne: bookingId },
      $or: [
        { startDate: { $lte: new Date(endDate), $gte: new Date(startDate) } },
        { endDate: { $lte: new Date(endDate), $gte: new Date(startDate) } },
      ],
    });

    if (overlappingBooking) {
      return res.status(400).json({
        message: "This property is already booked for the selected dates.",
      });
    }

    booking.startDate = startDate;
    booking.endDate = endDate;
    await booking.save();

    res.status(200).json({ message: "Booking updated successfully!", booking });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Cancel a booking
exports.cancelBooking = async (req, res) => {
  try {
    const bookingId = req.params.bookingId;
    const userId = req.user.id;

    const booking = await Booking.findOneAndDelete({
      _id: bookingId,
      user: userId,
    });

    if (!booking) {
      return res
        .status(404)
        .json({ message: "Booking not found or unauthorized." });
    }

    res.status(200).json({ message: "Booking canceled successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get booked dates for a property
exports.getBookedDates = async (req, res) => {
  try {
    const propertyId = req.params.propertyId;
    const bookings = await Booking.find({ property: propertyId }).select(
      "startDate endDate"
    );

    res.status(200).json({ bookedDates: bookings });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get user's bookings
exports.getMyBookings = async (req, res) => {
  try {
    const userId = req.user.id; // Ensure user ID is coming from authMiddleware
    const bookings = await Booking.find({ user: userId }).populate(
      "property",
      "title"
    );

    res.status(200).json({ bookings });
  } catch (error) {
    console.error("Error fetching user bookings:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getAllProperties = async (req, res) => {
  try {
    const properties = await Property.find().populate(
      "category owner tags",
      "name"
    );

    res.status(200).json(properties);
  } catch (error) {
    console.error("Error fetching properties:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Transaction-related functions
exports.getMyTransactions = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const transactions = await Booking.find({ 
      user: userId,
      paymentStatus: { $ne: null } // Only include bookings with payment status
    })
    .populate('property', 'title')
    .sort({ createdAt: -1 }); // Newest first

    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ error: "Error fetching transactions", details: error.message });
  }
};

// Add this new controller function
exports.getActiveBookingsCount = async (req, res) => {
  try {
    const count = await Booking.countDocuments({ 
      paymentStatus: { $in: ["paid", "partially_paid"] },
      endDate: { $gte: new Date() }
    });
    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};