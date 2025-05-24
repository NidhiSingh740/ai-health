import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function SignupPage() {
  const [user, setUser] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleInput = (e) => {
    let name = e.target.name;
    let value = e.target.value;

    setUser({
      ...user,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/auth/register", { // Assuming your backend runs on port 5000
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      if (response.ok) {
        alert("Registration successful!");
        setUser({ username: "", email: "", phone: "", password: "" });
        navigate("/login"); // Redirect to login page after successful signup
      } else {
        const errorData = await response.json();
        alert(errorData.msg || "Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during registration:", error);
      alert("An error occurred during registration. Please try again later.");
    }
  };

  return (
    <div style={{
      backgroundImage: "url('/images/signup.jpeg')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        padding: '30px',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        maxWidth: '400px',
        width: '100%',
        textAlign: 'center'
      }}>
        <h2>Create an Account</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <input
            type="text"
            name="username"
            placeholder="Full Name"
            value={user.username}
            onChange={handleInput}
            required
            style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={user.email}
            onChange={handleInput}
            required
            style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
          />
          <input
            type="text"
            name="phone"
            placeholder="Phone"
            value={user.phone}
            onChange={handleInput}
            required
            style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={user.password}
            onChange={handleInput}
            required
            style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
          />
          <button type="submit" style={{
            padding: '10px 15px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px'
          }}>Sign Up</button>
        </form>
        <div style={{ marginTop: '20px' }}>
          <p>Already have an account? <Link to="/login" style={{ color: '#007bff', textDecoration: 'none' }}>Login</Link></p>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;