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
const authMiddleware = require("../middleware/authMiddleware");
const multer = require("multer");
const path = require("path");

// Set up Multer storage (store images in "uploads" folder)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
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
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
    files: 10, // Max 10 images
  },
}).array("images", 10);

// IMPORTANT: Order of routes matters - specific routes first, then parameter routes
router.post(
  "/create",
  authMiddleware,
  (req, res, next) => {
    upload(req, res, (err) => {
      if (err) return handleUploadErrors(err, req, res, next);
      next();
    });
  },
  createProperty
);

// Middleware to handle upload errors
const handleUploadErrors = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      message: "File upload error",
      error: err.code === "LIMIT_FILE_SIZE" 
        ? "File too large (max 5MB)" 
        : err.message
    });
  } else if (err) {
    return res.status(400).json({ 
      message: "Upload failed",
      error: err.message 
    });
  }
  next();
};


router.get("/all", getAllProperties);
router.get("/search", searchProperties);
router.get("/my-properties", authMiddleware, getMyProperties);
router.get("/count-by-category", getPropertyCountByCategory); // Specific route BEFORE parameter routes

router.get("/count", getTotalProperties);
router.get("/selling-count", getSellingPropertiesCount);

// Parameter routes come AFTER specific routes
router.delete("/:id", authMiddleware, deleteProperty);
router.put("/:id", authMiddleware, upload, editProperty);
router.get("/:id", getPropertyById);

module.exports = router;
