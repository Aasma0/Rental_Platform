const express = require("express");
const router = express.Router();
const { 
  createProperty, 
  getAllProperties, 
  searchProperties,
  getMyProperties,
  editProperty,
  getPropertyById,
  getPropertyCountByCategory,
  deleteProperty,
  getSellingPropertiesCount,
  getTotalProperties,
} = require("../controllers/PropertyController");
const Property = require("../models/PropertyModel");
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

// IMPORTANT: Order of routes matters - specific routes first, then parameter routes
router.post("/create", authMiddleware, upload, createProperty);
router.get("/all", getAllProperties);
router.get("/search", searchProperties);
router.get("/my-properties", authMiddleware, getMyProperties);
router.get("/count-by-category", getPropertyCountByCategory); // Specific route BEFORE parameter routes

router.get('/count', getTotalProperties);
router.get('/selling-count', getSellingPropertiesCount);

// Parameter routes come AFTER specific routes
router.delete("/:id", authMiddleware, deleteProperty);
router.put("/:id", authMiddleware, upload, editProperty);
router.get("/:id", getPropertyById);

module.exports = router;