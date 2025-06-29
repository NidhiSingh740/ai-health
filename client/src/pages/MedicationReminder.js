
// client/src.pages/MedicationReminder.js

import React, { useState } from 'react';
import axios from 'axios';

// Custom message box component (replaces alert)
const MessageBox = ({ message, type, onClose }) => {
  if (!message) return null;

  const bgColor = type === 'success' ? 'bg-green-100 border-green-400 text-green-700' : 'bg-red-100 border-red-400 text-red-700';
  const textColor = type === 'success' ? 'text-green-800' : 'text-red-800';

  return (
    <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg border-l-4 ${bgColor} z-50`}>
      <div className="flex justify-between items-center">
        <p className={`font-semibold ${textColor}`}>{message}</p>
        <button onClick={onClose} className="ml-4 text-gray-500 hover:text-gray-700">
          &times;
        </button>
      </div>
    </div>
  );
};

const MedicationReminder = () => {
  const [form, setForm] = useState({
    medicationName: '',
    dosage: '',
    schedule: '', // This will be set as a datetime-local string
    phoneNumber: ''
  });
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  // Function to display a message
  const showMessage = (msg, type) => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => {
      setMessage('');
      setMessageType('');
    }, 5000); // Message disappears after 5 seconds
  };

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        showMessage("User not authenticated. Please login again.", "error");
        return;
      }

      // Convert schedule to ISO string for backend (optional, but good practice if not done on backend)
      // The backend (Mongoose) should handle the string to Date conversion automatically.
      // If `schedule` is an empty string, make sure to handle it appropriately or set a default.
      const payload = {
        ...form,
        schedule: form.schedule ? new Date(form.schedule).toISOString() : null, // Convert to ISO string
      };

      const res = await axios.post(
        'http://localhost:5000/api/medication/add',
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      showMessage(res.data.message, "success");
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
      showMessage(errorMessage, "error");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-sans">
      <MessageBox message={message} type={messageType} onClose={() => setMessage('')} />
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Smart Medication Reminder</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Removed userId input as it's handled by middleware */}

          <div>
            <label htmlFor="medicationName" className="block text-sm font-medium text-gray-700 mb-1">Medication Name</label>
            <input
              type="text"
              name="medicationName"
              id="medicationName"
              placeholder="e.g., Paracetamol"
              value={form.medicationName}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="dosage" className="block text-sm font-medium text-gray-700 mb-1">Dosage</label>
            <input
              type="text"
              name="dosage"
              id="dosage"
              placeholder="e.g., 500mg, 1 pill"
              value={form.dosage}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="schedule" className="block text-sm font-medium text-gray-700 mb-1">Schedule Time</label>
            <input
              type="datetime-local" // Changed to datetime-local for better date/time input
              name="schedule"
              id="schedule"
              value={form.schedule}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <input
              type="tel" // Use type="tel" for phone numbers
              name="phoneNumber"
              id="phoneNumber"
              placeholder="e.g., +919876543210"
              pattern="^\+\d{1,14}$" // Basic pattern for international numbers (e.g., +91...)
              title="Phone number must start with '+' and include country code, e.g., +919876543210"
              value={form.phoneNumber}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
          >
            Save & Schedule Reminder
          </button>
        </form>
      </div>
    </div>
  );
};

export default MedicationReminder;
