import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router'
import PatientHeader from '../PatientHeader/PatientHeader'
import PatientFooter from '../PatientFooter/PatientFooter'
import './ViewAppointments.css'

function ViewAppointments() {
    const navigate = useNavigate()
    const baseUrl = "http://127.0.0.1:8000/patient/"

    const [appointments, setAppointments] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [activeTab, setActiveTab] = useState('upcoming')
    const [cancellingId, setCancellingId] = useState(null)

    useEffect(() => {
        fetchAppointments()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeTab])

    const fetchAppointments = async () => {
        const patient_login_id = localStorage.getItem("loginId")
        if (!patient_login_id) {
            navigate('/login')
            return
        }

        setIsLoading(true)
        try {
            const response = await axios.get(
                `${baseUrl}appointments/?patient_login_id=${patient_login_id}&time_filter=${activeTab}`
            )
            setAppointments(response.data.appointments || [])
        } catch (error) {
            console.error("Error fetching appointments:", error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleCancelAppointment = async (appointmentId) => {
        if (!window.confirm("Are you sure you want to cancel this appointment?")) return

        const patient_login_id = localStorage.getItem("loginId")
        setCancellingId(appointmentId)

        try {
            await axios.post(`${baseUrl}cancel_appointment/`, {
                appointment_id: appointmentId,
                patient_login_id
            })
            alert("Appointment cancelled successfully")
            fetchAppointments()
        } catch (error) {
            alert(error.response?.data?.error || "Failed to cancel appointment")
        } finally {
            setCancellingId(null)
        }
    }

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'scheduled': return 'status-scheduled'
            case 'completed': return 'status-completed'
            case 'cancelled': return 'status-cancelled'
            default: return ''
        }
    }

    const formatDate = (dateStr) => {
        const date = new Date(dateStr)
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        })
    }

    const isUpcoming = (dateStr) => {
        const appointmentDate = new Date(dateStr)
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        return appointmentDate >= today
    }

    return (
        <div className="view-appointments-page">
            <PatientHeader />

            <div className="appointments-container">
                <div className="appointments-header">
                    <h1>My Appointments</h1>
                    <button
                        className="new-appointment-btn"
                        onClick={() => navigate('/findDoctors')}
                    >
                        + Book New Appointment
                    </button>
                </div>

                {/* Tab Navigation */}
                <div className="tabs-container">
                    <button
                        className={`tab-btn ${activeTab === 'upcoming' ? 'active' : ''}`}
                        onClick={() => setActiveTab('upcoming')}
                    >
                        Upcoming
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'past' ? 'active' : ''}`}
                        onClick={() => setActiveTab('past')}
                    >
                        Past
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
                        onClick={() => setActiveTab('all')}
                    >
                        All
                    </button>
                </div>

                {/* Appointments List */}
                {isLoading ? (
                    <div className="loading-container">
                        <div className="loading-spinner"></div>
                        <p>Loading appointments...</p>
                    </div>
                ) : appointments.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">📅</div>
                        <h2>No Appointments Found</h2>
                        <p>
                            {activeTab === 'upcoming'
                                ? "You don't have any upcoming appointments."
                                : activeTab === 'past'
                                    ? "You don't have any past appointments."
                                    : "You haven't booked any appointments yet."
                            }
                        </p>
                        <button
                            className="find-doctors-btn"
                            onClick={() => navigate('/findDoctors')}
                        >
                            Find Doctors
                        </button>
                    </div>
                ) : (
                    <div className="appointments-list">
                        {appointments.map((appointment) => (
                            <div key={appointment._id} className="appointment-card">
                                <div className="appointment-date-section">
                                    <div className="date-box">
                                        <span className="date-day">
                                            {new Date(appointment.appointment_date).getDate()}
                                        </span>
                                        <span className="date-month">
                                            {new Date(appointment.appointment_date).toLocaleDateString('en-US', { month: 'short' })}
                                        </span>
                                    </div>
                                </div>

                                <div className="appointment-details">
                                    <div className="appointment-header">
                                        <h3>Dr. {appointment.doctor_name}</h3>
                                        <span className={`status-badge ${getStatusBadgeClass(appointment.status)}`}>
                                            {appointment.status}
                                        </span>
                                    </div>
                                    <p className="appointment-hospital">
                                        <span className="icon">🏥</span> {appointment.hospital_name}
                                    </p>
                                    <div className="appointment-meta">
                                        <span className="meta-item">
                                            <span className="icon">🕐</span> {appointment.time_slot}
                                        </span>
                                        <span className="meta-item">
                                            <span className="icon">{appointment.appointment_type === 'online' ? '💻' : '🏥'}</span>
                                            {appointment.appointment_type === 'online' ? 'Online' : 'In-Person'}
                                        </span>
                                    </div>
                                    {appointment.reason && (
                                        <p className="appointment-reason">
                                            <strong>Reason:</strong> {appointment.reason}
                                        </p>
                                    )}
                                </div>

                                <div className="appointment-actions">
                                    {appointment.status === 'scheduled' && isUpcoming(appointment.appointment_date) && (
                                        <button
                                            className="cancel-btn"
                                            onClick={() => handleCancelAppointment(appointment._id)}
                                            disabled={cancellingId === appointment._id}
                                        >
                                            {cancellingId === appointment._id ? 'Cancelling...' : 'Cancel'}
                                        </button>
                                    )}
                                    <button
                                        className="view-btn"
                                        onClick={() => navigate('/bookAppointment', {
                                            state: {
                                                doctorId: appointment.doctor_id
                                            }
                                        })}
                                    >
                                        Book Again
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <PatientFooter />
        </div>
    )
}

export default ViewAppointments
