import React, { useState } from 'react';
import axios from 'axios'; // You may need to install axios

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/login', formData); // Replace with your backend API endpoint
      const { token } = response.data; // Assuming your backend returns a token upon successful login
      // Store the token in localStorage for future requests
      localStorage.setItem('token', token);
      // Redirect the user to a protected route
      // Replace '/dashboard' with the route you want to redirect to after login
      window.location = '/dashboard';
    } catch (error) {
      setErrorMessage('Invalid credentials. Please try again.');
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
          />
        </div>
        <button type="submit">Login</button>
      </form>
      {errorMessage && <p>{errorMessage}</p>}
    </div>
  );
};

export default Login;
