import React, { useState } from 'react';
import axios from 'axios';
import './ProfileSetup.css'; // Optional: For styling if you have this CSS

const ProfileSetup = () => {
  // State for form fields
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    weight: '',
    height: '',
    diseases: '',
    allergies: '',
    treatments: '',
    medications: '',
  });

  const [file, setFile] = useState(null); // For report upload

  // Handle input field changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle file input change
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Submit form to backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();

    // Append all form fields to FormData
    for (let key in formData) {
      data.append(key, formData[key]);
    }

    // Append uploaded file
    if (file) {
      data.append('file', file);
    }

    try {
      const res = axios.post('http://localhost:5000/api/profile', formData, {
  headers: {
    'Content-Type': 'multipart/form-data',
  },
  withCredentials: true
})


      alert('Profile setup successful!');
      console.log(res.data);
    } catch (err) {
      console.error('Error submitting profile:', err);
      alert('Failed to setup profile');
    }
  };

  return (
    <div className="profile-setup-container">
      <h2>User Profile Setup</h2>
      <form onSubmit={handleSubmit} className="profile-form">
        <input type="text" name="name" placeholder="Name" onChange={handleChange} required />
        <input type="number" name="age" placeholder="Age" onChange={handleChange} required />
        <input type="text" name="gender" placeholder="Gender" onChange={handleChange} required />
        <input type="number" name="weight" placeholder="Weight (kg)" onChange={handleChange} required />
        <input type="number" name="height" placeholder="Height (cm)" onChange={handleChange} required />
        <textarea name="diseases" placeholder="Past Diseases" onChange={handleChange}></textarea>
        <textarea name="allergies" placeholder="Allergies" onChange={handleChange}></textarea>
        <textarea name="treatments" placeholder="Ongoing Treatments" onChange={handleChange}></textarea>
        <textarea name="medications" placeholder="Medications" onChange={handleChange}></textarea>
        <label>Upload Medical Reports (PDF/Image):</label>
        <input type="file" onChange={handleFileChange} />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default ProfileSetup;
