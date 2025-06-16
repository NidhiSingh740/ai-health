import React, { useState } from 'react';
import axios from 'axios';
import './SymptomChecker.css';

const SymptomChecker = () => {
  const [symptoms, setSymptoms] = useState('');
  const [result, setResult] = useState(null); // Initialize as null to expect an object
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(''); // New state for error messages

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors
    setResult(null); // Clear previous results
    if (!symptoms) {
      setError("Please enter your symptoms.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/symptom-checker/check', { symptoms });
      console.log("Response from server:", res.data);
      setResult(res.data.diagnosis); // res.data.diagnosis will now be an object
    } catch (err) {
      console.error("Frontend error:", err);
      // Check if the error response has a specific message from the backend
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
          disabled={loading} // Disable button while loading
        >
          {loading ? 'Checking...' : 'Check Symptoms'}
        </button>
      </form>

      {error && ( // Display error messages
        <div style={{
          marginTop: '20px',
          padding: '15px',
          border: '1px solid #ff4d4d',
          borderRadius: '5px',
          backgroundColor: '#ffe6e6',
          color: '#cc0000'
        }}>
          <h4>Error:</h4>
          <p>{error}</p>
        </div>
      )}

      {result && ( // Only render if result is not null
        <div style={{
          marginTop: '20px',
          padding: '15px',
          border: '1px solid #ccc',
          borderRadius: '5px',
          backgroundColor: '#f9f9f9'
        }}>
          <h4>Result:</h4>
          <p><strong>Condition:</strong> {result.condition}</p>
          <p><strong>Severity:</strong> {result.severity}</p>
          <p><strong>Recommendation:</strong> {result.recommendation}</p>
          {result.notes && <p><strong>Notes:</strong> {result.notes}</p>} {/* Display notes if available */}
        </div>
      )}
    </div>
  );
};

export default SymptomChecker;