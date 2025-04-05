// In your routes/tagRouter.js

const express = require("express");
const Tag = require("../models/TagModel");
const isAdmin = require("../middleware/authMiddleware"); // Import the isAdmin middleware
const router = express.Router();

// Route to fetch all tags (accessible by all users)
router.get("/view", async (req, res) => {
  try {
    const tags = await Tag.find(); // Fetch all tags from the database
    res.status(200).json({ tags }); // Send the tags in the response
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching tags", error });
  }
});

// Route to create a new tag (only accessible by admins)
router.post("/create", isAdmin, async (req, res) => {
  const { name } = req.body;

  // Check if the name is provided
  if (!name) {
    return res.status(400).json({ message: "Tag name is required" });
  }

  try {
    const newTag = new Tag({ name });
    await newTag.save(); // Save the tag to the database
    res.status(201).json({ message: "Tag created successfully", tag: newTag });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating tag", error });
  }
});

// DELETE a tag by ID (admin only)
router.delete("/delete/:id", isAdmin, async (req, res) => {
  try {
    const tagId = req.params.id;
    const deletedTag = await Tag.findByIdAndDelete(tagId);

    if (!deletedTag) {
      return res.status(404).json({ message: "Tag not found" });
    }

    res.status(200).json({ message: "Tag deleted successfully" });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ message: "Error deleting tag", error });
  }
});


module.exports = router;
