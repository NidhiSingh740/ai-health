

// server/router/medicationReminder.js

const express = require('express');
const router = express.Router();
const Medication = require('../models/Medication');

// Auth middleware
const auth = require('../middlewares/auth-middleware');

// POST /api/medications/add
router.post('/add', auth, async (req, res) => {
  const { medicationName, dosage, schedule, phoneNumber } = req.body;

  if (!medicationName || !schedule || !phoneNumber) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const newMedication = new Medication({
      userId: req.user.id, // Comes from JWT auth!
      medicationName,
      dosage,
      schedule,
      phoneNumber
    });

    await newMedication.save();

    res.status(200).json({ message: '✅ Medication saved! Reminder will be sent at scheduled time.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error while saving medication' });
  }
});

module.exports = router;
