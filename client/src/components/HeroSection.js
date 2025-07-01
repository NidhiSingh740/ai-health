import React from 'react';
import '../pages/Home.css';

const HeroSection = () => {
  return (
    <section className="hero-section">
      <div className="hero-content">
        <div className="hero-text">
          <h1>Your AI Health Companion</h1>
          <p>
            Track symptoms, get personalized recovery plans, receive medication reminders,
            chat with an AI doctor, nutrition planner, manage mental health –
            all in one intelligent healthcare platform.
          </p>
          <a href="/signup" className="cta-button">Get Started</a>
        </div>
        <div className="hero-image">
          <img src="i.png" alt="AI Healthcare Assistant" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
