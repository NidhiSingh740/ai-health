// src/pages/SignupPage.js

import React from 'react';
import './LoginSignup.css';
import { Link } from 'react-router-dom';

function SignupPage() {
   const pageStyle = {
    backgroundImage: "url('/images/signup.jpeg')",
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };
  return (
    <div style={pageStyle}>

    <div className="auth-page">
      <div className="auth-container">
        <h2>Create an Account</h2>
        <form>
          <input type="text" placeholder="Full Name" required />
          <input type="email" placeholder="Email" required />
          <input type="password" placeholder="Password" required />
          <button type="submit">Sign Up</button>
        </form>
        <div className="auth-footer">
          <p>Already have an account? <Link to="/login">Login</Link></p>
        </div>
      </div>
    </div>
    </div>

    
  );
}

export default SignupPage;
