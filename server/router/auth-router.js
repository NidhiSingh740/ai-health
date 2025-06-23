const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth-controller');
const authMiddleware = require('../middlewares/auth-middleware');
const multer = require('multer');

// Configure multer for file storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Ensure this 'uploads/' directory exists
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });


router.get("/", authController.home);
router.post("/register", authController.register); // For initial user registration
router.post("/login", authController.login);

router.get("/profile", authMiddleware, authController.getProfile);
router.put("/profile", authMiddleware, authController.updateProfile); // New route for updating profile

router.post("/profile/upload-reports", authMiddleware, upload.array('medicalReports'), authController.uploadMedicalReports);

module.exports = router;