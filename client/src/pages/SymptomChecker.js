import React, { useState } from 'react';
import axios from 'axios';
import './SymptomChecker.css'; // Your existing styling for Symptom Checker

const SymptomChecker = ({ user }) => {
    const [symptoms, setSymptoms] = useState('');
    const [result, setResult] = useState(null); // Stores the diagnosis object
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setResult(null); // Clear previous result

        if (!symptoms.trim()) {
            setError("Please describe your symptoms to check.");
            return;
        }

        setLoading(true);

        try {
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
                'https://ai-health-n4i4.onrender.com/api/symptom-checker/check',
                payload
            );
            // Assuming res.data.diagnosis is the structured object from the backend
            setResult(res.data.diagnosis); 
        } catch (err) {
            // Updated error handling based on backend changes
            let errorMessage = "Something went wrong with the symptom checker. Please try again.";
            if (err.response?.data?.error) {
                errorMessage = err.response.data.error;
            } else if (err.message && err.message.includes("Network Error")) {
                errorMessage = "Network error. Please check your internet connection.";
            } else if (err.message && err.message.includes("timeout")) {
                errorMessage = "Request timed out. Please try again.";
            }
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="symptom-checker-wrapper">
            <div className="symptom-checker-container">
                {/* Header Section */}
                <div className="symptom-checker-header">
                    <span className="icon-stethoscope" role="img" aria-label="stethoscope">
                        🩺
                    </span>
                    <h2>AI Symptom Checker</h2>
                </div>

                {/* Input Form Section */}
                <form className="symptom-checker-input-form" onSubmit={handleSubmit}>
                    <textarea
                        placeholder="Describe your symptoms (e.g., headache, fever, sore throat)..."
                        value={symptoms}
                        onChange={(e) => setSymptoms(e.target.value)}
                        rows="1" // Starts with one row, CSS handles auto-grow
                        onKeyDown={(e) => { // Allows pressing Enter to submit, Shift+Enter for new line
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSubmit(e);
                            }
                        }}
                    />
                    <button type="submit" disabled={loading || !symptoms.trim()}>
                        {loading ? (
                            // Your existing SVG spinner code
                            <svg className="send-spinner" viewBox="0 0 50 50">
                                <circle className="path" cx="25" cy="25" r="20" fill="none" strokeWidth="5"></circle>
                            </svg>
                        ) : (
                            'Check'
                        )}
                    </button>
                </form>

                {/* Error Display */}
                {error && (
                    <div className="symptom-checker-error-message">
                        <p>{error}</p>
                    </div>
                )}

                {/* Result Display */}
                {result && (
                    <div className="symptom-checker-result-box">
                        {user?.name && (
                            <p className="greeting">
                                Hi {user.name}, here’s what I found:
                            </p>
                        )}
                        <h4 className="result-heading">Diagnosis Report:</h4>
                        <div className="result-details">
                            <p><strong>Condition:</strong> {result.condition || 'N/A'}</p>
                            <p><strong>Severity:</strong> {result.severity || 'N/A'}</p>
                            <p><strong>Recommendation:</strong> {result.recommendation || 'N/A'}</p>
                            {/* NEW: Display Suggested Tests */}
                            <p>
                                <strong>Suggested Tests:</strong>{" "}
                                {result.suggestedTests && result.suggestedTests.length > 0
                                    ? result.suggestedTests.join(', ') // Join array items with comma
                                    : 'No specific tests suggested.'}
                            </p>
                            {result.notes && <p><strong>Notes:</strong> {result.notes}</p>}
                        </div>
                        {/* NEW: Display Disclaimer */}
                        <p className="disclaimer-text">
                            This information is for general knowledge and informational purposes only, and does not constitute medical advice or diagnosis. Always consult a qualified healthcare professional for accurate diagnosis, treatment, and any health concerns.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SymptomChecker;