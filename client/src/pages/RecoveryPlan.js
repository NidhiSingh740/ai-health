import React, { useState } from 'react';
import axios from 'axios';
import './RecoveryPlan.css';

const RecoveryPlan = ({ user }) => {
  const [diagnosis, setDiagnosis] = useState('');
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setPlan(null);

    if (!diagnosis.trim()) {
      setError("Please enter a diagnosed condition.");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post('http://localhost:5000/api/recovery-plan/generate', {
        diagnosis: diagnosis.trim()
      });

      setPlan(res.data.recoveryPlan);
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
    <div className="recoveryplan-container">
      <h2>🩺 AI-Based Recovery Plan</h2>

      <form className="recovery-plan" onSubmit={handleSubmit}>
        <textarea
          placeholder="Enter your diagnosed condition..."
          value={diagnosis}
          onChange={(e) => setDiagnosis(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Generating...' : 'Generate Recovery Plan'}
        </button>
      </form>

      {error && (
        <div className="error-box">
          <h4>Error:</h4>
          <p>{error}</p>
        </div>
      )}

      {plan && (
        <div className="suggestion">
          {user?.name && (
            <p className="greeting">
              Hi {user.name}, here’s your personalized recovery plan:
            </p>
          )}
          <h3>📋 Suggested Recovery Plan</h3>
          <p><strong>💧 Hydration Tips:</strong> {plan.hydrationTips}</p>
          <p><strong>🛌 Rest Schedule:</strong> {plan.restSchedule}</p>
          <p><strong>🏠 Home Remedies:</strong> {plan.homeRemedies}</p>
          <p><strong>💊 Medicine Reminders:</strong> {plan.medicineReminders}</p>
          <p><strong>📈 Monitoring Advice:</strong> {plan.monitoringAdvice}</p>
        </div>
      )}
    </div>
  );
};

export default RecoveryPlan;
