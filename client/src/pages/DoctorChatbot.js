import React, { useState } from 'react';
import './DoctorChatbot.css';

const DoctorChatbot = () => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);

  const askChatbot = async () => {
    if (!question.trim()) return;
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/doctor-chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question }),
      });

      const data = await response.json();
      setAnswer(data.answer);
    } catch (err) {
      setAnswer("Error connecting to AI.");
    }
    setLoading(false);
  };

  return (
    <div className="chatbot-container">
      <h2>🤖 AI Doctor Chatbot</h2>
      <textarea
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Enter your health-related question here..."
      />
      <button onClick={askChatbot} disabled={loading}>
        {loading ? 'Asking AI...' : 'Ask Doctor'}
      </button>
      {answer && (
        <div className="chatbot-answer">
          <h4>AI Response:</h4>
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
};

export default DoctorChatbot;
