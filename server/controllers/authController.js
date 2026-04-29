// server/controllers/authController.js

const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/*
ROLE SECRET CODES
You can move these to .env later for better security
*/

const ROLE_SECRET_CODES = {
  admin: process.env.ADMIN_SECRET_CODE,
  executive: process.env.EXECUTIVE_SECRET_CODE,
  staff: ""
};

/*
REGISTER USER
POST /api/auth/register
*/

exports.registerUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
      secretCode
    } = req.body;

    // Validation
    if (!name || !email || !password || !role) {
      return res.status(400).json({
        msg: "Please provide all required fields"
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        msg: "User already exists"
      });
    }

    /*
    SECRET CODE VALIDATION
    Only admin and executive require secret code
    */

    if (role === "admin" || role === "executive") {
      const requiredCode = ROLE_SECRET_CODES[role];

      if (!secretCode || secretCode !== requiredCode) {
        return res.status(403).json({
          msg: `Invalid secret code for ${role}`
        });
      }
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role
    });

    // Generate token
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role
      },
      process.env.JWT_SECRET || "supersecretkey",
      {
        expiresIn: "7d"
      }
    );

    res.status(201).json({
      msg: "Registration successful",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error("Register Error:", error);

    res.status(500).json({
      msg: "Server error during registration"
    });
  }
};

/*
LOGIN USER
POST /api/auth/login
*/

exports.loginUser = async (req, res) => {
  try {
    const {
      email,
      password
    } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        msg: "Please provide email and password"
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        msg: "Invalid credentials"
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        msg: "Invalid credentials"
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role
      },
      process.env.JWT_SECRET || "supersecretkey",
      {
        expiresIn: "7d"
      }
    );

    res.status(200).json({
      msg: "Login successful",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error("Login Error:", error);

    res.status(500).json({
      msg: "Server error during login"
    });
  }
};