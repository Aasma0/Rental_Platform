const Property = require("../models/PropertyModel");
const Tag = require("../models/TagModel"); // Import the Tag model

// Create a new property
const createProperty = async (req, res) => {
  try {
    const { title, description, location, price, category, tags } = req.body;

    // Check if required fields are present
    if (!title || !description || !location || !price || !category) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Ensure tags is an array, and parse it if it's a string
    let parsedTags = tags;

    // If it's a string, try parsing it as JSON
    if (typeof tags === 'string') {
      try {
        parsedTags = JSON.parse(tags); // Attempt to parse the string
      } catch (err) {
        return res.status(400).json({ message: "Invalid tags format. Ensure it's a valid JSON array." });
      }
    }

    // Ensure tags are now an array
    if (!Array.isArray(parsedTags)) {
      return res.status(400).json({ message: "Tags must be an array" });
    }

    // Ensure tags don't exceed 10
    if (parsedTags.length > 10) {
      return res.status(400).json({ message: "You can select a maximum of 10 tags" });
    }

    // Verify if all tags exist in the database
    if (parsedTags.length > 0) {
      const validTags = await Tag.find({ '_id': { $in: parsedTags } });
      if (validTags.length !== parsedTags.length) {
        return res.status(400).json({ message: "Some tags are invalid" });
      }
    }

    // Get uploaded image filenames
    const imagePaths = req.files.map((file) => file.path); // Store file paths in DB

    // Create new property with tags
    const newProperty = new Property({
      title,
      description,
      location,
      price,
      images: imagePaths,
      category,
      tags: parsedTags, // Store parsed tags
      owner: req.user.id, // Owner from token
    });

    // Save the property
    await newProperty.save();

    // Return success response with populated tags
    const populatedProperty = await Property.findById(newProperty._id).populate('tags', 'name');
    res.status(201).json({ message: "Property created successfully", property: populatedProperty });
  } catch (error) {
    console.error("Error creating property:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Fetch all properties with tag details
const getAllProperties = async (req, res) => {
  try {
    const { category } = req.query; // Get category from query params
    const query = category ? { category } : {}; // If category exists, filter by it

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
    const userId = req.user.id; // Get user ID from the token

    const properties = await Property.find({ owner: userId })
      .populate("category owner tags", "name");

    // Format image URLs before sending response
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
    const { title, description, location, price, category, tags } = req.body;

    // Find the property
    let property = await Property.findById(id);
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    // Check if the logged-in user is the owner
    if (property.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized to update this property" });
    }

    // Handle image updates (if new images are uploaded)
    let updatedImages = property.images; // Keep existing images
    if (req.files && req.files.length > 0) {
      const imagePaths = req.files.map((file) => file.path); // Store file paths in DB
      updatedImages = imagePaths; // Replace with new images
    }

    // Update the property
    property = await Property.findByIdAndUpdate(
      id,
      { title, description, location, price, category, tags, images: updatedImages },
      { new: true } // Return updated document
    ).populate("category owner tags", "name");

    // Send updated property
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
  getPropertyById, // Add this line to export the function
};