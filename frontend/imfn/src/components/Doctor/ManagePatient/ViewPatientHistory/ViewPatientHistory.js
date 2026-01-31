import axios from 'axios'
import React, { useEffect, useState } from 'react'

function ViewPatientHistory({selectedAppointmentId, closeHistory}) {

    const [history, setHistory] = useState([])

    const fetchHistory = async () => {
        const url = 'http://localhost:8000/doctor/get_patient_history/'
        try {
            const response = await axios.get(url,{params : {apt_id : selectedAppointmentId}})
            const data = await response.data['message']
            setHistory(data)
            console.log("history : ",history)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchHistory()
    }, [])

    return (
        <div>
            ViewPatientHistory
            <button onClick={closeHistory}>X</button>
        </div>
    )
}

export default ViewPatientHistory