import React from 'react'
import { Link } from 'react-router-dom'
function Navbar() {
  return (
    <div className='navbar'>
        <div className='navbar-logo'>
            DOGGY DASH
        </div>
        <ul className='navbar-menu'>

            <li><Link to="/">Home Page</Link></li>
            <li><Link to="/account">Account</Link></li>
            <li><Link to="/login">Signup</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/contact">Contact</Link></li>


        </ul>


    </div>
  )
}

export default Navbar