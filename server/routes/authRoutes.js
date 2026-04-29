const express = require('express');
const router = express.Router();
// Import the functions from your controller
const { registerUser, loginUser } = require('../controllers/authController');

// Now the routes just call the controller functions
router.post('/register', registerUser);
router.post('/login', loginUser);

module.exports = router;