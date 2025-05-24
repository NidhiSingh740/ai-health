
import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'; // if you have CSS

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="logo">🩺 Smart Health AI</div>
      <div className="nav-links">
        <a href="#features">Features</a>
        <a href="/login" className='btn'>Login</a>
        {/* <Link to="/login" className="nav-link">Login</Link>
        <Link to="/signup" className="nav-link">Sign Up</Link> */}
      </div>
    </nav>
  );
};

export default Navbar;
