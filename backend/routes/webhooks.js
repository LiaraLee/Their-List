import express from "express";
import Stripe from "stripe";

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

router.post("/webhook", express.raw({ type: "application/json" }), async (req, res) => {
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
});

export default router;
