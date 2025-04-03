// routes/order.js
import express from 'express';
import jwt from 'jsonwebtoken';
import Stripe from 'stripe';
import Order from '../models/Order';

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Middleware to protect routes
const protect = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.id;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Place Order
router.post('/placeOrder', protect, async (req, res) => {
  const { restaurant, items, totalAmount, token } = req.body;

  try {
    // Process payment before saving the order
    const charge = await stripe.charges.create({
      amount: totalAmount * 100, // Convert amount to cents
      currency: 'usd',
      description: 'Order Payment',
      source: token,
    });

    // Save order to database after successful payment
    const order = new Order({
      user: req.user,
      restaurant,
      items,
      totalAmount,
      paymentStatus: 'Paid',
      transactionId: charge.id,
    });
    await order.save();

    res.status(201).json({ message: 'Order placed successfully', order });
  } catch (err) {
    res.status(500).json({ message: 'Payment failed', error: err.message });
  }
});

// Get Orders for User
router.get('/myOrders', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
