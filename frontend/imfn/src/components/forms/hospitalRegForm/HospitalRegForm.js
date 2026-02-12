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

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      setFormData({ ...formData, lat: position.coords.latitude, lon: position.coords.longitude })
    })
  }, [])

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
        lat: '',
        lon: '',
        email: '',
        password: ''
      })
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
                    value={formData.hospitalName} onChange={handleChange} required />
                </div>
              </div>

              <div className="modern-form-grid">
                <div className="modern-form-group">
                  <label><i className="fas fa-id-card"></i> Registration ID</label>
                  <input type="number" name="registrationId" placeholder="REG-123456"
                    value={formData.registrationId} onChange={handleChange} required />
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
                  <input type="tel" name="contactNumber" placeholder="+1 800 555 0199"
                    value={formData.contactNumber} onChange={handleChange} required />
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
                  value={formData.password} onChange={handleChange} required />
              </div>

              <button type="submit" className="registration-submit-btn hospital-btn">
                <span>Register Facility</span>
                <i className="fas fa-building"></i>
              </button>
            </form>

            <div className="registration-footer">
              <p>Already registered? <a href="#">Login here</a></p>
            </div>
          </div>
        </div>
      </div>

      {!hideHeaderFooter && <LandingPageFooter />}
    </div>
  );
};

export default HospitalRegForm;

