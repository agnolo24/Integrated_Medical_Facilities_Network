
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import axios from 'axios';
import './HospitalDetailsPage.css';

const HospitalDetailsPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    // Get hospitalLoginId from location state or fallback
    const hospitalLoginId = location.state?.hospitalLoginId;

    useEffect(() => {
        if (hospitalLoginId) {
            fetchDetails();
        } else {
            setLoading(false);
            // navigate('/admin'); // Redirect back if no ID
        }
    }, [hospitalLoginId]);

    const fetchDetails = async () => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/webAdmin/get_hospital_details/`, {
                params: { hospital_login_id: hospitalLoginId }
            });
            setData(response.data);
        } catch (error) {
            console.error("Error fetching details:", error);
            alert("Failed to load details");
        } finally {
            setLoading(false);
        }
    };

    const viewHistory = (doctor) => {
        navigate('/doctorAppointmentHistory', {
            state: {
                doctor: doctor,
                hospitalName: data.hospital.hospitalName
            }
        });
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Loading Hospital Intelligence...</p>
            </div>
        );
    }

    if (!data) return (
        <div className="loading-container">
            <h2>No Hospital Data Found</h2>
            <button className="btn-back" onClick={() => navigate('/admin')}>
                <i className="fas fa-arrow-left"></i> Back to Dashboard
            </button>
        </div>
    );

    const { hospital, doctors, ambulances } = data;

    return (
        <div className="hospital-details-page">
            <div className="page-container">
                <nav className="back-nav">
                    <button className="btn-back" onClick={() => navigate('/admin')}>
                        <i className="fas fa-arrow-left"></i> Back to Dashboard
                    </button>
                </nav>

                <header className="hospital-hero">
                    <div className="hero-main">
                        <div className="hero-badges">
                            <span className="badge badge-verified">
                                <i className="fas fa-check-circle me-1"></i> Verified Partner
                            </span>
                            <span className="badge badge-id">Reg ID: {hospital.registrationId}</span>
                        </div>
                        <h1>{hospital.hospitalName}</h1>
                        <p className="hero-address">
                            <i className="fas fa-map-marker-alt me-2 text-primary"></i>
                            {hospital.hospitalAddress}
                        </p>
                    </div>

                    <div className="contact-info-grid">
                        <div className="contact-item">
                            <label>Primary Contact</label>
                            <span>{hospital.contactNumber}</span>
                        </div>
                        <div className="contact-item">
                            <label>Email ID</label>
                            <span>{hospital.email}</span>
                        </div>
                        <div className="contact-item">
                            <label>Status</label>
                            <span style={{ color: '#10b981' }}>Active</span>
                        </div>
                    </div>
                </header>

                <div className="sections-grid">
                    {/* Doctors Section */}
                    <section className="doctors-section">
                        <div className="section-head">
                            <h2>
                                <i className="fas fa-user-md"></i> Medical Staff
                                <span className="count-pill">{doctors.length} Doctors</span>
                            </h2>
                        </div>

                        <div className="doctors-list">
                            {doctors.length > 0 ? doctors.map(d => (
                                <div key={d._id} className="doctor-card">
                                    <div className="doc-avatar">
                                        <i className="fas fa-user-md"></i>
                                    </div>
                                    <div className="doc-info">
                                        <h3>Dr. {d.name}</h3>
                                        <span className="doc-spec">{d.specialization}</span>
                                        <div className="doc-stats">
                                            <span className="doc-stat">{d.experience}Y Exp</span>
                                            <span className="doc-stat">{d.qualification}</span>
                                        </div>
                                        <button
                                            className="btn-history"
                                            onClick={() => viewHistory(d)}
                                        >
                                            <i className="fas fa-history"></i> Appointment History
                                        </button>
                                    </div>
                                </div>
                            )) : (
                                <p className="empty-text">No doctors registered in this facility.</p>
                            )}
                        </div>
                    </section>

                    {/* Ambulances Section */}
                    <section className="ambulances-section">
                        <div className="section-head">
                            <h2>
                                <i className="fas fa-ambulance"></i> Emergency Response
                                <span className="count-pill">{ambulances.length} Units</span>
                            </h2>
                        </div>

                        <div className="ambulance-grid">
                            {ambulances.length > 0 ? ambulances.map(a => (
                                <div key={a._id} className="ambulance-card">
                                    <span className="amb-type-badge">{a.ambulanceType}</span>
                                    <i className="fas fa-ambulance amb-icon"></i>
                                    <span className="amb-vno">{a.vehicleNumber}</span>
                                    <span className="amb-cat">{a.category}</span>
                                    <div className="amb-contact">
                                        <i className="fas fa-phone"></i> {a.contactNumber}
                                    </div>
                                </div>
                            )) : (
                                <p className="empty-text">No ambulance units assigned.</p>
                            )}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default HospitalDetailsPage;
