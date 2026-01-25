import React from 'react'
import './CheckHistoryCode.css'
import axios from 'axios'

export default function CheckHistoryCode({ selectedAppointmentId, closeCheckHistoryCode }) {

    const [formData, setFormData] = React.useState({
        historyCode: "",
    });

    const url = "http://127.0.0.1:8000/doctor/check_history_code/";
    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = { history_code: formData.historyCode, apt_id: selectedAppointmentId };

        try {
            const response = await axios.post(url, data);

            if (response.status === 200) {
                console.log("Success");
                alert("History Code Verified Successfully!");
                closeCheckHistoryCode();
            }
        }
        catch (error) {
            console.log(error);
            if (error.response) {
                if (error.response.status === 400) {
                    alert("Invalid History Code");
                } else if (error.response.status === 404) {
                    alert("Record not found");
                } else {
                    alert("An error occurred. Please try again.");
                }
            }
        }

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
