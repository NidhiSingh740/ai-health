import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './MainNavbar.css'; // Your existing CSS file

const MainNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="main-navbar">
      {/* Removed: <div className="navbar-brand">Your App Logo/Name</div> */}

      {/* Hamburger icon for mobile */}
      <button className="hamburger-menu" onClick={toggleMenu} aria-label="Toggle navigation">
        <div className={`bar ${isMenuOpen ? 'open' : ''}`}></div>
        <div className={`bar ${isMenuOpen ? 'open' : ''}`}></div>
        <div className={`bar ${isMenuOpen ? 'open' : ''}`}></div>
      </button>

      {/* Navigation links container */}
      <div className={`nav-links-container ${isMenuOpen ? 'open' : ''}`}>
        <NavLink to="/" end className="nav-link" onClick={() => setIsMenuOpen(false)}>
          Home
        </NavLink>
        <NavLink to="/profile-setup" className="nav-link" onClick={() => setIsMenuOpen(false)}>
          Profile Setup
        </NavLink>
        <NavLink to="/symptom-checker" className="nav-link" onClick={() => setIsMenuOpen(false)}>
          Symptom Checker
        </NavLink>
        <NavLink to="/recovery-plan" className="nav-link" onClick={() => setIsMenuOpen(false)}>
          Recovery Plan
        </NavLink>
        <NavLink to="/medication-reminder" className="nav-link" onClick={() => setIsMenuOpen(false)}>
          Medication Reminder
        </NavLink>
        <NavLink to="/doctor-chatbot" className="nav-link" onClick={() => setIsMenuOpen(false)}>
          Doctor Chatbot
        </NavLink>
        <NavLink to="/nutrition-planner" className="nav-link" onClick={() => setIsMenuOpen(false)}>
          Nutrition Planner
        </NavLink>
        <NavLink to="/mental-health" className="nav-link" onClick={() => setIsMenuOpen(false)}>
          Mental Health Support
        </NavLink>
      </div>

      {/* User info from your screenshot */}
      {/* <div className="navbar-user-info">
        <span>Nikki</span>
        <button className="logout-button">Logout</button>
      </div> */}
    </nav>
  );
};

export default MainNavbar;