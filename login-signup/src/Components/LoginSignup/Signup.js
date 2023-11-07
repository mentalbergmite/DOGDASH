import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './LoginSignup.css'; // Import your CSS file

import user_icon from '../Assets/person.png';
import email_icon from '../Assets/email.png';
import password_icon from '../Assets/password.png';


export default function Signup ()  {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const signup = async () => {
    /*
    try {
      console.log('Signup function called');
      const response = await Axios.post('/api/signup', { name:name, email:email, password:password });
      console.log(response.data);
      // Handle successful signup
      navigate('/login'); // Navigate to the login page after successful signup
    } catch (error) {
      console.error(error);
      console.error('Signup failed');
      // Handle signup error
    }
    */
    console.log('Signup function called');
    axios.post('http://127.0.0.1:5000/api/signup', {
        name: name,
        email: email,
        password: password
    })
    .then(function (response) {
        console.log(response);
        navigate("/login");
    })
    .catch(function (error) {
        console.log(error, 'error');
        if (error.response.status === 401) {
            alert("Invalid credentials");
        }
    });

  };

  return (
    <div className="container">
      <div className="header">
        <div className="text">Sign Up</div>
        <div className="underline"></div>
      </div>
      <form>
        <div className="input">
          <img src={user_icon} alt="" />
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="input-field" placeholder="Name" />
        </div>
        <div className="input">
          <img src={email_icon} alt="" />
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-field" placeholder="Email" />
        </div>
        <div className="input">
          <img src={password_icon} alt="" />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="input-field" placeholder="Password" />
        </div>

        <div className='submit-container'>
            <button onClick={signup} className="submit">Sign Up</button>
        </div>
        
      </form>
     
      
    </div>
  );
};


