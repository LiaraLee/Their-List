import { useEffect, useState } from "react";

const OrderList = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const response = await fetch("/api/orders");
      const data = await response.json();
      setOrders(data);
    };
    fetchOrders();
  }, []);

  return (
    <div>
      <h2>Your Orders</h2>
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
