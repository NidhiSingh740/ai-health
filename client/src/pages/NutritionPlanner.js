import React, { useState } from "react";
import axios from "axios";
import "./NutritionPlanner.css"; // Dedicated styling for Nutrition Planner

const NutritionPlanner = ({ user }) => {
  const [healthConditions, setHealthConditions] = useState("");
  const [preferences, setPreferences] = useState("");
  const [goal, setGoal] = useState("");
  const [feedback, setFeedback] = useState("");
  const [plan, setPlan] = useState(null); // Assuming plan is a string response
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setPlan(null); // Clear previous plan

    if (!goal.trim()) {
      setError("Please enter your primary health goal to generate a plan.");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        goal: goal.trim(),
        preferences: preferences.trim(),
        healthConditions: healthConditions.trim(),
        progressFeedback: feedback.trim(),
        user: {
          name: user?.name,
          age: user?.age,
          gender: user?.gender,
          weight: user?.weight,
          height: user?.height,
          diseases: user?.diseases,
          allergies: user?.allergies,
          treatments: user?.treatments,
          medications: user?.medications
        }
      };

      const res = await axios.post("http://localhost:5000/api/nutrition", payload);
      setPlan(res.data.plan); // Assuming res.data.plan is the string meal plan
    } catch (err) {
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError("Something went wrong generating the nutrition plan. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="nutrition-planner-wrapper">
      <div className="nutrition-planner-container">
        {/* Header Section */}
        <div className="nutrition-planner-header">
          <span className="icon-salad" role="img" aria-label="salad bowl">
            🥗
          </span>
          <h2>AI Diet & Nutrition Planner</h2>
        </div>

        {/* Input Form Section */}
        <form className="nutrition-planner-input-form" onSubmit={handleSubmit}>
          <textarea
            placeholder="Your health conditions (e.g., diabetes, hypertension, allergies...)"
            value={healthConditions}
            onChange={(e) => setHealthConditions(e.target.value)}
            rows="2"
          />
          <textarea
            placeholder="Your dietary preferences (e.g., vegetarian, keto, gluten-free, no dairy...)"
            value={preferences}
            onChange={(e) => setPreferences(e.target.value)}
            rows="2"
          />
          <textarea
            placeholder="Your health goal (e.g., weight loss, muscle gain, energy boost, better digestion...)"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            rows="2"
          />
          <textarea
            placeholder="Optional: Any feedback or progress since your last plan?"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            rows="2"
          />

          <button type="submit" disabled={loading}>
            {loading ? (
              <svg className="send-spinner" viewBox="0 0 50 50">
                <circle className="path" cx="25" cy="25" r="20" fill="none" strokeWidth="5"></circle>
              </svg>
            ) : (
              'Generate Plan'
            )}
          </button>
        </form>

        {/* Error Display */}
        {error && (
          <div className="nutrition-planner-error-message">
            <p>{error}</p>
          </div>
        )}

        {/* Plan Display */}
        {plan && (
          <div className="nutrition-planner-result-box">
            {user?.name && (
              <p className="greeting">
                Hi {user.name}, here’s your personalized nutrition plan:
              </p>
            )}
            <h3 className="plan-heading">📋 Your Custom Meal Plan</h3>
            <div className="plan-content">
               {/* Assuming 'plan' is a string that might contain newlines/formatting */}
              <p style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>{plan}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NutritionPlanner;