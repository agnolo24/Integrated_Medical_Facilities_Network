import axios from "axios";
import { useState, useEffect } from "react";
import AmbulanceHeader from "../AmbulanceHeader/AmbulanceHeader";
import AmbulanceFooter from "../AmbulanceFooter/AmbulanceFooter";
import {
  Phone,
  MapPin,
  Navigation,
  CheckCircle,
  User,
  Clock,
  AlertCircle,
  Play,
  List,
  RefreshCw,
  Activity,
  Shield,
  Truck,
  Zap
} from "lucide-react";
import "./AmbulanceHome.css";

function AmbulanceHome() {
  const [duty, setDuty] = useState(null);
  const [emergencies, setEmergencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ambulanceInfo, setAmbulanceInfo] = useState(null);
  const [stats, setStats] = useState({
    active: 0,
    live: 0,
    status: "Available"
  });

  const loginId = localStorage.getItem("loginId");
  const BASE_URL = "http://127.0.0.1:8000/ambulance";

  useEffect(() => {
    const init = async () => {
      await fetchAmbulanceData();
      await getDuty();
      await emergencyCall();
      setLoading(false);
    };
    init();

    // Set up real-time polling
    const interval = setInterval(() => {
      emergencyCall();
      getDuty();
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  async function fetchAmbulanceData() {
    try {
      const response = await axios.get(`${BASE_URL}/getAmbulanceData/`, {
        params: { am_id: loginId }
      });
      setAmbulanceInfo(response.data);
    } catch (error) {
      console.error("Error fetching ambulance data:", error);
    }
  }

  async function emergencyCall() {
    try {
      const response = await axios.get(
        `${BASE_URL}/get_available_emergencies/`,
        { params: { ambulanceId: loginId } }
      );
      const emers = response.data.emergencies || [];
      setEmergencies(emers);
      updateDashboardStats(emers, duty);
    } catch (error) {
      console.error("Error fetching emergencies:", error);
    }
  }

  async function getDuty() {
    try {
      const response = await axios.get(`${BASE_URL}/get_duty/`, {
        params: { ambulanceId: loginId },
      });
      const currentDuty = response.data[0] || null;
      setDuty(currentDuty);
      updateDashboardStats(emergencies, currentDuty);
    } catch (error) {
      setDuty(null);
    }
  }

  const updateDashboardStats = (emers, currentDuty) => {
    const availableRequests = emers.filter(e => e.status === 'ambulance_assigned').length;
    const isBusy = !!currentDuty;

    setStats({
      live: availableRequests,
      active: isBusy ? 1 : 0,
      status: isBusy ? "On Duty" : "Available"
    });
  }

  async function handleAcceptEmergency(emergencyId) {
    try {
      await axios.post(`${BASE_URL}/accept_emergency_duty/`, {
        emergency_id: emergencyId,
        ambulance_login_id: loginId,
      });
      //   alert("Emergency Response Initialized!");
      getDuty();
      emergencyCall();
    } catch (error) {
      alert(error.response?.data?.error || "Dispatch Error!");
    }
  }

  async function handleMarkFinished(emergencyId) {
    try {
      await axios.post(`${BASE_URL}/emergency_finished/`, {
        emergency_id: emergencyId,
        ambulance_login_id: loginId,
      });
      getDuty();
      emergencyCall();
    } catch (error) {
      alert(error.response?.data?.error || "Error closing incident.");
    }
  }

  async function acceptDuty(currentDuty) {
    await axios.put(`${BASE_URL}/accept_duty/`, {
      dutyId: currentDuty._id,
    });
    getDuty();
  }

  async function completeDuty(currentDuty) {
    await axios.put(`${BASE_URL}/complete_duty/`, {
      dutyId: currentDuty._id,
    });
    getDuty();
    emergencyCall();
  }

  function googleMap(e) {
    const { lat, lon } = e.patient_location;
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}&travelmode=driving`,
      "_blank"
    );
  }

  if (loading) {
    return (
      <div className="ah-dashboard-wrapper d-flex flex-column justify-content-center align-items-center">
        <AmbulanceHeader />
        <div style={{ textAlign: 'center', marginTop: '100px' }}>
          <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }} />
          <h5 className="mt-4 text-secondary fw-bold">Connecting to Dispatch System...</h5>
        </div>
      </div>
    );
  }

  return (
    <div className="ah-dashboard-wrapper">
      <AmbulanceHeader />

      <div className="ah-dashboard-content">
        <div className="ah-dashboard-header">
          <h1 className="ah-dashboard-title">Ambulance Hub</h1>
          <p className="ah-dashboard-subtitle">
            Welcome, {ambulanceInfo?.driverName || "Officer"} | Vehicle: {ambulanceInfo?.vehicleNumber || "Dispatch-01"}
          </p>
        </div>

        <div className="ah-stats-grid">
          {/* <div className="ah-stat-item">
            <div className="ah-stat-icon-box ah-icon-bg-blue">
              <Zap size={28} />
            </div>
            <div className="ah-stat-details">
              <h4>{stats.live}</h4>
              <span>Live Requests</span>
            </div>
          </div>
          <div className="ah-stat-item">
            <div className="ah-stat-icon-box ah-icon-bg-cyan">
              <Shield size={28} />
            </div>
            <div className="ah-stat-details">
              <h4>{stats.active}</h4>
              <span>Workload</span>
            </div>
          </div>*/}
          <div className="ah-stat-item">
            <div className="ah-stat-icon-box ah-icon-bg-emerald">
              <Truck size={28} />
            </div>
            <div className="ah-stat-details">
              <h4 style={{ fontSize: '1.2rem' }}>{ambulanceInfo?.vehicleNumber || "N/A"}</h4>
              <span>Unit ID</span>
            </div>
          </div> 
          <div className="ah-stat-item">
            <div className="ah-stat-icon-box ah-icon-bg-amber">
              <Activity size={28} />
            </div>
            <div className="ah-stat-details">
              <h4 style={{ fontSize: '1.2rem', color: stats.status === "Available" ? "#10b981" : "#f59e0b" }}>{stats.status}</h4>
              <span>Live Status</span>
            </div>
          </div>
        </div>

        <div className="ah-main-layout">
          {/* ASSIGNMENT SECTION */}
          <div className="ah-content-card">
            <div className="ah-card-header">
              <h2 className="ah-card-title">
                <Shield className="text-primary" /> Active Duty
              </h2>
              {duty && <span className="badge bg-primary rounded-pill px-3 py-2">PRIORITY</span>}
            </div>

            {duty ? (
              <div className="ah-priority-box ah-pulse-container">
                <div className="ah-priority-header">
                  <div className="ah-patient-avatar">
                    <User size={32} />
                  </div>
                  <div>
                    <h3 className="mb-0 fw-bold" style={{ color: '#1e293b' }}>{duty.patient_name}</h3>
                    <p className="text-muted small mb-0">Contact: {duty.patient_contact}</p>
                  </div>
                  <a href={`tel:${duty.patient_contact}`} className="ah-button ah-button-outline ms-auto" style={{ padding: '0.75rem' }}>
                    <Phone size={20} />
                  </a>
                </div>

                <div className="ah-location-stack">
                  <div className="ah-location-item">
                    <MapPin size={20} className="text-primary" />
                    <div>
                      <span className="ah-location-label">Pickup Location</span>
                      <span className="ah-location-text">{duty.from_address}</span>
                    </div>
                  </div>
                  <div className="ah-location-item mt-3">
                    <Navigation size={20} className="text-emerald" />
                    <div>
                      <span className="ah-location-label">Destination</span>
                      <span className="ah-location-text">{duty.to_address}</span>
                    </div>
                  </div>
                </div>

                <div className="d-grid gap-3">
                  <button
                    className={`ah-button ${duty.status === "accepted" ? "ah-button-success" : "ah-button-primary"}`}
                    onClick={() => duty.status === "accepted" ? completeDuty(duty) : acceptDuty(duty)}
                  >
                    {duty.status === "accepted" ? (
                      <><CheckCircle size={22} /> Mark as Completed</>
                    ) : (
                      <><Navigation size={22} /> Start This Assignment</>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-5">
                <Clock size={64} className="text-muted mx-auto mb-3 opacity-25" />
                <h5 className="text-secondary fw-bold">No Active Assignment</h5>
                <p className="text-muted">Standing by for next emergency signal...</p>
              </div>
            )}
          </div>

          {/* INCIDENT PANEL */}
          <div className="ah-content-card">
            <div className="ah-card-header">
              <h2 className="ah-card-title">
                <List className="text-primary" /> Incident Pool
              </h2>
              <button className="ah-button-sync" onClick={emergencyCall}>
                <RefreshCw size={20} />
              </button>
            </div>

            <div className="ah-list-scroll">
              {emergencies.length > 0 ? (
                emergencies.map((e) => (
                  <div key={e._id} className="ah-list-item">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <div>
                        <h5 className="fw-bold mb-1" style={{ color: '#334155' }}>{e.patient_name || "Emergency Call"}</h5>
                        <span className="badge bg-light text-primary border border-primary-subtle" style={{ fontSize: '0.7rem' }}>
                          {e.emergency_type?.toUpperCase() || "MEDICAL"}
                        </span>
                      </div>
                      <span className="text-muted small">📞 {e.patient_contact}</span>
                    </div>

                    <div className="d-grid gap-2">
                      {e.status === "ambulance_assigned" && (
                        <button className="ah-button ah-button-primary" style={{ padding: '0.65rem', fontSize: '0.9rem' }} onClick={() => handleAcceptEmergency(e._id)}>
                          <Play size={16} /> Respond
                        </button>
                      )}
                      {e.status === "ambulance_accepted" && (
                        <button className="ah-button ah-button-success" style={{ padding: '0.65rem', fontSize: '0.9rem' }} onClick={() => handleMarkFinished(e._id)}>
                          <CheckCircle size={16} /> Resolve
                        </button>
                      )}
                      <button className="ah-button ah-button-outline" style={{ padding: '0.65rem', fontSize: '0.9rem' }} onClick={() => googleMap(e)}>
                        <Zap size={16} /> Route Map
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-5 mt-4">
                  <Shield size={56} className="text-muted mx-auto mb-3 opacity-25" />
                  <p className="text-secondary fw-bold">Sector Clear</p>
                  <p className="text-muted small">No pending emergency calls.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <AmbulanceFooter />
    </div>
  );
}

export default AmbulanceHome;
