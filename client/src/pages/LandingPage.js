import React from 'react';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import FeaturesSection from '../components/FeaturesSection';
import Footer from '../components/Footer';
import './LandingPage.css'; 

const LandingPage = () => {
  return (
    <div>
     
      <HeroSection />
      <FeaturesSection />

    </div>
  );
};

export default LandingPage;
