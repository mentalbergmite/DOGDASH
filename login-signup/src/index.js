import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { Footer } from "./Components/Footer/Footer";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import "./index.css";
import App from './App';
import reportWebVitals from './reportWebVitals';
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Signup from "./pages/Signup"; // Import the Signup component
import Error from "./pages/Error";
import Account from "./pages/Account";
import About from "./pages/About";
import Home from "./pages/Home";
import Cart from './pages/Cart';
import Shop from './pages/Shop';
import Checkout from './pages/Checkout';
import Success from './pages/Success';


const router = createBrowserRouter([
  {
    path: "/",
    element: <Home/>,
  },
  {
    path: "/contact",
    element: <Contact/>,
  },
  {
    path: "/login",
    element: <Login/>,
  },
  {
    path: "/signup", // Define the signup route
    element: <Signup />, // Use the Signup component
  },
  {
    path: "/home",
    element: <Home/>,
  },
  {
    path: "/shop",
    element: <Shop/>,
  },
  {
    path: "/about",
    element: <About/>,
  }, {
    path: "/account",
    element: <Account/>,
  }, {
    path: "/cart",
    element: <Cart/>,
  }, {
    path: "/checkout",
    element: <Checkout/>,
  }, {
    path: "/error",
    element: <Error/>,
  }, {
    path: "/success",
    element: <Success/>,
  },
]);


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router}/>
    <Footer/>
  </React.StrictMode>
);
 
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
