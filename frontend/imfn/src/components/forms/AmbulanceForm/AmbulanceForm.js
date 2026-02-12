// ambulance reg form

import React, { useState } from 'react';

import './AmbulanceForm.css';
// import LandingPageHeader from '../../LandingPageHeader/LandingPageHeader';
// import LandingPageFooter from '../../LandingPageFooter/LandingPageFooter';
import axios from 'axios';

const AmbulanceForm = () => {
    const ambulanceRegistrationUrl = 'http://127.0.0.1:8000/hospital/register_ambulance/'

    const [formData, setFormData] = useState({
        name: '',
        ambulanceType: '',
        vehicleNumber: '',
        // hospital: '',
        category: '',
        contactNumber: '',
        email: ''
        // password: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const hospital_login_id = localStorage.getItem("loginId")
            const response = await axios.post(ambulanceRegistrationUrl, { ...formData, hospital_login_id })

            alert(response.data.message)

            setFormData({
                name: '',
                ambulanceType: '',
                vehicleNumber: '',
                // hospital: '',
                category: '',
                contactNumber: '',
                email: ''
                // password: ''
            })
        } catch (error) {
            alert(error?.response?.data?.error || "An error occur while registering the ambulance")
        }
    };

    return (
        <div className="registration-wrapper">
            <div className="registration-main-content">
                <div className="registration-container">
                    <div className="registration-card ambulance-variant">
                        <div className="registration-header">
                            <div className="registration-logo-circle">
                                <i className="fas fa-ambulance"></i>
                            </div>
                            <h2>Ambulance Fleet Registration</h2>
                            <p>Add a new emergency vehicle to your hospital fleet</p>
                        </div>

                        <form className="registration-form-modern" onSubmit={handleSubmit}>
                            <div className="modern-form-row">
                                <div className="modern-form-group">
                                    <label><i className="fas fa-user-tie"></i> Full Name (In-Charge)</label>
                                    <input type="text" name="name" placeholder="John Doe"
                                        value={formData.name} onChange={handleChange} required />
                                </div>
                            </div>

                            <div className="modern-form-group">
                                <label><i className="fas fa-layer-group"></i> Emergency Category</label>
                                <select name="category" className="modern-select"
                                    value={formData.category} onChange={handleChange} required>
                                    <option value="">Select Category</option>
                                    <option value="Category 1: Life-threatening emergencies">Category 1: Life-threatening emergencies</option>
                                    <option value="Category 2: Emergency calls">Category 2: Emergency calls</option>
                                    <option value="Category 3: Urgent problems">Category 3: Urgent problems</option>
                                    <option value="Category 4: Non-urgent problems">Category 4: Non-urgent problems</option>
                                </select>
                            </div>

                            <div className="modern-form-grid">
                                <div className="modern-form-group">
                                    <label><i className="fas fa-truck-medical"></i> Ambulance Type</label>
                                    <select name="ambulanceType" className="modern-select"
                                        value={formData.ambulanceType} onChange={handleChange} required>
                                        <option value="">Select Type</option>
                                        <option value="bls">BLS (Basic Life Support)</option>
                                        <option value="als">ALS (Advanced Life Support)</option>
                                        <option value="micu">MICU (Mobile ICU)</option>
                                        <option value="icu">ICU (Intensive Care)</option>
                                    </select>
                                </div>

                                <div className="modern-form-group">
                                    <label><i className="fas fa-id-badge"></i> Vehicle Number</label>
                                    <input type="text" name="vehicleNumber" placeholder="AB-123-CD"
                                        value={formData.vehicleNumber} onChange={handleChange} required />
                                </div>
                            </div>

                            <div className="modern-form-grid">
                                <div className="modern-form-group">
                                    <label><i className="fas fa-phone-alt"></i> Contact Number</label>
                                    <input type="tel" name="contactNumber" placeholder="+1 234 567 890"
                                        value={formData.contactNumber} onChange={handleChange} required />
                                </div>

                                <div className="modern-form-group">
                                    <label><i className="fas fa-envelope"></i> Email Address</label>
                                    <input type="email" name="email" placeholder="ambulance@hospital.org"
                                        value={formData.email} onChange={handleChange} required />
                                </div>
                            </div>

                            <button type="submit" className="registration-submit-btn ambulance-btn">
                                <span>Register Ambulance</span>
                                <i className="fas fa-plus-circle"></i>
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AmbulanceForm;

