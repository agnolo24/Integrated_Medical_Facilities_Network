
import React, { useState, useEffect } from 'react'
import axios from 'axios';

export default function PatientEditProfile({ patientData, onClose }) {
    const editPatientUrl = "http://127.0.0.1:8000/patient/edit_patient/";

    const [formData, setFormData] = useState({
        name: '',
        gender: '',
        age: '',
        dob: '',
        contact: ''
        // email: ''
    });

    useEffect(() => {
        if (patientData) {
            // Format format date for input type="date"
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

        // const login_id = localStorage.getItem("loginId");

        try {
            const response = await axios.put(editPatientUrl, {
                ...formData,
                patientId: patientData._id
            });

            alert("Patient profile updated successfully!");
            onClose();
        } catch (error) {
            alert(error?.response?.data?.error || "An Error Occurred while Updating");
        }
    };

    return (
        <div className="edit-doctor-container">
            <div className="card border-0">
                <div className="card-header bg-primary text-white text-center">
                    <h4>Edit Patient Profile</h4>
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        {/* Name */}
                        <div className="mb-3">
                            <label className="form-label">Full Name</label>
                            <input type="text" name="name" className="form-control"
                                value={formData.name} onChange={handleChange} required />
                        </div>

                        {/* Gender & Age */}
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Gender</label>
                                <select name="gender" className="form-select" value={formData.gender} onChange={handleChange} required>
                                    <option value="">Select</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Age</label>
                                <input type="number" name="age" className="form-control" value={formData.age} onChange={handleChange} required />
                            </div>
                        </div>

                        {/* DOB */}
                        <div className="mb-3">
                            <label className="form-label">Date of Birth</label>
                            <input type="date" name="dob" className="form-control" value={formData.dob} onChange={handleChange} required />
                        </div>

                        {/* Contact */}
                        <div className="mb-3">
                            <label className="form-label">Contact Number</label>
                            <input type="tel" name="contact" className="form-control" value={formData.contact} onChange={handleChange} required />
                        </div>

                        <div className="d-flex gap-2">
                            <button type="submit" className="btn btn-primary flex-grow-1">Update Details</button>
                            <button type="button" className="btn btn-light" onClick={onClose}>Cancel</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
