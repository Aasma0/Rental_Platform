const Tag = require('../models/TagModel');

// Fetch all tags
const getTags = async (req, res) => {
  try {
    const tags = await Tag.find();
    res.status(200).json(tags);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch tags", error: error.message });
  }
};

// Admin only: Create new tag
const createTag = async (req, res) => {
  try {
    const { name } = req.body;
    
    if (!name) {
      return res.status(400).json({ message: "Tag name is required" });
    }

    // Assuming you have a Tag model to handle tag creation
    const newTag = new Tag({ name });
    await newTag.save();

    return res.status(201).json({ message: "Tag created successfully", tag: newTag });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error creating tag" });
  }
};

module.exports = { getTags, createTag };
