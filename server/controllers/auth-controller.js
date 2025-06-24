const User = require("../models/user-model");
const bcrypt = require("bcryptjs");

const home = async (req, res) => {
  try {
    res.status(200).send("Welcome to the authentication API!");
  } catch (error) {
    console.error("Error in home controller:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Register logic (remains for initial user creation if needed separately from profile setup)
const register = async (req, res, next) => {
  try {
    console.log("Register request received:", req.body);

    const { username, email, password } = req.body; // Only initial registration fields here

    const userExist = await User.findOne({ email });

    if (userExist) {
      return res.status(400).json({ msg: "Email already exists" });
    }

    const userCreated = await User.create({
      username,
      email,
      password,
      // No profile fields here, they'll be added/updated via updateProfile
    });

    const token = await userCreated.generateToken();

    res.status(201).json({
      msg: "Registration successful",
      token: token,
      userId: userCreated._id.toString(),
      username: userCreated.username,
    });
  } catch (error) {
    console.error("Error during registration in auth-controller:", error);
    next(error);
  }
};

// Login logic
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    console.log("Login attempt for email:", email);

    const userExist = await User.findOne({ email });

    if (!userExist) {
      return res.status(400).json({ message: "Invalid credentials (email not found)" });
    }

    const isPasswordValid = await userExist.comparePassword(password);

    if (isPasswordValid) {
      const token = await userExist.generateToken();

      // Ensure all profile fields are sent back on login
      const userProfile = { ...userExist._doc };
      delete userProfile.password;

      res.status(200).json({
        msg: "Login successful",
        token: token,
        userId: userExist._id.toString(),
        username: userExist.username,
        profile: userProfile, 
      });
    } else {
      console.log("Password comparison failed for email:", email);
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    console.error("Error during login in auth-controller:", error);
    next(error);
  }
};

// Get User Profile logic
const getProfile = async (req, res, next) => {
  try {
    const userData = req.user; // Data from authMiddleware
    console.log("Profile request for user:", userData.email);

    // Filter out password field before sending
    const userProfile = { ...userData._doc };
    delete userProfile.password;

    return res.status(200).json({ userData: userProfile });
  } catch (error) {
    console.error("Error getting user profile:", error);
    next(error);
  }
};

// New: Update User Profile logic
const updateProfile = async (req, res, next) => {
  try {
    const userId = req.user._id; // User ID from authMiddleware
    const updates = req.body; // All fields sent from frontend for update

    // Find the user and update the profile fields
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updates }, // Use $set to update specific fields
      { new: true, runValidators: true } // Return the updated document and run schema validators
    ).select('-password'); // Exclude password from the returned document

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({
      message: "Profile updated successfully!",
      profile: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user profile:", error);
    next(error);
  }
};

// New: Upload medical reports endpoint (remains the same)
const uploadMedicalReports = async (req, res, next) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: "No files uploaded." });
        }

        const userId = req.user._id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        const newReports = req.files.map(file => ({
            filename: file.originalname,
            path: file.path,
        }));

        user.reports.push(...newReports);
        await user.save();

        res.status(200).json({ message: "Medical reports uploaded successfully!", reports: user.reports });
    } catch (error) {
        console.error("Error uploading medical reports:", error);
        next(error);
    }
};

module.exports = { home, register, login, getProfile, updateProfile, uploadMedicalReports };