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

  const validate = (name, value) => {
    let error = '';
    switch (name) {
      case 'name':
        if (!value) error = 'Full name is required';
        else if (value.length < 3) error = 'Name must be at least 3 characters long';
        else if (!/^[a-zA-Z\s.]+$/.test(value)) error = 'Name can only contain letters and spaces';
        break;
      case 'age':
        if (!value) error = 'Age is required';
        else if (value < 0 || value > 120) error = 'Please enter a valid age (0-120)';
        break;
      case 'gender':
        if (!value) error = 'Please select a gender';
        break;
      case 'dob':
        if (!value) error = 'Date of birth is required';
        else if (new Date(value) > new Date()) error = 'Date of birth cannot be in the future';
        break;
      case 'contact':
        if (!value) error = 'Contact number is required';
        else if (!/^[0-9]{10}$/.test(value)) error = 'Contact number must be exactly 10 digits';
        break;
      case 'email':
        if (!value) error = 'Email is required';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = 'Please enter a valid email address';
        break;
      case 'password':
        if (!value) error = 'Password is required';
        else if (value.length < 8) error = 'Password must be at least 8 characters long';
        else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(value))
          error = 'Include uppercase, lowercase, number, and special character';
        break;
      default:
        break;
    }
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const error = validate(name, value);
    setErrors({ ...errors, [name]: error });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Trigger validation for all fields
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      const error = validate(key, formData[key]);
      if (error) newErrors[key] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

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
      });
      setErrors({});
      console.log('Form Submitted:', formData);
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

            <form className="registration-form-modern" onSubmit={handleSubmit} noValidate>
              <div className="modern-form-row">
                <div className="modern-form-group">
                  <label><i className="fas fa-user"></i> Full Name</label>
                  <input type="text" name="name" placeholder="John Doe"
                    className={errors.name ? 'input-error' : ''}
                    value={formData.name} onChange={handleChange} onBlur={handleBlur} />
                  {errors.name && <span className="error-text"><i className="fas fa-exclamation-circle"></i> {errors.name}</span>}
                </div>
              </div>

              <div className="modern-form-grid">
                <div className="modern-form-group">
                  <label><i className="fas fa-birthday-cake"></i> Age</label>
                  <input type="number" name="age" placeholder="25"
                    className={errors.age ? 'input-error' : ''}
                    value={formData.age} onChange={handleChange} onBlur={handleBlur} />
                  {errors.age && <span className="error-text"><i className="fas fa-exclamation-circle"></i> {errors.age}</span>}
                </div>
                <div className="modern-form-group">
                  <label><i className="fas fa-calendar-alt"></i> Date of Birth</label>
                  <input type="date" name="dob"
                    className={errors.dob ? 'input-error' : ''}
                    value={formData.dob} onChange={handleChange} onBlur={handleBlur} />
                  {errors.dob && <span className="error-text"><i className="fas fa-exclamation-circle"></i> {errors.dob}</span>}
                </div>
              </div>

              <div className="modern-form-grid">
                <div className="modern-form-group">
                  <label><i className="fas fa-venus-mars"></i> Gender</label>
                  <select name="gender" className={`modern-select ${errors.gender ? 'input-error' : ''}`}
                    value={formData.gender} onChange={handleChange} onBlur={handleBlur}>
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.gender && <span className="error-text"><i className="fas fa-exclamation-circle"></i> {errors.gender}</span>}
                </div>
                <div className="modern-form-group">
                  <label><i className="fas fa-phone-alt"></i> Contact Number</label>
                  <input type="tel" name="contact" placeholder="9876543210"
                    className={errors.contact ? 'input-error' : ''}
                    value={formData.contact} onChange={handleChange} onBlur={handleBlur} />
                  {errors.contact && <span className="error-text"><i className="fas fa-exclamation-circle"></i> {errors.contact}</span>}
                </div>
              </div>

              <div className="modern-form-group">
                <label><i className="fas fa-envelope"></i> Email Address</label>
                <input type="email" name="email" placeholder="john@example.com"
                  className={errors.email ? 'input-error' : ''}
                  value={formData.email} onChange={handleChange} onBlur={handleBlur} />
                {errors.email && <span className="error-text"><i className="fas fa-exclamation-circle"></i> {errors.email}</span>}
              </div>

              <div className="modern-form-group">
                <label><i className="fas fa-lock"></i> Create Password</label>
                <input type="password" name="password" placeholder="••••••••"
                  className={errors.password ? 'input-error' : ''}
                  value={formData.password} onChange={handleChange} onBlur={handleBlur} />
                {errors.password && <span className="error-text"><i className="fas fa-exclamation-circle"></i> {errors.password}</span>}
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

