// components/Navbar.js
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css'; // Optional CSS

const Navbar = ({ user, onLogout }) => {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith('/dashboard');

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
        color: '#04751c'
      }}>
         Arogya AI
      </div>

      <div className="nav-links" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        { user ? (
          <>
       
            <span style={{ fontSize: '16px', color: '#555' }}>
             <strong>{user.username}</strong>
            </span>
            <button
              onClick={onLogout}
              style={{
                padding: '8px 15px',
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={{
              padding: '8px 15px',
              backgroundColor: '#04751c',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '16px',
              textDecoration: 'none'
            }}>Login</Link>
            {/* <Link to="/signup" style={{
              padding: '8px 15px',
              backgroundColor: 'blue',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '16px',
              textDecoration: 'none'
            }}>Sign Up</Link> */}
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
