import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './EditDoctor.css';

// Accept props from ViewDoctor
const EditDoctor = ({ doctorData, onClose }) => {
    const editDoctorUrl = "http://127.0.0.1:8000/hospital/edit_doctor/";

    const [formData, setFormData] = useState({
        name: '',
        gender: '',
        specialization: '',
        qualification: '',
        experience: '',
        contactNumber: '',
        // email: ''
    });

    useEffect(() => {
        if (doctorData) {
            setFormData({
                name: doctorData.name || '',
                gender: doctorData.gender || '',
                specialization: doctorData.specialization || '',
                qualification: doctorData.qualification || '',
                experience: doctorData.experience || '',
                contactNumber: doctorData.contactNumber || ''
                // email: doctorData.email || ''
            });
        }
    }, [doctorData]);

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

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const hospital_login_id = localStorage.getItem("loginId");
        // console.log(`${hospital_login_id}: ${typeof(hospital_login_id)}, ${doctorData._id}: ${typeof(doctorData)}`)

        try {
            const response = await axios.post(editDoctorUrl, {
                ...formData,
                hospital_login_id,
                doctorId: doctorData._id
            });

            alert("Doctor updated successfully!");
            onClose();
        } catch (error) {
            alert(error?.response?.data?.error || "An Error Occurred while Updating");
        }
    };

    return (
        <div className="edit-doctor-container">
            <div className="card border-0">
                <div className="card-header bg-primary text-white text-center">
                    <h4>Edit Doctor Profile</h4>
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        {/* Name */}
                        <div className="mb-3">
                            <label className="form-label">Full Name</label>
                            <input type="text" name="name" className="form-control"
                                value={formData.name} onChange={handleChange} required />
                        </div>

                        {/* Gender & Specialization */}
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Gender</label>
                                <select name="gender" className="form-select" value={formData.gender} onChange={handleChange} required>
                                    <option value="">Select</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Specialization</label>
                                <select name="specialization" className="form-select" value={formData.specialization} onChange={handleChange} required>
                                    <option value="">Select</option>
                                    {specializations.map((spec, index) => (
                                        <option key={index} value={spec}>{spec}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Qualification & Experience */}
                        <div className="row">
                            <div className="col-md-8 mb-3">
                                <label className="form-label">Qualification</label>
                                <select name="qualification" className="form-select" value={formData.qualification} onChange={handleChange} required>
                                    <option value="">Select</option>
                                    {qualifications.map((qual, index) => (
                                        <option key={index} value={qual}>{qual}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-md-4 mb-3">
                                <label className="form-label">Exp (Yrs)</label>
                                <input type="number" name="experience" className="form-control" value={formData.experience} onChange={handleChange} required />
                            </div>
                        </div>

                        {/* Contact & Email */}
                        <div className="mb-3">
                            <label className="form-label">Contact Number</label>
                            <input type="tel" name="contactNumber" className="form-control" value={formData.contactNumber} onChange={handleChange} required />
                        </div>

                        {/* <div className="mb-3">
                            <label className="form-label">Email Address</label>
                            <input type="email" name="email" className="form-control" value={formData.email} onChange={handleChange} required />
                        </div> */}

                        <div className="d-flex gap-2">
                            <button type="submit" className="btn btn-primary flex-grow-1">Update Details</button>
                            <button type="button" className="btn btn-light" onClick={onClose}>Cancel</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditDoctor;