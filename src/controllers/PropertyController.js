const Property = require("../models/PropertyModel");
const Tag = require("../models/TagModel"); // Import the Tag model
const Survey = require ("../models/SurveyModel.js");
const mongoose = require('mongoose');

// Create a new property
const createProperty = async (req, res) => {
  try {
    const { 
      title,
      description,
      location,
      price,
      category,
      tags,
      type,
      pricingUnit,
      totalPrice
    } = req.body;

    // Validate required fields
    if (!title || !description || !location || !price || !category || !type) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Parse and validate survey data
    let surveyData;
    try {
      surveyData = req.body.survey ? JSON.parse(req.body.survey) : null;
    } catch (parseError) {
      return res.status(400).json({ 
        message: "Invalid survey format",
        error: "Survey must be a valid JSON string" 
      });
    }

    // Validate survey requirements for shared properties
    if (type === "Sharing") {
      if (!surveyData) {
        return res.status(400).json({ 
          message: "Roommate compatibility survey is required for shared properties" 
        });
      }

      const requiredFields = ['sleepSchedule', 'smoking', 'noisePreference', 'neatness'];
      const missingFields = requiredFields.filter(field => !(field in surveyData));
      if (missingFields.length > 0) {
        return res.status(400).json({
          message: `Missing survey fields: ${missingFields.join(', ')}`
        });
      }

      if (isNaN(surveyData.noisePreference) || isNaN(surveyData.neatness)) {
        return res.status(400).json({
          message: "Noise preference and neatness must be numerical values"
        });
      }
    }

    // Validate pricing model
    if ((type === "Renting" || type === "Sharing") && !pricingUnit) {
      return res.status(400).json({
        message: `Pricing unit is required for ${type.toLowerCase()} properties`
      });
    }

    if ((type === "Renting" || type === "Sharing") &&
      !["Per Day", "Per Week", "Per Month"].includes(pricingUnit)) {
      return res.status(400).json({
        message: `Invalid pricing unit. Must be 'Per Day', 'Per Week', or 'Per Month' for ${type.toLowerCase()} properties`,
      });
    }

    if (type === "Selling" && !totalPrice) {
      return res.status(400).json({ 
        message: "Total price is required for selling properties" 
      });
    }

    // Parse tags
    let parsedTags = tags;
    try {
      parsedTags = typeof tags === 'string' ? JSON.parse(tags) : tags;
    } catch (err) {
      return res.status(400).json({
        message: "Invalid tags format. Ensure it's a valid JSON array."
      });
    }

    // Create property (without using a transaction)
    const newProperty = new Property({
      title,
      description,
      location,
      price,
      totalPrice: type === "Selling" ? totalPrice || price : undefined,
      pricingUnit: ["Renting", "Sharing"].includes(type) ? pricingUnit : undefined,
      images: req.files?.map(file => file.path) || [],
      category,
      tags: parsedTags,
      owner: req.user.id,
      type,
    });

    await newProperty.save();

    // Create and link survey for shared properties if applicable
    if (type === "Sharing" && surveyData) {
      try {
        const createdSurvey = new Survey({
          property: newProperty._id,
          user: req.user.id,
          sleepSchedule: surveyData.sleepSchedule,
          smoking: surveyData.smoking,
          noisePreference: Number(surveyData.noisePreference),
          neatness: Number(surveyData.neatness)
        });

        await createdSurvey.save();

        newProperty.survey = createdSurvey._id;
        await newProperty.save();
      } catch (surveyError) {
        return res.status(400).json({
          message: "Survey validation failed",
          error: surveyError.message
        });
      }
    }

    // Populate relationships for response
    const populatedProperty = await Property.findById(newProperty._id)
      .populate('tags category owner survey')
      .exec();

    res.status(201).json({
      message: "Property created successfully",
      property: populatedProperty
    });
  } catch (error) {
    console.error("Error creating property:", error);
    res.status(500).json({ 
      message: "Internal Server Error",
      error: error.message 
    });
  }
};

