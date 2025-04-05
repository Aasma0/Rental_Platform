const mongoose = require("mongoose");


const surveySchema = new mongoose.Schema({
  property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  sleepSchedule: { type: String, required: true },
  smoking: { type: String, required: true },
  noisePreference: { type: Number, required: true },
  neatness: { type: Number, required: true }
});

// Change to CommonJS export
module.exports = mongoose.model('Survey', surveySchema);