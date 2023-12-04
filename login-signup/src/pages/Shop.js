import React, { useState, useEffect } from 'react';
import Navbar from "../Components/Navbar/Navbar.jsx";
import Product from '../Components/Product/Product.js';
import FilterSidebar from './FilterSidebar.js';

import './Shop.css';

const Shop = () => {
    const [cartItems, setCartItems] = useState([]);
    const [filterOption, setFilterOption] = useState(null);
    const [products, setProducts] = useState([]);
  
    useEffect(() => {
      fetch('http://localhost:5000/api/products')
        .then(response => response.json())
        .then(data => {
          if (data.products) {
            console.log('Received products:', data.products);
            setProducts(data.products);
          }
        })
        .catch(error => {
          console.error('Error fetching products:', error);
        });
    }, []);
  
    const addToCart = (product) => {
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
      fetch('http://localhost:5000/api/clear_cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
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
              id={product.id}
              name={product.name}
              price={product.price}
              imageSource={product.image_source}
              addToCart={addToCart} // Pass addToCart function to Product component
            />
          ))}
        </div>
      </div>


    </>
  );
};

export default Shop;