// CheckoutSuccess.js

import React from 'react';
import './Success.css'; // Import the CSS file for styling

const CheckoutSuccess = () => {
  return (
    <div className="success-container">
      <div className="order-placed-box">
        <h2>Order Placed!</h2>
        <p>Order Number: {generateRandomOrderNumber()}</p>
      </div>
    </div>
  );
};

export default Success;

// Function to generate a random order number
const generateRandomOrderNumber = () => {
  return Math.floor(100000 + Math.random() * 900000); // Generates a 6-digit random number
};
