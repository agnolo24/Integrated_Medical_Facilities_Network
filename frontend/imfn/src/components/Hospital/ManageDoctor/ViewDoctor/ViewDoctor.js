import React, { useEffect, useState } from 'react';
import axios from 'axios';

import HospitalHeader from '../../HospitalHeader/HospitalHeader';
import HospitalFooter from '../../HospitalFooter/HospitalFooter';
import EditDoctor from '../EditDoctor/EditDoctor';

import './ViewDoctor.css';

function ViewDoctor() {
    const viewDoctorUrl = "http://127.0.0.1:8000/hospital/view_doctors/"
    const deleteDoctorUrl = "http://127.0.0.1:8000/hospital/delete_doctor/"

    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);

    const [selectedDoctor, setSelectedDoctor] = useState([])
    const [isModalOpen, setIsModalOpen] = useState(false)

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

    const handleDelete = async(doctor) => {
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
                                {console.log(typeof (doc))}
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
                                    <div className='container'>

                                        <div className='row'>
                                            <div className='button-doc col align-self-center'>
                                                <button className='btn btn-secondary' style={{ 'borderRadius': '25px' }} onClick={() => handleEditClick(doc)}>Edit</button>
                                            </div>
                                            <div className='button-doc col align-self-center'>
                                                <button className='btn btn-warning' style={{ 'borderRadius': '25px' }} onClick={() => handleDelete(doc)}>Delete</button>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="no-data">No doctors found for this hospital.</div>
                )}
            </main>

            {
                isModalOpen && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <button className="close-button" onClick={handleCloseModel}>&times;</button>
                            <EditDoctor doctorData={selectedDoctor} onClose={handleCloseModel} />
                        </div>
                    </div>
                )
            }

            <HospitalFooter />
        </div>
    );
}

export default ViewDoctor;