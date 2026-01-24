import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useLocation, useNavigate } from 'react-router'
import PatientHeader from '../PatientHeader/PatientHeader'
import PatientFooter from '../PatientFooter/PatientFooter'
import './BookAppointment.css'

function BookAppointment() {
    const location = useLocation()
    const navigate = useNavigate()
    const { doctorId, hospitalLoginId } = location.state || {}

    const baseUrl = "http://127.0.0.1:8000/patient/"

    const [doctor, setDoctor] = useState(null)
    const [hospital, setHospital] = useState(null)
    const [schedules, setSchedules] = useState({})
    const [isLoading, setIsLoading] = useState(true)
    const [selectedDate, setSelectedDate] = useState('')
    const [availableSlots, setAvailableSlots] = useState([])
    const [selectedSlot, setSelectedSlot] = useState('')
    const [appointmentType, setAppointmentType] = useState('offline')
    const [reason, setReason] = useState('')
    const [isBooking, setIsBooking] = useState(false)
    const [slotsLoading, setSlotsLoading] = useState(false)
    const [slotsMessage, setSlotsMessage] = useState('')

    // Get today's date for min date
    const today = new Date().toISOString().split('T')[0]

    useEffect(() => {
        if (!doctorId) {
            navigate('/findDoctors')
            return
        }
        fetchDoctorDetails()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [doctorId])

    const fetchDoctorDetails = async () => {
        try {
            const response = await axios.get(`${baseUrl}doctor_details/?doctor_id=${doctorId}`)
            setDoctor(response.data.doctor)
            setHospital(response.data.hospital)
            setSchedules(response.data.schedules)
        } catch (error) {
            console.error("Error fetching doctor details:", error)
            alert("Failed to load doctor details")
        } finally {
            setIsLoading(false)
        }
    }

    const fetchAvailableSlots = async (date) => {
        if (!date) return

        setSlotsLoading(true)
        setSlotsMessage('')
        setAvailableSlots([])
        setSelectedSlot('')

        try {
            const response = await axios.get(`${baseUrl}available_slots/?doctor_id=${doctorId}&date=${date}`)
            setAvailableSlots(response.data.available_slots || [])
            setSlotsMessage(response.data.message || '')
        } catch (error) {
            console.error("Error fetching slots:", error)
            setSlotsMessage("Failed to load available slots")
        } finally {
            setSlotsLoading(false)
        }
    }

    const handleDateChange = (e) => {
        const date = e.target.value
        setSelectedDate(date)
        if (date) {
            fetchAvailableSlots(date)
        }
    }

    const handleBookAppointment = async () => {
        if (!selectedSlot) {
            return alert("Please select a time slot")
        }

        const patient_login_id = localStorage.getItem("loginId")
        if (!patient_login_id) {
            return alert("Please login to book an appointment")
        }

        setIsBooking(true)
        try {
            const response = await axios.post(`${baseUrl}book_appointment/`, {
                patient_login_id,
                doctor_id: doctorId,
                hospital_login_id: hospitalLoginId || doctor?.hospital_login_id,
                appointment_date: selectedDate,
                time_slot: selectedSlot,
                appointment_type: appointmentType,
                reason: reason
            })

            alert(response.data.message || "Appointment booked successfully!")
            navigate('/viewAppointments')
        } catch (error) {
            const errorMsg = error.response?.data?.error || "Failed to book appointment"
            alert(errorMsg)
        } finally {
            setIsBooking(false)
        }
    }

    const getDaySchedule = () => {
        if (!selectedDate) return []
        const date = new Date(selectedDate)
        const dayName = date.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase()
        return schedules[dayName] || []
    }

    if (isLoading) {
        return (
            <div className="book-appointment-page">
                <PatientHeader />
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Loading doctor details...</p>
                </div>
                <PatientFooter />
            </div>
        )
    }

    return (
        <div className="book-appointment-page">
            <PatientHeader />

            <div className="book-appointment-container">
                <button className="back-btn" onClick={() => navigate(-1)}>
                    ← Back
                </button>

                <div className="booking-content">
                    {/* Doctor Info Card */}
                    <div className="doctor-info-card">
                        <div className="doctor-avatar">
                            {doctor?.name?.charAt(0) || 'D'}
                        </div>
                        <div className="doctor-details">
                            <h1>Dr. {doctor?.name}</h1>
                            <p className="specialization">{doctor?.specialization}</p>
                            <p className="qualification">{doctor?.qualification}</p>
                            <p className="experience">{doctor?.experience} years experience</p>
                        </div>
                        <div className="hospital-info">
                            <span className="hospital-icon">🏥</span>
                            <div>
                                <p className="hospital-name">{hospital?.name}</p>
                                <p className="hospital-address">{hospital?.address}</p>
                            </div>
                        </div>
                    </div>

                    {/* Booking Form */}
                    <div className="booking-form-card">
                        <h2>Book Appointment</h2>

                        {/* Appointment Type */}
                        <div className="form-group">
                            <label>Appointment Type</label>
                            <div className="type-toggle">
                                <button
                                    className={`type-btn ${appointmentType === 'offline' ? 'active' : ''}`}
                                    onClick={() => setAppointmentType('offline')}
                                >
                                    <span className="type-icon">🏥</span>
                                    In-Person Visit
                                </button>
                                <button
                                    className={`type-btn ${appointmentType === 'online' ? 'active' : ''}`}
                                    onClick={() => setAppointmentType('online')}
                                >
                                    <span className="type-icon">💻</span>
                                    Online Consultation
                                </button>
                            </div>
                        </div>

                        {/* Date Selection */}
                        <div className="form-group">
                            <label>Select Date</label>
                            <input
                                type="date"
                                className="date-input"
                                value={selectedDate}
                                onChange={handleDateChange}
                                min={today}
                            />
                        </div>

                        {/* Time Slots */}
                        {selectedDate && (
                            <div className="form-group">
                                <label>Available Time Slots</label>
                                {slotsLoading ? (
                                    <div className="slots-loading">Loading slots...</div>
                                ) : availableSlots.length > 0 ? (
                                    <div className="time-slots-grid">
                                        {availableSlots.map((slot, index) => (
                                            <button
                                                key={index}
                                                className={`slot-btn ${selectedSlot === slot ? 'selected' : ''}`}
                                                onClick={() => setSelectedSlot(slot)}
                                            >
                                                {slot}
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="no-slots">
                                        {slotsMessage || "No available slots for this date"}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Reason */}
                        <div className="form-group">
                            <label>Reason for Visit (Optional)</label>
                            <textarea
                                className="reason-input"
                                placeholder="Describe your symptoms or reason for appointment..."
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                rows={3}
                            />
                        </div>

                        {/* Book Button */}
                        <button
                            className="book-btn"
                            onClick={handleBookAppointment}
                            disabled={!selectedSlot || isBooking}
                        >
                            {isBooking ? 'Booking...' : 'Confirm Appointment'}
                        </button>
                    </div>

                    {/* Schedule Preview */}
                    <div className="schedule-preview-card">
                        <h3>Doctor's Weekly Schedule</h3>
                        <div className="schedule-grid">
                            {Object.entries(schedules).map(([day, slots]) => (
                                <div key={day} className="schedule-day">
                                    <span className="day-name">{day}</span>
                                    <span className="day-slots">
                                        {slots.length > 0
                                            ? `${slots.length} slot${slots.length > 1 ? 's' : ''}`
                                            : 'Unavailable'
                                        }
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <PatientFooter />
        </div>
    )
}

export default BookAppointment
