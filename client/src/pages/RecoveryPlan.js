import React, { useState } from 'react';
import axios from 'axios';
import './RecoveryPlan.css';


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
    <div className='recoveryplan-container'>
      <h2>🩺 AI-Based Recovery Plan</h2>
      <form className ='recovery-plan' onSubmit={handleSubmit}>
        <textarea
      
         
          placeholder="Enter your diagnosed condition..."
          value={diagnosis}
          onChange={(e) => setDiagnosis(e.target.value)}
        ></textarea>
        <button
          type="submit"
          
        >
          {loading ? 'Generating...' : 'Generate Recovery Plan'}
        </button>
      </form>

      {plan && (
        <div className='suggestion'
          
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
