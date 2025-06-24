import React, { useState } from 'react';
import axios from 'axios';
import './SymptomChecker.css';

const SymptomChecker = ({ user }) => {
  const [symptoms, setSymptoms] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResult(null);

    if (!symptoms.trim()) {
      setError("Please enter your symptoms.");
      return;
    }

    setLoading(true);

    try {
      // Build payload with both symptoms and user profile
      const payload = {
        symptoms: symptoms.trim(),
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

      const res = await axios.post(
        'http://localhost:5000/api/symptom-checker/check',
        payload
      );
      setResult(res.data.diagnosis);
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
          {/* Personalized greeting */}
          {user?.name && (
            <p className="greeting">
              Hi {user.name}, here’s what I found:
            </p>
          )}
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
