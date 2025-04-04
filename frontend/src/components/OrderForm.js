import { useState } from "react";

const OrderForm = () => {
  const [orderDetails, setOrderDetails] = useState({
    foodType: "",
    quantity: 1,
    deliveryAddress: "",
    paymentMethod: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Submit order logic here
    console.log("Order Submitted: ", orderDetails);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create Order</h2>
      <label>
        Food Type:
        <input
          type="text"
          value={orderDetails.foodType}
          onChange={(e) => setOrderDetails({ ...orderDetails, foodType: e.target.value })}
        />
      </label>
      <label>
        Quantity:
        <input
          type="number"
          value={orderDetails.quantity}
          onChange={(e) => setOrderDetails({ ...orderDetails, quantity: e.target.value })}
        />
      </label>
      <label>
        Delivery Address:
        <input
          type="text"
          value={orderDetails.deliveryAddress}
          onChange={(e) => setOrderDetails({ ...orderDetails, deliveryAddress: e.target.value })}
        />
      </label>
      <label>
        Payment Method:
        <input
          type="text"
          value={orderDetails.paymentMethod}
          onChange={(e) => setOrderDetails({ ...orderDetails, paymentMethod: e.target.value })}
        />
      </label>
      <button type="submit">Submit Order</button>
    </form>
  );
};

export default OrderForm;
