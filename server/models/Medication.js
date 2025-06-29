

// server/models/Medication.js
const mongoose = require('mongoose');

const medicationSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  medicationName: { type: String, required: true },
  dosage: { type: String },
  schedule: { type: Date, required: true },
  phoneNumber: { type: String, required: true },
  sent: { type: Boolean, default: false }
});

module.exports = mongoose.model('Medication', medicationSchema);
