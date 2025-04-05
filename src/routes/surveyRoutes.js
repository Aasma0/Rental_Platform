const express = require('express');
const router = express.Router();
const {
  getSurveysByProperties,
  createUpdateSurvey,
  getSurveyByProperty,
} = require('../controllers/SurveyController');
const authMiddleware = require('../middleware/authMiddleware');

// Protected routes
router.get('/', authMiddleware, getSurveysByProperties);
router.post('/:propertyId', authMiddleware, createUpdateSurvey);
router.get('/property/:propertyId', authMiddleware, getSurveyByProperty);

module.exports = router;