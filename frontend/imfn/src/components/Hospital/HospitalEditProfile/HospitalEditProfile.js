import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../HospitalProfile/HospitalProfile.css'; // Reuse valid styles

const HospitalEditProfile = ({ hospitalData, onClose }) => {

    // Initial State with keys matching the backend expectations
    const [formData, setFormData] = useState({
        hospitalName: '',
        registrationId: '',
        email: '',
        contactNumber: '',
        hospitalAddress: '',
        hospitalId: ''
    });

    useEffect(() => {
        if (hospitalData) {
            setFormData({
                hospitalName: hospitalData.hospitalName || '',
                registrationId: hospitalData.registrationId || '',
                email: hospitalData.email || '',
                contactNumber: hospitalData.contactNumber || '',
                hospitalAddress: hospitalData.hospitalAddress || '',
                hospitalId: hospitalData._id || ''
            });
        }
    }, [hospitalData]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put('http://127.0.0.1:8000/hospital/editHospital/', formData);
            alert("Hospital Profile Updated Successfully");
            // Optionally reload page or callback to refresh data
            window.location.reload();
        } catch (error) {
            console.error("Error updating profile", error);
            alert("Failed to update profile");
        }
    };

    return (
        <div className="profile-overlay" onClick={onClose}>
            <div className="profile-modal" onClick={e => e.stopPropagation()}>
                <button style={{'color':'blue'}} className="close-btn" onClick={onClose}>&times;</button>
                <div className="profile-header">
                    <h2>Edit Hospital Profile</h2>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="profile-body">
                        <div className="info-group">
                            <label>Hospital Name</label>
                            <input
                                type="text"
                                name="hospitalName"
                                value={formData.hospitalName}
                                onChange={handleChange}
                                className="form-control"
                                required
                            />
                        </div>
                        <div className="info-group">
                            <label>Registration ID</label>
                            <input
                                type="text"
                                name="registrationId"
                                value={formData.registrationId}
                                onChange={handleChange}
                                className="form-control"
                                required
                            />
                        </div>
                        <div className="info-group">
                            <label>Email (Read Only)</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                disabled
                                className="form-control"
                                style={{ backgroundColor: '#f0f0f0' }}
                            />
                        </div>
                        <div className="info-group">
                            <label>Contact Number</label>
                            <input
                                type="text"
                                name="contactNumber"
                                value={formData.contactNumber}
                                onChange={handleChange}
                                className="form-control"
                                required
                            />
                        </div>
                        <div className="info-group wide">
                            <label>Address</label>
                            <textarea
                                name="hospitalAddress"
                                value={formData.hospitalAddress}
                                onChange={handleChange}
                                className="form-control"
                                rows="3"
                                required
                            />
                        </div>
                    </div>
                    <div className="profile-footer">
                        <button type="submit" className="edit-btn">Save Changes</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default HospitalEditProfile;
