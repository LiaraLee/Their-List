import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import axios from "axios";

const stripePromise = loadStripe("your_publishable_key_here");

const CheckoutForm = ({ totalAmount, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    const fetchPaymentIntent = async () => {
      try {
        const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/api/users/register`, { amount: totalAmount });
        setClientSecret(data.clientSecret);
      } catch (error) {
        console.error("Error creating payment intent:", error);
      }
    };

    if (totalAmount > 0) fetchPaymentIntent();
  }, [totalAmount]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: { card: elements.getElement(CardElement) },
    });

    if (error) {
      console.error("Payment failed:", error.message);
      alert("Payment failed!");
    } else {
      alert("Payment successful!");
      onSuccess(paymentIntent.id);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Enter Payment Details</h2>
      <CardElement />
      <button type="submit" disabled={!stripe}>Pay ${totalAmount}</button>
    </form>
  );
};

const Payment = ({ totalAmount }) => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm totalAmount={totalAmount} onSuccess={(paymentId) => console.log("Payment successful!", paymentId)} />
    </Elements>
  );
};

export default Payment;
