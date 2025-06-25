import React, { useState } from "react";
import axios from "axios";
import "./SymptomChecker.css"; // Reusing existing styles

const NutritionPlanner = ({ user }) => {
  const [healthConditions, setHealthConditions] = useState("");
  const [preferences, setPreferences] = useState("");
  const [goal, setGoal] = useState("");
  const [feedback, setFeedback] = useState("");
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setPlan(null);

    if (!goal.trim()) {
      setError("Please enter your health goal.");
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
      setPlan(res.data.plan);
    } catch (err) {
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="symptom-checker-container">
      <h2>🥗 AI Diet & Nutrition Planner</h2>
      <form className="symptom-form" onSubmit={handleSubmit}>
        <textarea
          placeholder="Health conditions (e.g. diabetes, thyroid...)"
          value={healthConditions}
          onChange={(e) => setHealthConditions(e.target.value)}
          rows="2"
        />
        <textarea
          placeholder="Dietary preferences (e.g. vegetarian, keto...)"
          value={preferences}
          onChange={(e) => setPreferences(e.target.value)}
          rows="2"
        />
        <textarea
          placeholder="Health goal (e.g. weight loss, muscle gain...)"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          rows="2"
        />
        <textarea
          placeholder="Feedback or progress (optional)"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          rows="2"
        />

        <button type="submit" disabled={loading}>
          {loading ? "Generating..." : "Generate Meal Plan"}
        </button>
      </form>

      {error && (
        <div className="error-box">
          <h4>Error:</h4>
          <p>{error}</p>
        </div>
      )}

      {plan && (
        <div className="result-box">
          {user?.name && (
            <p className="greeting">
              Hi {user.name}, here’s your personalized meal plan:
            </p>
          )}
          <h4>Your Plan:</h4>
          <pre style={{ whiteSpace: 'pre-wrap', lineHeight: '1.5' }}>{plan}</pre>
        </div>
      )}
    </div>
  );
};

export default NutritionPlanner;
