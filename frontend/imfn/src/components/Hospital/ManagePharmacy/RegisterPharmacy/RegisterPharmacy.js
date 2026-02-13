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

    const [isPharmacyExist, setIsPharmacyExist] = useState(false);
    const [loading, setLoading] = useState(true);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const checkPharmacyExist = async () => {
        const url = "http://127.0.0.1:8000/hospital/check_pharmacy_exist/"
        const hospital_login_id = localStorage.getItem("loginId")
        setLoading(true);
        try {
            const response = await axios.get(url, { params: { hospital_login_id: hospital_login_id } })
            setIsPharmacyExist(response.data.isExist)
            console.log(response.data.isExist)
        } catch (error) {
            alert(error?.response?.data?.error || "An Error Occur while Checking")
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

        try {
            const response = await axios.post(url, { ...formData, hospital_login_id })
            alert(response.data.message)
            setFormData({
                email: '',
                password: ''
            })
            checkPharmacyExist(); // Re-check after successful registration
        } catch (error) {
            alert(error?.response?.data?.error || "An Error Occur while Registering")
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

                            <form onSubmit={handleSubmit}>
                                <div className="rp-form-group">
                                    <label className="rp-label">Email Address</label>
                                    <div className="rp-input-wrapper">
                                        <i className="fas fa-envelope"></i>
                                        <input
                                            type="email"
                                            name="email"
                                            className="rp-input"
                                            placeholder="pharmacy@hospital.com"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="rp-form-group">
                                    <label className="rp-label">Password</label>
                                    <div className="rp-input-wrapper">
                                        <i className="fas fa-lock"></i>
                                        <input
                                            type="password"
                                            name="password"
                                            className="rp-input"
                                            placeholder="••••••••"
                                            value={formData.password}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
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
