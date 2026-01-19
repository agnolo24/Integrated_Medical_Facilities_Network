import React, { useState } from 'react'
import './CreateSchedule.css'

function CreateSchedule({ doctor, onClose }) {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']

    const [schedules, setSchedules] = useState({
        sunday: [],
        monday: [],
        tuesday: [],
        wednesday: [],
        thursday: [],
        friday: [],
        saturday: []
    })

    // State for time input modal
    const [showTimeInput, setShowTimeInput] = useState(false)
    const [selectedDay, setSelectedDay] = useState('')
    const [startTime, setStartTime] = useState('')
    const [endTime, setEndTime] = useState('')

    // Format time to 12-hour format
    const formatTime = (time24) => {
        const [hours, minutes] = time24.split(':')
        const hour = parseInt(hours)
        const ampm = hour >= 12 ? 'PM' : 'AM'
        const hour12 = hour % 12 || 12
        return `${hour12}:${minutes} ${ampm}`
    }

    // Open time input modal for a specific day
    const openTimeInput = (day) => {
        setSelectedDay(day)
        setStartTime('')
        setEndTime('')
        setShowTimeInput(true)
    }

    // Add schedule to a day
    const addSchedule = () => {
        if (!startTime || !endTime) {
            alert('Please select both start and end times')
            return
        }

        if (startTime >= endTime) {
            alert('End time must be after start time')
            return
        }

        const newSchedule = `${formatTime(startTime)} - ${formatTime(endTime)}`

        setSchedules(prev => ({
            ...prev,
            [selectedDay]: [...prev[selectedDay], newSchedule]
        }))

        setShowTimeInput(false)
        setStartTime('')
        setEndTime('')
    }

    // Remove schedule from a day
    const removeSchedule = (day, index) => {
        setSchedules(prev => ({
            ...prev,
            [day]: prev[day].filter((_, i) => i !== index)
        }))
    }

    // Cancel time input
    const cancelTimeInput = () => {
        setShowTimeInput(false)
        setStartTime('')
        setEndTime('')
    }

    return (
        <div className="profile-overlay">
            <div className="profile-modal schedule-modal">
                <button className="close-btn" onClick={onClose}>&times;</button>

                <div className="profile-header">
                    <h2>Schedule Duty</h2>
                    <p className="profile-role">Managing schedule for Dr. {doctor?.name || 'Doctor'}</p>
                </div>

                <div className="schedule-grid">
                    {days.map((day) => (
                        <div className="day-row" key={day}>
                            <span className="day-name">{day}</span>
                            <div className="day-schedules">
                                {schedules[day].length === 0 ? (
                                    <span style={{ color: '#999', fontSize: '13px' }}>No schedules added</span>
                                ) : (
                                    schedules[day].map((schedule, index) => (
                                        <span className="schedule-tag" key={index}>
                                            {schedule}
                                            <button
                                                className="remove-schedule"
                                                onClick={() => removeSchedule(day, index)}
                                                title="Remove schedule"
                                            >
                                                ×
                                            </button>
                                        </span>
                                    ))
                                )}
                            </div>
                            <button
                                className="add-btn"
                                onClick={() => openTimeInput(day)}
                                title={`Add schedule for ${day}`}
                            >
                                +
                            </button>
                        </div>
                    ))}
                </div>

                {/* Time Input Modal */}
                {showTimeInput && (
                    <div className="time-input-overlay">
                        <div className="time-input-box">
                            <div className="time-field">
                                <label>Start Time</label>
                                <input
                                    type="time"
                                    value={startTime}
                                    onChange={(e) => setStartTime(e.target.value)}
                                />
                            </div>
                            <div className="time-field">
                                <label>End Time</label>
                                <input
                                    type="time"
                                    value={endTime}
                                    onChange={(e) => setEndTime(e.target.value)}
                                />
                            </div>
                            <button className="edit-btn" onClick={addSchedule}>
                                Add
                            </button>
                            <button className="password-btn" onClick={cancelTimeInput}>
                                Cancel
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default CreateSchedule
