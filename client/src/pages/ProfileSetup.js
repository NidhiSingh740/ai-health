import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ProfileSetup.css'; // Importing the new CSS file

const ProfileSetup = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
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
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('token');

                if (!token) {
                    setError('You are not logged in. Please log in to view your profile.');
                    setLoading(false);
                    return;
                }

                const res = await axios.get('https://ai-health-n4i4.onrender.com/api/auth/profile', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    withCredentials: true,
                });

                const profileData = res.data.userData;
                console.log("Fetched profile data:", profileData);

                setFormData({
                    username: profileData.username || '',
                    email: profileData.email || '',
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
        setSuccessMessage(''); // Clear previous messages
        setError('');

        const token = localStorage.getItem('token');

        if (!token) {
            setError('Authentication token not found. Please log in again.');
            return;
        }

        try {
            const res = await axios.put('https://ai-health-n4i4.onrender.com/api/auth/profile', formData, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                withCredentials: true,
            });

            setSuccessMessage('Profile updated successfully!');
            console.log(res.data);
            // Optionally, you might want to re-fetch profile data or update local state
            // to reflect any backend-side changes or normalizations if necessary.
        } catch (err) {
            console.error('Error updating profile:', err.response ? err.response.data : err.message);
            setError('Failed to update profile: ' + (err.response ? err.response.data.message || err.response.data.msg || 'Server error' : 'Network error'));
        }
    };

    if (loading) {
        return (
            <div className="profile-setup-wrapper">
                <div className="profile-setup-container loading">
                    <p>Loading profile...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="profile-setup-wrapper">
            <div className="profile-setup-container">
                {/* Header Section */}
                <div className="profile-setup-header">
                    <span className="icon-user-gear" role="img" aria-label="user with gear">⚙️</span>
                    <h2>Update User Profile</h2>
                </div>

                {/* Form Section */}
                <form onSubmit={handleSubmit} className="profile-setup-form-content">
                    {/* User Info Section */}
                    <div className="form-section-title">Account Information</div>
                    <div className="form-row-group">
                        <div className="form-field-group">
                            <label className="form-label">Username:</label>
                            <input type="text" name="username" value={formData.username} readOnly className="form-input read-only" />
                        </div>
                        <div className="form-field-group">
                            <label className="form-label">Email:</label>
                            <input type="email" name="email" value={formData.email} readOnly className="form-input read-only" />
                        </div>
                    </div>

                    {/* Personal Details Section */}
                    <div className="form-section-title">Personal Details</div>
                    <div className="form-row-group">
                        <div className="form-field-group">
                            <label className="form-label">Full Name:</label>
                            <input type="text" name="name" placeholder="Full Name" onChange={handleChange} value={formData.name} className="form-input" />
                        </div>
                        <div className="form-field-group">
                            <label className="form-label">Age:</label>
                            <input type="number" name="age" placeholder="Age" onChange={handleChange} value={formData.age} className="form-input" />
                        </div>
                    </div>
                    <div className="form-row-group">
                        <div className="form-field-group">
                            <label className="form-label">Gender:</label>
                            <input type="text" name="gender" placeholder="Gender" onChange={handleChange} value={formData.gender} className="form-input" />
                        </div>
                        <div className="form-field-group">
                            <label className="form-label">Weight (kg):</label>
                            <input type="number" name="weight" placeholder='Weight' onChange={handleChange} value={formData.weight} className="form-input" />
                        </div>
                    </div>
                    <div className="form-full-width-field">
                        <label className="form-label">Height (cm):</label>
                        <input type="number" name="height" placeholder='Height' onChange={handleChange} value={formData.height} className="form-input" />
                    </div>

                    {/* Medical Information Section */}
                    <div className="form-section-title">Medical Information</div>
                    <div className="form-full-width-field">
                        <label className="form-label">Past Diseases:</label>
                        <textarea name="diseases" placeholder='Past Diseases (e.g., Diabetes, Asthma, Hypertension)' onChange={handleChange} value={formData.diseases} rows="1"></textarea>
                    </div>
                    <div className="form-full-width-field">
                        <label className="form-label">Allergies:</label>
                        <textarea name="allergies" placeholder='Allergies (e.g., Peanuts, Penicillin, Dust)' onChange={handleChange} value={formData.allergies} rows="1"></textarea>
                    </div>
                    <div className="form-full-width-field">
                        <label className="form-label">Ongoing Treatments:</label>
                        <textarea name="treatments" placeholder='Ongoing Treatments (e.g., Chemotherapy, Dialysis, Physiotherapy)' onChange={handleChange} value={formData.treatments} rows="1"></textarea>
                    </div>
                    <div className="form-full-width-field">
                        <label className="form-label">Medications:</label>
                        <textarea name="medications" placeholder='Current Medications (e.g., Lisinopril 10mg daily, Insulin)' onChange={handleChange} value={formData.medications} rows="1"></textarea>
                    </div>

                    {/* Status Messages */}
                    {error && (
                        <div className="profile-error-message">
                            <p>{error}</p>
                        </div>
                    )}
                    {successMessage && (
                        <div className="profile-success-message">
                            <p>{successMessage}</p>
                        </div>
                    )}

                    <button type="submit" className="update-profile-button">Update Profile</button>
                </form>
            </div>
        </div>
    );
};

export default ProfileSetup;