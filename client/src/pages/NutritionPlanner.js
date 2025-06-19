import React, { useState } from "react";
import axios from "axios";
import Spinner from "../components/Spinner";
import "./NutritionPlanner.css"; // 👈 Import this CSS

function NutritionPlanner() {
  const [healthConditions, setHealthConditions] = useState("");
  const [preferences, setPreferences] = useState("");
  const [goal, setGoal] = useState("");
  const [feedback, setFeedback] = useState("");
  const [plan, setPlan] = useState("");
  const [loading, setLoading] = useState(false);

 const handleSubmit = async (e) => {
  e.preventDefault(); // ⬅️ Prevent default form behavior
  setLoading(true);
  try {
    const res = await axios.post("http://localhost:5000/api/nutrition", {
      healthConditions,
      preferences,
      goal,
      progressFeedback: feedback,
    });
    setPlan(res.data.plan);
  } catch (err) {
    console.error(err);
    setPlan("Error generating plan");
  }
  setLoading(false);
};


  return (
    <div className="nutrition-planner-container">
      <h2>🥗 AI Diet & Nutrition Planner</h2>
 <form className="nutrition-form" onSubmit={handleSubmit}>

      <textarea
        placeholder="Health conditions"
        value={healthConditions}
        onChange={(e) => setHealthConditions(e.target.value)}
        rows="2"
      />
      <textarea
        placeholder="Dietary preferences"
        value={preferences}
        onChange={(e) => setPreferences(e.target.value)}
        rows="2"
      />
      <textarea
        placeholder="Health goal (e.g. weight loss)"
        value={goal}
        onChange={(e) => setGoal(e.target.value)}
        rows="2"
      />
      <textarea
        placeholder="Feedback (optional)"
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
        rows="2"
      />

      <button type= "submit" disabled={loading}>
        {loading ? "Generating..." : "Generate Meal Plan"}
      </button>
</form>
      {loading ? (
        <Spinner />
      ) : (
        plan && (
          <div className="nutrition-result">
            <h3>Your Plan:</h3>
            <p>{plan}</p>
          </div>
        )
      )}
    </div>
  );
}

export default NutritionPlanner;
