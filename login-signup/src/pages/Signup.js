import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../Components/LoginSignup/LoginSignup.css';
import user_icon from '../Components/Assets/person.png';      // Updated path
import email_icon from '../Components/Assets/email.png';      // Updated path
import password_icon from '../Components/Assets/password.png';
import Navbar from '../Components/Navbar/Navbar'; 

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = async () => {
    if (name && email && password) {
      try {
        const response = await fetch('http://localhost:5000/api/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name, email, password }),
        });
  
        if (!response.ok) {
          throw new Error(`Signup failed with status: ${response.status}`);
        }
  
        const result = await response.json();
        console.log('Signup Result:', result);
  
        if (result.success) {
          // Redirect to the '/login' page after successful signup
          window.location.href = '/login';
        } else {
          // Handle signup failure
          alert(result.message);
        }
      } catch (error) {
        console.error('Error during signup:', error.message);
      }
    } else {
      // Handle incomplete data
      alert('Please provide all required information.');
    }
  };
  

  return (
    <>
    <div className='container'>
      <div className='header'>
        <div className='text'>Sign Up</div>
        <div className='underline'></div>
      </div>
      <div className='inputs'>
        <div className='input'>
          <img src={user_icon} alt='' />
          <input
            type='text'
            placeholder='Name'
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
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

      <div className='submit-container'>
        <div className='submit' onClick={handleSignup}>
          Sign Up
        </div>
      </div>

      <div className='login-link'>
        Already have an account? <a href='/login'>Login</a>
      </div>
    </div>
    </>
  );
};

export default Signup;
