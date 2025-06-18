import React, { useState } from 'react';
import axios from 'axios';
import './SymptomChecker.css';

const SymptomChecker = () => {
  const [symptoms, setSymptoms] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResult(null);
    if (!symptoms) {
      setError("Please enter your symptoms.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/symptom-checker/check', { symptoms });
      setResult(res.data.diagnosis);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
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
      <h2>🩺 AI Symptom Checker</h2>
      <form className="symptom-form" onSubmit={handleSubmit}>
        <textarea
          placeholder="Describe your symptoms here..."
          value={symptoms}
          onChange={(e) => setSymptoms(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Checking...' : 'Check Symptoms'}
        </button>
      </form>

      {error && (
        <div className="error-box">
          <h4>Error:</h4>
          <p>{error}</p>
        </div>
      )}

      {result && (
        <div className="result-box">
          <h4>Result:</h4>
          <p><strong>Condition:</strong> {result.condition}</p>
          <p><strong>Severity:</strong> {result.severity}</p>
          <p><strong>Recommendation:</strong> {result.recommendation}</p>
          {result.notes && <p><strong>Notes:</strong> {result.notes}</p>}
        </div>
      )}
    </div>
  );
};

export default SymptomChecker;
