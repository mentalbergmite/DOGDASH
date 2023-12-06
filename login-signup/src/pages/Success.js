// Success.js

import React from 'react';
import Navbar from "../Components/Navbar/Navbar.jsx";
import './Success.css'; // Import the CSS file for styling
import exampleOrderMap from './exampleordermap.png'; // Import the image


const Success = () => {
  return (
    <>
    <Navbar cartCount={0} />
    <div className="success-container">
      <div className="order-placed-box">
        <div className="form-group">
          <div className="order-map-image-container">
          <img src={exampleOrderMap} alt="Order Map" className="order-map-image" />
          </div>
        </div>
        <h2>Order Placed!</h2>
        <p>Order Number: {412022}</p>
        <p>Thank you for shopping with us!</p>
      </div>
        
    </div>
    </>
  );
};

export default Success;

// Function to generate a random order number
const generateRandomOrderNumber = () => {
  return Math.floor(100000 + Math.random() * 900000); // Generates a 6-digit random number
};
