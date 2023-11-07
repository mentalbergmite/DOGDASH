import React, { useState } from 'react'
import './Navbar.css'
import logo from '../Assets/doggy.png'
import paw from '../Assets/paw.png'
import { Link } from 'react-router-dom'

export const Navbar = () => {
    const [menu,setMenu] = useState("shop");

  return (
    <div className='navbar'>
        <div className='navbar-logo'>
          
            <img src={logo} alt="" style={{ width: '100px', height: 'auto' }} />
            <p>DOGGY DASH</p>
          
        </div>
        <ul className='navbar-menu'>

            <li onClick={()=>{setMenu("home")}}><Link style={{ textDecoration: 'none'}} to='/'>Home Page</Link>{menu==='home'?<hr/>:<></>}</li>
            <li onClick={()=>{setMenu("account")}}><Link style={{ textDecoration: 'none'}} to='/account'>Account</Link>{menu==='account'?<hr/>:<></>}</li>
            <li onClick={()=>{setMenu("shop")}}><Link style={{ textDecoration: 'none'}} to='/shop'>Shop</Link>{menu==='shop'?<hr/>:<></>}</li>


        </ul>
    <div className="nav-login-paw">
      <Link to='/signup'> <button>Signup</button></Link>
      <Link to='/login'> <button>Login</button></Link>
      <Link to='/cart'><img src={paw} alt="" style={{ width: '100px', height: 'auto' }} /></Link>
    
      <div className="nav-paw-count">0</div>

    </div>
    
    </div>
  )
}

export default Navbar
