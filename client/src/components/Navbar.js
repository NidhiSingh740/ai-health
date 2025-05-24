import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'; // if you have CSS

const Navbar = ({ user, onLogout }) => { // Receive user and onLogout props
  return (
    <nav className="navbar" style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '15px 30px',
      backgroundColor: '#f8f9fa',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    }}>
      <div className="logo" style={{
        fontSize: '24px',
        fontWeight: 'bold',
        color: '#007bff'
      }}>🩺 Smart Health AI</div>
      <div className="nav-links" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <Link to="/" style={{ textDecoration: 'none', color: '#333', fontSize: '16px' }}>Home</Link>
        <a href="#features" style={{ textDecoration: 'none', color: '#333', fontSize: '16px' }}>Features</a>

        {user ? (
          // If user is logged in
          <>
            <span style={{ fontSize: '16px', color: '#555' }}>
              Welcome, <span style={{ fontWeight: 'bold' }}>{user.username}</span>
            </span>
            <button
              onClick={onLogout}
              style={{
                padding: '8px 15px',
                backgroundColor: '#dc3545', // Red for logout
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '16px',
                textDecoration: 'none'
              }}
            >
              Logout
            </button>
          </>
        ) : (
          // If user is not logged in
          <>
            <Link to="/login" style={{
              padding: '8px 15px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '16px',
              textDecoration: 'none'
            }}>
              Login
            </Link>
            <Link to="/signup" style={{
              padding: '8px 15px',
              backgroundColor: '#28a745', // Green for signup
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '16px',
              textDecoration: 'none'
            }}>
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;