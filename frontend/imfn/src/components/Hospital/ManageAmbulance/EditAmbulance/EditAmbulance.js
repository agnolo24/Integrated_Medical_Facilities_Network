import React, { useEffect, useState } from 'react';
import axios from 'axios';

import './EditAmbulance.css';

function EditAmbulance({ ambulanceData, onClose }) {
    const editAmbulanceUrl = 'http://127.0.0.1:8000/hospital/edit_ambulance/';
    const hospital_login_id = localStorage.getItem('loginId');

    const ambulance_choices = [
        'bls',
        'als',
        'micu',
        'icu'
    ];

    const category_choice = [
        'Category 1: Life-threatening emergencies',
        'Category 2: Emergency calls',
        'Category 3: Urgent problems',
        'Category 4: Non-urgent problems'
    ];

    const [formData, setFormData] = useState({
        name: '',
        ambulanceType: '',
        vehicleNumber: '',
        category: '',
        contactNumber: ''
    });

    useEffect(() => {
        if (ambulanceData) {
            setFormData({
                ambulance_id: ambulanceData._id,
                name: ambulanceData.name || '',
                ambulanceType: ambulanceData.ambulanceType || '',
                vehicleNumber: ambulanceData.vehicleNumber || '',
                category: ambulanceData.category || '',
                contactNumber: ambulanceData.contactNumber || '',
            });
        }
    }, [ambulanceData]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.put(editAmbulanceUrl, formData);

            if (response.status === 200) {
                alert("Ambulance details updated successfully!");
                onClose();
            }
        } catch (error) {
            console.error("Error updating ambulance:", error);
            alert(error?.response?.data?.error || "An error occurred while updating ambulance details.");
        }
    };

    return (
        <div className="edit-ambulance-wrapper">
            <div className="edit-ambulance-card-modern">
                <div className="edit-ambulance-header-premium">
                    <i className="fas fa-truck-medical"></i>
                    <h2>Update Fleet Asset</h2>
                    <p>Refine vehicle specifications and classification</p>
                </div>

                <div className="edit-ambulance-body-content">
                    <form className="modern-ambulance-edit-form" onSubmit={handleSubmit}>
                        <div className="modern-input-field">
                            <label><i className="fas fa-layer-group"></i> Operational Category</label>
                            <select name="category" value={formData.category} onChange={handleChange} required>
                                <option value="">Select Level</option>
                                {category_choice.map((cat, index) => (
                                    <option value={cat} key={index}>{cat}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-row-grid-2">
                            <div className="modern-input-field">
                                <label><i className="fas fa-id-card"></i> Specialist Name</label>
                                <input type="text" name="name" placeholder="Assigned Specialist"
                                    value={formData.name} onChange={handleChange} required />
                            </div>
                            <br />
                            <div className="modern-input-field">
                                <label><i className="fas fa-briefcase-medical"></i> Unit Type</label>
                                <select name="ambulanceType" value={formData.ambulanceType} onChange={handleChange} required>
                                    <option value="">Select Class</option>
                                    {ambulance_choices.map((cho, index) => (
                                        <option key={index} value={cho}>{cho.toUpperCase()}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="form-row-grid-2">
                            <div className="modern-input-field">
                                <label><i className="fas fa-hashtag"></i> Registration No</label>
                                <input type="text" name="vehicleNumber" placeholder="AB-123-CD"
                                    value={formData.vehicleNumber} onChange={handleChange} required />
                            </div>
                            <br />
                            <div className="modern-input-field">
                                <label><i className="fas fa-phone-alt"></i> Dispatch Line</label>
                                <input type="tel" name="contactNumber" placeholder="+1 234 567 890"
                                    value={formData.contactNumber} onChange={handleChange} required />
                            </div>
                        </div>

                        <div className="edit-actions-modern">
                            <button type="submit" className="sync-profile-btn">
                                <i className="fas fa-sync-alt"></i> Synchronize Fleet Profile
                            </button>
                            <button type="button" className="discard-changes-btn" onClick={onClose}>Discard</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default EditAmbulance;
