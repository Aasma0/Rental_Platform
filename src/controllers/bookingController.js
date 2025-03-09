const Booking = require("../models/BookingModel");
const Property = require("../models/PropertyModel");

// Book a property
const bookProperty = async (req, res) => {
  try {
    const { startDate, endDate } = req.body;
    const { propertyId } = req.params;
    const userId = req.user.id;

    if (!startDate || !endDate) {
      return res.status(400).json({ message: "Start date and end date are required" });
    }

    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    // Check if the property is already booked for the selected dates
    const overlappingBooking = await Booking.findOne({
      property: propertyId,
      $or: [
        { startDate: { $lte: new Date(endDate) }, endDate: { $gte: new Date(startDate) } },
      ],
    });

    if (overlappingBooking) {
      return res.status(400).json({ message: "Property is already booked for the selected dates" });
    }

    // Create a new booking
    const booking = new Booking({
      property: propertyId,
      user: userId,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
    });

    await booking.save();
    res.status(201).json({ message: "Booking successful", booking });
  } catch (error) {
    console.error("Error booking property:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get all bookings for a user
const getBookings = async (req, res) => {
  try {
    const userId = req.user.id;
    const bookings = await Booking.find({ user: userId }).populate("property");
    res.status(200).json({ bookings });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { bookProperty, getBookings };
