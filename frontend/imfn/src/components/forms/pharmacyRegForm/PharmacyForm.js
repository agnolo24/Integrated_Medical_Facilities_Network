
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

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
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
                                    <input type="text" name="pharmacyName" className="form-control"
                                        value={formData.pharmacyName} onChange={handleChange} required />
                                </div>

                                <div className="row">

                                    {/* License Number */}
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">License Number</label>
                                        <input type="text" name="licenseNumber" className="form-control"
                                            value={formData.licenseNumber} onChange={handleChange} required />
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
                                    <input type="tel" name="contactNumber" className="form-control"
                                        value={formData.contactNumber} onChange={handleChange} required />
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
                                    <input type="password" name="password" className="form-control"
                                        value={formData.password} onChange={handleChange} required />
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
