import React from 'react'
import './CheckHistoryCode.css'

export default function CheckHistoryCode({selectedAppointmentId, closeCheckHistoryCode }) {

    const [formData, setFormData] = React.useState({
        historyCode: "",
    });

    const url = "http://127.0.0.1:8000/doctor/check_history_code";
    const handleSubmit = (e) => {
        e.preventDefault();
        const data = { historyCode: formData.historyCode ,  selectedAppointmentId : selectedAppointmentId};
        // console.log(data);
        // console.log(selectedAppointmentId);
        const response = axios.post(url,{params : data});
        
    };
    return (
        <div className="chc-overlay">
            <div className="chc-modal">
                <button className="chc-close-icon" onClick={closeCheckHistoryCode}>
                    &times;
                </button>
                <div className="chc-header">
                    <h1>Check History Code</h1>
                </div>
                <form onSubmit={handleSubmit} className="chc-form">
                    <div className="chc-input-group">
                        <input
                            type="text"
                            className="chc-input"
                            placeholder='Enter History Code'
                            value={formData.historyCode}
                            onChange={(e) => setFormData({ ...formData, historyCode: e.target.value })}
                        />
                    </div>
                    <div className="chc-actions">
                        <button type="button" className="chc-cancel-btn" onClick={closeCheckHistoryCode}>Cancel</button>
                        <button type="submit" className="chc-submit-btn">Submit</button>
                    </div>
                </form>
            </div>
        </div>
    )
}
