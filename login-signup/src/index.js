import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import "./index.css";
import App from './App';
import reportWebVitals from './reportWebVitals';
import Contact from "./pages/Contact";
import Login1 from "./pages/Login";
import Error from "./pages/Error";
import Account from "./pages/Account";
import About from "./pages/About";
import Home from "./pages/Home";
import Signup1 from "./pages/Signup";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
  },
  {
    path: "/contact",
    element: <Contact/>,
  },
  {
    path: "/signup",
    element: <Signup1/>,
  },
  {
    path: "/login",
    element: <Login1/>,
  },
  {
    path: "/home",
    element: <Home/>,
  },
  {
    path: "/about",
    element: <About/>,
  }, {
    path: "/account",
    element: <Account/>,
  }, {
    path: "/error",
    element: <Error/>,
  },
]);


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
