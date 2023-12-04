// home.js

import React, { useState, useEffect } from 'react';
import Navbar from "../Components/Navbar/Navbar.jsx";
import Product from '../Components/Product/Product.js';
import doggysaleImage from '../Components/Assets/doggysaleROUNDED.png';
import './Home.css';
import { Link } from 'react-router-dom';

const Home = ({ addToCart }) => {
  const [addedItems, setAddedItems] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Fetch all products from the server
    fetch('http://localhost:5000/api/products')
      .then(response => response.json())
      .then(data => {
        if (data.products) {
          setProducts(data.products);
        }
      })
      .catch(error => {
        console.error('Error fetching products:', error);
      });

    // Fetch the cart data from the server using the view_cart route
    fetch('http://localhost:5000/api/view_cart')
      .then((response) => response.json())
      .then((data) => {
        if (data.cart) {
          setCartItems(data.cart);
        }
      })
      .catch((error) => {
        console.error('Error fetching cart:', error);
      });
  }, []);

  const handleAddToCart = (product) => {
      // Check if the item is already in the cart
      const existingItem = cartItems.find(item => item.id === product.id);
    
      if (existingItem) {
        // If the item is already in the cart, update the quantity
        const updatedCartItems = cartItems.map(item =>
          item.id === existingItem.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
    
        setCartItems(updatedCartItems);
      } else {
        // If the item is not in the cart, add a new item with quantity 1
        setCartItems(prevCartItems => [...prevCartItems, { ...product, quantity: 1 }]);
      }
    
      // Update the cart on the server
      fetch('http://localhost:5000/api/add_to_cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(product),
      })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            console.log('Item added to the cart on the server side');
          } else {
            console.error('Failed to add item to the cart:', data.message);
          }
        })
        .catch(error => {
          console.error('Error adding item to the cart:', error);
        });
    };
  

  const handleClearCart = () => {
    // Make a POST request to clear the cart
    fetch('http://localhost:5000/api/clear_cart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          // Cart cleared successfully, update the local state or perform any additional actions
          setCartItems([]);
          console.log('Cart cleared successfully');
        } else {
          console.error('Error clearing cart:', data.message);
        }
      })
      .catch(error => {
        console.error('Error clearing cart:', error);
      });
  };

  function getRandomNumber() {
    return Math.floor(Math.random() * 12) + 1;
  }

  // Function to shuffle an array
  const shuffleArray = (array) => {
    let currentIndex = array.length, randomIndex;
  
    // While there remain elements to shuffle...
    while (currentIndex !== 0) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
  }

  return (
    <>
      <Navbar />

      <div className="image-container">
        <div className="image-frame">
          <img
            src={doggysaleImage}
            alt="Doggysale Rounded"
          />

          {/* Link component covering the image */}
          <Link to="/Shop" className="overlay-link">
            {/* Content inside the link (optional) */}
          </Link>
        </div>
      </div>

      {/* Render four random products in a row using shuffled */}
      <div className="home-product-row">
        {products.length > 0 && (
          shuffleArray(products).slice(0, 4).map(product => (
            <Product
              key={product.id}
              id={product.id}
              name={product.name}
              price={product.price}
              imageSource={product.image_source}
              addToCart={handleAddToCart}
              />
          ))
        )}
      </div>
    </>
  );
};

export default Home;
