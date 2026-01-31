import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { NavLink } from 'react-router';
import PatientHeader from '../PatientHeader/PatientHeader';
import PatientFooter from '../PatientFooter/PatientFooter';
import './PatientHome.css';

export default function PatientHome() {
    const [patientData, setPatientData] = useState(null);
    const [location, setLocation] = useState({ lat: null, lon: null });
    const [error, setError] = useState(null);
    const [showEmergencyModal, setShowEmergencyModal] = useState(false);
    const [loading, setLoading] = useState(false);

    const emergencyTypes = [
        { id: 'accident', label: 'Accident / Trauma', icon: 'fa-car-crash', color: '#e53e3e' },
        { id: 'heart', label: 'Heart Related', icon: 'fa-heartbeat', color: '#d53f8c' },
        { id: 'breathing', label: 'Breathing Difficulty', icon: 'fa-lungs', color: '#3182ce' },
        { id: 'pregnancy', label: 'Pregnancy / Labor', icon: 'fa-baby', color: '#805ad5' },
        { id: 'unconscious', label: 'Unconscious', icon: 'fa-user-slash', color: '#718096' },
        { id: 'other', label: 'Other Critical', icon: 'fa-plus-circle', color: '#319795' }
    ];

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
        getLocation(); // Get location on mount to be ready
    }, []);

    const handleEmergencyClick = () => {
        setShowEmergencyModal(true);
    };

    const triggerEmergency = async (type) => {
        setLoading(true);
        setShowEmergencyModal(false);

        // Ensure we have current location
        getLocation();

        try {
            const login_id = localStorage.getItem("loginId");
            const response = await axios.get("http://127.0.0.1:8000/patient/getNearestHospital/", {
                params: {
                    lat: location.lat,
                    lon: location.lon,
                    type: type.label,
                    patient_login_id: login_id
                }
            });
            const { nearest_hospital } = response.data;
            alert(`Emergency protocols initiated for ${type.label}.\n\nNearest Hospital Found: ${nearest_hospital.hospitalName}\nDistance: ${nearest_hospital.distance_km} km\nEstimated Arrival: ${nearest_hospital.estimated_time_mins} mins\n\nWaiting for hospital approval and ambulance dispatch...`);
            console.log(response.data);
        } catch (error) {
            console.error("Emergency trigger error:", error);
            alert("Failed to find nearest hospital. Please call emergency services directly.");
        } finally {
            setLoading(false);
        }
    };

    const getLocation = () => {
        if (!navigator.geolocation) {
            setError("Geolocation is not supported by your browser.");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLocation({
                    lat: position.coords.latitude,
                    lon: position.coords.longitude,
                });
                setError(null);
            },
            (err) => {
                switch (err.code) {
                    case err.PERMISSION_DENIED:
                        setError("Permission denied. Please allow location access.");
                        break;
                    case err.POSITION_UNAVAILABLE:
                        setError("Location information is unavailable.");
                        break;
                    case err.TIMEOUT:
                        setError("Location request timed out.");
                        break;
                    default:
                        setError("An unknown error occurred.");
                }
            }
        );
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
                    <button
                        className={`emergency-btn ${loading ? 'loading' : ''}`}
                        onClick={handleEmergencyClick}
                        disabled={loading}
                    >
                        <i className="fas fa-ambulance"></i>
                        {loading ? 'INITIATING...' : 'EMERGENCY BUTTON'}
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

            {/* Emergency Modal */}
            {showEmergencyModal && (
                <div className="emergency-modal-overlay">
                    <div className="emergency-modal">
                        <div className="modal-header">
                            <h2>Select Emergency Type</h2>
                            <button className="close-btn" onClick={() => setShowEmergencyModal(false)} aria-label="Close">
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                        <div className="modal-body">
                            <p className="modal-subtitle">What is the nature of the emergency? This helps us dispatch the right care.</p>
                            <div className="emergency-type-grid">
                                {emergencyTypes.map((type) => (
                                    <button
                                        key={type.id}
                                        className="emergency-type-card"
                                        onClick={() => triggerEmergency(type)}
                                        style={{ '--accent-color': type.color }}
                                    >
                                        <div className="type-icon">
                                            <i className={`fas ${type.icon}`}></i>
                                        </div>
                                        <span>{type.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <PatientFooter />
        </div>
    );
}
