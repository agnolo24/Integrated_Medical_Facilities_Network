import axios from 'axios'
import React, { useEffect, useState } from 'react'
import './ViewPatientHistory.css'

function ViewPatientHistory({ selectedAppointmentId, closeHistory }) {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchHistory = async () => {
        setLoading(true);
        const url = 'http://localhost:8000/doctor/get_patient_history/';
        try {
            const response = await axios.get(url, { params: { apt_id: selectedAppointmentId } });
            // The backend returns {"history": [...]}
            if (response.data && response.data.history) {
                setHistory(response.data.history);
            } else {
                setHistory([]);
            }
        } catch (error) {
            console.error("Error fetching history:", error);
            setError("Failed to load patient history. Please try again later.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (selectedAppointmentId) {
            fetchHistory();
        }
    }, [selectedAppointmentId]);

    const formatDate = (dateStr) => {
        if (!dateStr) return 'N/A';
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="vph-overlay" onClick={closeHistory}>
            <div className="vph-modal" onClick={e => e.stopPropagation()}>
                <div className="vph-header">
                    <div className="vph-header-content">
                        <h2><i className="fas fa-history"></i> Medical History</h2>
                        <span className="vph-header-subtitle">Comprehensive patient record and past consultations</span>
                    </div>
                    <button className="vph-close-btn" onClick={closeHistory} title="Close">
                        <i className="fas fa-times"></i>
                    </button>
                </div>

                <div className="vph-body">
                    {loading ? (
                        <div className="vph-loading">
                            <div className="vph-spinner"></div>
                            <p>Loading historical records...</p>
                        </div>
                    ) : error ? (
                        <div className="vph-error">
                            <i className="fas fa-exclamation-triangle" style={{ fontSize: '3rem', color: '#e74c3c' }}></i>
                            <p>{error}</p>
                            <button className="vph-btn-secondary" onClick={fetchHistory} style={{ marginTop: '1rem' }}>
                                Retry
                            </button>
                        </div>
                    ) : history.length === 0 ? (
                        <div className="vph-empty">
                            <i className="fas fa-folder-open" style={{ fontSize: '3rem', marginBottom: '1rem' }}></i>
                            <p>No previous medical records found for this patient.</p>
                        </div>
                    ) : (
                        <div className="vph-history-list">
                            {history.map((item, index) => (
                                <div key={item.appointment_id || index} className="vph-history-item">
                                    <div className="vph-item-header">
                                        <div className="vph-date">
                                            <i className="far fa-calendar-alt"></i> {formatDate(item.appointment_date)}
                                        </div>
                                        <span className={`vph-status-badge vph-status-${item.status}`}>
                                            {item.status}
                                        </span>
                                    </div>

                                    <div className="vph-item-grid">
                                        <div className="vph-info-section">
                                            <h4><i className="fas fa-hospital"></i> Facility</h4>
                                            <p><strong>{item.hospital_name}</strong></p>
                                            <p>{item.hospital_address}</p>
                                            <p><small>{item.hospital_contact}</small></p>
                                        </div>
                                        <div className="vph-info-section">
                                            <h4><i className="fas fa-user-md"></i> Doctor</h4>
                                            <p><strong>{item.doctor_name}</strong></p>
                                            <p>{item.doctor_specialization}</p>
                                            <p><small>{item.doctor_email}</small></p>
                                        </div>
                                    </div>

                                    <div className="vph-content-row">
                                        <div className="vph-info-section">
                                            <h4><i className="fas fa-notes-medical"></i> Reason for Visit</h4>
                                            <div className="vph-reason-text">"{item.reason}"</div>
                                        </div>
                                    </div>

                                    {item.prescription && (
                                        <div className="vph-prescription-box">
                                            <h4><i className="fas fa-file-prescription"></i> Prescription</h4>
                                            <p>{item.prescription.map((med, i) => (
                                                <div key={i} className="vph-med-item">
                                                    <p><strong>{med.medicine_name}</strong></p>
                                                    <p>Dose: {med.dose_age} | Quantity: {med.quantity} | Days: {med.days}</p>
                                                </div>
                                            ))}</p>
                                        </div>
                                    )}

                                    {item.documents && item.documents.length > 0 && (
                                        <div className="vph-content-row">
                                            <h4><i className="fas fa-paperclip"></i> Attached Documents</h4>
                                            <div className="vph-documents-list">
                                                {item.documents.map((doc, dIdx) => (
                                                    <a
                                                        key={dIdx}
                                                        href={`http://localhost:8000${doc}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="vph-doc-link"
                                                    >
                                                        <i className="fas fa-file-alt"></i> Doc {dIdx + 1}
                                                    </a>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="vph-footer">
                    <button className="vph-btn-secondary" onClick={closeHistory}>
                        Close History View
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ViewPatientHistory
