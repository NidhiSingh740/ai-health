const User = require("../models/user-model"); // Adjust path if needed
const bcrypt = require("bcryptjs");

// Home logic (just for a simple test)
const home = async (req, res) => {
  try {
    res.status(200).send("Welcome to the authentication API!");
  } catch (error) {
    console.error("Error in home controller:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Register logic
const register = async (req, res, next) => {
  try {
    console.log("Register request received:", req.body); // Log incoming request body

    const { username, email, phone, password } = req.body;

    const userExist = await User.findOne({ email });

    if (userExist) {
      return res.status(400).json({ msg: "Email already exists" });
    }

    // IMPORTANT: Pass the plain password to User.create.
    // The pre('save') hook in user-model.js will handle the hashing.
    const userCreated = await User.create({
      username,
      email,
      phone,
      password: password, // Pass the original, plain password
    });

    // Generate token for immediate login after registration (optional, but common)
    const token = await userCreated.generateToken();

    res.status(201).json({ // 201 Created status for successful resource creation
      msg: "Registration successful",
      token: token, // Include token in signup response
      userId: userCreated._id.toString(),
      username: userCreated.username, // Also send username for immediate display
    });
  } catch (error) {
    console.error("Error during registration in auth-controller:", error);
    // Pass the error to the error handling middleware
    next(error);
  }
};

// Login logic
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    console.log("Login attempt for email:", email); // Log login attempt

    const userExist = await User.findOne({ email });

    if (!userExist) {
      return res.status(400).json({ message: "Invalid credentials (email not found)" });
    }

    // Compare the provided plain password with the hashed password stored in the database
    const isPasswordValid = await userExist.comparePassword(password); // Use the method from the model

    if (isPasswordValid) {
      // Generate token upon successful login
      const token = await userExist.generateToken();

      res.status(200).json({
        msg: "Login successful",
        token: token,
        userId: userExist._id.toString(),
        username: userExist.username, // Include username in login response
      });
    } else {
      console.log("Password comparison failed for email:", email); // Log failure
      res.status(401).json({ message: "Invalid email or password" }); // 401 Unauthorized
    }
  } catch (error) {
    console.error("Error during login in auth-controller:", error);
    // Pass the error to the error handling middleware
    next(error);
  }
};

// New: Get User Profile logic
const getProfile = async (req, res, next) => {
  try {
    // The user data is attached to req.user by the authMiddleware
    const userData = req.user;
    console.log("Profile request for user:", userData.email);

    // Send back the user data (excluding sensitive info like password)
    // The select({ password: 0 }) in authMiddleware already handles this.
    return res.status(200).json({ userData });
  } catch (error) {
    console.error("Error getting user profile:", error);
    next(error); // Pass error to error handling middleware
  }
};

module.exports = { home, register, login, getProfile };