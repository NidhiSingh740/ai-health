import React, { useState } from "react";
import Spinner from "../components/Spinner";
import axios from "axios";
import "./SymptomChecker.css"; // Reusing same styles for consistency

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
      setError("Please describe how you're feeling.");
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
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="symptom-checker-container">
      <h2>🧘 AI Mental Health Support</h2>
      <form className="symptom-form" onSubmit={handleSubmit}>
        <textarea
          placeholder="Describe how you’re feeling..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows="2"
        />
        <textarea
          placeholder="Current mood (e.g. anxious, sad, overwhelmed...)"
          value={mood}
          onChange={(e) => setMood(e.target.value)}
          rows="2"
        />
        <textarea
          placeholder="Any known stress triggers?"
          value={triggers}
          onChange={(e) => setTriggers(e.target.value)}
          rows="2"
        />
        <textarea
          placeholder="Any mental health history to share?"
          value={history}
          onChange={(e) => setHistory(e.target.value)}
          rows="2"
        />
        <button type="submit" disabled={loading}>
          {loading ? "Analyzing..." : "Get Support"}
        </button>
      </form>

      {error && (
        <div className="error-box">
          <h4>Error:</h4>
          <p>{error}</p>
        </div>
      )}

      {loading && <Spinner />}

      {reply && (
        <div className="result-box">
          {user?.name && (
            <p className="greeting">
              Hi {user.name}, here's what I suggest for your mental well-being:
            </p>
          )}
          <h4>AI Response:</h4>
          <pre style={{ whiteSpace: 'pre-wrap', lineHeight: '1.5' }}>{reply}</pre>
        </div>
      )}
    </div>
  );
}

export default MentalHealth;
