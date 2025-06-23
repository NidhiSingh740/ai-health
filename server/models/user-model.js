const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    // --- Profile Information ---
    name: {
        type: String,
        // required: true, // Making this optional for initial registration flexibility
    },
    age: {
        type: Number,
        // required: true,
    },
    gender: {
        type: String,
        // required: true,
    },
    weight: {
        type: Number,
        // required: true,
    },
    height: { // Keeping height as it was commented out in frontend but might be needed
        type: Number,
    },
    diseases: {
        type: String, // Storing as a single string for simplicity as per frontend textarea
        default: ""
    },
    allergies: {
        type: String, // Storing as a single string for simplicity as per frontend textarea
        default: ""
    },
    treatments: {
        type: String, // Storing as a single string for simplicity as per frontend textarea
        default: ""
    },
    medications: {
        type: String, // Storing as a single string for simplicity as per frontend textarea
        default: ""
    },
    reports: [
        {
            filename: String,
            path: String,
            uploadedAt: {
                type: Date,
                default: Date.now,
            },
        },
    ], // Array of objects to store file details
});

// IMPORTANT: Pre-save hook to hash the password before saving a new user
userSchema.pre('save', async function(next){
    const user = this;

    if(!user.isModified("password")){
        return next();
    }

    try {
        const saltRound = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, saltRound);
        next();
    } catch(error){
        console.error("Error during password hashing in pre-save hook:", error);
        next(error);
    }
});

// Instance method to compare incoming password with hashed password
userSchema.methods.comparePassword = async function(password) {
    return bcrypt.compare(password, this.password);
};

// Instance method to generate a JSON Web Token
userSchema.methods.generateToken = async function () {
    try {
        return jwt.sign(
            {
                userId: this._id.toString(),
                email: this.email,
                isAdmin: this.isAdmin,
            },
            process.env.JWT_SECRET_KEY,
            {
                expiresIn: "30d",
            }
        );
    } catch(error){
        console.error("Error in generateToken method:", error);
        throw new Error("Failed to generate authentication token.");
    }
};

const User = mongoose.model("User", userSchema);

module.exports = User;