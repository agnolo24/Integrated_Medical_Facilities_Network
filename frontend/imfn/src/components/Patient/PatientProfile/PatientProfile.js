import './PatientProfile.css';
import React from 'react'
import axios from 'axios';

export default function PatientProfile({ patientData, handleOpenEditProfile, handleOpenChangePassword }) {

    // Simple alert for now as per Doctor implementation pattern, or could implemented a modal
    const handleChangePassword = (e) => {
        e.preventDefault();
        handleOpenChangePassword();
    };

    return (
        <div className="profile-card">
            <div className="profile-icon-container">
                <i className="fas fa-user-injured profile-icon"></i>
            </div>
            <h2>{patientData.name}</h2>
            <h4>Patient</h4>
            <p>Gender: {patientData.gender}</p>
            <p>Age: {patientData.age}</p>
            <p>DOB: {patientData.dob}</p>
            <p>Email: <a href={`mailto:${patientData.email}`}>{patientData.email}</a></p>
            <p>Phone: <a href={`tel:${patientData.contact}`}>{patientData.contact}</a></p>
            <div className="profile-actions">
                <button className="edit-button"
                    onClick={handleOpenEditProfile}
                >Edit</button>
                <a href="#" className="change-password" onClick={handleChangePassword}>Change Password</a>
            </div>
        </div>
    );
}
