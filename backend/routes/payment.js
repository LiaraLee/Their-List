import express from 'express';
import stripe from '../config/stripe.js';
import protect from '../middleware/auth.js';

const router = express.Router();

router.post('/create-payment-intent', protect, async (req, res) => {
  try {
    const { amount, currency = 'usd' } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100,
      currency,
      metadata: { userId: req.user.userId },
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Payment processing failed', error: error.message });
  }
});

export default router;
