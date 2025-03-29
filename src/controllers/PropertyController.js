const Property = require("../models/PropertyModel");
const Tag = require("../models/TagModel"); // Import the Tag model

// Create a new property
const createProperty = async (req, res) => {
  try {
    let { title, description, location, price, category, tags, type, pricingUnit, totalPrice } = req.body;

    if (!title || !description || !location || !price || !category || !type) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // For renting, pricingUnit is required; for selling, totalPrice is required
    if (type === "Renting" && !["Per Day", "Per Week", "Per Month"].includes(pricingUnit)) {
      return res.status(400).json({ message: "Invalid pricing unit. Must be 'Per Day', 'Per Week', or 'Per Month' for renting" });
    }
    if (type === "Selling" && !totalPrice) {
      return res.status(400).json({ message: "Total price is required for selling properties" });
    }

    // Parse tags if it's a JSON string
    let parsedTags = tags;
    if (typeof tags === "string") {
      try {
        parsedTags = JSON.parse(tags);
      } catch (err) {
        return res.status(400).json({ message: "Invalid tags format. Ensure it's a valid JSON array." });
      }
    }

    // Create the property
    const newProperty = new Property({
      title,
      description,
      location,
      price,
      totalPrice, // Only used for selling properties
      pricingUnit: type === "Renting" ? pricingUnit : undefined,
      images: req.files.map((file) => file.path),
      category,
      tags: parsedTags,
      owner: req.user.id,
      type,
    });

    await newProperty.save();
    res.status(201).json({ message: "Property created successfully", property: newProperty });
  } catch (error) {
    console.error("Error creating property:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Fetch all properties with tag details (optional filtering by category and type)
const getAllProperties = async (req, res) => {
  try {
    const { category, type } = req.query;
    const query = {};
    if (category) query.category = category;
    if (type && ["Renting", "Selling"].includes(type)) query.type = type;

    const properties = await Property.find(query)
      .populate("category owner tags", "name");

    // Map through properties to include full image URLs
    const propertiesWithImages = properties.map(property => ({
      ...property.toObject(),
      images: property.images.map(image => `${req.protocol}://${req.get('host')}/${image.split('/').pop()}`)
    }));

    res.status(200).json(propertiesWithImages);
  } catch (error) {
    console.error("Error fetching properties:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Search properties
const searchProperties = async (req, res) => {
  try {
    const { search } = req.query;

    if (!search) {
      return res.status(400).json({ message: "Search query is required" });
    }

    let tagMatch = [];

    // Find matching tag IDs
    const matchingTags = await Tag.find({ name: { $regex: search, $options: "i" } });
    if (matchingTags.length > 0) {
      tagMatch = matchingTags.map(tag => tag._id);
    }

    // Search for properties by location or tags
    const query = {
      $or: [
        { location: { $regex: search, $options: "i" } },
        { tags: { $in: tagMatch } },
      ],
    };

    let properties = await Property.find(query).populate("tags", "name");

    // Format image URLs before sending response
    const propertiesWithImages = properties.map(property => ({
      ...property.toObject(),
      images: property.images.map(image => `${req.protocol}://${req.get('host')}/${image.split('/').pop()}`)
    }));

    res.json({ properties: propertiesWithImages });
  } catch (error) {
    console.error("Search Error:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// Fetch properties created by the logged-in user
const getMyProperties = async (req, res) => {
  try {
    const userId = req.user.id;

    const properties = await Property.find({ owner: userId })
      .populate("category owner tags", "name");

    const propertiesWithImages = properties.map(property => ({
      ...property.toObject(),
      images: property.images.map(image => `${req.protocol}://${req.get('host')}/${image.split('/').pop()}`)
    }));

    res.status(200).json(propertiesWithImages);
  } catch (error) {
    console.error("Error fetching user's properties:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Delete a property
const deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    if (property.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await Property.findByIdAndDelete(req.params.id);
    res.json({ message: "Property deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update property by ID (Only owner can update)
const editProperty = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, location, price, category, tags, type, pricingUnit, totalPrice } = req.body;

    let property = await Property.findById(id);
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    // Check if the logged-in user is the owner
    if (property.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized to update this property" });
    }

    if (type && !["Renting", "Selling"].includes(type)) {
      return res.status(400).json({ message: "Invalid type. Must be 'Renting' or 'Selling'." });
    }

    // Handle image updates (if new images are uploaded)
    let updatedImages = property.images; // Keep existing images
    if (req.files && req.files.length > 0) {
      updatedImages = req.files.map((file) => file.path);
    }

    // Update the property
    property = await Property.findByIdAndUpdate(
      id,
      { title, description, location, price, totalPrice, pricingUnit, category, tags, images: updatedImages, type },
      { new: true }
    ).populate("category owner tags", "name");

    res.status(200).json({ message: "Property updated successfully", property });
  } catch (error) {
    console.error("Error updating property:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get property by ID
const getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }
    res.status(200).json(property);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching property" });
  }
};

module.exports = {
  createProperty,
  getAllProperties,
  searchProperties,
  getMyProperties,
  editProperty,
  deleteProperty,
  getPropertyById,
};
