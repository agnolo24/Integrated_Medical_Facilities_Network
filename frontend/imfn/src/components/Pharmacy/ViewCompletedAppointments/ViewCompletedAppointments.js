import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PharmacyHeader from '../PharmacyHeader/PharmacyHeader';
import PharmacyFooter from '../PharmacyFooter/PharmacyFooter';
import './ViewCompletedAppointments.css';

function ViewCompletedAppointments() {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const pharmacyLoginId = localStorage.getItem("loginId");

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://127.0.0.1:8000/pharmacy/get_completed_appointments/', {
                params: { pharmacy_login_id: pharmacyLoginId }
            });
            setAppointments(response.data.appointments || []);
        } catch (error) {
            console.error("Error fetching appointments:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const renderPrescription = (prescription) => {
        if (!prescription || prescription === "N/A" || (Array.isArray(prescription) && prescription.length === 0)) {
            return <span>No prescription available</span>;
        }

        if (typeof prescription === 'string') {
            return <span>{prescription}</span>;
        }

        if (Array.isArray(prescription)) {
            return (
                <ul className="prescription-list">
                    {prescription.map((item, index) => (
                        <li key={index} className="prescription-item">
                            <div className="medicine-info">
                                <span className="medicine-name">{item.medicine_name}</span>
                                <span className="medicine-qty">{item.quantity} Qty</span>
                            </div>
                            <div className="medicine-details">
                                {item.dose_age} • {item.days} Day(s)
                            </div>
                        </li>
                    ))}
                </ul>
            );
        }

        return <span>{typeof prescription === 'object' ? JSON.stringify(prescription) : prescription}</span>;
    };

    const filteredAppointments = appointments.filter(apt =>
        apt.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.doctor_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="view-appointments-page">
            <PharmacyHeader />

            <main className="appointments-main">
                <div className="container mt-50 mb-50">
                    <div className="page-header mb-30">
                        <h2>Today's Completed Appointments</h2>
                        <p>View prescriptions for patients who completed their visits today.</p>
                    </div>

                    <div className="table-controls mb-30">
                        <div className="search-container">
                            <input
                                type="text"
                                placeholder="Search by patient or doctor..."
                                value={searchTerm}
                                onChange={handleSearch}
                                className="search-input"
                            />
                            <i className="fas fa-search search-icon"></i>
                        </div>
                        <button className="btn ss-btn refresh-btn" onClick={fetchAppointments}>
                            <i className="fas fa-sync-alt"></i> Refresh
                        </button>
                    </div>

                    <div className="appointments-table-container">
                        <table className="table appointments-table">
                            <thead>
                                <tr>
                                    <th>Patient Name</th>
                                    <th>Doctor Name</th>
                                    <th>Time</th>
                                    <th>Prescription</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan="4" className="text-center">Loading appointments...</td>
                                    </tr>
                                ) : filteredAppointments.length > 0 ? (
                                    filteredAppointments.map((apt) => (
                                        <tr key={apt.appointment_id}>
                                            <td><strong>{apt.patient_name}</strong></td>
                                            <td>{apt.doctor_name}</td>
                                            <td>{apt.time_slot}</td>
                                            <td>
                                                <div className="prescription-box">
                                                    {renderPrescription(apt.prescription)}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="text-center">No completed appointments found for today.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>

            <PharmacyFooter />
        </div>
    );
}

export default ViewCompletedAppointments;
