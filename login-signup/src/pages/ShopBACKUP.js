// home.js

import React, { useState, useEffect } from 'react';
import Navbar from "../Components/Navbar/Navbar.jsx";
import Product from '../Components/Product/Product.js'; // Adjust the path based on your project structure
import FilterSidebar from './FilterSidebar.js'; // Adjust the path based on your project structure

import './Shop.css'; // Import the styles


const Shop = ({ addToCart }) => {
  const [addedItems, setAddedItems] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [filterOption, setFilterOption] = useState(null);
  const [products, setProducts] = useState([]);



  // Fetch the cart data from the server using the view_cart route
  useEffect(() => {
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
  }, []);
   // Empty dependency array ensures this effect runs only once on mount

  const handleAddToCart = (product) => {
    console.log('Adding to cart:', product);
    addToCart(product);
    setAddedItems((prevItems) => [...prevItems, product]);
  
    // Check if the product data is available
    if (product.name && product.price) {
      // Update the cart in the Flask backend with product information
      fetch('http://localhost:5000/api/add_to_cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: product.name,
          price: product.price,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            console.log('Item added to the cart on the server side');
          } else {
            console.error('Failed to add item to the cart:', data.message);
          }
        })
        .catch((error) => {
          console.error('Error adding item to the cart:', error);
        });
    } else {
      console.error('Product data is incomplete. Item not added to the cart.');
    }
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

  const handleFilter = (option) => {
    setFilterOption(option);
    // Implement filtering logic 
  };

  // creates 12 products
  /*const productsData = [
    { id: 1, name: 'Product One', price: 20 },
    { id: 2, name: 'Product Two', price: 30 },
    { id: 3, name: 'Product Three', price: 40 },
    { id: 4, name: 'Product Four', price: 50 },
    { id: 5, name: 'Product Five', price: 60 },
    { id: 6, name: 'Product Six', price: 70 },
    { id: 7, name: 'Product Seven', price: 80 },
    { id: 8, name: 'Product Eight', price: 90 },
    { id: 9, name: 'Product Nine', price: 100 },
    { id: 10, name: 'Product Ten', price: 110 },
    { id: 11, name: 'Product Eleven', price: 120 },
    { id: 12, name: 'Product Twelve', price: 130 },

    // Add more product data as needed
  ];
  */

  return (
    <>
      <Navbar cartCount={cartItems.length} />

      <div className="content-container">
        <div className="sidebar">
          <FilterSidebar className="filter-sidebar" />
        </div>

        <div className="products-grid">
          {products.map((product) => (
            <Product
              key={product.id}
              name={product.name}
              price={product.price}
              incrementCartCount={() => handleAddToCart(product)}
            />
          ))}
        </div>
      </div>

      <div className="added-items-list">
        <h3>Added Items:</h3>
        <ul>
          {addedItems.map((item, index) => (
            <li key={index}>{item.name} - ${item.price}</li>
          ))}
        </ul>
      </div>

      <div className="cart-items-list">
        <h3>Cart List:</h3>
        <ul>
          {cartItems.map((item) => (
            <li key={item.product_id}>{item.name} - ${item.price}</li>
          ))}
        </ul>
        <button onClick={handleClearCart}>Clear Cart</button>
      </div>
    </>
  );
};

export default Shop;
