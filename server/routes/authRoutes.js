const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// @route   POST /api/auth/register
// @desc    Register a new user

// @route   POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    
    // 1. Validation check
    if (!name || !email || !password) {
      return res.status(400).json({ msg: 'Please enter all required fields' });
    }

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'User already exists' });

    user = new User({ name, email, password, role: role || 'staff' });
    
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();

    res.status(201).json({ msg: 'User registered successfully' });
  } catch (err) {
    console.error("Registration Error:", err.message);
    res.status(500).json({ msg: 'Server Error during registration' });
  }
});

// @route   POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // 2. Strict Body Validation (Prevents 400s from empty payloads)
    if (!email || !password) {
      return res.status(400).json({ msg: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    // 3. Robust Token Generation
    // Ensure JWT_SECRET exists to avoid internal signature errors
    if (!process.env.JWT_SECRET) {
      console.error("FATAL ERROR: JWT_SECRET is not defined in .env");
      return res.status(500).json({ msg: 'Server configuration error' });
    }

    const payload = { 
      id: user.id, 
      role: user.role,
      name: user.name 
    };

    jwt.sign(
      payload, 
      process.env.JWT_SECRET, 
      { expiresIn: '8h' }, // Increased to 8h for a full work shift at SSGI
      (err, token) => {
        if (err) throw err;
        res.json({ 
          token, 
          user: { 
            id: user._id,
            name: user.name, 
            email: user.email,
            role: user.role 
          } 
        });
      }
    );

  } catch (err) {
    console.error("Login Controller Error:", err.message);
    res.status(500).json({ msg: 'Internal Server Error' });
  }
});

module.exports = router;