import React from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import './LoginSignup.css';
import user_icon from '../Assets/person.png';
import email_icon from '../Assets/email.png';
import password_icon from '../Assets/password.png';

const LoginSignup = () => {
    const [action, setAction] = useState('Login');

    const handleRoute = () => {
        if (action === 'Login') {
            return '/';
        } else {
            return '/account';
        }
    };

    return (
        <div className='container'>
            <div className="header">
                <div className="text">{action}</div>
                <div className="underline"></div>
            </div>
            <div className="inputs">
                {action === "Login" ? <div></div> :
                    <div className="input">
                        <img src={user_icon} alt="" />
                        <input type="text" placeholder='Name' />
                    </div>
                }

                <div className="input">
                    <img src={email_icon} alt="" />
                    <input type="email" placeholder='Email' />
                </div>
                <div className="input">
                    <img src={password_icon} alt="" />
                    <input type="password" placeholder='Password' />
                </div>
            </div>
            <button>
                <Link to={handleRoute()}>
                    Continue
                </Link>
            </button>

            {action === "Login" &&
                <div className="forgot-password">Forgot Password?<span> Click Here!</span></div>
            }

            <div className="submit-container">
                <div className={action === "Login" ? "submit gray" : "submit"} onClick={() => setAction("Sign Up")}>Sign Up</div>
                <div className={action === "Sign Up" ? "submit gray" : "submit"} onClick={() => setAction("Login")}>Login</div>
            </div>
        </div>
    );
}

export default LoginSignup;
