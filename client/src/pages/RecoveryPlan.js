import React, { useState } from 'react';
import axios from 'axios';


const RecoveryPlan = () => {
  const [diagnosis, setDiagnosis] = useState('');
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!diagnosis) return;
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:5000/api/recovery-plan/generate', { diagnosis });
      setPlan(res.data.recoveryPlan);
    } catch (error) {
      setPlan('Error fetching recovery plan.');
      console.error(error);
    }

    setLoading(false);
  };

  return (
    <div style={{ padding: '30px', maxWidth: '700px', margin: 'auto' }}>
      <h2>🩺 AI-Based Personalized Recovery Plan</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          rows="4"
          style={{ width: '100%', padding: '10px', marginBottom: '15px' }}
          placeholder="Enter your diagnosed condition..."
          value={diagnosis}
          onChange={(e) => setDiagnosis(e.target.value)}
        ></textarea>
        <button
          type="submit"
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          {loading ? 'Generating...' : 'Generate Recovery Plan'}
        </button>
      </form>

      {plan && (
        <div
          style={{
            marginTop: '30px',
            backgroundColor: '#f9f9f9',
            padding: '15px',
            borderRadius: '8px',
            boxShadow: '0 0 10px rgba(0,0,0,0.1)',
          }}
        >
          <h3>📋 Suggested Recovery Plan</h3>
          {typeof plan === 'object' ? (
            <>
              <p><strong>💧 Hydration Tips:</strong> {plan.hydrationTips}</p>
              <p><strong>🛌 Rest Schedule:</strong> {plan.restSchedule}</p>
              <p><strong>🏠 Home Remedies:</strong> {plan.homeRemedies}</p>
              <p><strong>💊 Medicine Reminders:</strong> {plan.medicineReminders}</p>
              <p><strong>📈 Monitoring Advice:</strong> {plan.monitoringAdvice}</p>
            </>
          ) : (
            <p style={{ color: 'red' }}>{plan}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default RecoveryPlan;
