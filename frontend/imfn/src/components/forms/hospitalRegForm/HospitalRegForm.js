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
      setFormData(prev => ({
        ...prev,
        lat: position.coords.latitude,
        lon: position.coords.longitude
      }));
    });
  }, []);

  const validate = (name, value) => {
    let error = '';
    switch (name) {
      case 'hospitalName':
        if (!value) error = 'Hospital name is required';
        else if (value.length < 3) error = 'Name must be at least 3 characters long';
        else if (!/^[a-zA-Z0-9\s.'&,-]+$/.test(value)) error = 'Name can only contain letters, spaces, and dots';
        break;
      case 'registrationId':
        if (!value) error = 'Registration ID is required';
        break;
      case 'hospitalAddress':
        if (!value) error = 'Facility address is required';
        break;
      case 'contactNumber':
        if (!value) error = 'Contact number is required';
        else if (!/^[0-9]{10}$/.test(value)) error = 'Contact number must be exactly 10 digits';
        break;
      case 'lat':
        if (value === '') error = 'Latitude is required';
        else if (isNaN(value) || value < -90 || value > 90) error = 'Enter a valid latitude (-90 to 90)';
        break;
      case 'lon':
        if (value === '') error = 'Longitude is required';
        else if (isNaN(value) || value < -180 || value > 180) error = 'Enter a valid longitude (-180 to 180)';
        break;
      case 'email':
        if (!value) error = 'Official email is required';
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
      });
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

            <form className="registration-form-modern" onSubmit={handleSubmit} noValidate>
              <div className="modern-form-row">
                <div className="modern-form-group">
                  <label><i className="fas fa-h-square"></i> Hospital Name</label>
                  <input type="text" name="hospitalName" placeholder="City General Hospital"
                    className={errors.hospitalName ? 'input-error' : ''}
                    value={formData.hospitalName} onChange={handleChange} onBlur={handleBlur} />
                  {errors.hospitalName && <span className="error-text"><i className="fas fa-exclamation-circle"></i> {errors.hospitalName}</span>}
                </div>
              </div>

              <div className="modern-form-grid">
                <div className="modern-form-group">
                  <label><i className="fas fa-id-card"></i> Registration ID</label>
                  <input type="number" name="registrationId" placeholder="123456"
                    className={errors.registrationId ? 'input-error' : ''}
                    value={formData.registrationId} onChange={handleChange} onBlur={handleBlur} />
                  {errors.registrationId && <span className="error-text"><i className="fas fa-exclamation-circle"></i> {errors.registrationId}</span>}
                </div>
                <div className="modern-form-group">
                  <label><i className="fas fa-map-marker-alt"></i> Facility Address</label>
                  <input type="text" name="hospitalAddress" placeholder="123 Medical Way"
                    className={errors.hospitalAddress ? 'input-error' : ''}
                    value={formData.hospitalAddress} onChange={handleChange} onBlur={handleBlur} />
                  {errors.hospitalAddress && <span className="error-text"><i className="fas fa-exclamation-circle"></i> {errors.hospitalAddress}</span>}
                </div>
              </div>

              <div className="modern-form-row">
                <div className="modern-form-group">
                  <label><i className="fas fa-phone-square-alt"></i> Emergency Contact</label>
                  <input type="tel" name="contactNumber" placeholder="9876543210"
                    className={errors.contactNumber ? 'input-error' : ''}
                    value={formData.contactNumber} onChange={handleChange} onBlur={handleBlur} />
                  {errors.contactNumber && <span className="error-text"><i className="fas fa-exclamation-circle"></i> {errors.contactNumber}</span>}
                </div>
              </div>

              <div className="modern-form-grid">
                <div className="modern-form-group">
                  <label><i className="fas fa-location-arrow"></i> Latitude</label>
                  <input type="text" name="lat" placeholder="40.7128"
                    className={errors.lat ? 'input-error' : ''}
                    value={formData.lat} onChange={handleChange} onBlur={handleBlur} />
                  {errors.lat && <span className="error-text"><i className="fas fa-exclamation-circle"></i> {errors.lat}</span>}
                </div>
                <div className="modern-form-group">
                  <label><i className="fas fa-compass"></i> Longitude</label>
                  <input type="text" name="lon" placeholder="-74.0060"
                    className={errors.lon ? 'input-error' : ''}
                    value={formData.lon} onChange={handleChange} onBlur={handleBlur} />
                  {errors.lon && <span className="error-text"><i className="fas fa-exclamation-circle"></i> {errors.lon}</span>}
                </div>
              </div>

              <div className="modern-form-group">
                <label><i className="fas fa-envelope-open-text"></i> Official Email</label>
                <input type="email" name="email" placeholder="admin@hospital.org"
                  className={errors.email ? 'input-error' : ''}
                  value={formData.email} onChange={handleChange} onBlur={handleBlur} />
                {errors.email && <span className="error-text"><i className="fas fa-exclamation-circle"></i> {errors.email}</span>}
              </div>

              <div className="modern-form-group">
                <label><i className="fas fa-shield-alt"></i> Administrative Password</label>
                <input type="password" name="password" placeholder="••••••••"
                  className={errors.password ? 'input-error' : ''}
                  value={formData.password} onChange={handleChange} onBlur={handleBlur} />
                {errors.password && <span className="error-text"><i className="fas fa-exclamation-circle"></i> {errors.password}</span>}
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

