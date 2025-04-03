import React, { useState } from "react";
import axios from "axios";

const Orders = () => {
  const [restaurant, setRestaurant] = useState("");
  const [items, setItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);

  const placeOrder = async () => {
    try {
      await axios.post("http://localhost:5000/api/orders", { restaurant, items, totalAmount }, {
        headers: { Authorization: localStorage.getItem("token") },
      });
      alert("Order placed successfully!");
    } catch (error) {
      alert("Failed to place order");
    }
  };

  return (
    <div>
      <h2>Place Order</h2>
      <input type="text" placeholder="Restaurant Name" onChange={(e) => setRestaurant(e.target.value)} />
      <button onClick={placeOrder}>Order</button>
    </div>
  );
};

export default Orders;
