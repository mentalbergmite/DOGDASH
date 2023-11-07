import React, { useState } from 'react';
import Axios from 'axios'; // Import Axios for making HTTP requests
import './LoginSignup.css';

import user_icon from '../Assets/person.png';
import email_icon from '../Assets/email.png';
import password_icon from '../Assets/password.png';

const LoginSignup = () => {
  const [action, setAction] = useState('Login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const login = async () => {
    try {
      const response = await Axios.post('/api/login', { email, password });
      console.log(response.data);
      // Handle success (e.g., redirect to user profile)
    } catch (error) {
      console.error(error);
      // Handle error (e.g., display an error message)
    }
  };

  const signup = async () => {
    try {
      const response = await Axios.post('/api/signup', { name, email, password });
      console.log(response.data);
      // Handle success (e.g., redirect to login page)
    } catch (error) {
      console.error(error);
      // Handle error (e.g., display an error message)
    }
  };

  return (
    <div className="container">
      <div className="header">
        <div className="text">{action}</div>
        <div className="underline"></div>
      </div>
      <div className="inputs">
        {action === "Login" ? (
          <div></div>
        ) : (
          <div className="input">
            <img src={user_icon} alt="" />
            <input
              type="text"
              placeholder="Name"
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        )}

        <div className="input">
          <img src={email_icon} alt="" />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="input">
          <img src={password_icon} alt="" />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      </div>
      <div className="forgot-password">
        Forgot Password?<span> Click Here!</span>
      </div>
      <div className="submit-container">
                <div className={action==="Login"?"submit gray":"submit"} onClick={signup}>Sign Up</div>
                <div className={action==="Sign Up"?"submit gray":"submit"} onClick={login}>Login</div>
            </div>
    </div>
  );
};

export default LoginSignup;
