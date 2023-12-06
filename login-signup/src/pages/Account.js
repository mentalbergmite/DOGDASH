// Account.js

import React, { useEffect, useState } from 'react';
import './Account.css'; // Import your CSS file for styling
import Navbar from "../Components/Navbar/Navbar.jsx";
import pawfileImage from '../Components/Assets/pawfile.png';

const Account = () => {
  const [userData, setUserData] = useState(null);
  const [cartData, setCartData] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userResponse = await fetch('http://localhost:5000/api/user');
        const userData = await userResponse.json();

        if (userResponse.ok) {
          setUserData(userData);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    const fetchCart = async () => {
      try {
        const cartResponse = await fetch('http://localhost:5000/api/cart');
        const cartData = await cartResponse.json();

        if (cartResponse.ok) {
          setCartData(cartData);
          console.log('CART Data:', cartData); // Add this line

        }
      } catch (error) {
        console.error('Error fetching cart data:', error);
      }
    };

    const fetchData = async () => {
      await fetchUser();
      await fetchCart();
    };
  
    fetchData();
  }, []);

  return (
    <>
      <Navbar />
      <div className="account-container">
        <div className="account-box">
          {userData ? (
            <>
              <div className="profile-box">
                <div className="profile-image-frame">
                  <img src={pawfileImage} alt="Paw" className="profile-image" />
                </div>
              </div>
              <div className="user-info-box">
                <h2>Welcome, {userData.current_user}</h2>
                <div className="info-item">
                  <p><strong>Email:</strong></p>
                  <p>{userData.email}</p>
                </div>
                <div className="info-item">
                  <p><strong>Address:</strong></p>
                  <p>{userData.address}</p>
                </div>
                <div className="info-item">
                  <p><strong>Phone:</strong></p>
                  <p>{userData.phone}</p>
                </div>
              </div>
              <div className="orders-box">
                <h3>Order:</h3>
                <p>Order Number: {412022}</p>
                <p>Order Date: {new Date().toLocaleDateString()}</p>
                <p>Order Status: {"Pending"}</p>
                <p>Order Items:</p>
                {cartData && cartData.cart && cartData.cart.length > 0 ? (
                  <ul>
                    {cartData.cart.map(item => (
                      <li key={item.product_id}>
                        Product: {item.name}, Price: {item.price}, Quantity: {item.quantity}
                      </li>
                    ))}
                  </ul>
                  
                ) : (
                  <p>Cart is empty.</p>
                )}
                <p>Order Total: ${cartData && cartData.cart && cartData.cart.length > 0 ? cartData.cart.reduce((acc, item) => acc + item.price * item.quantity, 0) : 0}</p>

              </div>
            </>
          ) : (
            <p>Loading user data...</p>
          )}
        </div>
      </div>
    </>
  );
};

export default Account;
