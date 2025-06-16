import React, { useState } from 'react';
import axios from 'axios';

const SymptomChecker = () => {
  const [symptoms, setSymptoms] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!symptoms) return;

    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/symptom-checker/check', { symptoms });
      console.log("Response from server:", res.data);
      setResult(res.data.diagnosis);
    } catch (err) {
      setResult("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '30px', maxWidth: '600px', margin: 'auto' }}>
      <h2>🩺 AI Symptom Checker</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          rows="5"
          style={{ width: '100%', padding: '10px', fontSize: '16px' }}
          placeholder="Enter your symptoms..."
          value={symptoms}
          onChange={(e) => setSymptoms(e.target.value)}
        />
        <button
          type="submit"
          style={{ padding: '10px 20px', marginTop: '10px', fontSize: '16px' }}
        >
          {loading ? 'Checking...' : 'Check Symptoms'}
        </button>
      </form>

      {result && (
        <div style={{
          marginTop: '20px',
          padding: '15px',
          border: '1px solid #ccc',
          borderRadius: '5px',
          backgroundColor: '#f9f9f9'
        }}>
          <h4>Result:</h4>
          <p>{result}</p>
        </div>
      )}
    </div>
  );
};

export default SymptomChecker;
