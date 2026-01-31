import axios from "axios";
import { useState, useEffect } from "react";
import AmbulanceHeader from "../AmbulanceHeader/AmbulanceHeader";
import AmbulanceFooter from "../AmbulanceFooter/AmbulanceFooter";
import { Phone, MapPin, Navigation, CheckCircle, User, Clock, AlertCircle, Play, List, RefreshCw } from "lucide-react";

function AmbulanceHome() {
    const [duty, setDuty] = useState(null);
    const [emergencies, setEmergencies] = useState([]);
    const [loading, setLoading] = useState(true);

    const loginId = localStorage.getItem("loginId");
    const BASE_URL = "http://127.0.0.1:8000/ambulance";

    useEffect(() => {
        const init = async () => {
            await getDuty();
            await emergencyCall();
            setLoading(false);
        };
        init();

        // const interval = setInterval(emergencyCall, 10000);
        // return () => clearInterval(interval);

    }, []);

    async function emergencyCall() {
        try {
            const response = await axios.get(`${BASE_URL}/get_available_emergencies/`, {
                params: { ambulanceId: loginId },
            });
            setEmergencies(response.data.emergencies || []);
        } catch (error) {
            console.error("Error fetching emergencies:", error);
        }
    }

    async function getDuty() {
        try {
            const response = await axios.get(`${BASE_URL}/get_duty/`, {
                params: { ambulanceId: loginId },
            });
            setDuty(response.data[0] || null);
        } catch (error) {
            console.error("No duty or server error", error);
            setDuty(null);
        } finally {
            setLoading(false);
        }
    }

    async function handleAcceptEmergency(emergencyId) {
        try {
            await axios.post(`${BASE_URL}/accept_emergency_duty/`, {
                emergency_id: emergencyId,
                ambulance_login_id: loginId
            });
            alert("Emergency duty accepted!");
            getDuty();
            emergencyCall();
        } catch (error) {
            const msg = error.response?.data?.error || "Could not accept duty.";
            alert(msg);
        }
    }

    async function acceptDuty(currentDuty) {
        try {
            await axios.put(`${BASE_URL}/accept_duty/`, {
                dutyId: currentDuty._id,
            });
            getDuty();
        } catch (error) {
            console.error("Error accepting duty:", error);
        }
    }

    async function completeDuty(currentDuty) {
        try {
            await axios.put(`${BASE_URL}/complete_duty/`, {
                dutyId: currentDuty._id,
            });
            getDuty();
            emergencyCall();
        } catch (error) {
            console.error("Error completing duty:", error);
        }
    }

    if (loading) {
        return (
            <div className="bg-light min-vh-100 d-flex flex-column">
                <AmbulanceHeader />
                <div className="container flex-grow-1 d-flex justify-content-center align-items-center">
                    <div className="text-center">
                        <div className="spinner-border text-primary mb-3" role="status"></div>
                        <p className="text-muted">Loading your dashboard...</p>
                    </div>
                </div>
                <AmbulanceFooter />
            </div>
        );
    }

    return (
        <div className="bg-light min-vh-100 pb-5">
            <AmbulanceHeader />

            <div className="container py-5">
                <style>{`
                    .pulse-animation {
                        animation: pulse-red 2s infinite;
                    }
                    @keyframes pulse-red {
                        0% { transform: scale(0.98); box-shadow: 0 0 0 0 rgba(220, 53, 69, 0.4); }
                        70% { transform: scale(1); box-shadow: 0 0 0 10px rgba(220, 53, 69, 0); }
                        100% { transform: scale(0.98); box-shadow: 0 0 0 0 rgba(220, 53, 69, 0); }
                    }
                    .scroll-panel {
                        max-height: 800px;
                        overflow-y: auto;
                        padding-right: 10px;
                    }
                    .scroll-panel::-webkit-scrollbar { width: 5px; }
                    .scroll-panel::-webkit-scrollbar-thumb { background: #ccc; border-radius: 5px; }
                    .duty-card {
                        transition: all 0.3s ease;
                    }
                    .duty-card:hover {
                        transform: translateY(-5px);
                        box-shadow: 0 15px 30px rgba(0,0,0,0.1) !important;
                    }
                `}</style>

                <div className="text-center mb-5">
                    <h1 className="fw-bold text-primary">Ambulance Dashboard</h1>
                    <p className="text-muted mb-0">Manage active assignments and live emergency requests</p>
                </div>

                <div className="row justify-content-center">
                    <div className="col-lg-10">
                        <div className="row g-4">
                            {/* ACTIVE DUTY SECTION */}
                            <div className="col-md-6">
                                <h5 className="fw-bold mb-4 d-flex align-items-center gap-2 text-primary">
                                    <AlertCircle size={22} /> Current Assignment
                                </h5>
                                {duty ? (
                                    <div className="card border-0 shadow-sm rounded-4 duty-card overflow-hidden h-100">
                                        <div className="card-body p-4">
                                            <div className="d-flex align-items-center gap-3 mb-4">
                                                <div className="bg-primary text-white p-3 rounded-circle shadow-sm">
                                                    <User size={24} />
                                                </div>
                                                <div className="flex-grow-1">
                                                    <h5 className="mb-0 fw-bold">{duty.patient_name || "N/A"}</h5>
                                                    <small className="text-muted">Contact: {duty.patient_contact || "N/A"}</small>
                                                </div>
                                                <a href={`tel:${duty.patient_contact}`} className="btn btn-primary rounded-circle p-2 shadow-sm">
                                                    <Phone size={20} />
                                                </a>
                                            </div>

                                            <div className="bg-light rounded-4 p-4 mb-4">
                                                <div className="d-flex gap-3 mb-3">
                                                    <MapPin size={20} className="text-danger mt-1" />
                                                    <div>
                                                        <small className="text-muted text-uppercase fw-bold x-small">Pickup From</small>
                                                        <p className="mb-0 fw-semibold">{duty.from_address}</p>
                                                    </div>
                                                </div>
                                                <div className="d-flex gap-3">
                                                    <Navigation size={20} className="text-success mt-1" />
                                                    <div>
                                                        <small className="text-muted text-uppercase fw-bold x-small">Destination</small>
                                                        <p className="mb-0 fw-semibold">{duty.to_address}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="d-grid mt-4">
                                                {duty.status === "accepted" ? (
                                                    <button className="btn btn-success btn-lg py-3 fw-bold rounded-4 shadow-sm" onClick={() => completeDuty(duty)}>
                                                        <CheckCircle className="me-2" /> Mark as Completed
                                                    </button>
                                                ) : (
                                                    <button className="btn btn-primary btn-lg py-3 fw-bold rounded-4 shadow-sm" onClick={() => acceptDuty(duty)}>
                                                        <Navigation className="me-2" /> Start Navigation
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="card border-0 shadow-sm rounded-4 p-5 text-center text-muted border-2 border-dashed h-100 d-flex flex-column justify-content-center">
                                        <Clock size={48} className="mx-auto mb-3 opacity-25" />
                                        <h5 className="fw-bold">No Active Duty</h5>
                                        <p className="small mb-0">Wait for new assignments or accept an emergency.</p>
                                    </div>
                                )}
                            </div>

                            {/* EMERGENCY LIST SECTION */}
                            <div className="col-md-6">
                                <div className="d-flex justify-content-between align-items-center mb-4">
                                    <h5 className="fw-bold mb-0 d-flex align-items-center gap-2 text-danger">
                                        <List size={22} /> Live Emergencies
                                        {emergencies.length > 0 && <span className="badge bg-danger rounded-pill fs-7">{emergencies.length}</span>}
                                    </h5>
                                    <button onClick={emergencyCall} className="btn btn-link btn-sm text-decoration-none d-flex align-items-center gap-1">
                                        <RefreshCw size={14} /> Refresh
                                    </button>
                                </div>

                                <div className="scroll-panel">
                                    {emergencies.length > 0 ? (
                                        emergencies.map((e) => (
                                            <div key={e._id} className="card border-0 shadow-sm rounded-4 mb-3 border-start border-4 border-danger pulse-animation duty-card">
                                                <div className="card-body p-3">
                                                    <div className="d-flex justify-content-between align-items-start mb-2">
                                                        <div>
                                                            <h6 className="fw-bold mb-0">{e.patient_name || "Guest Patient"}</h6>
                                                            <span className="badge bg-danger-subtle text-danger px-2 py-1 mt-1 small text-uppercase" style={{ fontSize: '0.65rem' }}>
                                                                {e.emergency_type}
                                                            </span>
                                                        </div>
                                                        <small className="text-muted">{new Date(e.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</small>
                                                    </div>
                                                    <div className="d-flex align-items-center gap-2 text-muted small mb-3">
                                                        <MapPin size={14} className="text-danger" />
                                                        <span className="text-truncate">Contact: {e.patient_contact}</span>
                                                    </div>

                                                    {e.status === 'ambulance_assigned' && (
                                                        <button
                                                            onClick={() => handleAcceptEmergency(e._id)}
                                                            style={{ 'color': 'white', 'backgroundColor': '#dc3545', 'border': 'none', 'borderRadius': '5px', 'padding': '5px 10px', 'cursor': 'pointer' }}
                                                        >
                                                            <Play size={14} /> Accept Emergency Duty
                                                        </button>
                                                    )}
                                                    {e.status === 'ambulance_accepted' && (
                                                        <div className="alert alert-secondary py-2 mb-0 text-center small fw-bold text-uppercase">
                                                            Mark Finished
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="card border-0 shadow-sm rounded-4 p-5 text-center bg-white border-2 border-dashed h-100 d-flex flex-column justify-content-center">
                                            <AlertCircle size={48} className="mx-auto mb-3 text-muted opacity-25" />
                                            <h6 className="text-muted">No pending emergencies nearby</h6>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <AmbulanceFooter />
        </div>
    );
}

export default AmbulanceHome;
