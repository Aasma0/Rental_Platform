const mongoose = require("mongoose");

const surveySchema = new mongoose.Schema({
  property: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Property', 
    required: true 
  },
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  sleepSchedule: { 
    type: String, 
    required: true,
    enum: ['morning', 'night', 'flexible']
  },
  smoking: { 
    type: String, 
    required: true,
    enum: ['smoker', 'non-smoker', 'occasionally']
  },
  noisePreference: { 
    type: Number, 
    required: true,
    min: 1,
    max: 5
  },
  neatness: { 
    type: Number, 
    required: true,
    min: 1,
    max: 5
  }
}, {
  strict: true, // Reject unknown fields
  timestamps: true
});

module.exports = mongoose.model('Survey', surveySchema);