// Account.js

import React, { useEffect, useState } from 'react';
import './Account.css'; // Import your CSS file for styling
import Navbar from "../Components/Navbar/Navbar.jsx";
import pawfileImage from '../Components/Assets/pawfile.png';


const Account = () => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/user');
        const data = await response.json();

        if (response.ok) {
          setUserData(data);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
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
                  {/* Display the paw.png image */}
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
                <h3>Orders:</h3>
                <ul>
                  {userData.orders.map((order) => (
                    <li key={order.id}>Order ID: {order.id}, Date: {order.order_date}</li>
                  ))}
                </ul>
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
