import React from 'react';
import './ProfileSetup.css';

const ProfileSetup = () => {
  return (
    <div className="profile-setup-container">
      <h2 className="profile-title">Profile Setup</h2>
      <form className="profile-form">
        <h3>Personal Details</h3>
        <input type="text" placeholder="Name" required />
        <input type="number" placeholder="Age" required />
        <select required>
          <option value="">Select Gender</option>
          <option value="female">Female</option>
          <option value="male">Male</option>
          <option value="other">Other</option>
        </select>
        <input type="number" placeholder="Weight (kg)" required />
        <input type="number" placeholder="Height (cm)" required />

        <h3>Medical History</h3>
        <textarea placeholder="Past diseases"></textarea>
        <textarea placeholder="Allergies"></textarea>
        <textarea placeholder="Current treatments"></textarea>
        <textarea placeholder="Medications"></textarea>

        <h3>Upload Medical Reports</h3>
        <input type="file" multiple accept=".pdf,image/*" />

        <button type="submit">Save Profile</button>
      </form>
    </div>
  );
};

export default ProfileSetup;
