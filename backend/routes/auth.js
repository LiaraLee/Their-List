// routes/auth.js
import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs'; // Use bcryptjs for hashing passwords
import User from '../models/User.js';
import protect from '../middleware/auth.js';  // Import the authentication middleware

const router = express.Router();

// Register route
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user with the hashed password
    const user = new User({
      name,
      email,
      password: hashedPassword, // Save the hashed password
    });

    // Save user to the database
    await user.save();

    // Send response
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password); // Use bcrypt to compare hashed passwords
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token (including userId and name in the token payload)
    const token = jwt.sign(
      { userId: user._id, name: user.name }, // Add 'name' here
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Send response with token
    res.status(200).json({ message: 'Login successful', token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});
// Get user profile route (Protected)
router.get('/profile', protect, async (req, res) => {
  try {
    // The userId and name are now attached to req.user in the middleware
    const { userId, name } = req.user;

    // Find the user by ID (use userId from the decoded JWT token)
    const user = await User.findById(userId); // We can use userId from req.user here
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Return user profile details (name, email, and other profile info)
    res.status(200).json({ name: user.name, email: user.email, profile: user.profile });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
