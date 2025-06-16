const express = require("express");
const router = express.Router();
const path = require("path");
const multer = require("multer");

const protect = require("../middlewares/auth-middleware");
const { createProfile, getProfile } = require("../controllers/profileController");

// ✅ Multer setup for /api/profile (single medical report)
const singleStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Ensure this folder exists
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const singleUpload = multer({ storage: singleStorage });

// ✅ Multer from external middleware (for reports array in /setup)
const multiUpload = require("../middlewares/Upload");

// ====================== ROUTES ======================

// ✅ Route 1: Protected route to create profile with multiple reports
router.post("/setup", protect, multiUpload.array("reports", 5), createProfile);

// ✅ Route 2: Protected route to get user profile
router.get("/", protect, getProfile);

// ✅ Route 3: Public route (demo/test) to submit profile with single report
router.post("/", singleUpload.single("medicalReport"), (req, res) => {
  const {
    name, age, gender, weight, height,
    pastDiseases, allergies, ongoingTreatments, medications
  } = req.body;

  const file = req.file;

  res.json({
    message: "Profile submitted successfully!",
    data: {
      name, age, gender, weight, height,
      pastDiseases, allergies, ongoingTreatments, medications,
      medicalReport: file ? file.filename : null
    }
  });
});

module.exports = router;
