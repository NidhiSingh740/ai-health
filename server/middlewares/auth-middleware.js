// middlewares/auth-middleware.js
const jwt = require("jsonwebtoken");
const User = require("../models/user-model"); // Adjust path as needed

const authMiddleware = async (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ message: "Unauthorized HTTP, Token not provided" });
  }

  const jwtToken = token.replace("Bearer", "").trim();

  try {
    const isVerified = jwt.verify(jwtToken, process.env.JWT_SECRET_KEY);
    // Find user by ID and select all fields except password
    const userData = await User.findOne({ _id: isVerified.userId }).select({ password: 0 });

    if (!userData) {
      return res.status(401).json({ message: "Unauthorized, User not found" });
    }

    req.user = userData;
    req.token = jwtToken;
    req.userId = userData._id; // Ensure userId is available

    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized, Invalid token." });
  }
};

module.exports = authMiddleware;