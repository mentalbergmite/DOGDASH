// App.js

import React, { useState, useEffect } from 'react';
import './App.css';
import Navbar from './Components/Navbar/Navbar';
import HomePage from './pages/Home.js';
import Cart from './pages/Cart';  // Import the Cart component

function App() {
  const [cartCount, setCartCount] = useState(0);
  const [addedItems, setAddedItems] = useState([]);

  useEffect(() => {
    const fetchCartData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/cart');
        const data = await response.json();
  
        if (data.cart) {
          console.log('Received cart data:', data.cart);
          setAddedItems(data.cart);
          setCartCount(data.cart.length);
        }
      } catch (error) {
        console.error('Error fetching cart:', error);
      }
    };
  
    fetchCartData();
  }, []);

  const incrementCartCountLocal = () => {
    setCartCount(cartCount + 1);
  };

  return (
    <div>
      <Navbar cartCount={cartCount} />
      {/* Pass addToCart to HomePage with the correct function name */}
      {/* Render the Cart component */}
      <Cart addedItems={addedItems} />
    </div>
  );
}

export default App;
