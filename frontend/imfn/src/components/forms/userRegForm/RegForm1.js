// user reg form

import React, { useState } from 'react';
import axios from "axios"

import './RegForm1.css';
import LandingPageHeader from '../../LandingPageHeader/LandingPageHeader';
import LandingPageFooter from '../../LandingPageFooter/LandingPageFooter';

const patient_register = "http://127.0.0.1:8000/api/patient_register/"

const RegForm1 = ({ hideHeaderFooter = false }) => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    dob: '',
    contact: '',
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    let newErrors = {};
    if (formData.name.trim().length < 3) newErrors.name = "Name must be at least 3 characters";
    if (formData.age < 1 || formData.age > 120) newErrors.age = "Please enter a valid age (1-120)";
    if (!/^\d{10}$/.test(formData.contact)) newErrors.contact = "Contact must be exactly 10 digits";
    if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error for specific field when user starts typing
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const payload = { ...formData, age: Number(formData.age) }
      const response = await axios.post(patient_register, payload)
      alert(response.data.message + "\nPatient Id: " + response.data.patient_id)
      setFormData({
        name: '',
        age: '',
        gender: '',
        dob: '',
        contact: '',
        email: '',
        password: ''
      })
      setErrors({});
    } catch (error) {
      alert(error?.response?.data?.error || "Error")
    }
  };

  return (
    <div className="registration-wrapper">
      {!hideHeaderFooter && <LandingPageHeader />}

      <div className={`registration-main-content ${hideHeaderFooter ? 'in-modal' : ''}`}>
        <div className="registration-container">
          <div className="registration-card">
            <div className="registration-header">
              <div className="registration-logo-circle">
                <i className="fas fa-user-plus"></i>
              </div>
              <h2>Patient Registration</h2>
              <p>Join the Integrated Medical Facility Network</p>
            </div>

            <form className="registration-form-modern" onSubmit={handleSubmit}>
              <div className="modern-form-row">
                <div className="modern-form-group">
                  <label><i className="fas fa-user"></i> Full Name</label>
                  <input type="text" name="name" placeholder="John Doe"
                    className={errors.name ? 'input-error' : ''}
                    value={formData.name} onChange={handleChange} required />
                  {errors.name && <span className="error-text">{errors.name}</span>}
                </div>
              </div>

              <div className="modern-form-grid">
                <div className="modern-form-group">
                  <label><i className="fas fa-birthday-cake"></i> Age</label>
                  <input type="number" name="age" placeholder="25"
                    className={errors.age ? 'input-error' : ''}
                    value={formData.age} onChange={handleChange} required />
                  {errors.age && <span className="error-text">{errors.age}</span>}
                </div>
                <div className="modern-form-group">
                  <label><i className="fas fa-calendar-alt"></i> Date of Birth</label>
                  <input type="date" name="dob"
                    value={formData.dob} onChange={handleChange} required />
                </div>
              </div>

              <div className="modern-form-grid">
                <div className="modern-form-group">
                  <label><i className="fas fa-venus-mars"></i> Gender</label>
                  <select name="gender" className="modern-select"
                    value={formData.gender} onChange={handleChange} required>
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="modern-form-group">
                  <label><i className="fas fa-phone-alt"></i> Contact Number</label>
                  <input type="tel" name="contact" placeholder="10-digit number"
                    className={errors.contact ? 'input-error' : ''}
                    value={formData.contact} onChange={handleChange} required />
                  {errors.contact && <span className="error-text">{errors.contact}</span>}
                </div>
              </div>

              <div className="modern-form-group">
                <label><i className="fas fa-envelope"></i> Email Address</label>
                <input type="email" name="email" placeholder="john@example.com"
                  value={formData.email} onChange={handleChange} required />
              </div>

              <div className="modern-form-group">
                <label><i className="fas fa-lock"></i> Create Password</label>
                <input type="password" name="password" placeholder="••••••••"
                  className={errors.password ? 'input-error' : ''}
                  value={formData.password} onChange={handleChange} required />
                {errors.password && <span className="error-text">{errors.password}</span>}
              </div>

              <button type="submit" className="registration-submit-btn">
                <span>Create My Account</span>
                <i className="fas fa-check-circle"></i>
              </button>
            </form>

            {/* <div className="registration-footer">
              <p>Already have an account? <a href="#">Sign In</a></p>
            </div> */}
          </div>
        </div>
      </div>

      {!hideHeaderFooter && <LandingPageFooter />}
    </div>
  );
};

export default RegForm1;

