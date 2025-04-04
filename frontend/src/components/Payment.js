import { useState } from "react";

const Payment = () => {
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: "",
    expirationDate: "",
    cvv: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Process payment logic
    console.log("Payment Info: ", paymentInfo);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Payment</h2>
      <label>
        Card Number:
        <input
          type="text"
          value={paymentInfo.cardNumber}
          onChange={(e) => setPaymentInfo({ ...paymentInfo, cardNumber: e.target.value })}
        />
      </label>
      <label>
        Expiration Date:
        <input
          type="text"
          value={paymentInfo.expirationDate}
          onChange={(e) => setPaymentInfo({ ...paymentInfo, expirationDate: e.target.value })}
        />
      </label>
      <label>
        CVV:
        <input
          type="text"
          value={paymentInfo.cvv}
          onChange={(e) => setPaymentInfo({ ...paymentInfo, cvv: e.target.value })}
        />
      </label>
      <button type="submit">Submit Payment</button>
    </form>
  );
};

export default Payment;
