import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import MainNavbar from './components/MainNavbar';
import { useAuth } from './context/AuthContext';
import Footer from './components/Footer';
import Home from './pages/Home';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ProfileSetup from './pages/ProfileSetup';
import SymptomChecker from './pages/SymptomChecker';
import RecoveryPlan from './pages/RecoveryPlan';
import DoctorChatbot from './pages/DoctorChatbot';
import NutritionPlanner from './pages/NutritionPlanner';
import MentalHealth from './pages/MentalHealth';
import MedicationReminder from './pages/MedicationReminder';

import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const fetchUserProfile = async (token) => {
    try {
      const response = await fetch("https://ai-health-n4i4.onrender.com/api/auth/profile", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log("User profile fetched successfully:", data);
        setUser(data.userData);
      } else {
        localStorage.removeItem("token");
        setUser(null);
        navigate("/login");
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      localStorage.removeItem("token");
      setUser(null);
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
    navigate("/");
  };

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', fontSize: '24px' }}>
        Loading user session...
      </div>
    );
  }

  return (
     <div className="app-wrapper">
      <Navbar user={user} onLogout={handleLogout} />
      {user && (<MainNavbar />)}

      <div className="app-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage setUser={setUser} />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/profile-setup" element={<ProfileSetup />} />
          <Route path="/symptom-checker" element={<SymptomChecker user={user} />} />
          <Route path="/doctor-chatbot" element={<DoctorChatbot user = {user} />} />
          <Route path="/recovery-plan" element={<RecoveryPlan user = {user} />} />
          <Route path="/medication-reminder" element={<MedicationReminder user = {user} />} />

          <Route path="/nutrition-planner" element={<NutritionPlanner user = {user} />} />
          <Route path="/mental-health" element={<MentalHealth user = {user} />} />
        </Routes>
      </div>

      <Footer />
    </div>
  );
}

export default App;
