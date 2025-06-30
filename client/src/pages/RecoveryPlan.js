import React, { useState } from 'react';
import axios from 'axios';
import './RecoveryPlan.css'; // New styling for Recovery Plan

const RecoveryPlan = ({ user }) => {
  const [diagnosis, setDiagnosis] = useState('');
  const [plan, setPlan] = useState(null); // Stores the recovery plan object
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setPlan(null); // Clear previous plan

    if (!diagnosis.trim()) {
      setError("Please enter a diagnosed condition to generate a plan.");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post('https://ai-health-n4i4.onrender.com/api/recovery-plan/generate', {
        diagnosis: diagnosis.trim(),
        user: { // Pass user details as context, if your backend uses them for personalization
          name: user?.name,
          age: user?.age,
          gender: user?.gender,
          diseases: user?.diseases,
          medications: user?.medications
          // Add other relevant user details if your API needs them
        }
      });

      setPlan(res.data.recoveryPlan); // Assuming res.data.recoveryPlan is the structured object
    } catch (err) {
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError("Something went wrong with generating the plan. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="recovery-plan-wrapper">
      <div className="recovery-plan-container">
        {/* Header Section */}
        <div className="recovery-plan-header">
          <span className="icon-heartbeat" role="img" aria-label="heartbeat">
            ❤️‍🩹
          </span>
          <h2>AI Recovery Plan</h2>
        </div>

        {/* Input Form Section */}
        <form className="recovery-plan-input-form" onSubmit={handleSubmit}>
          <textarea
            placeholder="Enter the diagnosed condition (e.g., 'Common Cold', 'Mild Flu', 'Ankle Sprain')..."
            value={diagnosis}
            onChange={(e) => setDiagnosis(e.target.value)}
            rows="1" // Starts with one row, CSS handles auto-grow
            onKeyDown={(e) => { // Allows pressing Enter to submit, Shift+Enter for new line
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
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
          <div className="recovery-plan-error-message">
            <p>{error}</p>
          </div>
        )}

        {/* Plan Display */}
        {plan && (
          <div className="recovery-plan-result-box">
            {user?.name && (
              <p className="greeting">
                Hi {user.name}, here’s your personalized recovery plan:
              </p>
            )}
            <h3 className="plan-heading">📋 Your Recovery Plan</h3>
            <div className="plan-details">
              <p><strong>💧 Hydration Tips:</strong> {plan.hydrationTips || 'N/A'}</p>
              <p><strong>🛌 Rest Schedule:</strong> {plan.restSchedule || 'N/A'}</p>
              <p><strong>🏠 Home Remedies:</strong> {plan.homeRemedies || 'N/A'}</p>
              {/* If you plan to use medicineReminders, uncomment this line and ensure it's in your API response */}
              {/* {plan.medicineReminders && <p><strong>💊 Medicine Reminders:</strong> {plan.medicineReminders}</p>} */}
              <p><strong>📈 Monitoring Advice:</strong> {plan.monitoringAdvice || 'N/A'}</p>
              {plan.notes && <p><strong>📝 Notes:</strong> {plan.notes}</p>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecoveryPlan;