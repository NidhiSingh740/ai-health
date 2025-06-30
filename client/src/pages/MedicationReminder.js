import React, { useState } from 'react';
import axios from 'axios';
import Spinner from '../components/Spinner'; // Assuming Spinner is a shared component
import './MedicationReminder.css'; // Dedicated styling for Medication Reminder

function MedicationReminder({ user }) { // Added 'user' prop for consistency, though not strictly used for display here
  const [form, setForm] = useState({
    medicationName: '',
    dosage: '',
    schedule: '',
    phoneNumber: ''
  });
  const [message, setMessage] = useState(''); // Used for success/error messages
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setMessage(''); // Clear previous messages
    setMessageType('');
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setMessage("User not authenticated. Please login again.");
        setMessageType("error");
        setLoading(false);
        return;
      }

      const payload = {
        ...form,
        // Convert schedule to ISO string for backend, if it's not empty
        schedule: form.schedule ? new Date(form.schedule).toISOString() : null,
      };

      const res = await axios.post(
        'https://ai-health-n4i4.onrender.com/api/medication/add',
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setMessage(res.data.message);
      setMessageType("success");
      // Clear form after successful submission
      setForm({
        medicationName: '',
        dosage: '',
        schedule: '',
        phoneNumber: ''
      });
    } catch (err) {
      console.error('Error saving medication:', err);
      const errorMessage = err.response?.data?.message || 'Error saving medication. Please try again.';
      setMessage(errorMessage);
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="medication-reminder-wrapper">
      <div className="medication-reminder-container">
        {/* Header Section */}
        <div className="medication-reminder-header">
          <span className="icon-pill" role="img" aria-label="pill icon">
            💊
          </span>
          <h2>Medication Reminder</h2>
        </div>

        {/* Input Form Section */}
        <form className="medication-reminder-input-form" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="medicationName">Medication Name</label>
            <input
              type="text"
              name="medicationName"
              id="medicationName"
              placeholder="e.g., Paracetamol"
              value={form.medicationName}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label htmlFor="dosage">Dosage</label>
            <input
              type="text"
              name="dosage"
              id="dosage"
              placeholder="e.g., 500mg, 1 pill"
              value={form.dosage}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label htmlFor="schedule">Schedule Time</label>
            <input
              type="datetime-local"
              name="schedule"
              id="schedule"
              value={form.schedule}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label htmlFor="phoneNumber">Phone Number</label>
            <input
              type="tel"
              name="phoneNumber"
              id="phoneNumber"
              placeholder="e.g., +919876543210"
              pattern="^\+\d{1,14}$"
              title="Phone number must start with '+' and include country code, e.g., +919876543210"
              value={form.phoneNumber}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? (
              <Spinner />
            ) : (
              'Save & Schedule Reminder'
            )}
          </button>
        </form>

        {/* Message Display (Error/Success) */}
        {message && (
          <div className={messageType === 'error' ? "medication-reminder-error-message" : "medication-reminder-success-message"}>
            <p>{message}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default MedicationReminder;