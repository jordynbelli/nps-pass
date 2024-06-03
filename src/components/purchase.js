import React from 'react';
import './purchase.css';

const PurchaseForm = ({ formData, setFormData, handleSubmit }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const passCost = 25.00;
  const totalCost = formData.quantity * passCost;

  return (
    <div className="about-page">
      <div className="about-container">
        <div className="about-column">
          <h2>Purchase NPS ExpressPass</h2>
          <p>Cost per pass: $25.00 USD</p>
          <p>Total cost: ${totalCost.toFixed(2)} USD</p>
          <form onSubmit={handleSubmit}>
            <label htmlFor="name">Name:</label>
            <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
            
            <label htmlFor="email">Email:</label>
            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
            
            <label htmlFor="phone">Phone Number:</label>
            <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} required />

            <label htmlFor="address">Address:</label>
            <input type="text" id="address" name="address" value={formData.address} onChange={handleChange} required />

            <label htmlFor="city">City:</label>
            <input type="text" id="city" name="city" value={formData.city} onChange={handleChange} required />

            <label htmlFor="zipcode">Zip Code:</label>
            <input type="text" id="zipcode" name="zipcode" value={formData.zipcode} onChange={handleChange} required />
            
            <label htmlFor="quantity">Number of Passes:</label>
            <input type="number" id="quantity" name="quantity" value={formData.quantity} onChange={handleChange} min="1" required />
            
            <label htmlFor="payment">Payment Method:</label>
            <select id="payment" name="payment" value={formData.payment} onChange={handleChange} required>
              <option value="credit">Credit Card</option>
              <option value="paypal">PayPal</option>
            </select>
            
            <button type="submit">Purchase</button>
          </form>
        </div>
        <div className="image-column">
          <img src="../images/1.jpg" alt="" className="purchase-image" />
        </div>
      </div>
    </div>
  );
};

export default PurchaseForm;
