import React, { useState } from 'react';
import CreateSchedule from '../CreateSchedule/CreateSchedule';

function ViewDoctorSchedules({ doctorData, onClose }) {
    console.log(doctorData._id)
    const [isScheduleModelOpen, setIsScheduleModelOpen] = useState(false);

    const handleScheduleClick = () => setIsScheduleModelOpen(true);
    const handleScheduleClose = () => setIsScheduleModelOpen(false);

    return (
        <div className="view-schedules-container">

            <div className="schedule-list">
                <p>No Schedules Found for { doctorData.name }</p>
            </div>

            {/* Actions */}
            <div className="button-group">
                <button onClick={handleScheduleClick} className="btn btn-primary">
                    Schedule Duty
                </button>
                <button onClick={onClose} className="btn btn-secondary">
                    Close
                </button>
            </div>

            {/* Modal Logic */}
            {isScheduleModelOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <button className="close-button" onClick={handleScheduleClose}>&times;</button>
                        <CreateSchedule doctor={doctorData} onClose={handleScheduleClose}/>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ViewDoctorSchedules;