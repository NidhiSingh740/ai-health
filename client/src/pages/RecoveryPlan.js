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
      setError("Please enter your diagnosed condition.");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        diagnosis: diagnosis.trim(),
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

      const res = await axios.post('http://localhost:5000/api/recovery-plan/generate', payload);
      setPlan(res.data.recoveryPlan);
    } catch (error) {
      console.error(error);
      setError("Something went wrong. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div className='recoveryplan-container'>
      <h2>🩺 AI-Based Recovery Plan</h2>
      <form className='recovery-plan' onSubmit={handleSubmit}>
        <textarea
          placeholder="Enter your diagnosed condition..."
          value={diagnosis}
          onChange={(e) => setDiagnosis(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Generating...' : 'Generate Recovery Plan'}
        </button>
      </form>

      {error && <div className="error-box"><p>{error}</p></div>}

      {plan && (
        <div className='suggestion'>
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
