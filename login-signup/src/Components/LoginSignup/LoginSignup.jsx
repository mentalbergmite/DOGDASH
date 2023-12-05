import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './LoginSignup.css';
import user_icon from '../Assets/person.png';
import email_icon from '../Assets/email.png';
import password_icon from '../Assets/password.png';

const LoginSignup = () => {
    const [action, setAction] = useState('Login');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
  
    const handleActionClick = async () => {
      if (action === 'Sign Up' && name && email && password) {
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
  
          if (result.success) {
            // Sign up successful
            if (action === 'Login') {
              try {
                const loginResponse = await fetch('http://localhost:5000/api/login', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ email, password }),
                });
  
                const loginResult = await loginResponse.json();
  
                if (loginResult.success) {
                  // Redirect to the '/home' page after successful login
                  // Use Link to navigate
                  setAction('Login');
                } else {
                  // Handle login failure
                  alert(loginResult.message);
                }
              } catch (loginError) {
                console.error('Error during login:', loginError.message);
              }
            } else {
              // Switch to login form
              setAction('Login');
            }
          } else {
            // Handle sign up failure
            alert(result.message);
          }
        } catch (error) {
          console.error('Error during sign up:', error.message);
        }
      } else {
        // Switch between "Login" and "Sign Up" forms
        setName('');
        setEmail('');
        setPassword('');
        setAction(action === 'Login' ? 'Sign Up' : 'Login');
      }
    };

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
    <div className='container'>
      <div className='header'>
        <div className='text'>{action}</div>
        <div className='underline'></div>
      </div>
      <div className='inputs'>
        {action === 'Login' ? null : (
          <div className='input'>
            <img src={user_icon} alt='' />
            <input
              type='text'
              placeholder='Name'
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        )}

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

      {action === 'Login' && (
        <div className='forgot-password'>
          Forgot Password?<span> Click Here!</span>
        </div>
      )}

      <div className='submit-container'>
        <div
          className={action === 'Login' ? 'submit gray' : 'submit'}
          onClick={handleActionClick}
        >
          Sign Up
        </div>
        <div
          className={action === 'Sign Up' ? 'submit gray' : 'submit'}
          onClick={handleActionClick}
        >
          Login
        </div>
      </div>
    </div>
  );
};

export default LoginSignup;
