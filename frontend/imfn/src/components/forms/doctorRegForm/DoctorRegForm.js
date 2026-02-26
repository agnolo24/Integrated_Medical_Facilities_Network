// This is doctor registration form

import React, { useState } from 'react';
import axios from 'axios'

import './DoctorRegForm.css';

const DoctorRegForm = () => {
  const doctorRegistrationUrl = "http://127.0.0.1:8000/hospital/doctor_registration/"

  const specializations = [
    'Cardiology',
    'Dermatology',
    'Endocrinology',
    'Gastroenterology',
    'General Medicine',
    'General Surgery',
    'Gynecology',
    'Hematology',
    'Neurology',
    'Obstetrics',
    'Oncology',
    'Ophthalmology',
    'Orthopedics',
    'Otolaryngology (ENT)',
    'Pediatrics',
    'Psychiatry',
    'Pulmonology',
    'Radiology',
    'Urology'
  ];

  const qualifications = [
    'MBBS',
    'MD (Doctor of Medicine)',
    'MS (Master of Surgery)',
    'DNB (Diplomate of National Board)',
    'DM (Doctorate of Medicine)',
    'MCh (Master of Chirurgiae)',
    'BDS (Bachelor of Dental Surgery)',
    'MDS (Master of Dental Surgery)',
    'BAMS (Bachelor of Ayurvedic Medicine and Surgery)',
    'BHMS (Bachelor of Homeopathic Medicine and Surgery)',
    'BUMS (Bachelor of Unani Medicine and Surgery)',
    'BVSc & AH (Bachelor of Veterinary Science and Animal Husbandry)',
    'BPT (Bachelor of Physiotherapy)'
  ];

  const [formData, setFormData] = useState({
    name: '',
    gender: '',
    specialization: '',
    dob: '',
    // hospital: '',
    qualification: '',
    experience: '',
    contactNumber: '',
    email: ''
    // password : ''
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    let newErrors = {};
    if (formData.name.trim().length < 3) newErrors.name = "Doctor name must be at least 3 characters";
    if (formData.experience < 0) newErrors.experience = "Experience cannot be negative";
    if (!/^\d{10}$/.test(formData.contactNumber)) newErrors.contactNumber = "Contact must be exactly 10 digits";

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

    const hospital_login_id = localStorage.getItem("loginId")


    try {
      const response = await axios.post(doctorRegistrationUrl, { ...formData, hospital_login_id })
      alert(response.data.message)

      setFormData({
        name: '',
        gender: '',
        specialization: '',
        dob: '',
        // hospital: '',
        qualification: '',
        experience: '',
        contactNumber: '',
        email: ''
        // password : ''
      })
      setErrors({});
    } catch (error) {
      alert(error?.response?.data?.error || "An Error Occur while Registering")
    }
  };

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

            <form className="registration-form-modern" onSubmit={handleSubmit}>
              <div className="modern-form-row">
                <div className="modern-form-group">
                  <label><i className="fas fa-user-edit"></i> Full Name</label>
                  <input type="text" name="name" placeholder="Dr. Jane Smith"
                    className={errors.name ? 'input-error' : ''}
                    value={formData.name} onChange={handleChange} required />
                  {errors.name && <span className="error-text">{errors.name}</span>}
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
                  <label><i className="fas fa-calendar-check"></i> Date of Birth</label>
                  <input type="date" name="dob"
                    value={formData.dob} onChange={handleChange} required />
                </div>
              </div>

              <div className="modern-form-grid">
                <div className="modern-form-group">
                  <label><i className="fas fa-stethoscope"></i> Specialization</label>
                  <select name="specialization" className="modern-select"
                    value={formData.specialization} onChange={handleChange} required>
                    <option value="">Select Specialization</option>
                    {specializations.map((spec, index) => (
                      <option key={index} value={spec}>{spec}</option>
                    ))}
                  </select>
                </div>
                <div className="modern-form-group">
                  <label><i className="fas fa-graduation-cap"></i> Qualification</label>
                  <select name="qualification" className="modern-select"
                    value={formData.qualification} onChange={handleChange} required>
                    <option value="">Select Qualification</option>
                    {qualifications.map((qual, index) => (
                      <option key={index} value={qual}>{qual}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="modern-form-grid">
                <div className="modern-form-group">
                  <label><i className="fas fa-briefcase-medical"></i> Experience (Years)</label>
                  <input type="number" name="experience" placeholder="10"
                    className={errors.experience ? 'input-error' : ''}
                    value={formData.experience} onChange={handleChange} required />
                  {errors.experience && <span className="error-text">{errors.experience}</span>}
                </div>
                <div className="modern-form-group">
                  <label><i className="fas fa-phone-alt"></i> Contact Number</label>
                  <input type="tel" name="contactNumber" placeholder="10-digit number"
                    className={errors.contactNumber ? 'input-error' : ''}
                    value={formData.contactNumber} onChange={handleChange} required />
                  {errors.contactNumber && <span className="error-text">{errors.contactNumber}</span>}
                </div>
              </div>

              <div className="modern-form-group">
                <label><i className="fas fa-envelope"></i> Professional Email</label>
                <input type="email" name="email" placeholder="dr.jane@hospital.org"
                  value={formData.email} onChange={handleChange} required />
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

