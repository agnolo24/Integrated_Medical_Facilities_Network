import React, { useState, useEffect } from 'react';
import axios from 'axios';

const HistoryDetailsModal = ({ isOpen, onClose, billId }) => {
    const [details, setDetails] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isOpen && billId) {
            fetchDetails();
        }
    }, [isOpen, billId]);

    const fetchDetails = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://127.0.0.1:8000/pharmacy/get_bill_history_details/', {
                params: { bill_id: billId }
            });
            setDetails(response.data);
        } catch (error) {
            console.error("Error fetching history details:", error);
        } finally {
            setLoading(false);
        }
    };

    const renderPrescription = (data) => {
        if (!data || data === "N/A" || (Array.isArray(data) && data.length === 0)) {
            return <p className="text-muted italic">No prescription available</p>;
        }

        if (typeof data === 'string') {
            return <p>{data}</p>;
        }

        if (Array.isArray(data)) {
            return (
                <ul className="list-unstyled">
                    {data.map((item, index) => (
                        <li key={index} className="mb-2 p-2 bg-white border rounded shadow-sm">
                            <div className="d-flex justify-content-between">
                                <span className="font-weight-bold">{item.medicine_name}</span>
                                <span className="badge badge-info">{item.quantity} Qty</span>
                            </div>
                            <div className="small text-muted mt-1">
                                <span className="mr-3"><i className="far fa-clock mr-1"></i> {item.dose_age}</span>
                                <span><i className="far fa-calendar-alt mr-1"></i> {item.days} Day(s)</span>
                            </div>
                        </li>
                    ))}
                </ul>
            );
        }

        return <pre className="small bg-white p-2 border">{JSON.stringify(data, null, 2)}</pre>;
    };

    if (!isOpen) return null;

    return (
        <div className="mi-modal-backdrop" style={{ zIndex: 1100 }}>
            <div className="mi-modal-content bill-view" style={{ maxWidth: '700px' }}>
                <div className="mi-modal-top">
                    <h3>Billing Record Details</h3>
                    <button className="mi-action-icon" onClick={onClose}>
                        <i className="fas fa-times"></i>
                    </button>
                </div>

                <div className="mi-bill-scroll" style={{ padding: '20px' }}>
                    {loading ? (
                        <div className="text-center py-5">
                            <div className="spinner-border text-primary" role="status"></div>
                            <p className="mt-2">Loading details...</p>
                        </div>
                    ) : details ? (
                        <div className="mi-bill-document">
                            <div className="row mb-4">
                                <div className="col-md-6">
                                    <label className="text-muted small text-uppercase font-weight-bold">Patient Information</label>
                                    <h5 className="mb-0">{details.patient_name}</h5>
                                    <p className="text-muted mb-0">{details.patient_contact}</p>
                                </div>
                                <div className="col-md-6 text-right">
                                    <label className="text-muted small text-uppercase font-weight-bold">Billing ID</label>
                                    <h5 className="mb-0 text-primary">#{details.bill_id.slice(-8).toUpperCase()}</h5>
                                    <p className="text-muted mb-0">{details.billing_date} {details.billing_time}</p>
                                </div>
                            </div>

                            <hr />

                            <div className="mb-4">
                                <label className="text-muted small text-uppercase font-weight-bold">Medical Context</label>
                                <div className="bg-light p-3 rounded">
                                    <p className="mb-2"><strong>Doctor:</strong> Dr. {details.doctor_name}</p>
                                    <div className="prescription-display">
                                        <p className="mb-1"><strong>Prescription:</strong></p>
                                        {renderPrescription(details.prescription)}
                                    </div>
                                </div>
                            </div>

                            <label className="text-muted small text-uppercase font-weight-bold">Dispensed Medicines</label>
                            <table className="table table-sm mi-bill-table">
                                <thead>
                                    <tr>
                                        <th>Medicine Name</th>
                                        <th className="text-center">Qty</th>
                                        <th className="text-right">Price</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {details.medicines.map((med, idx) => (
                                        <tr key={idx}>
                                            <td>{med.medicine_name}</td>
                                            <td className="text-center">{med.quantity}</td>
                                            <td className="text-right">₹{(med.price).toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <th colSpan="2" className="text-right">Total Amount</th>
                                        <th className="text-right text-primary">₹{details.total_amount.toFixed(2)}</th>
                                    </tr>
                                </tfoot>
                            </table>

                            <div className="mt-4 text-center">
                                <span className={`status-badge ${details.status}`}>
                                    Payment Status: {details.status}
                                </span>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-5">
                            <p>Failed to load details.</p>
                        </div>
                    )}
                </div>

                <div className="mi-modal-right-actions p-3 border-top text-right">
                    <button className="mi-outline-btn" onClick={onClose}>Close</button>
                </div>
            </div>
        </div>
    );
};

export default HistoryDetailsModal;
