// Cart.js

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link
import './Cart.css';


const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    // Fetch cart items from the server
    fetch('http://localhost:5000/api/cart')
      .then(response => response.json())
      .then(data => setCartItems(data.cart))
      .catch(error => console.error('Error fetching cart:', error));
  }, []);

  useEffect(() => {
    // Calculate the total when cart items change
    const newTotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    setTotal(newTotal);
  }, [cartItems]);

  const handleClearCart = () => {
    // Display a confirmation dialog
    const isConfirmed = window.confirm("Are you sure you want to clear your cart?");
  
    // If the user confirms, proceed with clearing the cart
    if (isConfirmed) {
      // Make a request to clear the cart on the server
      fetch('http://localhost:5000/api/clear_cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            // If the cart is cleared successfully, update the local state
            setCartItems([]);
            console.log('Cart cleared successfully');
          } else {
            console.error('Error clearing cart:', data.message);
          }
        })
        .catch(error => {
          console.error('Error clearing cart:', error);
        });
    } else {
      // If the user cancels, do nothing
      console.log('Clear cart canceled');
    }
  };

  const handleUpdateQuantity = (productId, newQuantity) => {
    // Make a request to update the quantity on the server
    fetch('http://localhost:5000/api/update_quantity', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        product_id: productId,
        quantity: newQuantity,
      }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          // If the quantity is updated successfully, fetch the updated cart
          fetch('http://localhost:5000/api/cart')
            .then(response => response.json())
            .then(data => setCartItems(data.cart))
            .catch(error => console.error('Error fetching cart:', error));
        } else {
          console.error('Error updating quantity:', data.message);
        }
      })
      .catch(error => {
        console.error('Error updating quantity:', error);
      });
  };



  return (
    <div className="cart-container">
      <h1>Your Cart</h1>
      <ul className="added-items-list">
        {cartItems.map((item) => (
          <li key={item.product_id} className="cart-item">
            <img src={`http://localhost:5000/api/images/${item.image}`} alt={item.name} className="cart-product-image" />
            <div className="cart-product-details">
              <div className="cart-product-name">{item.name}</div>
              <div className="cart-product-price">${item.price}</div>
              <div className="cart-product-quantity">
                <button className="quantity-btn" onClick={() => handleUpdateQuantity(item.product_id, item.quantity - 1)}>-</button>
                <span>{item.quantity}</span>
                <button className="quantity-btn" onClick={() => handleUpdateQuantity(item.product_id, item.quantity + 1)}>+</button>
              </div>
            </div>
          </li>
        ))}
    </ul>
    <div className="total">Total: ${total}</div>
    <div className="cart-buttons">
      <button onClick={handleClearCart}>Clear Cart</button>
      <Link to="/Checkout">
        <button>Checkout</button>
      </Link>
    </div>
  </div>
);
};

export default Cart;
