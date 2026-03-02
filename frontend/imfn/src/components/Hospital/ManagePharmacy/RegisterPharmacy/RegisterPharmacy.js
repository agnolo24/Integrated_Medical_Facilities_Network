import React, { useEffect, useState } from 'react';
import HospitalHeader from '../../HospitalHeader/HospitalHeader';
import HospitalFooter from '../../HospitalFooter/HospitalFooter';
import './RegisterPharmacy.css';
import axios from 'axios';

export default function RegisterPharmacy({ hideHeaderFooter = false }) {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const [errors, setErrors] = useState({});
    const [isPharmacyExist, setIsPharmacyExist] = useState(false);
    const [loading, setLoading] = useState(true);

    const validate = (name, value) => {
        let error = '';
        switch (name) {
            case 'email':
                if (!value) error = 'Pharmacy email is required';
                else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = 'Please enter a valid email address';
                break;
            case 'password':
                if (!value) error = 'Password is required';
                else if (value.length < 8) error = 'Password must be at least 8 characters long';
                else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(value))
                    error = 'Include uppercase, lowercase, number, and special character';
                break;
            default:
                break;
        }
        return error;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        const error = validate(name, value);
        setErrors({ ...errors, [name]: error });
    };

    const checkPharmacyExist = async () => {
        const url = "http://127.0.0.1:8000/hospital/check_pharmacy_exist/"
        const hospital_login_id = localStorage.getItem("loginId")
        setLoading(true);
        try {
            const response = await axios.get(url, { params: { hospital_login_id: hospital_login_id } })
            setIsPharmacyExist(response.data.isExist)
        } catch (error) {
            alert(error?.response?.data?.error || "An Error Occurred while Checking")
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        checkPharmacyExist()
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = "http://127.0.0.1:8000/hospital/register_pharmacy/"
        const hospital_login_id = localStorage.getItem("loginId")

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
            const response = await axios.post(url, { ...formData, hospital_login_id })
            alert(response.data.message)
            setFormData({
                email: '',
                password: ''
            })
            setErrors({});
            checkPharmacyExist(); // Re-check after successful registration
        } catch (error) {
            alert(error?.response?.data?.error || "An Error Occurred while Registering")
        }
    };

    return (
        <div style={{ minHeight: hideHeaderFooter ? 'auto' : '100vh', display: 'flex', flexDirection: 'column' }}>
            {!hideHeaderFooter && <HospitalHeader />}

            <main className="rp-container">
                <div className="rp-form-card">
                    {loading ? (
                        <div className="rp-loading">
                            <div className="rp-spinner"></div>
                            <p>Checking pharmacy status...</p>
                        </div>
                    ) : isPharmacyExist ? (
                        <div className="rp-exist-card">
                            <div className="rp-exist-icon">
                                <i className="fas fa-check-circle"></i>
                            </div>
                            <h2>Pharmacy Already Registered</h2>
                            <p>Your hospital already has a registered pharmacy. You can manage medications and prescriptions through the pharmacy dashboard.</p>
                            <a href="/viewPharmacy" className="rp-btn-view">
                                Manage Pharmacy
                            </a>
                        </div>
                    ) : (
                        <>
                            <div className="rp-header">
                                <h2>Pharmacy Registration</h2>
                                <p>Enter email and password to register a new pharmacy</p>
                            </div>

                            <form onSubmit={handleSubmit} noValidate>
                                <div className="rp-form-group">
                                    <label className="rp-label">Email Address</label>
                                    <div className="rp-input-wrapper">
                                        <i className={`fas fa-envelope ${errors.email ? 'text-red-500' : ''}`}></i>
                                        <input
                                            type="email"
                                            name="email"
                                            className={`rp-input ${errors.email ? 'input-error' : ''}`}
                                            placeholder="pharmacy@hospital.com"
                                            value={formData.email}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        />
                                    </div>
                                    {errors.email && <span className="error-text"><i className="fas fa-exclamation-circle"></i> {errors.email}</span>}
                                </div>

                                <div className="rp-form-group">
                                    <label className="rp-label">Password</label>
                                    <div className="rp-input-wrapper">
                                        <i className={`fas fa-lock ${errors.password ? 'text-red-500' : ''}`}></i>
                                        <input
                                            type="password"
                                            name="password"
                                            className={`rp-input ${errors.password ? 'input-error' : ''}`}
                                            placeholder="••••••••"
                                            value={formData.password}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        />
                                    </div>
                                    {errors.password && <span className="error-text"><i className="fas fa-exclamation-circle"></i> {errors.password}</span>}
                                </div>

                                <button type="submit" className="rp-submit-btn">
                                    Register Pharmacy
                                </button>
                            </form>
                        </>
                    )}
                </div>
            </main>

            {!hideHeaderFooter && <HospitalFooter />}
        </div>
    );
}
