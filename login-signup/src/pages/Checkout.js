// Checkout.js

import React from 'react';
import './Checkout.css'; // Import the CSS file for styling
import exampleOrderMap from './exampleordermap.png'; // Import the image


const Checkout = () => {
  return (
    <div className="checkout-container">
      <div className="cart-container">
        <h2>Cart Page</h2>
        {/* Placeholder for Cart items */}
        <div className="added-items-list">
          <h3>Added Items:</h3>
          <ul>

          </ul>
        </div>
        {/* Placeholder for Product List */}
        <div className="product-list-container">
          <h3>Product:</h3>
          <ul className="product-list">
            {/* Example Product */}
            <li>
              <div className="product-image-placeholder" /> {/* Image placeholder */}
              Product One - $20 - Quantity: 5 - Total: $100
            </li>
          </ul>
          <h3>Product:</h3>
          <ul className="product-list">
            {/* Example Product */}
            <li>
              <div className="product-image-placeholder" /> {/* Image placeholder */}
              Product One - $20 - Quantity: 5 - Total: $100
            </li>
          </ul>
          <h3>Product:</h3>
          <ul className="product-list">
            {/* Example Product */}
            <li>
              <div className="product-image-placeholder" /> {/* Image placeholder */}
              Product One - $20 - Quantity: 5 - Total: $100
            </li>
          </ul>
          <h3>Product:</h3>
          <ul className="product-list">
            {/* Example Product */}
            <li>
              <div className="product-image-placeholder" /> {/* Image placeholder */}
              Product One - $20 - Quantity: 5 - Total: $100
            </li>
          </ul>
        </div>
      </div>

      {/* Checkout Form */}
      <div className="checkout-form-container">
        <div className="checkout-form">
        <h2>Checkout</h2>

          <div className="form-group">
            {/* Display image above the Name field */}
            <img src={exampleOrderMap} alt="Order Map" className="order-map-image" />
          </div>
          <div className="form-group">
            <label>Name:</label>
            <input type="text" />
          </div>
          <div className="form-group">
            <label>Phone Number:</label>
            <input type="text" />
          </div>
          <div className="form-group">
            <label>Address:</label>
            <input type="text" />
          </div>
          <button type="button">Place Order</button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
