const express = require("express");
const router = express.Router();
const { createProperty, 
        getAllProperties, 
        searchProperties,
        getMyProperties,
        editProperty,
        getPropertyById,
        deleteProperty} = require("../controllers/PropertyController");
const authMiddleware = require("../middleware/authMiddleware");
const multer = require("multer");
const path = require("path");

// Set up Multer storage (store images in "uploads" folder)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Save images in the "uploads" folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); // Unique filename
  },
});

// File filter for images only
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"), false);
  }
};

// Multer middleware (max 10 images)
const upload = multer({ storage, fileFilter }).array("images", 10);

// Modify route to use Multer
router.post("/create", authMiddleware, upload, createProperty);
router.get("/all", getAllProperties); // Route to get all properties
router.get("/search", searchProperties); // Search by location or tags
router.get("/my-properties", authMiddleware, getMyProperties);
router.delete("/:id", authMiddleware, deleteProperty);
router.put("/:id", authMiddleware, upload, editProperty);
router.get("/:id", getPropertyById);
module.exports = router;