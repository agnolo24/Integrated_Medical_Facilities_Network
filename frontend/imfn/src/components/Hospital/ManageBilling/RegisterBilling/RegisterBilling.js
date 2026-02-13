import React, { useEffect, useState } from 'react';
import HospitalHeader from '../../HospitalHeader/HospitalHeader';
import HospitalFooter from '../../HospitalFooter/HospitalFooter';
import './RegisterBilling.css';
import axios from 'axios';

export default function RegisterBilling({ hideHeaderFooter = false }) {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const [isBillingExist, setIsBillingExist] = useState(false);
    const [loading, setLoading] = useState(true);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const checkBillingExist = async () => {
        const url = "http://127.0.0.1:8000/hospital/check_billing_exist/"
        const hospital_login_id = localStorage.getItem("loginId")
        setLoading(true);
        try {
            const response = await axios.get(url, { params: { hospital_login_id: hospital_login_id } })
            setIsBillingExist(response.data.isExist)
        } catch (error) {
            alert(error?.response?.data?.error || "An Error Occur while Checking")
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        checkBillingExist()
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = "http://127.0.0.1:8000/hospital/register_billing/"
        const hospital_login_id = localStorage.getItem("loginId")

        try {
            const response = await axios.post(url, { ...formData, hospital_login_id })
            alert(response.data.message)
            setFormData({
                email: '',
                password: ''
            })
            checkBillingExist(); // Re-check after successful registration
        } catch (error) {
            alert(error?.response?.data?.error || "An Error Occur while Registering")
        }
    };

    return (
        <div style={{ minHeight: hideHeaderFooter ? 'auto' : '100vh', display: 'flex', flexDirection: 'column' }}>
            {!hideHeaderFooter && <HospitalHeader />}

            <main className="rb-container">
                <div className="rb-form-card">
                    {loading ? (
                        <div className="rb-loading">
                            <div className="rb-spinner"></div>
                            <p>Checking billing status...</p>
                        </div>
                    ) : isBillingExist ? (
                        <div className="rb-exist-card">
                            <div className="rb-exist-icon">
                                <i className="fas fa-check-circle"></i>
                            </div>
                            <h2>Billing Department Registered</h2>
                            <p>Your hospital already has a registered billing department. You can manage invoices and payments through the billing dashboard.</p>
                            <a href="/viewBilling" className="rb-btn-view">
                                Manage Billing
                            </a>
                        </div>
                    ) : (
                        <>
                            <div className="rb-header">
                                <h2>Billing Registration</h2>
                                <p>Enter email and password to register a new billing department</p>
                            </div>

                            <form onSubmit={handleSubmit}>
                                <div className="rb-form-group">
                                    <label className="rb-label">Email Address</label>
                                    <div className="rb-input-wrapper">
                                        <i className="fas fa-envelope"></i>
                                        <input
                                            type="email"
                                            name="email"
                                            className="rb-input"
                                            placeholder="billing@hospital.com"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="rb-form-group">
                                    <label className="rb-label">Password</label>
                                    <div className="rb-input-wrapper">
                                        <i className="fas fa-lock"></i>
                                        <input
                                            type="password"
                                            name="password"
                                            className="rb-input"
                                            placeholder="••••••••"
                                            value={formData.password}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>

                                <button type="submit" className="rb-submit-btn">
                                    Register Billing
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
