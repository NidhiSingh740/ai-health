
import React, { useState } from 'react';
import Spinner from '../components/Spinner';
import axios from 'axios';
import './MentalHealth.css';

function MentalHealth() {
  const [message, setMessage] = useState('');
  const [reply, setReply] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!message.trim()) return;
    setLoading(true);
    setReply('');

    try {
      const res = await axios.post(
        'http://localhost:5000/api/mental-health',
        { message }
      );
      setReply(res.data.reply);
    } catch (err) {
      setReply('Error processing request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mental-health-container">
      <h2>🧘 Mental Health Support</h2>
      <form className='mental-health' onSubmit={sendMessage}>
      <textarea
        value={message}
        onChange={e => setMessage(e.target.value)}
        placeholder="Describe how you’re feeling..."

      />
      <button
        onClick={sendMessage}
     
        disabled={loading}
      >
        {loading?(
        <>
        <span className='spinner'/> Thinking..
        
        </>
        ):(
          'Send'
        )}
      
      </button>
</form>
      {loading && <Spinner />}

      {reply && (
        <div className='mentalhealth-answer'>
          <h4>AI Response:</h4>
          <p>{reply}</p>
        </div>
      )}
    </div>
  );
}

export default MentalHealth;
