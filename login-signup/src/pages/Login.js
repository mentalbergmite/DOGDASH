import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../Components/LoginSignup/LoginSignup.css';
import user_icon from '../Components/Assets/person.png';      // Updated path
import email_icon from '../Components/Assets/email.png';      // Updated path
import password_icon from '../Components/Assets/password.png';
import Navbar from '../Components/Navbar/Navbar'; 


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      email: email,
      password: password,
    };

    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        // Redirect to the '/home' page after successful login
        window.location.href = '/home';
      } else {
        // Handle login failure
        alert(result.message);
      }
    } catch (error) {
      console.error('Error during login:', error.message);
    }
  };

  return (
    <>
    <Navbar />
    <div className='container'>
      <div className='header'>
        <div className='text'>Login</div>
        <div className='underline'></div>
      </div>
      <div className='inputs'>
        <div className='input'>
          <img src={email_icon} alt='' />
          <input
            type='email'
            placeholder='Email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className='input'>
          <img src={password_icon} alt='' />
          <input
            type='password'
            placeholder='Password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      </div>

      <div className='forgot-password'>
        Forgot Password?<span> Click Here!</span>
      </div>

      <div className='submit-container'>
        <div className='submit' onClick={handleSubmit}>
          Login
        </div>
        <Link to='/signup' className='submit gray'>
          Sign Up
        </Link>
      </div>
    </div>
    </>

  );
};

export default Login;
