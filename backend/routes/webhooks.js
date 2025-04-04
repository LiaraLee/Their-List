// routes/webhooks.js
import express from "express";
import dotenv from 'dotenv';
import Stripe from "stripe";

dotenv.config();

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// No need to define path again—just handle the body!
export default async function (req, res) {
  const sig = req.headers["stripe-signature"];

  try {
    const event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);

    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object;
      console.log("💰 Payment received:", paymentIntent);
      // Handle order fulfillment logic here
    }

    res.status(200).json({ received: true });
  } catch (err) {
    console.error("⚠️  Webhook signature verification failed.", err.message);
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
}

