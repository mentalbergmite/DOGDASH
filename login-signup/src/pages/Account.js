
import Navbar from "../Components/Navbar";
import Header from "../Components/Header.js";
import React, { Component } from 'react';

class Account extends Component{
    constructor(){
        super();
        this.state = {
            showForm: false,
            showAlert: false,
        };
    }
    toggleForm=()=>{
        this.setState({showForm: !this.state.showForm});
    }
    handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const name = formData.get("name");
        const email = formData.get("email");
        const phone_number = formData.get("phone");
        const address = formData.get("address");
        try{
            const response = await fetch("/submit-form",{
                method: "POST",
                headers: {
                    'Content-Type': 'update_form'
                },
                body:JSON.stringify({name,email,phone_number,address}),//handle empty or invalid body data at backend
            });
            if (response.ok){
                //show success alert
                this.setState({ showAlert: true });
            }else{
                //show failure alert
                console.error("Form data submission failed");
            }
        } catch(error){
            //uh oh stinky
            console.error("Error ", error);
        }

        
      }
    render(){
        return (
            <html lang="en-US">
        <head>
            <meta charset="utf-8"/>
            <title>Doggy Dash</title>
        </head>
        <Navbar></Navbar>
        <body>
            {this.state.showAlert && (
            <div>
                <p>Profile Updated Successfully</p>
                <button onClick={() => this.setState({ showAlert: false })}>Close</button>
            </div>
            )}
            <h2> Your Account</h2>
            <div>
                <h3>Name</h3><p>#name</p>
                <h3>Email</h3><p>#email</p>
                <h3>Phone number</h3><p>#Phone</p>
                <h3>Address</h3><p>#address</p>     
            </div>
            <div>
                <button onClick={this.toggleForm}>Edit Profile</button> 
            </div>
            {this.state.showForm && (
            <form onSubmit={this.handleSubmit} id="edit_profile"> 
                <h1>Edit Profile</h1>
                <div class = "field">   
                    <label for="name">Name:</label>
                    <input type="text" id="name" name="name" placeholder="Edit Name"/>
                    <small></small>
                </div>
                <div class = "field">
                    <label for="name">Email:</label>
                    <input type="email" id="email" name="email" placeholder="Edit Email"/>
                    <small></small>
                </div>
                <div class = "field">
                    <label for="name">Phone Number:</label>
                    <input type="text" id="phone" name="phone" placeholder="Edit Phone Number"/>
                    <small></small>
                </div>
                <div class = "field">
                    <label for="name">Address:</label>
                    <input type="text" id="address" name="address" placeholder="Edit Address"/>
                    <small></small>
                </div>
                <div class="field">
                    <button type="submit" class="full">Submit</button>
                </div>
                </form>
            )}
        </body>
        </html>
        )
    }
}

export default Account;

