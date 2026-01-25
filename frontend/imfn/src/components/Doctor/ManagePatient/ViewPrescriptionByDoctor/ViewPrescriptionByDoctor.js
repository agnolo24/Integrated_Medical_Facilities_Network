import React, { useState } from 'react'
import './ViewPrescriptionByDoctor.css'

export default function ViewPrescriptionByDoctor({ selectedAppointmentId, closeViewPrescription }) {

    const [prescription, setPrescription] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleAddRow = () => {
        setPrescription([...prescription, { medicine_name: '', quantity: '', dose_age: '', days: '' }]);
    };

    const handleInputChange = (index, field, value) => {
        const updatedPrescription = [...prescription];
        updatedPrescription[index][field] = value;
        setPrescription(updatedPrescription);
    };

    const handleDeleteRow = (index) => {
        const updatedPrescription = prescription.filter((_, i) => i !== index);
        setPrescription(updatedPrescription);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Submitting Prescription:", {
            appointment_id: selectedAppointmentId,
            medicines: prescription
        });
        alert("Prescription Submitted! (Check Console)");
    };

    return (
        <div className="vpbd-overlay">
            <div className="vpbd-modal">
                <button className="vpbd-close-icon" onClick={closeViewPrescription}>&times;</button>
                <div className="vpbd-header">
                    <h2>View Prescription</h2>
                </div>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>
                    <div className="vpbd-body">
                        <p>Appointment ID: {selectedAppointmentId}</p>

                        {loading && <p>Loading prescription...</p>}
                        {error && <p>Error loading prescription: {error}</p>}

                        <div className="vpbd-table-container">
                            <table className="vpbd-table">
                                <thead>
                                    <tr>
                                        <th>Medicine Name</th>
                                        <th>Quantity</th>
                                        <th>Dose Age</th>
                                        <th>Days</th>
                                        <th style={{ width: '60px' }}>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {prescription.map((med, index) => (
                                        <tr key={index}>
                                            <td>
                                                <input
                                                    type="text"
                                                    className="vpbd-input"
                                                    value={med.medicine_name}
                                                    onChange={(e) => handleInputChange(index, 'medicine_name', e.target.value)}
                                                    placeholder="Medicine Name"
                                                    required
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="text"
                                                    className="vpbd-input"
                                                    value={med.quantity}
                                                    onChange={(e) => handleInputChange(index, 'quantity', e.target.value)}
                                                    placeholder="Qty"
                                                    required
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="text"
                                                    className="vpbd-input"
                                                    value={med.dose_age}
                                                    onChange={(e) => handleInputChange(index, 'dose_age', e.target.value)}
                                                    placeholder="Dose"
                                                    required
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="text"
                                                    className="vpbd-input"
                                                    value={med.days}
                                                    onChange={(e) => handleInputChange(index, 'days', e.target.value)}
                                                    placeholder="Days"
                                                    required
                                                />
                                            </td>
                                            <td style={{ textAlign: 'center' }}>
                                                <button
                                                    type="button"
                                                    className="vpbd-delete-btn"
                                                    onClick={() => handleDeleteRow(index)}
                                                    title="Remove Item"
                                                >
                                                    <i className="fas fa-trash-alt"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div className="vpbd-add-row-container">
                                <button type="button" className="vpbd-add-btn" onClick={handleAddRow}>
                                    <i className="fas fa-plus"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="vpbd-actions">
                        <button type="button" className="vpbd-cancel-btn" onClick={closeViewPrescription}>Cancel</button>
                        <button type="submit" className="vpbd-submit-btn">Submit Prescription</button>
                    </div>
                </form>
            </div>
        </div>
    )
}
