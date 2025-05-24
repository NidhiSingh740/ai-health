const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true, // Corrected from require:true
    },
    email: {
        type: String,
        required: true, // Corrected
        unique: true,   // Ensures unique emails at the database level
    },
    phone: {
        type: String,
        required: true, // Corrected
    },
    password: {
        type: String,
        required: true, // Corrected
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
});

// IMPORTANT: Pre-save hook to hash the password before saving a new user
userSchema.pre('save', async function(next){
    const user = this; // 'this' refers to the user document about to be saved

    // Only hash the password if it's new or has been modified
    if(!user.isModified("password")){
        return next(); // Skip hashing if password hasn't changed
    }

    try {
        const saltRound = await bcrypt.genSalt(10); // Generate a salt
        user.password = await bcrypt.hash(user.password, saltRound); // Hash the password
        next(); // Proceed to save
    } catch(error){
        console.error("Error during password hashing in pre-save hook:", error);
        next(error); // Pass error to Mongoose/Express error handler
    }
});


// Instance method to compare incoming password with hashed password
userSchema.methods.comparePassword = async function(password) {
    // 'this.password' refers to the hashed password stored in the database
    return bcrypt.compare(password, this.password);
};

// Instance method to generate a JSON Web Token
userSchema.methods.generateToken = async function () {
    try {
        return jwt.sign(
            {
                userId: this._id.toString(), // Use this._id for the user's MongoDB ID
                email: this.email,
                isAdmin: this.isAdmin,
            },
            process.env.JWT_SECRET_KEY, // The secret key for signing the token
            {
                expiresIn: "30d", // Token expiration time
            }
        );
    } catch(error){
        console.error("Error in generateToken method:", error);
        throw new Error("Failed to generate authentication token."); // Propagate error for proper handling
    }
};

// Create the User model
const User = mongoose.model("User", userSchema);

module.exports = User;