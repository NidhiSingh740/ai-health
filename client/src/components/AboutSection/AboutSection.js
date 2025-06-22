import React from 'react';
import './AboutSection.css';

const AboutSection = () => {
  return (
    <div className="about-container">
      
      <section className="about-features">
        <h2>About Us</h2>
        <p>
          Our AI-Powered Smart Healthcare Assistant is designed to help users manage their health effectively using AI technology.
          It provides instant symptom analysis, personalized recovery suggestions, mental health support, medication reminders, and more—
          all in one seamless platform.
        </p>

        <h2>Key Features</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>AI Symptom Checker</h3>
            <p>Get quick insights into your symptoms with AI-generated health predictions.</p>
          </div>
          <div className="feature-card">
            <h3>Recovery Plans</h3>
            <p>Receive personalized plans and lifestyle suggestions to recover faster.</p>
          </div>
          <div className="feature-card">
            <h3>Virtual Doctor Chatbot</h3>
            <p>Ask health questions and get helpful responses instantly, anytime.</p>
          </div>
          
          <div className="feature-card">
            <h3>Diet & Nutrition Planner</h3>
            <p>Personalized diet plans based on your health conditions and fitness goals.</p>
          </div>
          <div className="feature-card">
            <h3>Mental Health Support</h3>
            <p>Access mindfulness tools, stress management resources, and emotional health support.</p>
          </div>
        </div>
      </section>

      {/* Section 2: How to Use */}
      <section className="how-it-works">
        <h2>How to Use</h2>
        <div className="steps">
          <div className="step">
            <span>1️⃣</span>
            <h4>Signup/Login</h4>
            <p>Create your account for secure access.</p>
          </div>
          <div className="step">
            <span>2️⃣</span>
            <h4>Complete Profile Setup</h4>
            <p>Fill in your health records, medical history, and preferences.</p>
          </div>
          <div className="step">
            <span>3️⃣</span>
            <h4>Use Health Tools</h4>
            <p>Start using features like AI symptom checker, Doctor chatbot, and Nutrition planners.</p>
          </div>
          <div className="step">
            <span>4️⃣</span>
            <h4>Track & Mental Health Support</h4>
            <p>Monitor health trends and get Mental Health Support Anytime.</p>
          </div>
        </div>
      </section>

    </div>
  );
};

export default AboutSection;
