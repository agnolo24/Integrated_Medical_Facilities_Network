import React, { useEffect, useState } from "react";
import axios from "axios";
import HospitalHeader from "../HospitalHeader/HospitalHeader";
import HospitalFooter from "../HospitalFooter/HospitalFooter";
import "./HospitalHome.css";

function HospitalHome() {
    const [emergencies, setEmergencies] = useState([]);
    const [ambulances, setAmbulances] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedEmergency, setSelectedEmergency] = useState(null);
    const [showDispatchModal, setShowDispatchModal] = useState(false);
    const [hospitalData, setHospitalData] = useState(null);

    const hospitalLoginId = localStorage.getItem("loginId");

    const fetchData = async () => {
        try {
            const hRes = await axios.get(`http://127.0.0.1:8000/hospital/getHospitalData/?login_id=${hospitalLoginId}`);
            setHospitalData(hRes.data);

            const eRes = await axios.get("http://127.0.0.1:8000/hospital/get_pending_emergencies/", {
                params: { hospital_login_id: hospitalLoginId }
            });
            setEmergencies(eRes.data.emergencies);

            const aRes = await axios.get("http://127.0.0.1:8000/hospital/get_available_ambulances/", {
                params: { hospital_login_id: hospitalLoginId }
            });
            setAmbulances(aRes.data.ambulances);
        } catch (error) {
            console.error("Dashboard error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 8000);
        return () => clearInterval(interval);
    }, []);

    const handleDispatchClick = (emergency) => {
        setSelectedEmergency(emergency);
        setShowDispatchModal(true);
    };

    const confirmDispatch = async (ambulanceId) => {
        try {
            await axios.post("http://127.0.0.1:8000/hospital/assign_emergency_to_ambulance/", {
                emergency_id: selectedEmergency._id,
                ambulance_id: ambulanceId
            });
            setShowDispatchModal(false);
            fetchData();
        } catch (error) {
            console.error("Dispatch failed:", error);
        }
    };

    const rejectEmergency = async (id) => {
        if (!window.confirm("Reject this emergency alert?")) return;
        try {
            await axios.post("http://127.0.0.1:8000/hospital/respond_to_emergency/", {
                emergency_id: id,
                action: 'reject'
            });
            fetchData();
        } catch (error) {
            console.error("Rejection error:", error);
        }
    };

    return (
        <div className="hp-dashboard-container">
            <HospitalHeader />

            <main className="hp-main-workspace scrollbar-hide">
                {/* Management Ribbon - Prominent and Visible */}
                {/* <div className="hp-management-ribbon">
                    <div className="hp-ribbon-content">
                        <div className="hp-ribbon-group">
                            <span className="hp-ribbon-label">Fleet & Staff Management</span>
                            <div className="hp-action-chips">
                                <a href="/viewDoctors" className="hp-chip">
                                    <i className="fas fa-user-md"></i> View Doctors
                                </a>
                                <a href="/viewAmbulance" className="hp-chip">
                                    <i className="fas fa-truck-medical"></i> Fleet Management
                                </a>
                                <a href="/scheduleDoctor" className="hp-chip">
                                    <i className="fas fa-calendar-check"></i> Rosters & Schedules
                                </a>
                            </div>
                        </div>
                    </div>
                </div> */}

                {/* Dashboard Header/Stats */}
                <div className="hp-top-stats-row">
                    <div className="hp-main-title">
                        <h1>Emergency Response Monitor</h1>
                        <div className="hp-station-badge">
                            <span className="hp-pulse-dot green"></span>
                            {hospitalData?.hospitalName || "Active Duty Station"}
                        </div>
                    </div>
                    <div className="hp-stats-group">
                        <div className="hp-mini-stat alert">
                            <span className="val">{emergencies.length}</span>
                            <span className="lbl">Active Calls</span>
                        </div>
                        <div className="hp-mini-stat ready">
                            <span className="val">{ambulances.length}</span>
                            <span className="lbl">Ready Fleet</span>
                        </div>
                    </div>
                </div>

                <section className="hp-emergency-list-section">
                    {loading && emergencies.length === 0 ? (
                        <div className="hp-loading-placeholder">
                            <div className="hp-spinner"></div>
                            <p>Connecting to Emergency Core...</p>
                        </div>
                    ) : emergencies.length === 0 ? (
                        <div className="hp-no-emergencies">
                            <div className="hp-safe-icon"><i className="fas fa-shield-virus"></i></div>
                            <h2>Perimeter Secure</h2>
                            <p>No active incidents reported in your sector. System scanning...</p>
                        </div>
                    ) : (
                        <div className="hp-emergencies-wall">
                            {emergencies.map((emerge) => (
                                <div key={emerge._id} className="hp-alert-row-card">
                                    <div className="hp-row-header">
                                        <div className="hp-type-tag">
                                            <div className="hp-pulse-dot red"></div>
                                            {emerge.emergency_type}
                                        </div>
                                        <div className="hp-row-time">
                                            REF: {emerge._id.slice(-6).toUpperCase()} • RECEIVED {new Date(emerge.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>

                                    <div className="hp-row-body">
                                        <div className="hp-body-main">
                                            <div className="hp-patient-info">
                                                <small>Victim / Patient</small>
                                                <strong>{emerge.patient_name || "Guest User"}</strong>
                                            </div>
                                            <div className="hp-location-box">
                                                <i className="fas fa-map-marker-alt"></i>
                                                <div className="coords">
                                                    <span>{emerge.patient_location.lat.toFixed(4)}, {emerge.patient_location.lon.toFixed(4)}</span>
                                                    <small>Pickup Hub</small>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="hp-body-stats">
                                            <div className="hp-dist-stat">
                                                <small>Route Distance</small>
                                                <strong>{emerge.distance_m ? (emerge.distance_m / 1000).toFixed(1) : "0.0"} <span className="u">KM</span></strong>
                                            </div>
                                            <div className="hp-time-stat">
                                                <small>Est. Response</small>
                                                <strong>{emerge.duration_s ? Math.round(emerge.duration_s / 60) : "--"} <span className="u">MIN</span></strong>
                                            </div>
                                        </div>

                                        <div className="hp-row-actions">
                                            <button className="hp-dispatch-btn" onClick={() => handleDispatchClick(emerge)}>
                                                <i className="fas fa-bolt"></i> DISPATCH
                                            </button>
                                            <button className="hp-reject-btn" onClick={() => rejectEmergency(emerge._id)}>
                                                <i className="fas fa-times"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </main>

            {showDispatchModal && (
                <div className="hp-modal-overlay" onClick={() => setShowDispatchModal(false)}>
                    <div className="hp-dispatch-box" onClick={e => e.stopPropagation()}>
                        <div className="hp-box-head">
                            <h3>Select Deployment Unit</h3>
                            <button onClick={() => setShowDispatchModal(false)}><i className="fas fa-times"></i></button>
                        </div>
                        <div className="hp-unit-list">
                            {ambulances.length === 0 ? (
                                <div className="hp-empty-units">
                                    <i className="fas fa-exclamation-triangle"></i>
                                    <p>All fleet units currently engaged. Manual override required.</p>
                                </div>
                            ) : (
                                ambulances.map(amb => (
                                    <div key={amb._id} className="hp-unit-card">
                                        <div className="hp-u-info">
                                            <div className="hp-u-icon"><i className="fas fa-ambulance"></i></div>
                                            <div className="hp-u-details">
                                                <strong>{amb.ambulanceName}</strong>
                                                <small>{amb.vehicleNumber}</small>
                                            </div>
                                        </div>
                                        <button className="hp-go-btn" onClick={() => confirmDispatch(amb._id)}>
                                            DEPLOY
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}

            <HospitalFooter />
        </div>
    );
}

export default HospitalHome;
