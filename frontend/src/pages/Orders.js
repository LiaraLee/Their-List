import React, { useState, useEffect } from "react";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { Link } from 'react-router-dom';


const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY); // use your .env key here

const CheckoutForm = ({ restaurant, items, totalAmount, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    const fetchPaymentIntent = async () => {
      try {
        const { data } = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/payment/create-payment-intent`,
          { amount: totalAmount },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
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
      onSuccess(paymentIntent.id); // Notify parent of success
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
  const [items, setItems] = useState([]); // still placeholder; not in use yet
  const [totalAmount, setTotalAmount] = useState(9.99); // sample value
  const [isCheckout, setIsCheckout] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false); // NEW

  const handlePaymentSuccess = async (paymentId) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/orders`,
        {
          restaurant,
          items,
          totalAmount,
          paymentId,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setOrderSuccess(true); // ✅ Show success message
      setRestaurant("");
      setItems([]);
      setTotalAmount(0);
      setIsCheckout(false);
    } catch (error) {
      alert("Failed to place order");
    }
  };

  return (
    <div className="container">
      <h2>Place Order</h2>

      {orderSuccess && (
  <>
    <div className="alert alert-success mt-3">
      🎉 Your order has been placed successfully!
    </div>
    <Link to="/my-orders" className="btn btn-outline-primary mt-3">
      View My Orders
    </Link>
  </>
)}
      {!orderSuccess && (
        <>
          <input
            type="text"
            placeholder="Restaurant Name"
            className="form-control my-2"
            value={restaurant}
            onChange={(e) => setRestaurant(e.target.value)}
          />

          {/* (Optional) Set totalAmount via form later */}
          <button className="btn btn-primary my-2" onClick={() => setIsCheckout(true)}>
            Proceed to Payment
          </button>

          {isCheckout && (
            <Elements stripe={stripePromise}>
              <CheckoutForm
                restaurant={restaurant}
                items={items}
                totalAmount={totalAmount}
                onSuccess={handlePaymentSuccess}
              />
            </Elements>
          )}
        </>
      )}
    </div>
  );
};

export default Orders;
