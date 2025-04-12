import React, { useState, useEffect } from "react";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, useStripe, useElements, CardElement } from "@stripe/react-stripe-js";

const stripePromise = loadStripe("your_publishable_key_here"); // Replace with your Stripe public key

const CheckoutForm = ({ restaurant, items, totalAmount, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    const fetchPaymentIntent = async () => {
      try {
        const { data } = await axios.post(
          "http://localhost:5000/api/payments/create-payment-intent",
          { amount: totalAmount },
          { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
        );
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
      <CardElement />
      <button type="submit" disabled={!stripe}>Pay ${totalAmount}</button>
    </form>
  );
};

const Orders = () => {
  const [restaurant, setRestaurant] = useState("");
  const [items, setItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [isCheckout, setIsCheckout] = useState(false);

  const handlePaymentSuccess = async (paymentId) => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/orders`, {
        restaurant,
        items,
        totalAmount,
        paymentId,
      }, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });

      alert("Order placed successfully!");
      setRestaurant("");
      setItems([]);
      setTotalAmount(0);
      setIsCheckout(false);
    } catch (error) {
      alert("Failed to place order");
    }
  };

  return (
    <div>
      <h2>Place Order</h2>
      <input type="text" placeholder="Restaurant Name" value={restaurant} onChange={(e) => setRestaurant(e.target.value)} />
      <button onClick={() => setIsCheckout(true)}>Proceed to Payment</button>

      {isCheckout && (
        <Elements stripe={stripePromise}>
          <CheckoutForm restaurant={restaurant} items={items} totalAmount={totalAmount} onSuccess={handlePaymentSuccess} />
        </Elements>
      )}
    </div>
  );
};

export default Orders;
