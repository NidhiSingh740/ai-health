import React, { useState } from "react";
// Assuming Spinner is a shared component like the one used in NutritionPlanner
// If you don't have this Spinner component, you'll need to create it or remove the import/usage.
// For example, if Spinner.js looks like:
// export const Spinner = () => (
//   <svg className="send-spinner" viewBox="0 0 50 50">
//     <circle className="path" cx="25" cy="25" r="20" fill="none" strokeWidth="5"></circle>
//   </svg>
// );
// Then import it like: import { Spinner } from "../components/Spinner";
// If you're using a single component file called Spinner.js like `import Spinner from "../components/Spinner";`
// and it exports default, then that's fine.
import Spinner from "../components/Spinner"; // Assuming this is your loading spinner component
import axios from "axios";
import "./MentalHealth.css"; // Dedicated styling for Mental Health Support

function MentalHealth({ user }) {
  const [message, setMessage] = useState("");
  const [mood, setMood] = useState("");
  const [triggers, setTriggers] = useState("");
  const [history, setHistory] = useState("");
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setReply("");

    if (!message.trim()) {
      setError("Please describe how you're feeling to get support.");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        message: message.trim(),
        userMood: mood.trim(),
        stressTriggers: triggers.trim(),
        mentalHealthHistory: history.trim(),
        user: {
          name: user?.name,
          age: user?.age,
          gender: user?.gender,
        },
      };

      const res = await axios.post("http://localhost:5000/api/mental-health", payload);
      setReply(res.data.reply);
    } catch (err) {
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError("Something went wrong getting support. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mental-health-wrapper">
      <div className="mental-health-container">
        {/* Header Section */}
        <div className="mental-health-header">
          <span className="icon-lotus" role="img" aria-label="lotus flower">
            🌸
          </span>
          <h2>AI Mental Health Support</h2>
        </div>

        {/* Input Form Section */}
        <form className="mental-health-input-form" onSubmit={handleSubmit}>
          <textarea
            placeholder="Describe how you’re feeling right now..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows="2" // Changed to 1 for compact initial look
          />
          <textarea
            placeholder="Current mood (e.g., anxious, sad, overwhelmed, hopeful...)"
            value={mood}
            onChange={(e) => setMood(e.target.value)}
            rows="2" // Changed to 1
          />
          <textarea
            placeholder="Any known stress triggers or recent events?"
            value={triggers}
            onChange={(e) => setTriggers(e.target.value)}
            rows="2" // Changed to 1
          />
          <textarea
            placeholder="Any relevant mental health history to share?"
            value={history}
            onChange={(e) => setHistory(e.target.value)}
            rows="2" // Changed to 1
          />
          <button type="submit" disabled={loading}>
            {loading ? (
              <Spinner /> // Using the shared Spinner component
            ) : (
              'Get Support'
            )}
          </button>
        </form>

        {/* Error Display */}
        {error && (
          <div className="mental-health-error-message">
            <p>{error}</p>
          </div>
        )}

        {/* Reply Display */}
        {reply && (
          <div className="mental-health-result-box">
            {user?.name && (
              <p className="greeting">
                Hi {user.name}, here's some personalized support:
              </p>
            )}
            <h3 className="response-heading">✨ AI Guidance for Well-being</h3>
            <div className="response-content">
              {/* Using <p> tag with inline style for pre-wrap, similar to NutritionPlanner */}
              <p style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>{reply}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MentalHealth;