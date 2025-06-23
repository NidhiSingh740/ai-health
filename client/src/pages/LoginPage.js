import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './LoginSignup.css';

function LoginPage({ setUser }) {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleInput = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      if (response.ok) {
        const responseData = await response.json();
        alert(responseData.msg);
        localStorage.setItem("token", responseData.token);
        setUser({
          userId: responseData.userId,
          username: responseData.username,
          email: credentials.email,
        });
        navigate("/");
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Login failed. Please check your credentials.");
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert("An unexpected error occurred during login. Please try again later.");
    }
  };

  return (
    
    <div className="login-page-container">
      <div className="login-image-section">
        <img src="/images/loginsignup2.png" alt="Login Visual" className="login-image" />
      </div>

      <div className="auth-container">
        <div className="auth-box">
          <h2>Welcome Back 👋</h2>
          <p className="auth-subtitle">Login to your Smart AI HealthCare</p>
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={credentials.email}
              onChange={handleInput}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={credentials.password}
              onChange={handleInput}
              required
            />
            <button type="submit">Login</button>
          </form>
          <div className="auth-footer">
            <p>Don't have an account? <Link to="/signup">Sign Up</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
