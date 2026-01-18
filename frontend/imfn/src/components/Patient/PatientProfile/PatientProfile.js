import './PatientProfile.css';
import React from 'react'
import axios from 'axios';

export default function PatientProfile({ patientData, handleOpenEditProfile }) {

    // Simple alert for now as per Doctor implementation pattern, or could implemented a modal
    const handleChangePassword = async () => {
        const newPassword = prompt("Enter new password:");
        if (newPassword) {
            try {
                const login_id = localStorage.getItem("loginId");
                await axios.post("http://127.0.0.1:8000/patient/change_password/", {
                    login_id: login_id,
                    new_password: newPassword
                });
                alert("Password changed successfully!");
            } catch (error) {
                alert("Failed to change password.");
                console.error(error);
            }
        }
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
