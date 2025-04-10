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
          <li key={order.id}>
            <h3>{order.foodType}</h3>
            <p>Quantity: {order.quantity}</p>
            <p>Delivery Address: {order.deliveryAddress}</p>
            <p>Payment: {order.paymentMethod}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OrderList;
