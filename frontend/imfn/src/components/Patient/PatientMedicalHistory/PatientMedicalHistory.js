import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './PatientMedicalHistory.css';
import { useLocation, useNavigate } from 'react-router';
import PatientHeader from '../PatientHeader/PatientHeader';
import PatientFooter from '../PatientFooter/PatientFooter';
import AdminSidebar from '../../admin/AdminDashboard/AdminSidebar';

function PatientMedicalHistory() {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();

    // Check if viewed by admin (passed via location state)
    const adminViewId = location.state?.patient_login_id;
    const isMainAdmin = location.state?.fromAdmin;

    const fetchHistory = async () => {
        setLoading(true);
        const patient_login_id = adminViewId || localStorage.getItem('loginId');
        try {
            const response = await axios.get(`http://127.0.0.1:8000/patient/get_patient_med_history/`, {
                params: { patient_login_id }
            });
            setHistory(response.data);
        } catch (error) {
            console.error("Error fetching medical history:", error);
            setError("Failed to load medical history.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    const formatDate = (dateStr) => {
        if (!dateStr || dateStr === 'N/A') return 'N/A';
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    const handleTabChange = (tab) => {
        navigate('/admin', { state: { activeTab: tab } });
    };

    if (loading) {
        return (
            <div className="pmh-container">
                <div className="pmh-loading">
                    <div className="pmh-spinner"></div>
                    <h2>Gathering medical records...</h2>
                    <p>Building comprehensive health history</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="pmh-container">
                <div className="pmh-error-view text-center">
                    <i className="fas fa-exclamation-circle fa-4x text-red-500 mb-4"></i>
                    <h2>Oops! Something went wrong</h2>
                    <p>{error}</p>
                    <button className="pmh-btn-retry mt-4" onClick={fetchHistory}>Retry</button>
                    {adminViewId && (
                        <button className="pmh-btn-retry mt-2" onClick={() => navigate(-1)} style={{ marginLeft: '10px' }}>Go Back</button>
                    )}
                </div>
            </div>
        );
    }

    const renderContent = () => (
        <div className="pmh-container">
            {adminViewId && (
                <div style={{ marginBottom: '20px' }}>
                    <button onClick={() => navigate(-1)} className="btn-back-medical">
                        <i className="fas fa-arrow-left"></i> Back to Report
                    </button>
                </div>
            )}
            <header className="pmh-header">
                <div className="pmh-header-content">
                    <h1><i className="fas fa-notes-medical"></i> {adminViewId ? "Patient Medical Record" : "Medical Wallet"}</h1>
                    <span className="pmh-header-subtitle">
                        {adminViewId ? `Complete health history for verified records` : "Your personal record of past consultations and treatments"}
                    </span>
                </div>
                <div className="pmh-header-stats">
                    <div className="text-right">
                        <span className="block text-2xl font-bold">{history.length}</span>
                        <span className="text-sm opacity-80 uppercase font-semibold">Total Records</span>
                    </div>
                </div>
            </header>

            {history.length === 0 ? (
                <div className="pmh-empty">
                    <i className="fas fa-folder-open fa-4x text-gray-300 mb-6"></i>
                    <h2>No history found</h2>
                    <p>No verified medical records are currently associated with this profile.</p>
                </div>
            ) : (
                <div className="pmh-history-list">
                    {history.map((record) => (
                        <article key={record.appointment_id} className="pmh-history-item">
                            <div className={`pmh-item-badge-strip pmh-badge-${record.status}`}></div>

                            <div className="pmh-item-header">
                                <div className="pmh-date-box">
                                    <div className="pmh-calendar-icon">
                                        <i className="far fa-calendar-check"></i>
                                    </div>
                                    <div className="pmh-date-info">
                                        <time className="pmh-date">{formatDate(record.appointment_date)}</time>
                                        <span className="pmh-time">{record.time_slot} | {record.appointment_type}</span>
                                    </div>
                                </div>
                                <span className={`pmh-status-badge pmh-status-${record.status}`}>
                                    {record.status}
                                </span>
                            </div>

                            <div className="pmh-item-body">
                                <div className="pmh-info-grid">
                                    <div className="pmh-info-section">
                                        <h3 className="pmh-section-title"><i className="fas fa-user-md"></i> Provider</h3>
                                        <div className="pmh-provider-card">
                                            <p className="pmh-name">Dr. {record.doctor_name}</p>
                                            <p className="pmh-detail"><strong>{record.doctor_specialization}</strong></p>
                                        </div>
                                    </div>

                                    <div className="pmh-info-section">
                                        <h3 className="pmh-section-title"><i className="fas fa-hospital-alt"></i> Facility</h3>
                                        <div className="pmh-facility-card">
                                            <p className="pmh-name">{record.hospital_name}</p>
                                            <p className="pmh-detail"><i className="fas fa-map-marker-alt"></i> {record.hospital_address}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="pmh-reason-section">
                                    <h3 className="pmh-section-title"><i className="fas fa-comment-medical"></i> Visit Summary</h3>
                                    <div className="pmh-reason-box">
                                        "{record.reason}"
                                    </div>
                                </div>

                                {record.prescription && record.prescription.length > 0 && (
                                    <div className="pmh-prescription-section">
                                        <h3 className="pmh-prescription-title"><i className="fas fa-file-prescription"></i> Issued Prescription</h3>
                                        <div className="pmh-medicine-list">
                                            {record.prescription.map((med, index) => (
                                                <div key={index} className="pmh-medicine-item">
                                                    <div className="pmh-med-info">
                                                        <h5>{med.medicine_name}</h5>
                                                        <p className="pmh-med-meta">
                                                            Dosage: {med.dose_age} | Duration: {med.days} days
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </div>
    );

    if (adminViewId) {
        return (
            <div className="admin-container">
                <AdminSidebar
                    activeTab="reports"
                    setActiveTab={handleTabChange}
                    onLogout={handleLogout}
                />
                <main className="admin-main">
                    {renderContent()}
                </main>
            </div>
        );
    }

    return (
        <div>
            <PatientHeader />
            {renderContent()}
            <PatientFooter />
        </div>
    );
}

export default PatientMedicalHistory;
