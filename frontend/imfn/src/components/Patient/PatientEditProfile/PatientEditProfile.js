
import React, { useState, useEffect } from 'react'
import axios from 'axios';
import '../PatientProfile/PatientProfile.css';

export default function PatientEditProfile({ patientData, onClose }) {
    const editPatientUrl = "http://127.0.0.1:8000/patient/edit_patient/";

    const [formData, setFormData] = useState({
        name: '',
        gender: '',
        age: '',
        dob: '',
        contact: ''
    });

    useEffect(() => {
        if (patientData) {
            // Format date for input type="date"
            let formattedDob = '';
            if (patientData.dob) {
                const date = new Date(patientData.dob);
                formattedDob = date.toISOString().split('T')[0];
            }

            setFormData({
                name: patientData.name || '',
                gender: patientData.gender || '',
                age: patientData.age || '',
                dob: formattedDob,
                contact: patientData.contact || ''
            });
        }
    }, [patientData]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await axios.put(editPatientUrl, {
                ...formData,
                patientId: patientData._id
            });

            alert("Patient profile updated successfully!");
            onClose();
            window.location.reload();
        } catch (error) {
            alert(error?.response?.data?.error || "An Error Occurred while Updating");
        }
    };

    return (
        <div className="profile-overlay" onClick={onClose}>
            <div className="profile-modal" onClick={e => e.stopPropagation()}>
                <button style={{'color':'blue'}} className="close-btn" onClick={onClose}>&times;</button>

                <div className="profile-header">
                    <h2>Edit Patient Profile</h2>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="profile-body">
                        {/* Name */}
                        <div className="info-group wide">
                            <label>Full Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter your full name"
                                required
                            />
                        </div>

                        {/* Gender */}
                        <div className="info-group">
                            <label>Gender</label>
                            <select
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        {/* Age */}
                        <div className="info-group">
                            <label>Age</label>
                            <input
                                type="number"
                                name="age"
                                value={formData.age}
                                onChange={handleChange}
                                placeholder="Years"
                                required
                            />
                        </div>

                        {/* DOB */}
                        <div className="info-group">
                            <label>Date of Birth</label>
                            <input
                                type="date"
                                name="dob"
                                value={formData.dob}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* Contact */}
                        <div className="info-group">
                            <label>Contact Number</label>
                            <input
                                type="tel"
                                name="contact"
                                value={formData.contact}
                                onChange={handleChange}
                                placeholder="Enter phone number"
                                required
                            />
                        </div>
                    </div>

                    <div className="profile-footer">
                        <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
                        <button type="submit" className="save-btn">Save Changes</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
