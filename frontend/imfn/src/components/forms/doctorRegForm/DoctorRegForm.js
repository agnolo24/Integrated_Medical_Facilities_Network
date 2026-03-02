// Doctor registration form

import React, { useState } from 'react';
import axios from 'axios'

import './DoctorRegForm.css';

const DoctorRegForm = () => {
  const doctorRegistrationUrl = "http://127.0.0.1:8000/hospital/doctor_registration/"

  const [formData, setFormData] = useState({
    name: '',
    gender: '',
    specialization: '',
    dob: '',
    qualification: '',
    experience: '',
    contactNumber: '',
    email: ''
  });

  const [errors, setErrors] = useState({});

  const validate = (name, value) => {
    let error = '';
    switch (name) {
      case 'name':
        if (!value) error = 'Full name is required';
        else if (value.length < 3) error = 'Name must be at least 3 characters';
        else if (!/^[a-zA-Z\s.]+$/.test(value)) error = 'Name can only contain letters, spaces, and dots';
        break;
      case 'gender':
        if (!value) error = 'Gender selection is required';
        break;
      case 'dob':
        if (!value) error = 'Date of birth is required';
        else if (new Date(value) > new Date()) error = 'Date of birth cannot be in the future';
        break;
      case 'specialization':
        if (!value) error = 'Please select a specialization';
        break;
      case 'qualification':
        if (!value) error = 'Please select a qualification';
        break;
      case 'experience':
        if (value === '') error = 'Experience is required';
        else if (value < 0 || value > 60) error = 'Experience must be between 0 and 60 years';
        break;
      case 'contactNumber':
        if (!value) error = 'Contact number is required';
        else if (!/^[0-9]{10}$/.test(value)) error = 'Must be exactly 10 digits';
        break;
      case 'email':
        if (!value) error = 'Professional email is required';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = 'Please enter a valid email address';
        break;
      default:
        break;
    }
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: '' });
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const error = validate(name, value);
    setErrors({ ...errors, [name]: error });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const hospital_login_id = localStorage.getItem("loginId");

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
      const response = await axios.post(doctorRegistrationUrl, { ...formData, hospital_login_id })
      alert(response.data.message);
      setFormData({
        name: '',
        gender: '',
        specialization: '',
        dob: '',
        qualification: '',
        experience: '',
        contactNumber: '',
        email: ''
      });
      setErrors({});
    } catch (error) {
      alert(error?.response?.data?.error || "An Error Occurred while Registering");
    }
  };

  const specializations = [
    'Cardiology', 'Dermatology', 'Endocrinology', 'Gastroenterology',
    'General Medicine', 'General Surgery', 'Gynecology', 'Hematology',
    'Neurology', 'Obstetrics', 'Oncology', 'Ophthalmology',
    'Orthopedics', 'Otolaryngology (ENT)', 'Pediatrics', 'Psychiatry',
    'Pulmonology', 'Radiology', 'Urology'
  ];

  const qualifications = [
    'MBBS', 'MD (Doctor of Medicine)', 'MS (Master of Surgery)',
    'DNB (Diplomate of National Board)', 'DM (Doctorate of Medicine)',
    'MCh (Master of Chirurgiae)', 'BDS (Bachelor of Dental Surgery)',
    'MDS (Master of Dental Surgery)', 'BAMS (Bachelor of Ayurvedic Medicine and Surgery)',
    'BHMS (Bachelor of Homeopathic Medicine and Surgery)', 'BUMS (Bachelor of Unani Medicine and Surgery)',
    'BVSc & AH (Bachelor of Veterinary Science and Animal Husbandry)', 'BPT (Bachelor of Physiotherapy)'
  ];

  return (
    <div className="registration-wrapper">
      <div className="registration-main-content">
        <div className="registration-container">
          <div className="registration-card doctor-variant">
            <div className="registration-header">
              <div className="registration-logo-circle">
                <i className="fas fa-user-md"></i>
              </div>
              <h2>Doctor Registration</h2>
              <p>Onboard a new medical professional to your facility</p>
            </div>

            <form className="registration-form-modern" onSubmit={handleSubmit} noValidate>
              <div className="modern-form-row">
                <div className="modern-form-group">
                  <label><i className="fas fa-user-edit"></i> Full Name</label>
                  <input type="text" name="name" placeholder="Dr. Jane Smith"
                    className={errors.name ? 'input-error' : ''}
                    value={formData.name} onChange={handleChange} onBlur={handleBlur} />
                  {errors.name && <span className="error-text"><i className="fas fa-exclamation-circle"></i> {errors.name}</span>}
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
                  <label><i className="fas fa-calendar-check"></i> Date of Birth</label>
                  <input type="date" name="dob"
                    className={errors.dob ? 'input-error' : ''}
                    value={formData.dob} onChange={handleChange} onBlur={handleBlur} />
                  {errors.dob && <span className="error-text"><i className="fas fa-exclamation-circle"></i> {errors.dob}</span>}
                </div>
              </div>

              <div className="modern-form-grid">
                <div className="modern-form-group">
                  <label><i className="fas fa-stethoscope"></i> Specialization</label>
                  <select name="specialization" className={`modern-select ${errors.specialization ? 'input-error' : ''}`}
                    value={formData.specialization} onChange={handleChange} onBlur={handleBlur}>
                    <option value="">Select Specialization</option>
                    {specializations.map((spec, index) => (
                      <option key={index} value={spec}>{spec}</option>
                    ))}
                  </select>
                  {errors.specialization && <span className="error-text"><i className="fas fa-exclamation-circle"></i> {errors.specialization}</span>}
                </div>
                <div className="modern-form-group">
                  <label><i className="fas fa-graduation-cap"></i> Qualification</label>
                  <select name="qualification" className={`modern-select ${errors.qualification ? 'input-error' : ''}`}
                    value={formData.qualification} onChange={handleChange} onBlur={handleBlur}>
                    <option value="">Select Qualification</option>
                    {qualifications.map((qual, index) => (
                      <option key={index} value={qual}>{qual}</option>
                    ))}
                  </select>
                  {errors.qualification && <span className="error-text"><i className="fas fa-exclamation-circle"></i> {errors.qualification}</span>}
                </div>
              </div>

              <div className="modern-form-grid">
                <div className="modern-form-group">
                  <label><i className="fas fa-briefcase-medical"></i> Experience (Years)</label>
                  <input type="number" name="experience" placeholder="10"
                    className={errors.experience ? 'input-error' : ''}
                    value={formData.experience} onChange={handleChange} onBlur={handleBlur} />
                  {errors.experience && <span className="error-text"><i className="fas fa-exclamation-circle"></i> {errors.experience}</span>}
                </div>
                <div className="modern-form-group">
                  <label><i className="fas fa-phone-alt"></i> Contact Number</label>
                  <input type="tel" name="contactNumber" placeholder="9876543210"
                    className={errors.contactNumber ? 'input-error' : ''}
                    value={formData.contactNumber} onChange={handleChange} onBlur={handleBlur} />
                  {errors.contactNumber && <span className="error-text"><i className="fas fa-exclamation-circle"></i> {errors.contactNumber}</span>}
                </div>
              </div>

              <div className="modern-form-group">
                <label><i className="fas fa-envelope"></i> Professional Email</label>
                <input type="email" name="email" placeholder="dr.jane@hospital.org"
                  className={errors.email ? 'input-error' : ''}
                  value={formData.email} onChange={handleChange} onBlur={handleBlur} />
                {errors.email && <span className="error-text"><i className="fas fa-exclamation-circle"></i> {errors.email}</span>}
              </div>

              <button type="submit" className="registration-submit-btn doctor-btn">
                <span>Register Medical Professional</span>
                <i className="fas fa-check-double"></i>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorRegForm;

