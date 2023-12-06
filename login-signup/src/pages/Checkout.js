import React, { useEffect, useState } from 'react';
import './Checkout.css'; // Import the CSS file for styling
import { Link } from 'react-router-dom'; // Import Link
import Navbar from "../Components/Navbar/Navbar.jsx";


const Checkout = () => {
  const [cartData, setCartData] = useState([]);
  const [total, setTotal] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    address: '',
  });

  useEffect(() => {
    // Fetch cart items from the server
    fetch('http://localhost:5000/api/cart')
      .then((response) => response.json())
      .then((data) => setCartData(data.cart))
      .catch((error) => console.error('Error fetching cart:', error));
  }, []);

  useEffect(() => {
    // Calculate the total when cart items change
    const newTotal = cartData.reduce((acc, item) => acc + item.price * item.quantity, 0);
    setTotal(newTotal);
  }, [cartData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handlePlaceOrder = () => {
    // Add logic to place the order with formData
    // You can send a request to your server with the order details
    console.log('Placing order with data:', formData);
    // Reset the form after placing the order
    setFormData({
      name: '',
      phoneNumber: '',
      address: '',
    });
  };

  return (
    <>
    <Navbar />
    <div className="checkout-container">
      <div className="cart-container">
        <h2>Final Order</h2>
        <div className="added-items-list">
          <ul>
            {cartData.map((item) => (
              <li key={item.product_id} className="cart-item">
                <img
                  src={`http://localhost:5000/api/images/${item.image}`}
                  alt={item.name}
                  className="cart-product-image"
                />
                <div className="cart-product-details">
                  <div className="cart-product-name">{item.name}</div>
                  <div className="cart-product-price">${item.price}</div>
                  <div className="cart-product-quantity">
                    Quantity: {item.quantity}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="total">Total: ${total}</div>
        <div className="form-group">
          <label>Name:</label>
          <input type="text" name="name" value={formData.name} onChange={handleInputChange} />
        </div>
        <div className="form-group">
          <label>Phone Number:</label>
          <input
            type="text"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label>Address:</label>
          <input type="text" name="address" value={formData.address} onChange={handleInputChange} />
        </div>
        <div className="cart-buttons">
          <Link to="/Success">
            <button>Place Order</button>
          </Link>
        </div>
      </div>
    </div>
    </>
  );
};

export default Checkout;
