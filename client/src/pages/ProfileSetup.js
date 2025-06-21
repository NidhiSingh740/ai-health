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

      
        <div className='profile-title'> 
          <h2>User Profile Setup</h2>

        </div>
<form onSubmit={handleSubmit} className="profile-form">
  <div className="form-row">
    <label className="form-label">Name:</label>
    <input type="text" name="name" placeholder="Name" onChange={handleChange} required  className="form-input" />
    <label className="form-label">Age:</label>
      <input type="number" name="age" placeholder="Age" onChange={handleChange}required className="form-input" />
  </div>

  <div className="form-row">
    <label className="form-label">Gender:</label>
     <input type="text" name="gender" placeholder="Gender" onChange={handleChange}  required className="form-input" />
    <label className="form-label">Weight (kg):</label>
    <input type="number" name="weight" placeholder='Weight' onChange={handleChange} required className="form-input" />
  </div>

  {/* <div className="form-row">
    <label className="form-label">Height (cm):</label>
    <input type="number" name="height" placeholder='Height' onChange={handleChange} required className="form-input" />
  </div> */}

  <label className="form-label">Past Diseases:</label>
  <textarea name="diseases" placeholder='Past Diseases' onChange={handleChange} />

  <label className="form-label">Allergies:</label>
  <textarea name="allergies" placeholder='Allergies' onChange={handleChange} />

  <label className="form-label">Ongoing Treatments:</label>
  <textarea name="treatments" placeholder='Ongoing Treatments' onChange={handleChange} />

  <label className="form-label">Medications:</label>
  <textarea name="medications" placeholder='Medications' onChange={handleChange} />

  <label className="form-label">Upload Medical Reports:</label>
  <input type="file" placeholder='Upload Mediacal Reports' onChange={handleFileChange} />

  <button type="submit">Submit</button>
</form>

    </div>
  );
};

export default ProfileSetup;
