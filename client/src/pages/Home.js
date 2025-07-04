import React from 'react';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import AboutSection from '../components/AboutSection/AboutSection';
import Footer from '../components/Footer';
import './Home.css'; 

const LandingPage = () => {
  return (
    <div>
     
      <HeroSection />
      <AboutSection />
      {/* <Footer /> */}
      
      {/* Uncomment the following line if you want to include the Navbar */}
      {/* <Navbar /> */}
    </div>
  );
};

export default LandingPage;
