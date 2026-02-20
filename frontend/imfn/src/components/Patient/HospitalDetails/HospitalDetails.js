import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useLocation, useNavigate } from 'react-router'
import PatientHeader from '../PatientHeader/PatientHeader'
import PatientFooter from '../PatientFooter/PatientFooter'
import './HospitalDetails.css'

function HospitalDetails() {
    const location = useLocation()
    const navigate = useNavigate()
    const { hospitalLoginId } = location.state || {}

    const baseUrl = "http://127.0.0.1:8000/patient/"

    const [hospital, setHospital] = useState(null)
    const [departments, setDepartments] = useState([])
    const [doctors, setDoctors] = useState([])
    const [filteredDoctors, setFilteredDoctors] = useState([])
    const [selectedDepartment, setSelectedDepartment] = useState('all')
    const [isLoading, setIsLoading] = useState(true)
    const [isReportModalOpen, setIsReportModalOpen] = useState(false)
    const [reportText, setReportText] = useState('')
    const [isSubmittingReport, setIsSubmittingReport] = useState(false)

    useEffect(() => {
        if (!hospitalLoginId) {
            navigate('/findDoctors')
            return
        }
        fetchHospitalDoctors()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hospitalLoginId])

    useEffect(() => {
        if (selectedDepartment === 'all') {
            setFilteredDoctors(doctors)
        } else {
            setFilteredDoctors(doctors.filter(doc => doc.specialization === selectedDepartment))
        }
    }, [selectedDepartment, doctors])

    const fetchHospitalDoctors = async () => {
        try {
            const response = await axios.get(`${baseUrl}hospital_doctors/?hospital_login_id=${hospitalLoginId}`)
            setHospital(response.data.hospital)
            setDepartments(response.data.departments || [])
            setDoctors(response.data.doctors || [])
            setFilteredDoctors(response.data.doctors || [])
        } catch (error) {
            console.error("Error fetching hospital doctors:", error)
            alert("Failed to load hospital details")
        } finally {
            setIsLoading(false)
        }
    }

    const handleBookAppointment = (doctor) => {
        if (!doctor.has_schedule) {
            return alert("This doctor doesn't have any schedule set up yet. Please try another doctor.")
        }
        navigate('/bookAppointment', {
            state: {
                doctorId: doctor._id,
                hospitalLoginId: hospitalLoginId
            }
        })
    }

    const handleSubmitReport = async (e) => {
        e.preventDefault()
        if (!reportText.trim()) return alert("Please enter a reason for reporting")

        setIsSubmittingReport(true)
        const loginId = localStorage.getItem('loginId')

        try {
            await axios.post(`${baseUrl}submit_report/`, {
                patient_login_id: loginId,
                hospital_login_id: hospitalLoginId,
                report_text: reportText
            })
            alert("Report submitted successfully to the admin. You can track its status in 'My Reports'")
            setIsReportModalOpen(false)
            setReportText('')
        } catch (error) {
            console.error("Error submitting report:", error)
            alert("Failed to submit report. Please try again.")
        } finally {
            setIsSubmittingReport(false)
        }
    }

    if (isLoading) {
        return (
            <div className="hospital-details-page">
                <PatientHeader />
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Loading hospital details...</p>
                </div>
                <PatientFooter />
            </div>
        )
    }

    return (
        <div className="hospital-details-page">
            <PatientHeader />

            <div className="hospital-details-container">
                {/* <button className="back-btn" onClick={() => navigate(-1)}>
                    ← Back to Search
                </button> */}

                {/* Hospital Header */}
                <div className="hospital-header-card">
                    <div className="hospital-icon-large">🏥</div>
                    <div className="hospital-header-content">
                        <h1>{hospital?.name}</h1>
                        <p className="hospital-address">{hospital?.address}</p>
                        <p className="hospital-contact">📞 {hospital?.contact}</p>
                    </div>
                    <div className="hospital-stats">
                        <div className="stat">
                            <span className="stat-number">{doctors.length}</span>
                            <span className="stat-label">Doctors</span>
                        </div>
                        <div className="stat">
                            <span className="stat-number">{departments.length}</span>
                            <span className="stat-label">Departments</span>
                        </div>
                    </div>
                    <div className="hospital-actions-top">
                        <button className="report-hosp-btn" onClick={() => setIsReportModalOpen(true)}>
                            🚩 Report Hospital
                        </button>
                    </div>
                </div>

                {/* Department Filter */}
                <div className="departments-section">
                    <h2>Departments</h2>
                    <div className="department-chips">
                        <button
                            className={`department-chip ${selectedDepartment === 'all' ? 'active' : ''}`}
                            onClick={() => setSelectedDepartment('all')}
                        >
                            All Departments
                        </button>
                        {departments.map((dept, index) => (
                            <button
                                key={index}
                                className={`department-chip ${selectedDepartment === dept ? 'active' : ''}`}
                                onClick={() => setSelectedDepartment(dept)}
                            >
                                {dept}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Doctors Grid */}
                <div className="doctors-section">
                    <h2>
                        {selectedDepartment === 'all'
                            ? 'All Doctors'
                            : `${selectedDepartment} Doctors`}
                        <span className="count">({filteredDoctors.length})</span>
                    </h2>

                    {filteredDoctors.length === 0 ? (
                        <div className="no-doctors">
                            No doctors found in this department.
                        </div>
                    ) : (
                        <div className="doctors-grid">
                            {filteredDoctors.map((doctor) => (
                                <div key={doctor._id} className="doctor-card">
                                    <div className="doctor-card-avatar">
                                        {doctor.name?.charAt(0) || 'D'}
                                    </div>
                                    <div className="doctor-card-info">
                                        <h3>Dr. {doctor.name}</h3>
                                        <p className="doctor-card-spec">{doctor.specialization}</p>
                                        <p className="doctor-card-qual">{doctor.qualification}</p>
                                        <p className="doctor-card-exp">{doctor.experience} years exp.</p>
                                    </div>
                                    <div className="doctor-card-actions">
                                        {doctor.has_schedule ? (
                                            <button
                                                className="book-btn"
                                                onClick={() => handleBookAppointment(doctor)}
                                            >
                                                Book Appointment
                                            </button>
                                        ) : (
                                            <span className="no-schedule-badge">
                                                Schedule Unavailable
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Report Modal */}
            {isReportModalOpen && (
                <div className="report-modal-overlay">
                    <div className="report-modal">
                        <div className="report-modal-header">
                            <h2>Report {hospital?.name}</h2>
                            <button className="close-modal-btn" onClick={() => setIsReportModalOpen(false)}>&times;</button>
                        </div>
                        <form onSubmit={handleSubmitReport}>
                            <p>Please provide a detailed reason for reporting this hospital to the administrator.</p>
                            <textarea
                                value={reportText}
                                onChange={(e) => setReportText(e.target.value)}
                                placeholder="Describe your issue or concern here..."
                                required
                            ></textarea>
                            <div className="modal-footer">
                                <button type="button" className="cancel-btn" onClick={() => setIsReportModalOpen(false)}>Cancel</button>
                                <button type="submit" className="submit-report-btn" disabled={isSubmittingReport}>
                                    {isSubmittingReport ? 'Submitting...' : 'Submit Report'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <PatientFooter />
        </div>
    )
}


export default HospitalDetails
