
// models/Profile.js
const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: String,
  age: Number,
  gender: String,
  weight: Number,
  height: Number,
  medicalHistory: {
    pastDiseases: [String],
    allergies: [String],
    treatments: [String],
    medications: [String],
  },
  reports: [String], // Array of file paths or URLs
});

module.exports = mongoose.model("Profile", profileSchema);
