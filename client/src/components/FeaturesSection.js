
import React from 'react';

const features = [
  "AI Symptom Checker",
  "Recovery Plans",
  "Medication Reminders",
  "Virtual Doctor Chat",
  "Mental Health Support",
  "Emergency Alerts"
];

const FeaturesSection = () => {
  return (
    <section className="features" id="features">
      <h2>Key Features</h2>
      <div className="feature-grid">
        {features.map((f, idx) => (
          <div key={idx} className="feature-card">{f}</div>
        ))}
      </div>
    </section>
  );
};

export default FeaturesSection;
