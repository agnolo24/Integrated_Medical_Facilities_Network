import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ViewPatientAppointmentDetails.css';

export default function ViewPatientAppointmentDetails({ selectedAppointmentId, closeAppointmentDetails, openCheckHistoryCode }) {
    const [details, setDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDetails = async () => {
            setLoading(true);
            try {
                // Since there is no single-item endpoint, we fetch all and find the match
                // In a production app, we would ask for a specific endpoint
                const URL = "http://127.0.0.1:8000/doctor/get_patient_appointment_details/";
                const login_id = localStorage.getItem("loginId");

                // Fetch ALL appointments (both scheduled and cancelled) to ensure we find it
                // We'll make two requests if needed or just hope 'all' isn't filtered on backend too strictly
                // Based on backend logic:
                // if filterStatus is 'scheduled', query['status'] = 'scheduled'
                // We need to pass no filterStatus to get everything? 
                // Wait, backend logic:
                // if filterStatus == 'scheduled' ... elif filterStatus == 'cancelled' ...
                // If we pass generic string logic, we might miss it.
                // Actually the backend code:
                // if filterStatus == 'scheduled': ... elif ...
                // So if we pass nothing or 'all', it doesn't filter status! Perfect.

                const response = await axios.get(URL, { params: { login_id: login_id, apt_id: selectedAppointmentId } });
                setDetails(response.data);
                // if (response.data && response.data.appointments) {
                //     console.log("hello there");
                //     const match = response.data.appointments.find(apt => apt._id === selectedAppointmentId);
                //     if (match) {
                //         setDetails(match);
                //     } else {
                //         setError("Appointment details not found.");
                //     }
                // } else {
                //     setError("Failed to load appointment data.");
                // }
            } catch (err) {
                console.error("Error fetching details:", err);
                setError("Something went wrong while fetching details.");
            } finally {
                setLoading(false);
            }
        };

        if (selectedAppointmentId) {
            fetchDetails();
        }
    }, [selectedAppointmentId]);

    const formatDate = (dateStr) => {
        if (!dateStr) return 'N/A';
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    };

    if (!selectedAppointmentId) return null;

    return (
        <div className="vpad-overlay" onClick={closeAppointmentDetails}>
            <div className="vpad-modal" onClick={e => e.stopPropagation()}>
                {loading ? (
                    <div className="vpad-loading">
                        <div className="vpad-spinner"></div>
                        <p>Loading Appointment Details...</p>
                    </div>
                ) : error ? (
                    <div className="vpad-error">
                        <i className="fas fa-exclamation-circle" style={{ fontSize: '3rem', marginBottom: '1rem', color: '#e74c3c' }}></i>
                        <p>{error}</p>
                        <button className="vpad-btn vpad-btn-secondary" onClick={closeAppointmentDetails} style={{ marginTop: '1rem' }}>
                            Close
                        </button>
                    </div>
                ) : details ? (
                    <>
                        <div className="vpad-header">
                            <div className="vpad-header-content">
                                <h2>Appointment Details</h2>
                                <span className="vpad-status-pill">
                                    {details.status}
                                </span>
                            </div>
                            <button className="vpad-close-btn" onClick={closeAppointmentDetails}>
                                <i className="fas fa-times"></i>
                            </button>
                        </div>

                        <div className="vpad-body">
                            <div className="vpad-grid">
                                <div className="vpad-section">
                                    <h3><i className="fas fa-user-injured"></i> Patient Information</h3>
                                    <div className="vpad-info-group highlight">
                                        <label>Patient Name</label>
                                        <p>{details.patient_name || "Unknown"}</p>
                                    </div>
                                    <div className="vpad-info-group">
                                        <label>Appointment ID</label>
                                        <p>{details._id}</p>
                                    </div>
                                    <div className="vpad-info-group">
                                        <label>Contact</label>
                                        <p>{details.patient_contact || "N/A"}</p>
                                    </div>
                                    <div className="vpad-info-group">
                                        <label>Age & Gender</label>
                                        <p>{details.patient_age ? `${details.patient_age} Years` : 'N/A'} / {details.patient_gender || 'N/A'}</p>
                                    </div>
                                    {/* <div className="vpad-info-group">
                                        <label>Address</label>
                                        <p>{details.patient_address || "N/A"}</p>
                                    </div> */}
                                </div>

                                <div className="vpad-section">
                                    <h3><i className="far fa-clock"></i> Schedule</h3>
                                    <div className="vpad-info-group">
                                        <label>Date</label>
                                        <p>{formatDate(details.appointment_date)}</p>
                                    </div>
                                    <div className="vpad-info-group">
                                        <label>Time Slot</label>
                                        <p>{details.time_slot}</p>
                                    </div>
                                    <div className="vpad-info-group">
                                        <label>Type</label>
                                        <p>{details.appointment_type}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="vpad-section">
                                <h3><i className="fas fa-file-medical"></i> Medical Context</h3>
                                <div className="vpad-info-group">
                                    <label>Reason for Visit</label>
                                    <div className="vpad-reason-box">
                                        <p>"{details.reason}"</p>
                                    </div>
                                </div>
                            </div>
                            <div className='medical-history'>
                                
                                <button className="medical-history-btn" onClick={() => openCheckHistoryCode(details._id)}>
                                    View Medical History
                                </button>
                            </div>
                        </div>

                        <div className="vpad-footer">
                            <button className="vpad-btn vpad-btn-secondary" onClick={closeAppointmentDetails}>
                                Close
                            </button>
                            {
                                (details.status === 'scheduled' || details.status === 'completed') && (
                                    <button className="vpad-btn vpad-btn-primary" onClick={() => alert('Feature coming soon: Add Prescription')}>
                                        <i className="fas fa-file-prescription"></i> Add Prescription
                                    </button>
                                )
                            }
                        </div>
                    </>
                ) : null}
            </div>
        </div>
    );
}
