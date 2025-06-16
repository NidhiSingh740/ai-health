// src/Router.js

import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Page Imports
import Home from './components/Home';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';

// (Add other pages when ready)
// import Dashboard from './components/Dashboard';
// import SymptomChecker from './components/SymptomChecker'; // etc.

const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/dashboard" element={<DashBoard />} />

      {/* Placeholder for other features to add next */}
      {/* <Route path="/symptom-checker" element={<SymptomChecker />} /> */}
      {/* <Route path="/recovery-plan" element={<RecoveryPlan />} /> */}
    </Routes>
  );
};

export default Router;
