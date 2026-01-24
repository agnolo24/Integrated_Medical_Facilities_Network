import React, { useState, useEffect } from 'react'
import axios from 'axios'
import './CreateSchedule.css'

function CreateSchedule({ doctor, onClose }) {
    const createScheduleUrl = "http://127.0.0.1:8000/hospital/create_schedule/"
    const getScheduleUrl = "http://127.0.0.1:8000/hospital/get_schedule/"
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']

    const [schedules, setSchedules] = useState({
        sunday: [], monday: [], tuesday: [], wednesday: [], thursday: [], friday: [], saturday: []
    })

    const [showTimeInput, setShowTimeInput] = useState(false)
    const [selectedDay, setSelectedDay] = useState('')
    const [startTime, setStartTime] = useState('')
    const [endTime, setEndTime] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [isFetching, setIsFetching] = useState(true)

    // Fetch existing schedules when component mounts
    useEffect(() => {
        const fetchExistingSchedules = async () => {
            if (!doctor?._id) {
                setIsFetching(false)
                return
            }

            try {
                const response = await axios.get(`${getScheduleUrl}?doctorId=${doctor._id}`)
                if (response.data?.schedules) {
                    setSchedules(response.data.schedules)
                }
            } catch (error) {
                console.error("Error fetching existing schedules:", error)
                // Keep empty schedules if fetch fails
            } finally {
                setIsFetching(false)
            }
        }

        fetchExistingSchedules()
    }, [doctor?._id])

    const formatTime = (time24) => {
        const [hours, minutes] = time24.split(':')
        const hour = parseInt(hours)
        const ampm = hour >= 12 ? 'PM' : 'AM'
        const hour12 = hour % 12 || 12
        return `${hour12}:${minutes} ${ampm}`
    }

    const openTimeInput = (day) => {
        setSelectedDay(day); setShowTimeInput(true);
    }

    const addSchedule = () => {
        if (!startTime || !endTime) return alert('Select both times')
        if (startTime >= endTime) return alert('End time must be after start time')
        const newSchedule = `${formatTime(startTime)} - ${formatTime(endTime)}`
        setSchedules(prev => ({ ...prev, [selectedDay]: [...prev[selectedDay], newSchedule] }))
        cancelTimeInput()
    }

    const cancelTimeInput = () => {
        setShowTimeInput(false); setStartTime(''); setEndTime('');
    }

    const removeSchedule = (day, index) => {
        setSchedules(prev => ({ ...prev, [day]: prev[day].filter((_, i) => i !== index) }))
    }

    const handleSubmit = async () => {
        // Check if at least one schedule is added
        const hasSchedules = days.some(day => schedules[day].length > 0)
        if (!hasSchedules) {
            return alert('Please add at least one schedule before saving')
        }

        const hospital_login_id = localStorage.getItem("loginId")

        setIsLoading(true)
        try {
            console.log({
                data: {
                    schedules,
                    hospital_login_id,
                    doctorId: doctor._id
                }
            })
            const response = await axios.post(createScheduleUrl, {
                schedules,
                hospital_login_id,
                doctorId: doctor._id
            })

            alert("Schedule saved successfully!")
            onClose()
        } catch (error) {
            alert(error?.response?.data?.error || "An error occurred while saving the schedule")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="m-sched-overlay">
            <div className="m-sched-modal">
                <button className="m-sched-close-x" onClick={onClose}>&times;</button>

                <div className="m-sched-header">
                    <h2>Schedule Duty</h2>
                    <p>Managing schedule for <strong>Dr. {doctor?.name || 'doc1'}</strong></p>
                </div>

                <div className="m-sched-list">
                    {isFetching ? (
                        <div className="m-sched-loading">Loading schedules...</div>
                    ) : (
                        days.map((day) => (
                            <div className="m-sched-row" key={day}>
                                <div className="m-sched-day-label">{day}</div>
                                <div className="m-sched-pills-area">
                                    {schedules[day].length === 0 ? (
                                        <span className="m-sched-empty-text">No schedules added</span>
                                    ) : (
                                        schedules[day].map((time, index) => (
                                            <div className="m-sched-pill" key={index}>
                                                {time}
                                                <button className="m-sched-pill-remove" onClick={() => removeSchedule(day, index)}>&times;</button>
                                            </div>
                                        ))
                                    )}
                                </div>
                                <button className="m-sched-add-circle" onClick={() => openTimeInput(day)}>+</button>
                            </div>
                        ))
                    )}
                </div>

                {/* Save Schedule Button */}
                <div className="m-sched-footer">
                    <button
                        className="m-sched-btn-save"
                        onClick={handleSubmit}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Saving...' : 'Save Schedule'}
                    </button>
                </div>

                {showTimeInput && (
                    <div className="m-sched-popover-bg">
                        <div className="m-sched-popover-box">
                            <div className="m-sched-input-group">
                                <label>Start Time</label>
                                <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
                            </div>
                            <div className="m-sched-input-group">
                                <label>End Time</label>
                                <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
                            </div>
                            <div className="m-sched-popover-actions">
                                <button className="m-sched-btn-cancel" onClick={cancelTimeInput}>Cancel</button>
                                <button className="m-sched-btn-confirm" onClick={addSchedule}>Add Slot</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default CreateSchedule