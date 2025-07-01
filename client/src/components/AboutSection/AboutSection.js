import React from 'react';
import './AboutSection.css'; // Make sure this path is correct

const AboutSection = () => {
  return (
    <div className="about-container">

      <div className="about-features">
    

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
            <h3>Medication Reminder</h3>
            <p>Helps users manage their medications by saving schedules and sending automated SMS reminders to ensure timely intake.</p>
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
      </div>
      <div className="about-features">
        <h2>About Us</h2>
        <p>
          Our AI-Powered Smart Healthcare Assistant is designed to help users manage their health effectively using AI technology.
          It provides instant symptom analysis, personalized recovery suggestions, mental health support, medication reminders, and more—
          all in one seamless platform.
        </p>

      </div>

      <div className="how-it-works">
        <h2>How to Use</h2>
        <div className="steps">
          <div className="step">
            <div className="step-number-circle">1</div>
            <h4>Signup/Login</h4>
            <p>Create your account for secure access to personalized health tools.</p>
          </div>
          <div className="step">
            <div className="step-number-circle">2</div>
            <h4>Complete Profile Setup</h4>
            <p>Fill in your health records, medical history, and preferences for tailored support.</p>
          </div>
          <div className="step">
            <div className="step-number-circle">3</div>
            <h4>Use Health Tools</h4>
            <p>Explore features like the AI symptom checker, Doctor chatbot, Nutrition Planner, and Medication Reminder.</p>
          </div>
          <div className="step">
            <div className="step-number-circle">4</div>
            <h4>Track & Mental Health Support</h4>
            <p>Monitor your health trends and receive Mental Health Support anytime you need it.</p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default AboutSection;
