import React from 'react'

function CreateSchedule({doctor, onClose}) {
    return (
        <div>
            <div>
                <h4>Schedule Duty for {doctor.name}</h4>
                <hr />

                
            </div>
            <button onClick={onClose}>Close</button>
        </div>
    )
}

export default CreateSchedule
