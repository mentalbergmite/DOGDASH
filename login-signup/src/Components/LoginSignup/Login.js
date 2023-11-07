import React, { useState } from 'react';
import Axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './LoginSignup.css'; // Import your CSS file
import user_icon from '../Assets/person.png';
import password_icon from '../Assets/password.png';


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const login = async () => {
    try {
      const response = await Axios.post('/api/login', { email, password });
      console.log(response.data);
      // Handle successful login
      navigate('/profile'); // Navigate to the profile page or another page as needed
    } catch (error) {
      console.error(error);
      // Handle login error
    }
  };

  return (
    <div className="container">
      <div className="header">
        <div className="text">Login</div>
        <div className="underline"></div>
      </div>
      <form>
        <div className="input">
          <img src={user_icon} alt="" />
          <input type="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          
          placeholder="Email" />
        </div>
        <div className="input">
          <img src={password_icon} alt="" />
          <input type="password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          
          placeholder="Password" />
        </div>
        
      </form>
      <div className="forgot-password">Forgot Password?<span> Click Here!</span></div>

      <div className='submit-container'>
        <button onClick={login} className="submit">Login</button>
      </div>
    </div>
  );
};

export default Login;
