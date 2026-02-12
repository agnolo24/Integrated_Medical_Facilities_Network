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

    const [emergencyDetails, setEmergencyDetails] = useState(null);

    const fetchEmergencyDetails = async () => {
        try {
            const response = await axios.get("http://127.0.0.1:8000/patient/get_emergency_details/", {
                params: { login_id: localStorage.getItem("loginId") }
            });

            // Only set if we have actual data
            if (response.data && response.data._id) {
                setEmergencyDetails(response.data);
            } else {
                setEmergencyDetails(null);
            }
        } catch (error) {
            console.error("Error fetching emergency details:", error);
        }
    };

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
        getLocation();
        fetchEmergencyDetails();
    }, []);

    // Polling for updates if there's an active emergency
    useEffect(() => {
        let interval;
        // Check if status is NOT finished or rejected
        if (emergencyDetails && !['finished', 'hospital_rejected'].includes(emergencyDetails.status)) {
            interval = setInterval(fetchEmergencyDetails, 5000);
        }
        return () => clearInterval(interval);
    }, [emergencyDetails]);

    const getStatusStep = (status) => {
        switch (status) {
            case 'pending_hospital': return 1;
            case 'hospital_approved': return 2;
            case 'ambulance_assigned': return 3;
            case 'ambulance_accepted': return 4;
            case 'finished': return 5;
            default: return 0;
        }
    };

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
                {/* Live Emergency Tracking Section */}
                {emergencyDetails && !['finished', 'hospital_rejected'].includes(emergencyDetails.status) && (
                    <section className="live-emergency-tracker">
                        <div className="tracker-header">
                            <div className="status-badge-live">
                                <span className="pulse-dot"></span>
                                LIVE EMERGENCY TRACKING
                            </div>
                        </div>

                        <div className="tracker-body">
                            <div className="emergency-info-primary">
                                <h3>{emergencyDetails.emergency_type} Emergency</h3>
                                <p className="status-text">
                                    {emergencyDetails.status === 'pending_hospital' && 'Triage: Notifying nearest hospital...'}
                                    {emergencyDetails.status === 'hospital_approved' && 'Hospital has accepted. Dispatching ambulance...'}
                                    {emergencyDetails.status === 'ambulance_assigned' && 'Ambulance assigned. Waiting for driver...'}
                                    {emergencyDetails.status === 'ambulance_accepted' && 'En Route: Help is on the way!'}
                                </p>
                            </div>

                            <div className="status-progress-track">
                                {[1, 2, 3, 4, 5].map(step => (
                                    <div key={step} className={`step-node ${getStatusStep(emergencyDetails.status) >= step ? 'active' : ''}`}>
                                        <div className="node-circle">
                                            {step === 1 && <i className="fas fa-hospital-alt"></i>}
                                            {step === 2 && <i className="fas fa-check-circle"></i>}
                                            {step === 3 && <i className="fas fa-truck-medical"></i>}
                                            {step === 4 && <i className="fas fa-map-marker-alt"></i>}
                                            {step === 5 && <i className="fas fa-flag-checkered"></i>}
                                        </div>
                                    </div>
                                ))}
                                <div className="progress-bar-fill" style={{ width: `${(getStatusStep(emergencyDetails.status) - 1) * 25}%` }}></div>
                            </div>

                            <div className="details-grid-live">
                                {emergencyDetails.hospital_details && (
                                    <div className="detail-card-live">
                                        <label><i className="fas fa-hospital"></i> Medical Center</label>
                                        <strong>{emergencyDetails.hospital_details.name}</strong>
                                        <span>{emergencyDetails.hospital_details.contact}</span>
                                    </div>
                                )}
                                {emergencyDetails.ambulance_details && (
                                    <div className="detail-card-live">
                                        <label><i className="fas fa-ambulance"></i> Rescue Unit</label>
                                        <strong>{emergencyDetails.ambulance_details.name} ({emergencyDetails.ambulance_details.vehicle_no})</strong>
                                        <span>Line: {emergencyDetails.ambulance_details.contact}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>
                )}

                {/* Emergency Banner - Hide when there is an active emergency */}
                {(!emergencyDetails || ['finished', 'hospital_rejected'].includes(emergencyDetails.status)) && (
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
                )}

                {/* Quick Actions (Functional Buttons) */}
                <div className="section-header" style={{ marginTop: emergencyDetails && !['finished', 'hospital_rejected'].includes(emergencyDetails.status) ? '20px' : '40px' }}>
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
                    <NavLink to="/PatientMedicalHistory" className="action-card">
                        <i className="fas fa-heartbeat" style={{ color: '#ff4b2b' }}></i>
                        <h3>Health Records</h3>
                    </NavLink>
                    {/* <NavLink to="/profile" className="action-card">
                        <i className="fas fa-user-circle" style={{ color: '#9f7aea' }}></i>
                        <h3>My Profile</h3>
                    </NavLink> */}
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
