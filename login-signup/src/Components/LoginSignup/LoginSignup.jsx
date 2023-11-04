import React from 'react';
import { useState } from 'react';
import './LoginSignup.css';

import user_icon from '/Users/babatundejrayanda/Documents/Login-signup/login-signup/src/Components /Assets/person.png'
import email_icon from '/Users/babatundejrayanda/Documents/Login-signup/login-signup/src/Components /Assets/email.png'
import password_icon from '/Users/babatundejrayanda/Documents/Login-signup/login-signup/src/Components /Assets/password.png'
const LoginSignup = () => {
    const [action, setAction] = useState('Login');
    
    return ( 
        
        <div className='container'>
            <div classname="header">
                <div className="text">{action}</div>
                <div className="underline"></div>
            </div>
            <div className="inputs">
                {action==="Login"?<div></div>:<div className="input">
                    <img src={user_icon} alt="" />
                    <input type="text" placeholder='Username'/>
                </div>}
                
                <div className="input">
                    <img src={email_icon} alt="" />
                    <input type="email" placeholder='Email'/>
                </div>
                <div className="input">
                    <img src={password_icon} alt="" />
                    <input type="password" placeholder='Password' />
                </div>
            </div>
            <div className="forgot-password">Forgot Password?<span> Click Here!</span></div>
            <div className="submit-container">
                <div className={action==="Login"?"submit gray":"submit"} onClick={()=>setAction("Sign Up")}>Adopt Up</div>
                <div className={action==="Sign Up"?"submit gray":"submit"} onClick={()=>setAction("Login")}>Login</div>
            </div>

        </div>
        )
}

export default LoginSignup