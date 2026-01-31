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
} from "lucide-react";
import "./AmbulanceHome.css";

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
  }, []);

  async function emergencyCall() {
    try {
      const response = await axios.get(
        `${BASE_URL}/get_available_emergencies/`,
        { params: { ambulanceId: loginId } }
      );
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
      setDuty(null);
    }
  }

  async function handleAcceptEmergency(emergencyId) {
    try {
      await axios.post(`${BASE_URL}/accept_emergency_duty/`, {
        emergency_id: emergencyId,
        ambulance_login_id: loginId,
      });
      alert("Emergency accepted!");
      getDuty();
      emergencyCall();
    } catch (error) {
      alert(error.response?.data?.error || "Could not accept emergency.");
    }
  }

  async function handleMarkFinished(emergencyId) {
    try {
      await axios.post(`${BASE_URL}/emergency_finished/`, {
        emergency_id: emergencyId,
        ambulance_login_id: loginId,
      });
      alert("Emergency completed!");
      getDuty();
      emergencyCall();
    } catch (error) {
      alert(error.response?.data?.error || "Could not finish emergency.");
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
      "_self"
    );
  }

  if (loading) {
    return (
      <div className="min-vh-100 d-flex flex-column">
        <AmbulanceHeader />
        <div className="flex-grow-1 d-flex justify-content-center align-items-center">
          <div className="text-center">
            <div className="spinner-border text-primary mb-3" />
            <p className="text-muted">Loading dashboard…</p>
          </div>
        </div>
        <AmbulanceFooter />
      </div>
    );
  }

  return (
    <div className="bg-light min-vh-100">
      <AmbulanceHeader />

      <div className="container py-5">
        <div className="text-center mb-5">
          <h1 className="fw-bold text-primary">🚑 Ambulance Control Panel</h1>
          <p className="text-muted">
            Live emergency requests & active duty management
          </p>
        </div>

        <div className="row g-4 justify-content-center">
          <div className="col-xl-9 col-lg-10">
            <div className="row g-4">
              {/* CURRENT DUTY */}
              <div className="col-md-6">
                <h5 className="fw-bold mb-3 text-primary d-flex gap-2">
                  <AlertCircle /> Current Assignment
                </h5>

                {duty ? (
                  <div className="card shadow-sm rounded-4 duty-card h-100">
                    <div className="card-body p-4">
                      <div className="d-flex align-items-center gap-3 mb-4">
                        <div className="bg-primary text-white p-3 rounded-circle">
                          <User />
                        </div>
                        <div className="flex-grow-1">
                          <h6 className="fw-bold mb-0">
                            {duty.patient_name}
                          </h6>
                          <small className="text-muted">
                            {duty.patient_contact}
                          </small>
                        </div>
                        <a
                          href={`tel:${duty.patient_contact}`}
                          className="btn btn-outline-primary rounded-circle"
                        >
                          <Phone size={18} />
                        </a>
                      </div>

                      <div className="bg-light rounded-4 p-3 mb-4">
                        <p className="mb-2">
                          <MapPin className="text-danger me-2" />
                          {duty.from_address}
                        </p>
                        <p className="mb-0">
                          <Navigation className="text-success me-2" />
                          {duty.to_address}
                        </p>
                      </div>

                      <button
                        className={`btn btn-lg w-100 ${
                          duty.status === "accepted"
                            ? "btn-success"
                            : "btn-primary"
                        }`}
                        onClick={() =>
                          duty.status === "accepted"
                            ? completeDuty(duty)
                            : acceptDuty(duty)
                        }
                      >
                        {duty.status === "accepted" ? (
                          <>
                            <CheckCircle className="me-2" />
                            Complete Duty
                          </>
                        ) : (
                          <>
                            <Navigation className="me-2" />
                            Start Navigation
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="card text-center p-5 rounded-4 shadow-sm">
                    <Clock size={42} className="mx-auto mb-3 text-muted" />
                    <h6>No Active Duty</h6>
                    <p className="text-muted small">
                      Waiting for emergency assignment
                    </p>
                  </div>
                )}
              </div>

              {/* EMERGENCIES */}
              <div className="col-md-6">
                <div className="d-flex justify-content-between mb-3">
                  <h5 className="fw-bold text-danger d-flex gap-2">
                    <List /> Live Emergencies
                  </h5>
                  <button
                    className="btn btn-sm btn-outline-secondary"
                    onClick={emergencyCall}
                  >
                    <RefreshCw size={14} /> Refresh
                  </button>
                </div>

                <div className="scroll-panel">
                  {emergencies.length ? (
                    emergencies.map((e) => (
                      <div
                        key={e._id}
                        className="card mb-3 shadow-sm rounded-4 pulse"
                      >
                        <div className="card-body">
                          <h6 className="fw-bold mb-1">
                            {e.patient_name || "Guest Patient"}
                          </h6>
                          <small className="text-muted">
                            {e.emergency_type}
                          </small>

                          <p className="small mt-2 mb-2">
                            📞 {e.patient_contact}
                          </p>

                          {e.status === "ambulance_assigned" && (
                            <button
                              className="btn btn-danger btn-sm w-100"
                              onClick={() =>
                                handleAcceptEmergency(e._id)
                              }
                            >
                              <Play size={14} /> Accept Emergency
                            </button>
                          )}

                          {e.status === "ambulance_accepted" && (
                            <button
                              className="btn btn-primary btn-sm w-100"
                              onClick={() =>
                                handleMarkFinished(e._id)
                              }
                            >
                              <CheckCircle size={14} /> Mark Finished
                            </button>
                          )}

                          <button
                            className="btn btn-outline-secondary btn-sm w-100 mt-2"
                            onClick={() => googleMap(e)}
                          >
                            <Navigation size={14} /> Open in Google Maps
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="card p-5 text-center rounded-4 shadow-sm">
                      <AlertCircle size={40} className="mx-auto mb-3" />
                      <p className="text-muted">
                        No active emergencies
                      </p>
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
