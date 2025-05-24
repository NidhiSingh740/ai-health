// middlewares/auth-middleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/user-model'); // Adjust path if needed

const authMiddleware = async (req, res, next) => {
  const authHeader = req.header('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: "Authorization header missing or malformed" });
  }

  const token = authHeader.replace('Bearer ', ''); // Extract the token

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const isVerified = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const userData = await User.findOne({ _id: isVerified.userId }).select({ password: 0 }); // Exclude password

    if (!userData) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = userData; // Attach the user document to the request
    req.token = token;   // Attach the token to the request
    req.userId = userData._id; // Attach userId for convenience

    next(); // Proceed to the next middleware/route handler
  } catch (error) {
    console.error("Authentication error:", error.message);
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: "Token expired. Please log in again." });
    }
    return res.status(401).json({ message: "Invalid token. Please log in again." });
  }
};

module.exports = authMiddleware;