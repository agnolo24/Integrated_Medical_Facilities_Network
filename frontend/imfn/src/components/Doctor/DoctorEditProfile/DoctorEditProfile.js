import React, { useState, useEffect } from 'react'
import axios from 'axios';
import '../../Hospital/HospitalProfile/HospitalProfile.css';

export default function DoctorEditProfile({ doctorData, onClose }) {
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
        'Cardiology', 'Dermatology', 'Endocrinology', 'Gastroenterology', 'General Medicine', 'General Surgery',
        'Gynecology', 'Hematology', 'Neurology', 'Obstetrics', 'Oncology', 'Ophthalmology', 'Orthopedics',
        'Otolaryngology (ENT)', 'Pediatrics', 'Psychiatry', 'Pulmonology', 'Radiology', 'Urology'
    ];

    const qualifications = [
        'MBBS', 'MD (Doctor of Medicine)', 'MS (Master of Surgery)', 'DNB (Diplomate of National Board)',
        'DM (Doctorate of Medicine)', 'MCh (Master of Chirurgiae)', 'BDS (Bachelor of Dental Surgery)',
        'MDS (Master of Dental Surgery)', 'BAMS (Bachelor of Ayurvedic Medicine and Surgery)',
        'BHMS (Bachelor of Homeopathic Medicine and Surgery)', 'BUMS (Bachelor of Unani Medicine and Surgery)',
        'BVSc & AH (Bachelor of Veterinary Science and Animal Husbandry)', 'BPT (Bachelor of Physiotherapy)'
    ];

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const hospital_login_id = localStorage.getItem("loginId");
        try {
            await axios.put(editDoctorUrl, {
                ...formData,
                hospital_login_id,
                doctorId: doctorData._id
            });
            alert("Doctor updated successfully!");
            onClose();
            window.location.reload(); // Refresh to show optimized data
        } catch (error) {
            alert(error?.response?.data?.error || "An Error Occurred while Updating");
        }
    };

    return (
        <div className="profile-overlay" onClick={onClose}>
            <div className="profile-modal" onClick={e => e.stopPropagation()}>
                <button className="close-btn" onClick={onClose}>&times;</button>
                <div className="profile-header">
                    <h2>Edit Doctor Profile</h2>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="profile-body">
                        <div className="info-group">
                            <label>Full Name</label>
                            <input type="text" name="name" className="form-control"
                                value={formData.name} onChange={handleChange} required />
                        </div>
                        <div className="info-group">
                            <label>Gender</label>
                            <select name="gender" className="form-control" value={formData.gender} onChange={handleChange} required>
                                <option value="">Select</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div className="info-group">
                            <label>Specialization</label>
                            <select name="specialization" className="form-control" value={formData.specialization} onChange={handleChange} required>
                                <option value="">Select</option>
                                {specializations.map((spec, index) => (
                                    <option key={index} value={spec}>{spec}</option>
                                ))}
                            </select>
                        </div>
                        <div className="info-group">
                            <label>Qualification</label>
                            <select name="qualification" className="form-control" value={formData.qualification} onChange={handleChange} required>
                                <option value="">Select</option>
                                {qualifications.map((qual, index) => (
                                    <option key={index} value={qual}>{qual}</option>
                                ))}
                            </select>
                        </div>
                        <div className="info-group">
                            <label>Experience (Years)</label>
                            <input type="number" name="experience" className="form-control" value={formData.experience} onChange={handleChange} required />
                        </div>
                        <div className="info-group">
                            <label>Contact Number</label>
                            <input type="tel" name="contactNumber" className="form-control" value={formData.contactNumber} onChange={handleChange} required />
                        </div>
                    </div>
                    <div className="profile-footer">
                        <button type="submit" className="edit-btn">Update Details</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

