import React, { useState } from 'react';
import './payment.css';

const PaymentForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipcode: '',
    quantity: 1,
    payment: 'credit',
  });

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch('http://127.0.0.1:5000/purchase', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      alert(`Thank you, ${formData.name}! You have successfully purchased ${formData.quantity} NPS ExpressPass(es) using ${formData.payment}. An order confirmation will be sent to your email shortly.`);
      setFormData({
        name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        zipcode: '',
        quantity: 1,
        payment: 'credit',
      });
      window.location.href = '/';
    } else {
      alert('There was an error processing your purchase. Please try again.');
    }
  };

  return (
    <div className="payment-page">
      <div className="payment-container">
        <h2>Payment</h2>
        <form onSubmit={handlePaymentSubmit}>
          <label htmlFor="cardNumber">Card Number:</label>
          <input type="text" id="cardNumber" name="cardNumber" required />
          
          <div className="expiry-cvv">
            <div>
              <label htmlFor="expiryDate">Expiry Date:</label>
              <input type="text" id="expiryDate" name="expiryDate" required />
            </div>
            <div>
              <label htmlFor="cvv">CVV:</label>
              <input type="text" id="cvv" name="cvv" required />
            </div>
          </div>

          <button type="submit">Submit Payment</button>
        </form>
      </div>
    </div>
  );
};

export default PaymentForm;
