
import React, { useState } from 'react';
import axios from 'axios';

const RecoveryPlan = () => {
  const [diagnosis, setDiagnosis] = useState('');
  const [plan, setPlan] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!diagnosis) return;
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:5000/api/recovery-plan', { diagnosis });
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
          style={{ padding: '10px 20px', backgroundColor: '#007bff', color: '#fff', border: 'none' }}
        >
          {loading ? 'Generating...' : 'Generate Recovery Plan'}
        </button>
      </form>
      {plan && (
        <div style={{ marginTop: '30px', whiteSpace: 'pre-line', backgroundColor: '#f9f9f9', padding: '15px', borderRadius: '8px' }}>
          <strong>Suggested Recovery Plan:</strong>
          <p>{plan}</p>
        </div>
      )}
    </div>
  );
};

export default RecoveryPlan;
