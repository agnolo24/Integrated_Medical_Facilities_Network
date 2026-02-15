import React, { useState } from 'react';
import axios from 'axios';
import './HospitalProfile.css'; // You can copy this css or make a new one

const HospitalProfile = ({ hospitalData, handleOpenEditProfile, handleOpenChangePassword, onClose }) => {

    if (!hospitalData) return null;

    return (
        <div className="profile-overlay" onClick={onClose}>
            <div className="profile-modal" onClick={(e) => e.stopPropagation()}>
                <button style={{'color':'blue'}} className="close-btn" onClick={onClose}>&times;</button>
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
                    <button className="password-btn" onClick={handleOpenChangePassword}>Change Password</button>
                </div>
            </div>
        </div>
    );
};

export default HospitalProfile;