// Fetch all properties with tag details (optional filtering by category and type)
// Updated getAllProperties function
const getAllProperties = async (req, res) => {
  try {
    const { category, type, populate } = req.query;
    const query = {};
    
    // Build base query
    if (category) query.category = category;
    if (type) query.type = type;

    // Handle population
    const population = (populate || "").split(",").filter(Boolean);
    let queryBuilder = Property.find(query);

    // Add population for each field
    population.forEach(field => {
      queryBuilder = queryBuilder.populate(field);
    });

    // Execute query
    const properties = await queryBuilder
      .populate("category tags") // Always populate these
      .exec();

    // Format images
    const propertiesWithImages = properties.map((property) => ({
      ...property.toObject(),
      images: property.images.map(
        (image) => `${req.protocol}://${req.get("host")}/${image.split("/").pop()}`
      ),
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
    const matchingTags = await Tag.find({
      name: { $regex: search, $options: "i" },
    });
    if (matchingTags.length > 0) {
      tagMatch = matchingTags.map((tag) => tag._id);
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
    const propertiesWithImages = properties.map((property) => ({
      ...property.toObject(),
      images: property.images.map(
        (image) =>
          `${req.protocol}://${req.get("host")}/${image.split("/").pop()}`
      ),
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

    const properties = await Property.find({ owner: userId }).populate(
      "category owner tags",
      "name"
    );

    const propertiesWithImages = properties.map((property) => ({
      ...property.toObject(),
      images: property.images.map(
        (image) =>
          `${req.protocol}://${req.get("host")}/${image.split("/").pop()}`
      ),
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
// Update property by ID (Only owner can update)
const editProperty = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      location,
      price,
      category,
      tags,
      type,
      pricingUnit,
      totalPrice,
      coordinates
    } = req.body;

    let property = await Property.findById(id);
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    // Check if the logged-in user is the owner
    if (property.owner.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Unauthorized to update this property" });
    }

    // Validate property type
    if (type && !["Renting", "Selling", "Sharing"].includes(type)) {
      return res
        .status(400)
        .json({ message: "Invalid type. Must be 'Renting', 'Selling', or 'Sharing'." });
    }

    // Parse tags
    let parsedTags = tags;
    try {
      parsedTags = typeof tags === 'string' ? JSON.parse(tags) : tags;
    } catch (err) {
      return res.status(400).json({
        message: "Invalid tags format. Ensure it's a valid JSON array."
      });
    }

    // Handle coordinates
    let parsedCoordinates = coordinates;
    try {
      parsedCoordinates = typeof coordinates === 'string' ? JSON.parse(coordinates) : coordinates;
    } catch (err) {
      console.error("Coordinates parsing error:", err);
      // If coordinates can't be parsed, continue with existing coordinates
      parsedCoordinates = property.coordinates;
    }

    // Handle survey data for shared properties
    let surveyData;
    if (type === "Sharing") {
      try {
        surveyData = req.body.survey ? JSON.parse(req.body.survey) : null;
        
        if (!surveyData && !property.survey) {
          return res.status(400).json({ 
            message: "Roommate compatibility survey is required for shared properties" 
          });
        }
        
        // If we have new survey data, update or create the survey
        if (surveyData) {
          if (property.survey) {
            // Update existing survey
            await Survey.findByIdAndUpdate(property.survey, {
              sleepSchedule: surveyData.sleepSchedule,
              smoking: surveyData.smoking,
              noisePreference: Number(surveyData.noisePreference),
              neatness: Number(surveyData.neatness)
            });
          } else {
            // Create new survey
            const createdSurvey = new Survey({
              property: property._id,
              user: req.user.id,
              sleepSchedule: surveyData.sleepSchedule,
              smoking: surveyData.smoking,
              noisePreference: Number(surveyData.noisePreference),
              neatness: Number(surveyData.neatness)
            });
            
            await createdSurvey.save();
            property.survey = createdSurvey._id;
          }
        }
      } catch (parseError) {
        console.error("Survey parsing error:", parseError);
        // If there's a parsing error, use existing survey data
      }
    }

    // Handle image updates (if new images are uploaded)
    let updatedImages = property.images; // Keep existing images
    if (req.files && req.files.length > 0) {
      updatedImages = req.files.map((file) => file.path);
    }

    // Update the property
    const updateData = {
      title,
      description,
      location,
      price,
      coordinates: parsedCoordinates,
      category,
      tags: parsedTags,
      images: updatedImages,
      type
    };

    // Add conditional fields based on property type
    if (type === "Selling") {
      updateData.totalPrice = totalPrice || price;
      updateData.pricingUnit = undefined;
    } else if (["Renting", "Sharing"].includes(type)) {
      updateData.pricingUnit = pricingUnit;
      updateData.totalPrice = undefined;
    }

    property = await Property.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    ).populate("category owner tags survey", "name");

    res
      .status(200)
      .json({ message: "Property updated successfully", property });
  } catch (error) {
    console.error("Error updating property:", error);
    res.status(500).json({ 
      message: "Internal Server Error", 
      error: error.message 
    });
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

// Get count of properties per category
const getPropertyCountByCategory = async (req, res) => {
  try {
    console.log("Executing getPropertyCountByCategory...");

    const result = await Property.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "categories", // Make sure this matches your actual collection name in MongoDB
          localField: "_id",
          foreignField: "_id",
          as: "categoryInfo",
        },
      },
      {
        $unwind: {
          path: "$categoryInfo",
          preserveNullAndEmptyArrays: true, // Keep categories even if they don't have matching info
        },
      },
      {
        $project: {
          categoryName: { $ifNull: ["$categoryInfo.name", "Uncategorized"] },
          count: 1,
          _id: 0,
        },
      },
    ]);

    console.log("Category count result:", result);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error getting category property count:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getTotalProperties = async (req, res) => {
  try {
    const count = await Property.countDocuments();
    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

const getSellingPropertiesCount = async (req, res) => {
  try {
    const count = await Property.countDocuments({
      type: "Selling",
      status: "active",
    });
    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
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
  getPropertyCountByCategory,
  getSellingPropertiesCount,
  getTotalProperties,
};