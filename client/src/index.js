// src/index.js (or src/main.jsx)

import React from 'react';
import ReactDOM from 'react-dom/client'; // For React 18+
import { BrowserRouter as Router } from 'react-router-dom'; // Import Router here
import App from './App'; // Import your App component
import './index.css'; // Your global CSS, if any
import { AuthProvider } from './context/AuthContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router> {/* Wrap your App component with Router here */}
      <App />
    </Router>
  </React.StrictMode>
);