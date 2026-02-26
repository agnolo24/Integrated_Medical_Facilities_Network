
import React, { useState } from 'react';
import './PharmacyForm.css';

const PharmacyForm = () => {
    const [formData, setFormData] = useState({
        pharmacyName: '',
        licenseNumber: '',
        address: '',
        contactNumber: '',
        email: '',
        password: ''
    });

    const [errors, setErrors] = useState({});

    const validateForm = () => {
        let newErrors = {};
        if (formData.pharmacyName.trim().length < 3) newErrors.pharmacyName = "Pharmacy name must be at least 3 characters";
        if (formData.licenseNumber.trim().length < 5) newErrors.licenseNumber = "License number must be at least 5 characters";
        if (!/^\d{10}$/.test(formData.contactNumber)) newErrors.contactNumber = "Contact must be exactly 10 digits";
        if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (errors[e.target.name]) {
            setErrors({ ...errors, [e.target.name]: '' });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        console.log('Form Submitted:', formData);
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card shadow-sm">
                        <div className="card-header bg-primary text-white text-center">
                            <h4>Pharmacy Registration</h4>
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleSubmit}>

                                {/* Pharmacy Name */}
                                <div className="mb-3">
                                    <label className="form-label">Pharmacy Name</label>
                                    <input type="text" name="pharmacyName"
                                        className={`form-control ${errors.pharmacyName ? 'is-invalid' : ''}`}
                                        value={formData.pharmacyName} onChange={handleChange} required />
                                    {errors.pharmacyName && <div className="invalid-feedback">{errors.pharmacyName}</div>}
                                </div>

                                <div className="row">

                                    {/* License Number */}
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">License Number</label>
                                        <input type="text" name="licenseNumber"
                                            className={`form-control ${errors.licenseNumber ? 'is-invalid' : ''}`}
                                            value={formData.licenseNumber} onChange={handleChange} required />
                                        {errors.licenseNumber && <div className="invalid-feedback">{errors.licenseNumber}</div>}
                                    </div>

                                    {/* Address */}
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Address</label>
                                        <input type="text" name="address" className="form-control"
                                            value={formData.address} onChange={handleChange} required />
                                    </div>
                                </div>

                                {/* Contact Number */}
                                <div className="mb-3">
                                    <label className="form-label">Contact Number</label>
                                    <input type="tel" name="contactNumber"
                                        className={`form-control ${errors.contactNumber ? 'is-invalid' : ''}`}
                                        value={formData.contactNumber} onChange={handleChange} required />
                                    {errors.contactNumber && <div className="invalid-feedback">{errors.contactNumber}</div>}
                                </div>

                                {/* Email Address */}
                                <div className="mb-3">
                                    <label className="form-label">Email Address</label>
                                    <input type="email" name="email" className="form-control"
                                        value={formData.email} onChange={handleChange} required />
                                </div>

                                {/* Password */}
                                <div className="mb-3">
                                    <label className="form-label">Password</label>
                                    <input type="password" name="password"
                                        className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                                        value={formData.password} onChange={handleChange} required />
                                    {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                                </div>

                                <button type="submit" className="btn btn-primary w-100 mt-3">Register</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PharmacyForm;
