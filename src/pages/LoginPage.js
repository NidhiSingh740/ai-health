import React from 'react';
import './LoginSignup.css';
import { Link } from 'react-router-dom';

function LoginPage() {
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
      <div className="auth-container">
        <h2>Login to Smart Health AI</h2>
        <form>
          <input type="email" placeholder="Email" required />
          <input type="password" placeholder="Password" required />
          <button type="submit">Login</button>
        </form>
        <div className="auth-footer">
          <p>Don't have an account? <Link to="/signup">Sign Up</Link></p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
