import React from 'react';
import { NavLink } from 'react-router-dom';
import './MainNavbar.css'; // Create and import the CSS file

const MainNavbar = () => {
  return (
    <nav className="main-navbar">
      <NavLink to="/" end className="nav-link">
        Home
      </NavLink>
      <NavLink to="/profile-setup" className="nav-link">
        Profile Setup
      </NavLink>
      <NavLink to="/symptom-checker" className="nav-link">
        Symptom Checker
      </NavLink>
      <NavLink to="/recovery-plan" className="nav-link">
        Recovery Plan
      </NavLink>
      <NavLink to="/doctor-chatbot" className="nav-link">
        Doctor Chatbot
      </NavLink>
      <NavLink to="/nutrition-planner" className="nav-link">
        Nutrition Planner
      </NavLink>
      <NavLink to="/mental-health" className="nav-link">Mental Health Support</NavLink>

    </nav>
  );
};

export default MainNavbar;
