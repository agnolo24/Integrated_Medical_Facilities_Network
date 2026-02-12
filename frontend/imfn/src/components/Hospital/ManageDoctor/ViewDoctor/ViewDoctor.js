import React, { useEffect, useState } from 'react';
import axios from 'axios';

import HospitalHeader from '../../HospitalHeader/HospitalHeader';
import HospitalFooter from '../../HospitalFooter/HospitalFooter';
import EditDoctor from '../EditDoctor/EditDoctor';

import './ViewDoctor.css';
import CreateSchedule from '../CreateSchedule/CreateSchedule';

function ViewDoctor() {
    const viewDoctorUrl = "http://127.0.0.1:8000/hospital/view_doctors/"
    const deleteDoctorUrl = "http://127.0.0.1:8000/hospital/delete_doctor/"

    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);

    const [selectedDoctor, setSelectedDoctor] = useState([])
    const [isModalOpen, setIsModalOpen] = useState(false)

    const [selectedDoctorForSchedule, setSelectedDoctorForSchedule] = useState([])
    const [isScheduleOpen, setIsScheduleOpen] = useState(false)

    useEffect(() => {
        getData();
    }, []);

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

    const handleEditClick = (doctor) => {
        setSelectedDoctor(doctor)
        setIsModalOpen(true)
    }

    const handleCloseModel = () => {
        setIsModalOpen(false)
        setSelectedDoctor(null)
        getData()
    }

    const handleDelete = async (doctor) => {
        const res = window.confirm(`Are you sure you want to delete Dr. ${doctor.name}?`)

        if (res) {
            try {
                const hospitalLoginId = localStorage.getItem("loginId");
                await axios.delete(deleteDoctorUrl, {
                    data: {
                        doctorId: doctor._id,
                        hospital_login_id: hospitalLoginId
                    }
                })
                alert("Successfully Deleted Dr. " + doctor.name)
                getData() // Refresh the list
            } catch (error) {
                console.error("Delete error:", error)
                alert(error?.response?.data?.error || "Failed to Delete Dr. " + doctor.name)
            }
        }
    }

    const handleScheduleClick = (doc) => {
        setIsScheduleOpen(true)
        setSelectedDoctorForSchedule(doc)
    }

    const handleScheduleClose = () => {
        setIsScheduleOpen(false)
    }

    return (
        <div className="page-container">
            <HospitalHeader />

            <main className="content-wrapper">
                <header className="view-header">
                    <h1>Our Medical Specialists</h1>
                    <p>Manage and monitor clinical staff across your medical facility.</p>
                </header>

                {loading ? (
                    <div className="loader">
                        <i className="fas fa-spinner fa-spin"></i>
                        <p>Syncing Clinical Records...</p>
                    </div>
                ) : doctors.length > 0 ? (
                    <div className="doctor-grid">
                        {doctors.map((doc) => (
                            <div key={doc._id} className="doctor-card">
                                <div className="card-top-decoration"></div>
                                <div className="card-badge">{doc.specialization}</div>

                                <div className="doctor-card-content">
                                    <div className="doctor-avatar-section">
                                        <div className="doctor-avatar-circle">
                                            <i className="fas fa-user-md"></i>
                                        </div>
                                        <div className="doctor-main-info">
                                            <h3>Dr. {doc.name}</h3>
                                            <p className="qualification">{doc.qualification}</p>
                                        </div>
                                    </div>

                                    <div className="details-grid">
                                        <div className="detail-item">
                                            <i className="fas fa-briefcase-medical"></i>
                                            <span><strong>Experience:</strong> {doc.experience} Years</span>
                                        </div>
                                        <div className="detail-item">
                                            <i className="fas fa-venus-mars"></i>
                                            <span><strong>Gender:</strong> {doc.gender}</span>
                                        </div>
                                        <div className="detail-item">
                                            <i className="fas fa-phone-alt"></i>
                                            <span><strong>Contact:</strong> {doc.contactNumber}</span>
                                        </div>
                                        <div className="detail-item">
                                            <i className="fas fa-envelope-open-text"></i>
                                            <span><strong>Email:</strong> {doc.email}</span>
                                        </div>
                                    </div>

                                    <div className="doctor-actions">
                                        <div className="action-row-main">
                                            <button className="modern-btn edit-btn" onClick={() => handleEditClick(doc)}>
                                                <i className="fas fa-edit"></i> Edit
                                            </button>
                                            <button className="modern-btn delete-btn" onClick={() => handleDelete(doc)}>
                                                <i className="fas fa-trash-alt"></i> Delete
                                            </button>
                                        </div>
                                        <button className="modern-btn schedule-btn" onClick={() => handleScheduleClick(doc)}>
                                            <i className="fas fa-calendar-alt"></i> Manage Schedules
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="no-data">
                        <i className="fas fa-user-slash" style={{ fontSize: '3rem', color: '#cbd5e1', marginBottom: '1rem' }}></i>
                        <p>No specialists found in the network for this facility.</p>
                        <button className="modern-btn schedule-btn" style={{ maxWidth: '200px', margin: '1rem auto' }} onClick={() => window.location.reload()}>
                            Refresh Explorer
                        </button>
                    </div>
                )}
            </main>

            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <button className="close-button" onClick={handleCloseModel}>&times;</button>
                        <div className="modal-inner-scroll">
                            <EditDoctor doctorData={selectedDoctor} onClose={handleCloseModel} />
                        </div>
                    </div>
                </div>
            )}

            {isScheduleOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        {/* <button className="close-button" onClick={handleScheduleClose}>&times;</button> */}
                        <div className="modal-inner-scroll">
                            <CreateSchedule doctor={selectedDoctorForSchedule} onClose={handleScheduleClose} />
                        </div>
                    </div>
                </div>
            )}
            <HospitalFooter />
        </div>
    );
}

export default ViewDoctor;