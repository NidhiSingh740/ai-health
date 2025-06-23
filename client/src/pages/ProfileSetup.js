import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ProfileSetup.css';

const ProfileSetup = () => {
  const [formData, setFormData] = useState({
    username: '', // Added for prefilling
    email: '',     // Added for prefilling
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

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token'); 

        const res = await axios.get('http://localhost:5000/api/auth/profile', {
          headers: {
            Authorization: `Bearer ${token}`, 
          },
          withCredentials: true,
        });

        const profileData = res.data.userData; 
        console.log("Fetched profile data:", profileData);

        // Update formData with fetched data, handling potential nulls/undefineds
        setFormData({
          username: profileData.username || '', // Prefill username
          email: profileData.email || '',     // Prefill email
          name: profileData.name || '',
          age: profileData.age || '',
          gender: profileData.gender || '',
          weight: profileData.weight || '',
          height: profileData.height || '',
          diseases: profileData.diseases || '',
          allergies: profileData.allergies || '',
          treatments: profileData.treatments || '',
          medications: profileData.medications || '',
        });
        setLoading(false);
      } catch (err) {
        console.error('Error fetching profile:', err.response ? err.response.data : err.message);
        setError('Failed to fetch profile data. Please ensure you are logged in.');
        setLoading(false);
      }
    };

    fetchProfile();
  }, []); 

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token'); 

    try {
      const res = await axios.put('http://localhost:5000/api/auth/profile', formData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, 
        },
        withCredentials: true,
      });

      alert('Profile updated successfully!');
      console.log(res.data);
    } catch (err) {
      console.error('Error updating profile:', err.response ? err.response.data : err.message);
      alert('Failed to update profile: ' + (err.response ? err.response.data.message || err.response.data.msg : 'Server error'));
    }
  };

  if (loading) {
    return (
      <div className="profile-setup-container">
        <p>Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-setup-container">
        <p className="error-message">{error}</p>
      </div>
    );
  }

  return (
    <div className="profile-setup-container">
      <div className="profile-title">
        <h2>Update User Profile</h2>
      </div>
      <form onSubmit={handleSubmit} className="profile-form">
        <div className="form-row">
          <label className="form-label">Username:</label>
          <input type="text" name="username" value={formData.username} readOnly className="form-input read-only" /> {/* Read-only */}
          <label className="form-label">Email:</label>
          <input type="email" name="email" value={formData.email} readOnly className="form-input read-only" /> {/* Read-only */}
        </div>

        <div className="form-row">
          <label className="form-label">Full Name:</label>
          <input type="text" name="name" placeholder="Full Name" onChange={handleChange} value={formData.name} className="form-input" />
          <label className="form-label">Age:</label>
          <input type="number" name="age" placeholder="Age" onChange={handleChange} value={formData.age} className="form-input" />
        </div>

        <div className="form-row">
          <label className="form-label">Gender:</label>
          <input type="text" name="gender" placeholder="Gender" onChange={handleChange} value={formData.gender} className="form-input" />
          <label className="form-label">Weight (kg):</label>
          <input type="number" name="weight" placeholder='Weight' onChange={handleChange} value={formData.weight} className="form-input" />
        </div>

        <label className="form-label">Height (cm):</label>
        <input type="number" name="height" placeholder='Height' onChange={handleChange} value={formData.height} className="form-input" />

        <label className="form-label">Past Diseases:</label>
        <textarea name="diseases" placeholder='Past Diseases (e.g., Diabetes, Asthma)' onChange={handleChange} value={formData.diseases} />

        <label className="form-label">Allergies:</label>
        <textarea name="allergies" placeholder='Allergies (e.g., Peanuts, Penicillin)' onChange={handleChange} value={formData.allergies} />

        <label className="form-label">Ongoing Treatments:</label>
        <textarea name="treatments" placeholder='Ongoing Treatments (e.g., Chemotherapy, Dialysis)' onChange={handleChange} value={formData.treatments} />

        <label className="form-label">Medications:</label>
        <textarea name="medications" placeholder='Current Medications (e.g., Lisinopril 10mg daily)' onChange={handleChange} value={formData.medications} />

        <button type="submit">Update Profile</button>
      </form>
    </div>
  );
};

export default ProfileSetup;