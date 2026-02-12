import React, { useState } from 'react';
import './AssignDuty.css';
import { useNavigate } from 'react-router'

import axios from 'axios'

function AssignDuty({ ambulanceData, onClose }) {
    const navigate = useNavigate()
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

    const onSubmit = async (e) => {
        e.preventDefault();
        console.log(formData);

        try {
            const response = await axios.post(assign_duty_ambulance_url, formData)
            alert("Duty Assigned.")

            onClose()
        } catch (error) {
            console.error("An error occur while assigning duty:", error)
            alert("Failed to Assign Duty.")
        }
    };

    return (
        <div className="assign-duty-overlay">
            <div className="assign-duty-card-v2">
                <div className="assign-header-premium">
                    <i className="fas fa-satellite-dish"></i>
                    <h2>Emergency Dispatch</h2>
                    <div className="vehicle-info-pill">
                        <i className="fas fa-truck-medical"></i> {ambulanceData.name} • {ambulanceData.vehicleNumber}
                    </div>
                </div>

                <div className="assign-body-content">
                    <form className="modern-assign-form" onSubmit={onSubmit}>
                        <div className="form-field-group">
                            <label><i className="fas fa-map-marker-alt"></i> Dispatch Origin (Pickup)</label>
                            <textarea
                                name="from_address"
                                value={formData.from_address}
                                onChange={handleChange}
                                placeholder="Enter full street address or facility name..."
                                className="assign-textarea-premium"
                                required
                            />
                        </div>

                        <div className="form-field-group">
                            <label><i className="fas fa-map-pin"></i> Target Destination (Drop-off)</label>
                            <textarea
                                name="to_address"
                                value={formData.to_address}
                                onChange={handleChange}
                                placeholder="Enter medical facility or patient residence..."
                                className="assign-textarea-premium"
                                required
                            />
                        </div>

                        <div className="form-field-group">
                            <label><i className="fas fa-exclamation-triangle"></i> Mission Risk Classification</label>
                            <select
                                name="risk_level"
                                value={formData.risk_level}
                                onChange={handleChange}
                                className="assign-select-premium"
                                required
                            >
                                <option value="" disabled>Select Response Priority</option>
                                <option value="low">Low – Scheduled Transfer</option>
                                <option value="medium">Medium – Urgent Response Required</option>
                                <option value="high">High – Critical Life Threat</option>
                            </select>
                        </div>

                        <div className="assign-footer-actions">
                            <button type="submit" className="dispatch-duty-btn">
                                <i className="fas fa-paper-plane"></i> Dispatch Emergency Unit
                            </button>
                            <button type="button" className="cancel-duty-btn" onClick={onClose}>Dismiss</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default AssignDuty;
