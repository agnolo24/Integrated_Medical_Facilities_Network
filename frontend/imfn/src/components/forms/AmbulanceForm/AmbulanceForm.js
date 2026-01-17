// ambulance reg form

import React, { useState } from 'react';

import './AmbulanceForm.css';
import LandingPageHeader from '../../LandingPageHeader/LandingPageHeader';
import LandingPageFooter from '../../LandingPageFooter/LandingPageFooter';
import axios from 'axios';

const AmbulanceForm = () => {
    const ambulanceRegistrationUrl = 'http://127.0.0.1:8000/hospital/register_ambulance/' 

    const [formData, setFormData] = useState({
        name: '',
        ambulanceType: '',
        vehicleNumber: '',
        // hospital: '',
        category: '',
        contactNumber: '',
        email: ''
        // password: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async(e) => {
        e.preventDefault();
        
        try {
            const hospital_login_id = localStorage.getItem("loginId")
            const response = await axios.post(ambulanceRegistrationUrl, { ...formData, hospital_login_id })
            
            alert(response.data.message)

            setFormData({
                name: '',
                ambulanceType: '',
                vehicleNumber: '',
                // hospital: '',
                category: '',
                contactNumber: '',
                email: ''
                // password: ''
            })
        } catch (error) {
            alert(error?.response?.data?.error || "An error occur while registering the ambulance")
        }
    };

    return (
        <div>
            <LandingPageHeader/>
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card shadow-sm">
                        <div className="card-header bg-primary text-white text-center">
                            <h4>Ambulance Registration</h4>
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleSubmit}>

                                {/* Name */}
                                <div className="mb-3">
                                    <label className="form-label">Full Name</label>
                                    <input type="text" name="name" className="form-control"
                                        value={formData.name} onChange={handleChange} required />
                                </div>

                                <div className="row">
                                    {/* Ambulance Type */}
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Ambulance Type</label>

                                        <select name="ambulanceType" className="form-select"
                                            value={formData.ambulanceType} onChange={handleChange} required>
                                            <option value="">Select Type</option>
                                            <option value="bls">BLS</option>
                                            <option value="als">ALS</option>
                                            <option value="micu">MICU</option>
                                            <option value="icu">ICU</option>
                                        </select>
                                    </div>


                                    {/* Vehicle Number */}
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Vehicle Number</label>
                                        <input type="text" name="vehicleNumber" className="form-control"
                                            value={formData.vehicleNumber} onChange={handleChange} required />
                                    </div>
                                </div>


                                {/* Hospital Name */}
                                {/* <div className="mb-3">
                                    <label className="form-label">Hospital Name</label>
                                    <input type="text" name="hospital" className="form-control"
                                        value={formData.hospital} onChange={handleChange} required />

                                </div> */}

                                {/* Category*/}
                                <div className="mb-3">
                                    <label className="form-label">Ambulance Category</label>
                                    <select name="category" className="form-select"
                                        value={formData.category} onChange={handleChange} required>
                                        <option value="">Select Type</option>
                                        <option value="Category 1: Life-threatening emergencies">Category 1: Life-threatening emergencies</option>

                                        <option value="Category 2: Emergency calls">Category 2: Emergency calls
                                        </option>
                                        <option value="Category 3: Urgent problems">Category 3: Urgent problems
                                        </option>
                                        <option value="Category 4: Non-urgent problems">Category 4: Non-urgent problems
                                        </option>
                                    </select>

                                </div>



                                {/* Contact Number */}
                                <div className="mb-3">
                                    <label className="form-label">Contact Number</label>
                                    <input type="tel" name="contactNumber" className="form-control"
                                        value={formData.contactNumber} onChange={handleChange} required />
                                </div>

                                {/* Email */}
                                <div className="mb-3">
                                    <label className="form-label">Email Address</label>
                                    <input type="email" name="email" className="form-control"
                                        value={formData.email} onChange={handleChange} required />
                                </div>

                                {/* Password */}
                                {/* <div className="mb-3">
                                    <label className="form-label">Password</label>
                                    <input type="password" name="password" className="form-control"
                                        value={formData.password} onChange={handleChange} required />
                                </div> */}

                                <button type="submit" className="btn btn-primary w-100 mt-3">Register</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            </div>
            <LandingPageFooter/>
            </div>
    );
};

export default AmbulanceForm;

