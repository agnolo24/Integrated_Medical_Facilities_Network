// user reg form

import React, { useState } from 'react';
import axios from "axios"

import './RegForm1.css';
import LandingPageHeader from '../../LandingPageHeader/LandingPageHeader';
import LandingPageFooter from '../../LandingPageFooter/LandingPageFooter';

const patient_register = "http://127.0.0.1:8000/api/patient_register/"

const RegForm1 = () => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    dob: '',
    contact: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {...formData, age: Number(formData.age)}
      const response = await axios.post(patient_register, payload)
      alert(response.data.message + "\nPatient Id: "+ response.data.patient_id)
      setFormData({
        name: '',
        age: '',
        gender: '',
        dob: '',
        contact: '',
        email: '',
        password: ''
      })
      console.log('Form Submitted:', formData);
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
                <h4>Register Account</h4>
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
                    {/* Age */}
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Age</label>
                      <input type="number" name="age" className="form-control"
                        value={formData.age} onChange={handleChange} required />
                    </div>
                    {/* Date of Birth */}
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Date of Birth</label>
                      <input type="date" name="dob" className="form-control"
                        value={formData.dob} onChange={handleChange} required />
                    </div>
                  </div>

                  {/* Gender */}
                  <div className="mb-3">
                    <label className="form-label">Gender</label>
                    <select name="gender" className="form-select"
                      value={formData.gender} onChange={handleChange} required>
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  {/* Contact Number */}
                  <div className="mb-3">
                    <label className="form-label">Contact Number</label>
                    <input type="tel" name="contact" className="form-control"
                      value={formData.contact} onChange={handleChange} required />
                  </div>

                  {/* Email */}
                  <div className="mb-3">
                    <label className="form-label">Email Address</label>
                    <input type="email" name="email" className="form-control"
                      value={formData.email} onChange={handleChange} required />
                  </div>

                  {/* Password */}
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

export default RegForm1;

