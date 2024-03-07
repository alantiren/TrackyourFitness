// authRoutes.js
// Import required modules
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('./models/user'); // Import the User model

// Create a router instance
const router = express.Router();

// Signup Route: Endpoint for user signup
router.post('/signup', async (req, res) => {
  try {
    // Extract user input from request body
    const { username, email, password } = req.body;

    // Check if username or email already exists in the database
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Username or email already exists.' });
    }

    // Hash the password before storing it in the database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user object with hashed password
    const newUser = new User({
      username,
      email,
      password: hashedPassword
    });

    // Save the user to the database
    await newUser.save();

    // Return success message
    res.status(201).json({ message: 'User registered successfully.' });
  } catch (error) {
    // Handle errors
    console.error('Error during user signup:', error);
    res.status(500).json({ error: 'An error occurred during user signup.' });
  }
});

// Login Route: Endpoint for user login
router.post('/login', async (req, res) => {
  try {
    // Extract user input from request body
    const { username, password } = req.body;

    // Find the user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password.' });
    }

    // Compare hashed password with the provided password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid username or password.' });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Return the token
    res.status(200).json({ token });
  } catch (error) {
    // Handle errors
    console.error('Error during user login:', error);
    res.status(500).json({ error: 'An error occurred during user login.' });
  }
});

// Logout Route: Endpoint for user logout
router.post('/logout', (req, res) => {
    try {
      // Clear the token cookie to log out the user
      res.clearCookie('token');
      res.status(200).json({ message: 'Logged out successfully.' });
    } catch (error) {
      console.error('Error during user logout:', error);
      res.status(500).json({ error: 'An error occurred during user logout.' });
    }
  });

// Export the router
module.exports = router;
