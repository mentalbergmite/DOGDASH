import React from 'react';
import Navbar from "../Components/Navbar/Navbar.jsx";
import LoginSignup from "../Components/LoginSignup/LoginSignup.jsx";

export default function Login(){
    return(
        <React.Fragment>
            <Navbar />
            <LoginSignup />
        </React.Fragment>
    );
}
