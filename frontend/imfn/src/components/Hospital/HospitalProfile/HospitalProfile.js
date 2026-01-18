import React, { useState } from 'react';
import axios from 'axios';
import './HospitalProfile.css'; // You can copy this css or make a new one

const HospitalProfile = ({ hospitalData, handleOpenEditProfile, onClose }) => {

    if (!hospitalData) return null;

    const handleChangePassword = async () => {
        const newPassword = prompt("Enter new password:");
        if (newPassword) {
            try {
                await axios.post("http://127.0.0.1:8000/hospital/change_hospital_password/", {
                    login_id: hospitalData.login_id,
                    new_password: newPassword
                });
                alert("Password Updated Successfully");
            } catch (error) {
                console.error("Error changing password", error);
                alert("Failed to update password");
            }
        }
    };

    return (
        <div className="profile-overlay" onClick={onClose}>
            <div className="profile-modal" onClick={(e) => e.stopPropagation()}>
                <button className="close-btn" onClick={onClose}>&times;</button>
                <div className="profile-header">
                    <div className="profile-avatar">
                        <i className="fas fa-hospital"></i>
                    </div>
                    <h2>{hospitalData.hospitalName}</h2>
                    <p className="profile-role">Hospital Administrator</p>
                </div>
                <div className="profile-body">
                    <div className="info-group">
                        <label>Registration ID</label>
                        <p>{hospitalData.registrationId}</p>
                    </div>
                    <div className="info-group">
                        <label>Email</label>
                        <p>{hospitalData.email}</p>
                    </div>
                    <div className="info-group">
                        <label>Contact Number</label>
                        <p>{hospitalData.contactNumber}</p>
                    </div>
                    <div className="info-group wide">
                        <label>Address</label>
                        <p>{hospitalData.hospitalAddress}</p>
                    </div>
                </div>
                <div className="profile-footer">
                    <button className="edit-btn" onClick={handleOpenEditProfile}>Edit Profile</button>
                    <button className="password-btn" onClick={handleChangePassword}>Change Password</button>
                </div>
            </div>
        </div>
    );
};

export default HospitalProfile;
