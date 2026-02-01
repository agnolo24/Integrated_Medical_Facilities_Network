import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../Hospital/HospitalProfile/HospitalProfile.css';

export default function PharmacyProfile({ onClose }) {
    const [pharmacyData, setPharmacyData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPharmacyData = async () => {
            const loginId = localStorage.getItem("loginId");
            console.log("loginId : ",loginId)
            try {
                const response = await axios.get('http://127.0.0.1:8000/pharmacy/get_pharmacy_data/', {
                    params: { login_id: loginId }
                });
                setPharmacyData(response.data);
            } catch (error) {
                console.error("Error fetching pharmacy data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPharmacyData();
    }, []);

    if (loading) return null; // Or a spinner

    return (
        <div className="profile-overlay" onClick={onClose}>
            <div className="profile-modal" onClick={(e) => e.stopPropagation()}>
                <button className="close-btn" onClick={onClose}>&times;</button>
                <div className="profile-header">
                    <div className="profile-avatar">
                        <i className="fas fa-clinic-medical"></i>
                    </div>
                    <h2>Pharmacy Profile</h2>
                    <p className="profile-role">Registered Pharmacy</p>
                </div>
                <div className="profile-body">
                    <div className="info-group">
                        <label>Email</label>
                        <p>{pharmacyData?.email || "N/A"}</p>
                    </div>
                    <div className="info-group">
                        <label>Associated Hospital</label>
                        <p>{pharmacyData?.hospital_name || "N/A"}</p>
                    </div>
                    <div className="info-group">
                        <label>Hospital Address</label>
                        <p>{pharmacyData?.hospital_address || "N/A"}</p>
                    </div>
                    <div className="info-group">
                        <label>Hospital Contact</label>
                        <p>{pharmacyData?.hospital_contact_number || "N/A"}</p>
                    </div>
                </div>
                <div className="profile-footer">
                    {/* Add Edit or Change Password buttons if needed later */}
                    <button className="edit-btn" onClick={onClose}>Close</button>
                </div>
            </div>
        </div>
    );
}
