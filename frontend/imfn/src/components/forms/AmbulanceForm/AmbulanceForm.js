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
        category: '',
        contactNumber: '',
        email: ''
    });

    const [errors, setErrors] = useState({});

    const validate = (name, value) => {
        let error = '';
        switch (name) {
            case 'name':
                if (!value) error = 'Full name is required';
                else if (value.length < 3) error = 'Name must be at least 3 characters';
                else if (!/^[a-zA-Z\s.]+$/.test(value)) error = 'Name can only contain letters, spaces, and dots';
                break;
            case 'category':
                if (!value) error = 'Emergency category is required';
                break;
            case 'ambulanceType':
                if (!value) error = 'Ambulance type is required';
                break;
            case 'vehicleNumber':
                if (!value) error = 'Vehicle number is required';
                else if (!/^[A-Z0-9-]{5,15}$/.test(value.toUpperCase())) error = 'Enter a valid vehicle number';
                break;
            case 'contactNumber':
                if (!value) error = 'Contact number is required';
                else if (!/^[0-9]{10}$/.test(value)) error = 'Must be exactly 10 digits';
                break;
            case 'email':
                if (!value) error = 'Email address is required';
                else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = 'Please enter a valid email address';
                break;
            default:
                break;
        }
        return error;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (errors[name]) setErrors({ ...errors, [name]: '' });
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        const error = validate(name, value);
        setErrors({ ...errors, [name]: error });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newErrors = {};
        Object.keys(formData).forEach((key) => {
            const error = validate(key, formData[key]);
            if (error) newErrors[key] = error;
        });

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            const hospital_login_id = localStorage.getItem("loginId")
            const response = await axios.post(ambulanceRegistrationUrl, { ...formData, hospital_login_id })

            alert(response.data.message)

            setFormData({
                name: '',
                ambulanceType: '',
                vehicleNumber: '',
                category: '',
                contactNumber: '',
                email: ''
            });
            setErrors({});
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

                        <form className="registration-form-modern" onSubmit={handleSubmit} noValidate>
                            <div className="modern-form-row">
                                <div className="modern-form-group">
                                    <label><i className="fas fa-user-tie"></i> Full Name (In-Charge)</label>
                                    <input type="text" name="name" placeholder="John Doe"
                                        className={errors.name ? 'input-error' : ''}
                                        value={formData.name} onChange={handleChange} onBlur={handleBlur} />
                                    {errors.name && <span className="error-text"><i className="fas fa-exclamation-circle"></i> {errors.name}</span>}
                                </div>
                            </div>

                            <div className="modern-form-group">
                                <label><i className="fas fa-layer-group"></i> Emergency Category</label>
                                <select name="category" className={`modern-select ${errors.category ? 'input-error' : ''}`}
                                    value={formData.category} onChange={handleChange} onBlur={handleBlur}>
                                    <option value="">Select Category</option>
                                    <option value="Category 1: Life-threatening emergencies">Category 1: Life-threatening emergencies</option>
                                    <option value="Category 2: Emergency calls">Category 2: Emergency calls</option>
                                    <option value="Category 3: Urgent problems">Category 3: Urgent problems</option>
                                    <option value="Category 4: Non-urgent problems">Category 4: Non-urgent problems</option>
                                </select>
                                {errors.category && <span className="error-text"><i className="fas fa-exclamation-circle"></i> {errors.category}</span>}
                            </div>

                            <div className="modern-form-grid">
                                <div className="modern-form-group">
                                    <label><i className="fas fa-truck-medical"></i> Ambulance Type</label>
                                    <select name="ambulanceType" className={`modern-select ${errors.ambulanceType ? 'input-error' : ''}`}
                                        value={formData.ambulanceType} onChange={handleChange} onBlur={handleBlur}>
                                        <option value="">Select Type</option>
                                        <option value="bls">BLS (Basic Life Support)</option>
                                        <option value="als">ALS (Advanced Life Support)</option>
                                        <option value="micu">MICU (Mobile ICU)</option>
                                        <option value="icu">ICU (Intensive Care)</option>
                                    </select>
                                    {errors.ambulanceType && <span className="error-text"><i className="fas fa-exclamation-circle"></i> {errors.ambulanceType}</span>}
                                </div>

                                <div className="modern-form-group">
                                    <label><i className="fas fa-id-badge"></i> Vehicle Number</label>
                                    <input type="text" name="vehicleNumber" placeholder="AB-123-CD"
                                        className={errors.vehicleNumber ? 'input-error' : ''}
                                        value={formData.vehicleNumber} onChange={handleChange} onBlur={handleBlur} />
                                    {errors.vehicleNumber && <span className="error-text"><i className="fas fa-exclamation-circle"></i> {errors.vehicleNumber}</span>}
                                </div>
                            </div>

                            <div className="modern-form-grid">
                                <div className="modern-form-group">
                                    <label><i className="fas fa-phone-alt"></i> Contact Number</label>
                                    <input type="tel" name="contactNumber" placeholder="9876543210"
                                        className={errors.contactNumber ? 'input-error' : ''}
                                        value={formData.contactNumber} onChange={handleChange} onBlur={handleBlur} />
                                    {errors.contactNumber && <span className="error-text"><i className="fas fa-exclamation-circle"></i> {errors.contactNumber}</span>}
                                </div>

                                <div className="modern-form-group">
                                    <label><i className="fas fa-envelope"></i> Email Address</label>
                                    <input type="email" name="email" placeholder="ambulance@hospital.org"
                                        className={errors.email ? 'input-error' : ''}
                                        value={formData.email} onChange={handleChange} onBlur={handleBlur} />
                                    {errors.email && <span className="error-text"><i className="fas fa-exclamation-circle"></i> {errors.email}</span>}
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

