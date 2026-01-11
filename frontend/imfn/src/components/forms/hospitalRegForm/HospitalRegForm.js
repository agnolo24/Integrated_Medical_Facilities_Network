// user reg form

import React, { useState } from 'react';
import axios from 'axios';

import './HospitalRegForm.css';
import LandingPageHeader from '../../LandingPageHeader/LandingPageHeader';
import LandingPageFooter from '../../LandingPageFooter/LandingPageFooter';

const HospitalRegForm = () => {
  const hospital_registration = 'http://127.0.0.1:8000/api/hospital_registration/'
  const [formData, setFormData] = useState({
    hospitalName: '',
    registrationId: '',
    hospitalAddress: '',
    contactNumber: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(hospital_registration, formData)
      alert(response.data.message + "\nHospital ID: " + response.data.hospital_id)

      setFormData({
        hospitalName: '',
        registrationId: '',
        hospitalAddress: '',
        contactNumber: '',
        email: '',
        password: ''
      })
    } catch (error) {
      alert(error?.response?.data?.error || "Error")
    }
  };

  return (
    <div>
      <LandingPageHeader />
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card shadow-sm">
              <div className="card-header bg-primary text-white text-center">
                <h4>Register Hospital</h4>
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmit}>

                  {/* Name */}
                  <div className="mb-3">
                    <label className="form-label">Hospital Name</label>
                    <input type="text" name="hospitalName" className="form-control"
                      value={formData.hospitalName} onChange={handleChange} required />
                  </div>

                  <div className="row">

                    <div className="col-md-6 mb-3">
                      <label className="form-label">Registration ID</label>
                      <input type="number" name="registrationId" className="form-control"
                        value={formData.registrationId} onChange={handleChange} required />
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="form-label">Hospital Address</label>
                      <input type="text" name="hospitalAddress" className="form-control"
                        value={formData.hospitalAddress} onChange={handleChange} required />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Contact Number</label>
                    <input type="tel" name="contactNumber" className="form-control"
                      value={formData.contactNumber} onChange={handleChange} required />
                  </div>


                  <div className="mb-3">
                    <label className="form-label">Email Address</label>
                    <input type="email" name="email" className="form-control"
                      value={formData.email} onChange={handleChange} required />
                  </div>


                  <div className="mb-3">
                    <label className="form-label">Password</label>
                    <input type="password" name="password" className="form-control"
                      value={formData.password} onChange={handleChange} required />
                  </div>

                  <button type="submit" className="btn btn-primary w-100 mt-3">Register</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <LandingPageFooter />
    </div>
  );
};

export default HospitalRegForm;

