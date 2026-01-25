import React, { useState } from 'react';
import './AssignDuty.css';

function AssignDuty({ ambulanceData, onClose }) {
    const assign_duty_ambulance_url = "http://localhost:8000/hospital/assign_duty_ambulance/";
    
    const [formData, setFormData] = useState({
        from_address: '',
        to_address: '',
        risk_level: '',
        ambulance_id: ambulanceData._id
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const onSubmit = (e) => {
        e.preventDefault();
        console.log(formData);
        // Future: API call
    };

    return (
        <div className="assign-duty-overlay">
            <div className="assign-duty-card">
                <div className="assign-duty-header">
                    <h2>
                        Assign Duty
                        <span>
                            {ambulanceData.name} ({ambulanceData.vehicleNumber})
                        </span>
                    </h2>
                </div>

                <form className="assign-duty-form" onSubmit={onSubmit}>
                    <div className="form-group">
                        <label htmlFor="from_address">From Address</label>
                        <textarea
                            id="from_address"
                            name="from_address"
                            value={formData.from_address}
                            onChange={handleChange}
                            placeholder="Enter pickup location"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="to_address">To Address</label>
                        <textarea
                            id="to_address"
                            name="to_address"
                            value={formData.to_address}
                            onChange={handleChange}
                            placeholder="Enter drop-off location"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="risk_level">Risk Level</label>
                        <select
                            id="risk_level"
                            name="risk_level"
                            value={formData.risk_level}
                            onChange={handleChange}
                            required
                        >
                            <option value="" disabled>
                                Select Risk Level
                            </option>
                            <option value="low">Low – Non-Emergency</option>
                            <option value="medium">Medium – Urgent</option>
                            <option value="high">High – Critical</option>
                        </select>
                    </div>

                    <div className="form-actions">
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={onClose}
                            style={{ borderRadius: '6px' }}
                        >
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary">
                            Assign Duty
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AssignDuty;
