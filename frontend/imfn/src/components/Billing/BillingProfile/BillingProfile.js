import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../Hospital/HospitalProfile/HospitalProfile.css';

export default function BillingProfile({ onClose }) {
    const [billingData, setBillingData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBillingData = async () => {
            const loginId = localStorage.getItem("loginId");
            try {
                const response = await axios.get('http://127.0.0.1:8000/billing/get_billing_data/', {
                    params: { login_id: loginId }
                });
                setBillingData(response.data);
            } catch (error) {
                console.error("Error fetching billing data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBillingData();
    }, []);

    if (loading) return null;

    return (
        <div className="profile-overlay" onClick={onClose}>
            <div className="profile-modal" onClick={(e) => e.stopPropagation()}>
                <button className="close-btn" onClick={onClose}>&times;</button>
                <div className="profile-header">
                    <div className="profile-avatar">
                        <i className="fas fa-file-invoice-dollar"></i>
                    </div>
                    <h2>Billing Profile</h2>
                    <p className="profile-role">Billing Department</p>
                </div>
                <div className="profile-body">
                    <div className="info-group">
                        <label>Email</label>
                        <p>{billingData?.email || "N/A"}</p>
                    </div>
                    <div className="info-group">
                        <label>Associated Hospital</label>
                        <p>{billingData?.hospital_name || "N/A"}</p>
                    </div>
                    <div className="info-group">
                        <label>Hospital Address</label>
                        <p>{billingData?.hospital_address || "N/A"}</p>
                    </div>
                    <div className="info-group">
                        <label>Hospital Contact</label>
                        <p>{billingData?.hospital_contact_number || "N/A"}</p>
                    </div>
                </div>
                <div className="profile-footer">
                    <button className="edit-btn" onClick={onClose}>Close</button>
                </div>
            </div>
        </div>
    );
}
