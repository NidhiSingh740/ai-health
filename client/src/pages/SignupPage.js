// src/pages/SignupPage.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './signup.css'; // Common CSS

function SignupPage() {
  const [user, setUser] = useState({
    username: '',
    email: '',
    phone: '',
    password: ''
  });

  const navigate = useNavigate();

  const handleInput = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('https://ai-health-n4i4.onrender.com/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
      });

      if (response.ok) {
        alert('Signup successful!');
        setUser({ username: '', email: '', phone: '', password: '' });
        navigate('/login');
      } else {
        const errorData = await response.json();
        alert(errorData.msg || 'Signup failed.');
      }
    } catch (error) {
      console.error('Signup error:', error);
      alert('Something went wrong. Please try again later.');
    }
  };

  return (
    <div className="signup-page-container">
      <div className="signup-image-section">
        <img src="/images/loginsignup2.png" alt="Signup Visual" className="signup-image" />
      </div>

      <div className="auth-container">
        <div className="auth-box">
          <h2>Create an Account</h2>
          <p className="auth-subtitle">Sign up for Smart AI HealthCare</p>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="username"
              placeholder="Full Name"
              value={user.username}
              onChange={handleInput}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={user.email}
              onChange={handleInput}
              required
            />
            <input
              type="text"
              name="phone"
              placeholder="Phone"
              value={user.phone}
              onChange={handleInput}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={user.password}
              onChange={handleInput}
              required
            />
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
