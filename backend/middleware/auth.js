import express from 'express';
import User from '../models/User.js';
import protect from '../middleware/auth.js';  // Import the protect middleware

const router = express.Router();

// Register a user
router.post('/register', async (req, res) => {
  // Registration logic here...
});

// Login a user
router.post('/login', async (req, res) => {
  // Login logic here...
});

// Get the user profile (Protected route)
router.get('/profile', protect, async (req, res) => {  // Use the protect middleware to require authentication
  try {
    const user = await User.findById(req.user);  // Access the user ID attached to req.user by the middleware
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      name: user.name,
      email: user.email,
      profile: user.profile,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
