import React from 'react';
import './payment.css'; 

const PaymentForm = ({ formData, setFormData, handleSubmit }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <div className="about-page">
      <div className="about-container">
        <div className="about-column">
          <h2>Enter Payment Details</h2>
          <form onSubmit={handleSubmit}>
            {formData.payment === 'credit' && (
              <>
                <label htmlFor="cardNumber">Card Number:</label>
                <input type="text" id="cardNumber" name="cardNumber" value={formData.cardNumber || ''} onChange={handleChange} required />
                
                <label htmlFor="expiryDate">Expiry Date:</label>
                <input type="text" id="expiryDate" name="expiryDate" value={formData.expiryDate || ''} onChange={handleChange} required />
                
                <label htmlFor="cvv">CVV:</label>
                <input type="text" id="cvv" name="cvv" value={formData.cvv || ''} onChange={handleChange} required />
              </>
            )}
            {formData.payment === 'paypal' && (
              <>
                <label htmlFor="paypalEmail">PayPal Email:</label>
                <input type="email" id="paypalEmail" name="paypalEmail" value={formData.paypalEmail || ''} onChange={handleChange} required />
              </>
            )}
            <button type="submit">Submit Payment</button>
          </form>
        </div>
        <div className="image-column">
          <img src="../images/1.jpg" alt="" className="purchase-image" />
        </div>
      </div>
    </div>
  );
};

export default PaymentForm;
