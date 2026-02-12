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
            const response = await axios.put(editDoctorUrl, {
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
            <div className="edit-doctor-card">
                <div className="edit-doctor-header">
                    <i className="fas fa-user-edit"></i>
                    <h2>Refine Specialist Profile</h2>
                    <p>Update credentials and contact information</p>
                </div>

                <div className="edit-doctor-body">
                    <form className="modern-edit-form" onSubmit={handleSubmit}>
                        <div className="form-input-group">
                            <label><i className="fas fa-id-card"></i> Full Name</label>
                            <input type="text" name="name" placeholder="Dr. Jane Smith"
                                value={formData.name} onChange={handleChange} required />
                        </div>

                        <div className="form-grid">
                            <div className="form-input-group">
                                <label><i className="fas fa-venus-mars"></i> Gender</label>
                                <select name="gender" value={formData.gender} onChange={handleChange} required>
                                    <option value="">Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div className="form-input-group">
                                <label><i className="fas fa-stethoscope"></i> Specialization</label>
                                <select name="specialization" value={formData.specialization} onChange={handleChange} required>
                                    <option value="">Select Domain</option>
                                    {specializations.map((spec, index) => (
                                        <option key={index} value={spec}>{spec}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="form-grid">
                            <div className="form-input-group" style={{ gridColumn: 'span 1' }}>
                                <label><i className="fas fa-graduation-cap"></i> Qualification</label>
                                <select name="qualification" value={formData.qualification} onChange={handleChange} required>
                                    <option value="">Select Credential</option>
                                    {qualifications.map((qual, index) => (
                                        <option key={index} value={qual}>{qual}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-input-group">
                                <label><i className="fas fa-award"></i> Exp (Years)</label>
                                <input type="number" name="experience" placeholder="10"
                                    value={formData.experience} onChange={handleChange} required />
                            </div>
                        </div>

                        <div className="form-input-group">
                            <label><i className="fas fa-phone-alt"></i> Contact Number</label>
                            <input type="tel" name="contactNumber" placeholder="+1 234 567 890"
                                value={formData.contactNumber} onChange={handleChange} required />
                        </div>

                        <div className="form-actions-edit">
                            <button type="submit" className="update-btn">
                                <i className="fas fa-save"></i> Synchronize Profile
                            </button>
                            <button type="button" className="cancel-btn-edit" onClick={onClose}>Discard</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditDoctor;