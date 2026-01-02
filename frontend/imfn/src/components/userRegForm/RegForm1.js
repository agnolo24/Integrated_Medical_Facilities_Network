// user reg form

import React, { useState } from 'react';
import './RegForm1.css';

const RegForm1 = () => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    dob: '',
    contactNumber: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Submitted:', formData);
  };

  return (
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
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
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
  );
};

export default RegForm1;

