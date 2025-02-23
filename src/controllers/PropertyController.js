const Property = require("../models/PropertyModel");

// Create a new property
const createProperty = async (req, res) => {
  try {
    const { title, description, location, price, category } = req.body;

    if (!title || !description || !location || !price || !category) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Get uploaded image filenames
    const imagePaths = req.files.map((file) => file.path); // Store file paths in DB

    const newProperty = new Property({
      title,
      description,
      location,
      price,
      images: imagePaths,
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

// Fetch all properties
const getAllProperties = async (req, res) => {
  try {
    const properties = await Property.find().populate("category owner", "name");
    
    // Map through properties to include full image URLs
    const propertiesWithImages = properties.map(property => ({
      ...property.toObject(),
      images: property.images.map(image => `${req.protocol}://${req.get('host')}/${image.split('/').pop()}`) // Create full URL for each image
    }));

    res.status(200).json(propertiesWithImages);
  } catch (error) {
    console.error("Error fetching properties:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { createProperty, getAllProperties };