const Booking = require("../models/BookingModel");
const Property = require("../models/PropertyModel");

// Book a property (only if no existing booking and no overlapping bookings)
exports.bookProperty = async (req, res) => {
  try {
    const { startDate, endDate } = req.body;
    const propertyId = req.params.propertyId;
    const userId = req.user.id;

    // Check if user already has a booking for this property
    const existingBooking = await Booking.findOne({
      user: userId,
      property: propertyId,
    });

    if (existingBooking) {
      return res
        .status(400)
        .json({
          message:
            "You have already booked this property. Update or cancel your booking instead.",
        });
    }

    // Check if the property has overlapping bookings
    const overlappingBooking = await Booking.findOne({
      property: propertyId,
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

    const newBooking = new Booking({
      user: userId,
      property: propertyId,
      startDate,
      endDate,
    });

    await newBooking.save();
    res
      .status(201)
      .json({ message: "Booking successful!", booking: newBooking });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
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

// Book a property (no overlapping bookings)
exports.bookProperty = async (req, res) => {
  try {
    const { startDate, endDate } = req.body;
    const propertyId = req.params.propertyId;
    const userId = req.user.id;

    if (new Date(startDate) >= new Date(endDate)) {
      return res
        .status(400)
        .json({ message: "End date must be after start date." });
    }

    // Check if user already booked this property
    const existingBooking = await Booking.findOne({
      user: userId,
      property: propertyId,
    });

    if (existingBooking) {
      return res
        .status(400)
        .json({
          message:
            "You have already booked this property. Update or cancel your booking instead.",
        });
    }

    // Check for any overlapping booking
    const overlappingBooking = await Booking.findOne({
      property: propertyId,
      $or: [
        { startDate: { $lt: new Date(endDate), $gte: new Date(startDate) } },
        { endDate: { $gt: new Date(startDate), $lte: new Date(endDate) } },
        {
          startDate: { $lte: new Date(startDate) },
          endDate: { $gte: new Date(endDate) },
        }, // Fully overlaps
      ],
    });

    if (overlappingBooking) {
      return res
        .status(400)
        .json({
          message: "This property is already booked for the selected dates.",
        });
    }

    const newBooking = new Booking({
      user: userId,
      property: propertyId,
      startDate,
      endDate,
    });

    await newBooking.save();
    res
      .status(201)
      .json({ message: "Booking successful!", booking: newBooking });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Update a booking
exports.updateBooking = async (req, res) => {
  try {
    const { startDate, endDate } = req.body;
    const bookingId = req.params.bookingId;
    const userId = req.user.id;

    if (new Date(startDate) >= new Date(endDate)) {
      return res
        .status(400)
        .json({ message: "End date must be after start date." });
    }

    const booking = await Booking.findOne({ _id: bookingId, user: userId });

    if (!booking) {
      return res
        .status(404)
        .json({ message: "Booking not found or unauthorized." });
    }

    // Check for overlapping bookings (excluding current booking)
    const overlappingBooking = await Booking.findOne({
      property: booking.property,
      _id: { $ne: bookingId },
      $or: [
        { startDate: { $lt: new Date(endDate), $gte: new Date(startDate) } },
        { endDate: { $gt: new Date(startDate), $lte: new Date(endDate) } },
        {
          startDate: { $lte: new Date(startDate) },
          endDate: { $gte: new Date(endDate) },
        }, // Fully overlaps
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
