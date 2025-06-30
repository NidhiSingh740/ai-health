import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Spinner from "../components/Spinner"; // Assuming you have a Spinner component
import "./DoctorChatbot.css"; // Your existing CSS for the chatbot

function DoctorChatbot({ user }) {
  const [messages, setMessages] = useState([]); // Stores both user and AI messages
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedFile, setSelectedFile] = useState(null); // New state for selected file
  const [filePreview, setFilePreview] = useState(null); // New state for file preview

  const messagesEndRef = useRef(null); // For auto-scrolling

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initial greeting when component mounts
  useEffect(() => {
    setMessages([
      {
        type: "ai",
        text: `Hi ${user?.name || 'there'}, how can I assist you with your health today?`,
      },
    ]);
  }, [user?.name]);

  const handleTextSubmit = async (e) => {
    e.preventDefault();
    if (!currentQuestion.trim()) {
      setError("Please type your question.");
      return;
    }

    const newMessage = { type: "user", text: currentQuestion.trim() };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setCurrentQuestion("");
    setError("");
    setLoading(true);

    try {
      const payload = {
        question: currentQuestion.trim(),
        user: {
          name: user?.name,
          age: user?.age,
          gender: user?.gender,
          diseases: user?.diseases,
          allergies: user?.allergies,
          treatments: user?.treatments,
          medications: user?.medications,
        },
      };

      const res = await axios.post("https://ai-health-n4i4.onrender.com/api/doctor-chatbot", payload);
      setMessages((prevMessages) => [
        ...prevMessages,
        { type: "ai", text: res.data.reply },
      ]);
    } catch (err) {
      console.error("Error communicating with AI:", err.response?.data || err.message);
      setError("Failed to get a response from the AI. Please try again.");
      setMessages((prevMessages) => [
        ...prevMessages,
        { type: "ai", text: "I'm sorry, I couldn't process your request right now. Please try again later." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // --- New Function for File Handling ---
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setFilePreview(URL.createObjectURL(file)); // Create a URL for preview
      setError(""); // Clear previous errors
    } else {
      setSelectedFile(null);
      setFilePreview(null);
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile) {
      setError("Please select a medical report image to upload.");
      return;
    }

    // Add user message indicating file upload
    setMessages((prevMessages) => [
      ...prevMessages,
      { type: "user", text: `Uploading report: "${selectedFile.name}"...`, isFile: true, fileUrl: filePreview },
    ]);

    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("medicalReport", selectedFile); // 'medicalReport' must match backend field name
    formData.append("user", JSON.stringify({ // Send user data for context
      name: user?.name,
      age: user?.age,
      gender: user?.gender,
      diseases: user?.diseases,
      allergies: user?.allergies,
      treatments: user?.treatments,
      medications: user?.medications,
    }));

    try {
      const res = await axios.post("https://ai-health-n4i4.onrender.com/api/doctor-chatbot/analyze-report", formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Important for file uploads
        },
      });

      // Add AI response
      setMessages((prevMessages) => [
        ...prevMessages,
        { type: "ai", text: res.data.explanation },
      ]);

      // Clear file selection after successful upload
      setSelectedFile(null);
      setFilePreview(null);

    } catch (err) {
      console.error("Error uploading or analyzing report:", err.response?.data || err.message);
      setError("Failed to analyze the report. Please ensure the image is clear or try again.");
      setMessages((prevMessages) => [
        ...prevMessages,
        { type: "ai", text: "I'm sorry, I couldn't analyze the report. Please make sure the image is clear and try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="doctor-chatbot-wrapper">
      <div className="doctor-chatbot-container">
        {/* Header */}
        <div className="doctor-chatbot-header">
          <span className="icon-doctor" role="img" aria-label="doctor">
            👨‍⚕️
          </span>
          <h2>AI Doctor Chatbot</h2>
        </div>

        {/* Chat Messages Area */}
        <div className="chat-messages">
          {messages.map((msg, index) => (
            <div key={index} className={`message-bubble ${msg.type}`}>
              {msg.text}
              {msg.isFile && msg.fileUrl && (
                <img src={msg.fileUrl} alt="Uploaded Report" className="uploaded-file-preview" />
              )}
            </div>
          ))}
          {loading && (
            <div className="message-bubble ai loading">
              <Spinner />
            </div>
          )}
          <div ref={messagesEndRef} /> {/* Scroll target */}
        </div>

        {/* Input Area */}
        <div className="chat-input-area">
          {filePreview && (
            <div className="file-preview-container">
              <img src={filePreview} alt="Selected Report Preview" className="selected-file-thumbnail" />
              <button className="clear-file-button" onClick={() => { setSelectedFile(null); setFilePreview(null); setError(''); }}>
                &times;
              </button>
            </div>
          )}

          <div className="input-row">
            <label htmlFor="file-upload" className="file-upload-button" title="Upload Medical Report">
              📄
            </label>
            <input
              type="file"
              id="file-upload"
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: 'none' }} // Hide actual input
            />
            <textarea
              placeholder={selectedFile ? "Click 'Analyze Report' or type a question..." : "Ask your health-related question here..."}
              value={currentQuestion}
              onChange={(e) => setCurrentQuestion(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey && !selectedFile) {
                  e.preventDefault();
                  handleTextSubmit(e);
                }
              }}
              rows="1" // Maintain compact rows
              className="chat-textarea"
              disabled={loading}
            />
            {selectedFile ? (
              <button onClick={handleFileUpload} disabled={loading} className="send-button file-button">
                {loading ? <Spinner /> : 'Analyze Report'}
              </button>
            ) : (
              <button onClick={handleTextSubmit} disabled={loading || !currentQuestion.trim()} className="send-button">
                {loading ? <Spinner /> : 'Ask'}
              </button>
            )}
          </div>
          {error && <div className="error-message chat-error">{error}</div>}
        </div>
      </div>
    </div>
  );
}

export default DoctorChatbot;