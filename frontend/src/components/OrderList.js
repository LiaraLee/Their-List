import { useEffect, useState } from "react";
import axios from 'axios';

const OrderList = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/orders`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
  
        // If your backend returns { orders: [...] }
        setOrders(response.data.orders);
      } catch (err) {
        console.error("Error fetching orders:", err);
      }
    };
  
    fetchOrders();
  }, []);  

  return (
    <div>
      <h2>My Orders</h2>
      <ul>
  {orders.map((order) => (
    <li key={order._id}>
      <h3>Restaurant: {order.restaurant}</h3>
      <ul>
        {order.items.map((item, index) => (
          <li key={index}>
            {item.name} x{item.quantity} — ${item.price}
          </li>
        ))}
      </ul>
      <p>Total: ${order.totalAmount}</p>
      <p>Status: {order.status}</p>
      <p>Payment: {order.paymentStatus}</p>
      <hr />
    </li>
  ))}
</ul>
    </div>
  );
};

export default OrderList;
