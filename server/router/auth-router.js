const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth-controller'); // Adjust path as needed
const authMiddleware = require('../middlewares/auth-middleware'); // Import the new middleware

router.get("/", authController.home);
router.post("/register", authController.register);
router.post("/login", authController.login);

// New protected route to get user profile
router.get("/profile", authMiddleware, authController.getProfile);

module.exports = router;