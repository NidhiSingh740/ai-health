import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './DoctorChatbot.css'; // Updated styling for the new look

const DoctorChatbot = ({ user }) => {
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState([]); // Stores all messages for chat history
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const messagesEndRef = useRef(null); // Ref for auto-scrolling to the latest message

  // Scroll to the bottom of messages whenever messages update or loading changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Initial greeting message when component mounts or user data changes
  useEffect(() => {
    if (user?.name && messages.length === 0) {
      setMessages([{
        text: `Hi ${user.name}, how can I assist you with your health today?`,
        sender: 'bot-greeting' // Special sender type for unique styling
      }]);
    }
  }, [user, messages.length]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!question.trim()) {
      setError("Please enter your question.");
      return;
    }

    const userMessage = { text: question.trim(), sender: 'user' };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setQuestion(''); // Clear input field immediately

    setLoading(true);

    try {
      const payload = {
        question: question.trim(),
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
        'http://localhost:5000/api/doctor-chatbot',
        payload
      );
      const botResponse = res.data.answer.response;
      // We will render 'botResponse' within the message bubble
      setMessages((prevMessages) => [...prevMessages, { text: botResponse, sender: 'bot' }]);
    } catch (err) {
      let errorMessage = "Something went wrong. Please try again.";
      if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      }
      setMessages((prevMessages) => [...prevMessages, { text: errorMessage, sender: 'error' }]);
      setError(errorMessage); // Keep error state for potential display outside chat
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chatbot-wrapper">
      <div className="chatbot-container">
        <div className="chatbot-header">
          <span className="icon-doctor" role="img" aria-label="doctor">
            👨‍⚕️
          </span>
          <h2>AI Doctor Chatbot</h2>
        </div>

        <div className="chatbot-messages-area">
          {messages.map((msg, index) => (
            <div key={index} className={`message-bubble ${msg.sender}`}>
              {(msg.sender === 'bot' || msg.sender === 'user') && (
                <span className={`icon-${msg.sender}`}>
                  {msg.sender === 'bot' ? '👨‍⚕️' : '👤'}
                </span>
              )}
              {/* Conditional rendering for bot messages to apply specific answer styling */}
              {msg.sender === 'bot' ? (
                <div className="chatbot-answer-content">
                  {/* Parse and render the text content for better styling */}
                  <p className="greeting-after-question">
                    {user?.name ? `Hi ${user.name}, here's what the doctor says:` : "Here's what the doctor says:"}
                  </p>
                  <div className="response-text" dangerouslySetInnerHTML={{ __html: msg.text.replace(/\n/g, '<br/>') }} />
                  {/* We are using dangerouslySetInnerHTML to render br tags.
                      For more advanced formatting (headings, lists), you'd need a Markdown parser here. */}
                </div>
              ) : (
                <p>{msg.text}</p>
              )}
            </div>
          ))}
          {loading && (
            <div className="message-bubble bot loading">
              <span className="icon-bot">👨‍⚕️</span>
              <p>Thinking...</p>
              <div className="loading-spinner"></div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form className="chatbot-input-form" onSubmit={handleSubmit}>
          <textarea
            placeholder="Ask your health-related question here..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            rows="1"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />
          <button type="submit" disabled={loading}>
            {loading ? (
              <svg className="send-spinner" viewBox="0 0 50 50">
                <circle className="path" cx="25" cy="25" r="20" fill="none" strokeWidth="5"></circle>
              </svg>
            ) : (
              'Ask'
            )}
          </button>
        </form>

        {error && (
          <div className="general-error-message">
            <p>{error}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorChatbot;