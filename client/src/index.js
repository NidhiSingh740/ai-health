// src/index.js (or src/main.jsx)

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import './index.css';
import { AuthProvider } from './context/AuthContext';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <AuthProvider> {/* ✅ AuthProvider must wrap App to provide context */}
      <Router>     {/* ✅ Router wraps App for routing */}
        <App />
      </Router>
    </AuthProvider>
  </React.StrictMode>
);
