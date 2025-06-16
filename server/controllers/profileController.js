// controllers/profileController.js
const Profile = require('../models/Profile');

const createProfile = async (req, res) => {
  try {
    const {
      name, age, gender, weight, height,
      diseases, allergies, treatments, medications
    } = req.body;

    const reports = req.files ? req.files.map(file => file.path) : [];

    const newProfile = new Profile({
      userId: req.user.id,
      name,
      age,
      gender,
      weight,
      height,
      diseases,
      allergies,
      treatments,
      medications,
      reports
    });

    await newProfile.save();

    res.status(201).json({ message: 'Profile saved successfully!', profile: newProfile });
  } catch (err) {
    console.error('Profile Error:', err);
    res.status(500).json({ message: 'Server Error in profile' });
  }
};

const getProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ userId: req.user.id });
    res.status(200).json(profile);
  } catch (error) {
    console.error('Get Profile Error:', error);
    res.status(500).json({ message: 'Server Error in getProfile' });
  }
};

module.exports = { createProfile, getProfile };
