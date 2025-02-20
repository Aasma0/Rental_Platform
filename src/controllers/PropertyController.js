const Property = require("../models/PropertyModel");

const createProperty = async (req, res) => {
  try {
    const { title, description, location, price, images, category } = req.body;

    if (!title || !description || !location || !price || !category) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newProperty = new Property({
      title,
      description,
      location,
      price,
      images,
      category,
      owner: req.user.id, // Owner from token
    });

    await newProperty.save();
    res.status(201).json({ message: "Property created successfully", property: newProperty });
  } catch (error) {
    console.error("Error creating property:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { createProperty };
