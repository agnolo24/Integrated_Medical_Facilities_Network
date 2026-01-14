import React, { useEffect, useState } from 'react';
import axios from 'axios';
import HospitalHeader from '../../HospitalHeader/HospitalHeader';
import HospitalFooter from '../../HospitalFooter/HospitalFooter';
import './ViewDoctor.css'; // We will create this file below

function ViewDoctor() {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const viewDoctorUrl = "http://127.0.0.1:8000/hospital/view_doctors/";

    useEffect(() => {
        const getData = async () => {
            try {
                const hospitalLoginId = localStorage.getItem("loginId");
                const response = await axios.get(viewDoctorUrl, {
                    params: { hospitalLoginId: hospitalLoginId }
                });
                
                setDoctors(response.data.doctors);
            } catch (error) {
                console.error("Error fetching doctors:", error);
            } finally {
                setLoading(false);
            }
        };
        getData();
    }, []);

    return (
        <div className="page-container">
            <HospitalHeader />
            
            <main className="content-wrapper">
                <header className="view-header">
                    <h1>Our Medical Specialists</h1>
                    <p>Manage and view all registered doctors for this facility.</p>
                </header>

                {loading ? (
                    <div className="loader">Loading Doctors...</div>
                ) : doctors.length > 0 ? (
                    <div className="doctor-grid">
                        {doctors.map((doc) => (
                            <div key={doc._id} className="doctor-card">
                                <div className="card-badge">{doc.specialization}</div>
                                <div className="doctor-info">
                                    <h3>Dr. {doc.name}</h3>
                                    <p className="qualification">{doc.qualification}</p>
                                    <div className="details">
                                        <span><strong>Experience:</strong> {doc.experience} Years</span>
                                        <span><strong>Gender:</strong> {doc.gender}</span>
                                        <span><strong>Contact:</strong> {doc.contactNumber}</span>
                                        <span><strong>Email:</strong> {doc.email}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="no-data">No doctors found for this hospital.</div>
                )}
            </main>

            <HospitalFooter />
        </div>
    );
}

export default ViewDoctor;