// routes/authRoutes.js
import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import protect from '../middleware/auth.js';

const router = express.Router();

// Register user
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
  
    try {
      const userExists = await User.findOne({ email });
      if (userExists) return res.status(400).json({ message: 'User already exists' });
  
      const user = new User({
        name,
        email: email.toLowerCase(),
        password
      }); // 🔐 let .pre('save') do the hashing
      await user.save();
  
      res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  });
  
// Login user
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    // Debugging: Log the password hash and entered password
    console.log('DB password hash:', user.password);
    console.log('Entered password:', password);
    
    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' }); 
    // Debugging: Log the result of password comparison   
    console.log('Password match:', isMatch);

    const token = jwt.sign(
      {
        userId: user._id,
        name: user.name,
        isAdmin: user.isAdmin || false, // fallback in case it's undefined
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({ message: 'Login successful', token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user profile (protected)
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

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
// TEMPORARY: Promote a user to admin by email
router.put('/promote', async (req, res) => {
    const { email } = req.body;
    try {
      const user = await User.findOneAndUpdate({ email }, { isAdmin: true }, { new: true });
      if (!user) return res.status(404).json({ message: 'User not found' });
      res.status(200).json({ message: `${user.email} is now an admin`, user });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error promoting user' });
    }
  });
  
export default router;
