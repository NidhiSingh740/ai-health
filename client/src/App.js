// src/App.js (Modified) - Remove BrowserRouter from here

import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom'; // No need for BrowserRouter here
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import Footer from './components/Footer';
import ProfileSetup from './pages/ProfileSetup';
import Navbar from './components/Navbar';

function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate(); // This will now work correctly

  const fetchUserProfile = async (token) => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/profile", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.userData);
      } else {
        localStorage.removeItem("token");
        setUser(null);
        // alert("Session expired or invalid. Please log in again.");
        navigate("/login");
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      localStorage.removeItem("token");
      setUser(null);
      // alert("Failed to connect to the server. Please try again.");
      navigate("/login");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchUserProfile(token);
    } else {
      setIsLoading(false);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', fontSize: '24px' }}>
        Loading user session...
      </div>
    );
  }

  return (
    <> {/* Use a React Fragment or a div here */}
      <Navbar user={user} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage setUser={setUser} />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/profile-setup" element={<ProfileSetup />} />
      </Routes>
      {<Footer />}
    </>
  );
}

export default App;