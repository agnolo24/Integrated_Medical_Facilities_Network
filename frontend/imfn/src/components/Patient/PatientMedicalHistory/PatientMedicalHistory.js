import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './PatientMedicalHistory.css';

import PatientHeader from '../PatientHeader/PatientHeader';
import PatientFooter from '../PatientFooter/PatientFooter';

function PatientMedicalHistory() {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchHistory = async () => {
        setLoading(true);
        const patient_login_id = localStorage.getItem('loginId');
        try {
            const response = await axios.get(`http://127.0.0.1:8000/patient/get_patient_med_history/`, {
                params: { patient_login_id }
            });
            setHistory(response.data);
        } catch (error) {
            console.error("Error fetching medical history:", error);
            setError("Failed to load your medical history. Please try again later.");
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

    if (loading) {
        return (
            <div className="pmh-container">
                <div className="pmh-loading">
                    <div className="pmh-spinner"></div>
                    <h2>Gathering medical records...</h2>
                    <p>Building your comprehensive health history</p>
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
                </div>
            </div>
        );
    }

    return (
        <div>
            <PatientHeader />
            <div className="pmh-container">
                <header className="pmh-header">
                    <div className="pmh-header-content">
                        <h1><i className="fas fa-notes-medical"></i> Medical Wallet</h1>
                        <span className="pmh-header-subtitle">Your personal record of past consultations and treatments</span>
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
                        <h2>No medical records yet</h2>
                        <p>Your history will appear here once you complete your consultations.</p>
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
                                            <h3 className="pmh-section-title"><i className="fas fa-user-md"></i> Healthcare Provider</h3>
                                            <div className="pmh-provider-card">
                                                <p className="pmh-name">Dr. {record.doctor_name}</p>
                                                <p className="pmh-detail"><strong>{record.doctor_specialization}</strong></p>
                                                <p className="pmh-detail"><i className="far fa-envelope"></i> {record.doctor_email}</p>
                                                <p className="pmh-detail"><i className="fas fa-phone-alt"></i> {record.doctor_contact}</p>
                                            </div>
                                        </div>

                                        <div className="pmh-info-section">
                                            <h3 className="pmh-section-title"><i className="fas fa-hospital-alt"></i> Medical Facility</h3>
                                            <div className="pmh-facility-card">
                                                <p className="pmh-name">{record.hospital_name}</p>
                                                <p className="pmh-detail"><i className="fas fa-map-marker-alt"></i> {record.hospital_address}</p>
                                                <p className="pmh-detail"><i className="fas fa-headset"></i> {record.hospital_contact}</p>
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
                                                                Dosage: {med.dose_age} | Quantity: {med.quantity} unit(s)
                                                            </p>
                                                        </div>
                                                        <div className="pmh-med-days">
                                                            {med.days} Days Course
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {record.documents && record.documents.length > 0 && (
                                        <div className="pmh-documents-section">
                                            <h3 className="pmh-section-title"><i className="fas fa-paperclip"></i> Attached Lab Results & Docs</h3>
                                            <div className="pmh-documents-list">
                                                {record.documents.map((doc, index) => (
                                                    <a
                                                        key={index}
                                                        href={`http://127.0.0.1:8000${doc}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="pmh-doc-link"
                                                    >
                                                        <i className="far fa-file-alt"></i>
                                                        Document {index + 1}
                                                    </a>
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
            <PatientFooter />
        </div>
    );
}

export default PatientMedicalHistory;
