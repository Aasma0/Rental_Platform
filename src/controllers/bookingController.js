const Booking = require("../models/BookingModel");
const Property = require("../models/PropertyModel");

exports.bookProperty = async (req, res) => {
  try {
    const { startDate, endDate, paymentType } = req.body;
    const propertyId = req.params.propertyId;
    const userId = req.user.id;

    // Validate input
    if (!startDate || !endDate || !paymentType) {
      return res.status(400).json({
        error: "Missing required fields: startDate, endDate, paymentType"
      });
    }

    // Parse dates
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({
        error: "Invalid date format. Use ISO 8601 format (YYYY-MM-DD)"
      });
    }

    // Check if property exists
    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({
        error: "Property not found"
      });
    }

    // Calculate number of nights. If dates are the same, assume at least one night.
    const msPerDay = 1000 * 3600 * 24;
    const nights = Math.ceil((end - start) / msPerDay) || 1;

    // Use the correct field from the property. 
    // For example, if your property model has `price` (as used in your frontend), use that.
    const propertyPrice = property.price;
    if (typeof propertyPrice !== "number") {
      return res.status(500).json({
        error: "Property price is not valid"
      });
    }

    const totalPrice = propertyPrice * nights;

    // Create new booking
    const booking = new Booking({
      property: propertyId,
      user: userId,
      startDate,
      endDate,
      totalPrice,
      paymentType,
      paymentStatus: "pending" // initial status
    });

    await booking.save();
    res.status(200).json({ booking });

  } catch (error) {
    console.error("Booking Error:", error);
    res.status(500).json({
      error: "Booking failed",
      details: process.env.NODE_ENV === "development" ? error.message : null
    });
  }
};
// Confirm booking payment
exports.confirmBookingPayment = async (req, res) => {
  try {
    const { paymentIntentId, status } = req.body;
    const bookingId = req.params.id;

    if (!paymentIntentId || !status) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const validStatuses = ["pending", "partially_paid", "paid"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid payment status" });
    }

    const updatedBooking = await Booking.findByIdAndUpdate(
      bookingId,
      { paymentStatus: status, paymentIntentId },
      { new: true }
    );

    if (!updatedBooking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    res.json(updatedBooking);

  } catch (error) {
    res.status(500).json({ error: "Error confirming payment", details: error.message });
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
      return res
        .status(400)
        .json({
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
    const bookings = await Booking.find({ user: userId }).populate("property", "title");

    res.status(200).json({ bookings });
  } catch (error) {
    console.error("Error fetching user bookings:", error);
    res.status(500).json({ message: "Server error" });
  }
};

