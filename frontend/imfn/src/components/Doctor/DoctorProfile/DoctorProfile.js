import './DoctorProfile.css'; // Optional: for external styling
import React, { useState, useEffect } from 'react'

// import DoctorEditProfile from '../DoctorEditProfile/DoctorEditProfile';

export default function DoctorProfile({ doctorData ,handleOpenEditProfile}) {

  
  return (
    <div className="profile-card">
      <div className="profile-icon-container">
        <i className="fas fa-user-md profile-icon"></i>
      </div>
      <h2>Dr. {doctorData.name}</h2>
      <h4>{doctorData.qualification}</h4>
      <p>{doctorData.specialization}</p>
      <p>Email: <a href={`mailto:${doctorData.email}`}>{doctorData.email}</a></p>
      <p>Phone: <a href={`tel:${doctorData.contactNumber}`}>{doctorData.contactNumber}</a></p>
      <div className="profile-actions">
        <button className="edit-button"
          onClick={handleOpenEditProfile}
        >Edit</button>
        <a href="#" className="change-password">Change Password</a>
      </div>
    </div>
  );
}





