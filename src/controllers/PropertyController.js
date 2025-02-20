const Property = require("../models/PropertyModel");

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

// New function to get properties of the logged-in user
// const getUserProperties = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const properties = await Property.find({ owner: userId });

//     res.status(200).json({ properties });
//   } catch (error) {
//     console.error("Error fetching user's properties:", error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };

module.exports = { createProperty};
