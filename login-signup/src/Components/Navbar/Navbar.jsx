// Navbar.jsx

import React, { useEffect, useState } from 'react';
import './Navbar.css';
import logo from '../Assets/doggy.png';
import paw from '../Assets/paw.png';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [cartCount, setCartCount] = useState(0);
  const [currentUserName, setCurrentUserName] = useState('Login'); // Set initial state to 'Login'
  const [loading, setLoading] = useState(true); // Add loading state


  useEffect(() => {



    const fetchCartData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/cart');
        const data = await response.json();
        console.log('Cart Data:', data);

        // Calculate the total quantity from the cart data
        const totalQuantity = data.cart.reduce((total, item) => total + item.quantity, 0);

        // Update the cart count state
        setCartCount(totalQuantity);
      } catch (error) {
        console.error('Error fetching cart:', error);
      }
    };

    const fetchUserData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/user');
        const userData = await response.json();
    
        if (response.ok) {
          console.log('User Data:', userData);
          setCurrentUserName(userData.current_user);
        }
        setLoading(false)
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    // Call the function to fetch cart data
    fetchCartData();

    // Call the function to fetch user data
    fetchUserData();

  }, []); // Empty dependency array ensures this effect runs only once on mount

  if (loading) {
    // Display loading state while fetching data
    return <p>Loading...</p>;
  }
  
  return (
    <div className='navbar'>
      <div className='navbar-logo'>
        <img src={logo} alt="Doggy Dash Logo" style={{ width: '100px', height: 'auto' }} />
        <p>DOGGY DASH</p>
      </div>
      <ul className='navbar-menu'>
        <li><Link to='/home' style={{ textDecoration: 'none' }}>Home Page</Link></li>
        <li><Link to='/account' style={{ textDecoration: 'none' }}>Account</Link></li>
        <li><Link to='/shop' style={{ textDecoration: 'none' }}>Shop</Link></li>
      </ul>
      <div className="nav-login-paw">
        <Link to='/login'>
          <button>{currentUserName}</button>
        </Link>
        <Link to='/cart'>
          <img src={paw} alt="Cart Paw Icon" style={{ width: '100px', height: 'auto' }} />
        </Link>
        <div className="nav-paw-count">{cartCount}</div>
      </div>
    </div>
  );
};

export default Navbar;
