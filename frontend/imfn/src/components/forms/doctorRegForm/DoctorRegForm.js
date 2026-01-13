// Doctor registration form

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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(doctorRegistrationUrl, formData)
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
    } catch (error) {
      alert(error?.response?.data?.error || "An Error Occur while Registering")
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow-sm">
            <div className="card-header bg-primary text-white text-center">
              <h4>Doctor Registration</h4>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>

                {/* Name */}
                <div className="mb-3">
                  <label className="form-label">Full Name</label>
                  <input type="text" name="name" className="form-control"
                    value={formData.name} onChange={handleChange} required />
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

                {/* Specialization */}
                <div className="mb-3">
                  <label className="form-label">Specialization</label>
                  <select name="specialization" className="form-select"
                    value={formData.specialization} onChange={handleChange} required>
                    <option value="">Select Specialization</option>
                    {specializations.map((spec, index) => (
                      <option key={index} value={spec}>{spec}</option>
                    ))}
                  </select>
                </div>

                <div className="row">
                  {/* Date of Birth */}
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Date of Birth</label>
                    <input type="date" name="dob" className="form-control"
                      value={formData.dob} onChange={handleChange} required />
                  </div>
                </div>

                {/* hospital
                <div className="mb-3">
                  <label className="form-label">Hospital</label>
                  <input type="text" name="hospital" className="form-control" 
                    value={formData.hospital} onChange={handleChange} required />
                </div> */}

                {/* qualification */}
                <div className="mb-3">
                  <label className="form-label">Qualification</label>
                  <select name="qualification" className="form-select"
                    value={formData.qualification} onChange={handleChange} required>
                    <option value="">Select Qualification</option>
                    {qualifications.map((qual, index) => (
                      <option key={index} value={qual}>{qual}</option>
                    ))}
                  </select>
                </div>

                {/* experience */}
                <div className="mb-3">
                  <label className="form-label">Experience (In Years)</label>
                  <input type="number" name="experience" className="form-control"
                    value={formData.experience} onChange={handleChange} required />
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
  );
};

export default DoctorRegForm;

