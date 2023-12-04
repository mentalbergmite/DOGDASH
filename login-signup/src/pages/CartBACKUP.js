// Cart.js

import React from 'react';
import './Cart.css'; // Import the CSS file for styling

const Cart = ({ addedItems }) => {
  // Hardcoded product data
  const productsData = [
    { id: 1, name: 'Product One', price: 20, quantity: 5 },
    { id: 2, name: 'Product Two', price: 30, quantity: 2 },
    { id: 3, name: 'Product Three', price: 40, quantity: 1 },
    { id: 4, name: 'Product Four', price: 50, quantity: 3 },
    { id: 5, name: 'Product Five', price: 60, quantity: 4 },
    { id: 6, name: 'Product Six', price: 70, quantity: 2 },
    { id: 7, name: 'Product Seven', price: 80, quantity: 1 },
    { id: 8, name: 'Product Eight', price: 90, quantity: 2 },
    { id: 9, name: 'Product Nine', price: 100, quantity: 3 },
    { id: 10, name: 'Product Ten', price: 110, quantity: 1 },
    { id: 11, name: 'Product Eleven', price: 120, quantity: 2 },
    { id: 12, name: 'Product Twelve', price: 130, quantity: 4 },
  ];

  // Helper function to calculate the total value
  const calculateTotalValue = (item) => item.price * item.quantity;

  return (
    <div className="cart-container">
      <h2>Cart Page</h2>
      {/* Check if addedItems is an array before mapping */}
      {Array.isArray(addedItems) && addedItems.length > 0 ? (
        <div className="added-items-list">
          <h3>Added Items:</h3>
          <ul>
            {addedItems.map((item, index) => (
              <li key={index}>
                <div className="product-image-placeholder" /> {/* Image placeholder */}
                {item.name} - ${item.price} - Quantity: {item.quantity} - Total: ${calculateTotalValue(item)}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p></p>
      )}

      {/* Display hardcoded product list */}
      <div className="product-list-container">
        <h3>Product List:</h3>
        <ul className="product-list">
          {productsData.map((product) => (
            <li key={product.id}>
              <div className="product-image-placeholder" /> {/* Image placeholder */}
              {product.name} - ${product.price} - Quantity: {product.quantity} - Total: ${calculateTotalValue(product)}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Cart;
