import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PrescriptionToggle = ({ appointmentId }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [prescription, setPrescription] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleOpenModal = async () => {
        setIsModalOpen(true);
        if (!prescription && !loading) {
            setLoading(true);
            setError(null);
            try {
                const response = await axios.get('http://127.0.0.1:8000/pharmacy/get_prescription/', {
                    params: { appointment_id: appointmentId }
                });
                setPrescription(response.data.prescription);
            } catch (err) {
                console.error("Error fetching prescription:", err);
                setError("Failed to load prescription.");
            } finally {
                setLoading(false);
            }
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    // Close modal on Escape key
    useEffect(() => {
        const handleEsc = (event) => {
            if (event.keyCode === 27) handleCloseModal();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, []);

    const renderPrescriptionContent = (data) => {
        if (!data || data === "N/A" || (Array.isArray(data) && data.length === 0)) {
            return (
                <div className="no-prescription-notice">
                    <i className="fas fa-file-medical-alt mb-2"></i>
                    <p>No prescription details available for this appointment.</p>
                </div>
            );
        }

        if (typeof data === 'string') {
            return <p className="prescription-text-content">{data}</p>;
        }

        if (Array.isArray(data)) {
            return (
                <ul className="prescription-modal-list">
                    {data.map((item, index) => (
                        <li key={index} className="prescription-modal-item">
                            <div className="med-header">
                                <span className="med-name">{item.medicine_name}</span>
                                <span className="med-qty">{item.quantity} Qty</span>
                            </div>
                            <div className="med-footer">
                                <span className="med-dose"><i className="far fa-clock"></i> {item.dose_age}</span>
                                <span className="med-days"><i className="far fa-calendar-alt"></i> {item.days} Day(s)</span>
                            </div>
                        </li>
                    ))}
                </ul>
            );
        }

        return <pre className="raw-json">{JSON.stringify(data, null, 2)}</pre>;
    };

    return (
        <div className="prescription-modal-container">
            <button
                className="btn check-prescription-btn"
                onClick={handleOpenModal}
                title="View Prescription Details"
            >
                <i className="fas fa-file-prescription"></i> Check Prescription
            </button>

            {isModalOpen && (
                <div className="prescription-modal-overlay" onClick={handleCloseModal}>
                    <div className="prescription-modal-card" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header-premium">
                            <h3><i className="fas fa-prescription"></i> Prescription Details</h3>
                            <button className="close-btn-minimal" onClick={handleCloseModal}>
                                <i className="fas fa-times"></i>
                            </button>
                        </div>

                        <div className="modal-body-premium">
                            {loading ? (
                                <div className="modal-loader">
                                    <div className="spinner-premium"></div>
                                    <p>Retrieving prescription details...</p>
                                </div>
                            ) : error ? (
                                <div className="modal-error">
                                    <i className="fas fa-exclamation-triangle"></i>
                                    <p>{error}</p>
                                    <button className="btn ss-btn btn-sm mt-2" onClick={handleOpenModal}>Retry</button>
                                </div>
                            ) : (
                                renderPrescriptionContent(prescription)
                            )}
                        </div>

                        <div className="modal-footer-premium">
                            <button className="btn ss-btn close-action-btn" onClick={handleCloseModal}>
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PrescriptionToggle;
