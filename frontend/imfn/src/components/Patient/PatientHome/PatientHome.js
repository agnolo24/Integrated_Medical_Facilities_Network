import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { NavLink } from 'react-router';
import PatientHeader from '../PatientHeader/PatientHeader';
import PatientFooter from '../PatientFooter/PatientFooter';
import './PatientHome.css';

export default function PatientHome() {
    const [patientData, setPatientData] = useState(null);

    useEffect(() => {
        const getPatientData = async () => {
            const login_id = localStorage.getItem("loginId");
            try {
                const response = await axios.get("http://127.0.0.1:8000/patient/getPatientData/", { params: { login_id: login_id } });
                setPatientData(response.data);
            } catch (error) {
                console.error("Error fetching patient data:", error);
            }
        };

        getPatientData();
    }, []);

    const handleEmergency = () => {
        alert("Emergency protocols initiated. Searching for nearest hospital and notifying emergency contacts...");
        // In a real app, this would trigger an ambulance request or alert system
    };

    return (
        <div className="patient-dashboard">
            <PatientHeader />

            <main className="dashboard-container">
                {/* Emergency Banner */}
                <section className="emergency-banner" style={{ marginTop: '30px' }}>
                    <div className="emergency-content">
                        <h3><i className="fas fa-exclamation-triangle me-2"></i> Medical Emergency?</h3>
                        <p>Get immediate medical assistance. Our 24/7 emergency response team is ready to help.</p>
                    </div>
                    <button className="emergency-btn" onClick={handleEmergency}>
                        <i className="fas fa-ambulance"></i>
                        EMERGENCY BUTTON
                    </button>
                </section>

                {/* Quick Actions (Functional Buttons) */}
                <div className="section-header" style={{ marginTop: '40px' }}>
                    <h2>Dashboard Actions</h2>
                </div>
                <div className="quick-actions">
                    <NavLink to="/findDoctors" className="action-card">
                        <i className="fas fa-user-md" style={{ color: '#4361ee' }}></i>
                        <h3>Find Doctors</h3>
                    </NavLink>
                    <NavLink to="/viewAppointments" className="action-card">
                        <i className="fas fa-clock" style={{ color: '#48bb78' }}></i>
                        <h3>My Appointments</h3>
                    </NavLink>
                    <NavLink to="/myRecords" className="action-card">
                        <i className="fas fa-heartbeat" style={{ color: '#ff4b2b' }}></i>
                        <h3>Health Records</h3>
                    </NavLink>
                    <NavLink to="/profile" className="action-card">
                        <i className="fas fa-user-circle" style={{ color: '#9f7aea' }}></i>
                        <h3>My Profile</h3>
                    </NavLink>
                </div>
            </main>

            <PatientFooter />
        </div>
    );
}
