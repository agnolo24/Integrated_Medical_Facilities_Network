import React, { useEffect, useState } from "react";
import axios from "axios";
import './AmbulanceEditProfile.css'

function AmbulanceEditProfile({ ambulanceData, onClose }) {
    const editAmbulanceUrl = 'http://127.0.0.1:8000/hospital/edit_ambulance/';

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
        <div className="ambulance-edit-overlay" onClick={onClose}>
            <div className="ambulance-edit-modal" onClick={(e) => e.stopPropagation()}>
                <button className="edit-close-btn" onClick={onClose}>&times;</button>

                <div className="edit-header-banner">
                    <h2>Edit Vehicle Profile</h2>
                    <p>Update your ambulance unit details and classification</p>
                </div>

                <div className="edit-form-body">
                    <form onSubmit={handleSubmit}>
                        <div className="row-grid">
                            <div className="premium-input-group">
                                <label><i className="fas fa-truck-medical"></i> Unit Name</label>
                                <input
                                    type="text"
                                    className="premium-input"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Emergency Unit X"
                                    required
                                />
                            </div>
                            <div className="premium-input-group">
                                <label><i className="fas fa-tag"></i> Service Type</label>
                                <select
                                    name="ambulanceType"
                                    className="premium-select"
                                    value={formData.ambulanceType}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select ML Type</option>
                                    {ambulance_choices.map((cho, index) => (
                                        <option key={index} value={cho}>{cho.toUpperCase()}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="row-grid">
                            <div className="premium-input-group">
                                <label><i className="fas fa-id-card"></i> Vehicle Number</label>
                                <input
                                    type="text"
                                    className="premium-input"
                                    name="vehicleNumber"
                                    value={formData.vehicleNumber}
                                    onChange={handleChange}
                                    placeholder="KL-XX-XXXX"
                                    required
                                />
                            </div>
                            <div className="premium-input-group">
                                <label><i className="fas fa-layer-group"></i> Unit Category</label>
                                <select
                                    name="category"
                                    className="premium-select"
                                    value={formData.category}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select Category</option>
                                    {category_choice.map((cat, index) => (
                                        <option value={cat} key={index}>{cat}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="premium-input-group">
                            <label><i className="fas fa-phone"></i> Emergency Contact</label>
                            <input
                                type="tel"
                                className="premium-input"
                                name="contactNumber"
                                value={formData.contactNumber}
                                onChange={handleChange}
                                placeholder="+91 XXXXX XXXXX"
                                required
                            />
                        </div>

                        <div className="edit-actions">
                            <button type="button" className="btn-premium btn-secondary-premium" onClick={onClose}>
                                Discard
                            </button>
                            <button type="submit" className="btn-premium btn-primary-premium">
                                <i className="fas fa-cloud-upload-alt"></i> Save Changes
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default AmbulanceEditProfile;