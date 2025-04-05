const mongoose = require("mongoose");

const surveySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      required: true,
    },
    // Survey content
    sleepSchedule: { type: String, enum: ["morning", "night"], required: true },
    smoking: {
      type: String,
      enum: ["smoker", "non-smoker", "occasionally"],
      required: true,
    },
    noisePreference: { type: Number, min: 1, max: 5, required: true },
    neatness: { type: Number, min: 1, max: 5, required: true },
    guestsFrequency: {
      type: String,
      enum: ["rarely", "sometimes", "often"],
      required: true,
    },
  },
  {
    timestamps: true,
    // Compound index for unique user-property pairs
    index: {
      user: 1,
      property: 1,
    },
  }
);

module.exports = mongoose.model("Survey", surveySchema);
