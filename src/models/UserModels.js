const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },  // New field for phone number
  location: { type: String },  // New field for location
  bio: { type: String },  // New field for bio
  profilePicture: { type: String },  // New field for profile picture
  role: { type: String, enum: ["user", "admin"], default: "user" },
  password: { type: String, required: true },
  disabled: { type: Boolean, default: false },
});

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const User = mongoose.model("User", userSchema);
module.exports = User;
