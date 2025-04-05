const Survey = require('../models/SurveyModel');
const Property = require('../models/PropertyModel');

// Create or Update Survey
const createUpdateSurvey = async (req, res) => {
  try {
    const { propertyId } = req.params;
    const { _id: userId } = req.user;
    
    // Validate property exists and is shared type
    const property = await Property.findOne({
      _id: propertyId,
      type: 'Sharing'
    });
    
    if (!property) {
      return res.status(404).json({ message: 'Shared property not found' });
    }

    // Create/update survey
    const survey = await Survey.findOneAndUpdate(
      { user: userId, property: propertyId },
      { ...req.body, user: userId, property: propertyId },
      { new: true, upsert: true }
    );

    res.status(200).json(survey);
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

// Get Survey by Property
const getSurveyByProperty = async (req, res) => {
  try {
    const survey = await Survey.findOne({
      property: req.params.propertyId,
      user: req.user._id
    }).populate('user', 'name avatar');

    if (!survey) {
      return res.status(404).json({ message: 'Survey not found' });
    }
    
    res.json(survey);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// SurveyController.js
const getSurveysByProperties = async (req, res) => {
  try {
    const { propertyIds } = req.query;
    
    if (!propertyIds) {
      return res.status(400).json({ message: 'propertyIds query parameter is required' });
    }

    const properties = propertyIds.split(',');
    
    const surveys = await Survey.find({
      property: { $in: properties }
    })
    .populate('property', 'title location images')
    .populate('user', 'name email');

    res.json(surveys);
  } catch (error) {
    console.error('Error fetching surveys:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Add to exports
module.exports = {
  createUpdateSurvey,
  getSurveyByProperty,
  getSurveysByProperties
};