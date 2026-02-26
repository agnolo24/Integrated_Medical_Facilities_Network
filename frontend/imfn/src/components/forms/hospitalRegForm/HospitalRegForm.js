// user reg form

import React, { useEffect, useState } from 'react';
import axios from 'axios';

import './HospitalRegForm.css';
import LandingPageHeader from '../../LandingPageHeader/LandingPageHeader';
import LandingPageFooter from '../../LandingPageFooter/LandingPageFooter';

const HospitalRegForm = ({ hideHeaderFooter = false }) => {
  const hospital_registration = 'http://127.0.0.1:8000/api/hospital_registration/'
  const [formData, setFormData] = useState({
    hospitalName: '',
    registrationId: '',
    hospitalAddress: '',
    contactNumber: '',
    lat: '',
    lon: '',
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      setFormData({ ...formData, lat: position.coords.latitude, lon: position.coords.longitude })
    })
  }, [])

  const validateForm = () => {
    let newErrors = {};
    if (formData.hospitalName.trim().length < 3) newErrors.hospitalName = "Hospital name must be at least 3 characters";
    if (formData.registrationId.length < 5) newErrors.registrationId = "Invalid Registration ID (min 5 characters)";
    if (!/^\d{10}$/.test(formData.contactNumber)) newErrors.contactNumber = "Contact must be exactly 10 digits";
    if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const response = await axios.post(hospital_registration, formData)
      alert(response.data.message + "\nHospital ID: " + response.data.hospital_id)

      setFormData({
        hospitalName: '',
        registrationId: '',
        hospitalAddress: '',
        contactNumber: '',
        lat: '',
        lon: '',
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
          <div className="registration-card hospital-variant">
            <div className="registration-header">
              <div className="registration-logo-circle">
                <i className="fas fa-hospital"></i>
              </div>
              <h2>Hospital Onboarding</h2>
              <p>Register your facility in the National Network</p>
            </div>

            <form className="registration-form-modern" onSubmit={handleSubmit}>
              <div className="modern-form-row">
                <div className="modern-form-group">
                  <label><i className="fas fa-h-square"></i> Hospital Name</label>
                  <input type="text" name="hospitalName" placeholder="City General Hospital"
                    className={errors.hospitalName ? 'input-error' : ''}
                    value={formData.hospitalName} onChange={handleChange} required />
                  {errors.hospitalName && <span className="error-text">{errors.hospitalName}</span>}
                </div>
              </div>

              <div className="modern-form-grid">
                <div className="modern-form-group">
                  <label><i className="fas fa-id-card"></i> Registration ID</label>
                  <input type="text" name="registrationId" placeholder="REG-123456"
                    className={errors.registrationId ? 'input-error' : ''}
                    value={formData.registrationId} onChange={handleChange} required />
                  {errors.registrationId && <span className="error-text">{errors.registrationId}</span>}
                </div>
                <div className="modern-form-group">
                  <label><i className="fas fa-map-marker-alt"></i> Facility Address</label>
                  <input type="text" name="hospitalAddress" placeholder="123 Medical Way"
                    value={formData.hospitalAddress} onChange={handleChange} required />
                </div>
              </div>

              <div className="modern-form-row">
                <div className="modern-form-group">
                  <label><i className="fas fa-phone-square-alt"></i> Emergency Contact</label>
                  <input type="tel" name="contactNumber" placeholder="10-digit emergency line"
                    className={errors.contactNumber ? 'input-error' : ''}
                    value={formData.contactNumber} onChange={handleChange} required />
                  {errors.contactNumber && <span className="error-text">{errors.contactNumber}</span>}
                </div>
              </div>

              <div className="modern-form-grid">
                <div className="modern-form-group">
                  <label><i className="fas fa-location-arrow"></i> Latitude</label>
                  <input type="text" name="lat" placeholder="40.7128"
                    value={formData.lat} onChange={handleChange} required />
                </div>
                <div className="modern-form-group">
                  <label><i className="fas fa-compass"></i> Longitude</label>
                  <input type="text" name="lon" placeholder="-74.0060"
                    value={formData.lon} onChange={handleChange} required />
                </div>
              </div>

              <div className="modern-form-group">
                <label><i className="fas fa-envelope-open-text"></i> Official Email</label>
                <input type="email" name="email" placeholder="admin@hospital.org"
                  value={formData.email} onChange={handleChange} required />
              </div>

              <div className="modern-form-group">
                <label><i className="fas fa-shield-alt"></i> Administrative Password</label>
                <input type="password" name="password" placeholder="••••••••"
                  className={errors.password ? 'input-error' : ''}
                  value={formData.password} onChange={handleChange} required />
                {errors.password && <span className="error-text">{errors.password}</span>}
              </div>

              <button type="submit" className="registration-submit-btn hospital-btn">
                <span>Register Facility</span>
                <i className="fas fa-building"></i>
              </button>
            </form>

            {/* <div className="registration-footer">
              <p>Already registered? <a href="#">Login here</a></p>
            </div> */}
          </div>
        </div>
      </div>

      {!hideHeaderFooter && <LandingPageFooter />}
    </div>
  );
};

export default HospitalRegForm;

