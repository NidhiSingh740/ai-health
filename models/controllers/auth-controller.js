const User = require("../models/user-model");
const bcrypt = require("bcryptjs");

// Home logic
const home = async (req, res) => {
  try {
    res.status(200).send("Welcome to registration page");
  } catch (error) {
    console.log(error);
  }
};

// Register logic
const register = async (req, res) => {
  try {
    console.log(req.body); // ✅ Fixed

    const { username, email, phone, password } = req.body;

    const userExist = await User.findOne({ email });

    if (userExist) {
      return res.status(400).json({ msg: "Email already exists" });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const userCreated = await User.create({
      username,
      email,
      phone,
      password: hashedPassword,
    });

    res.status(200).json({
      msg: "Registration successful",
      token: await userCreated.generateToken(),
      userId: userCreated._id.toString(),
    });
  } catch (error) {
   
    next(error)
  }
};

// Login logic
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const userExist = await User.findOne({ email }); // ✅ Fixed

    if (!userExist) {
      return res.status(400).json({ message: "Invalid credentials" });
    }


    const user = await userExist.comparePassword(password);

    if (user) {
      res.status(200).json({
        msg: "Login successful",
        token: await userExist.generateToken(),
        userId: userExist._id.toString(),
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json("Internal server error");
  }
};

module.exports = { home, register, login };
                                                                     