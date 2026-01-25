import React from 'react';
import { useNavigate } from 'react-router';

const HospitalDetailsModal = ({ data, onClose }) => {
    const navigate = useNavigate();

    if (!data) return null;

    const viewHistory = (doctor) => {
        navigate('/doctorAppointmentHistory', {
            state: {
                doctor: doctor,
                hospitalName: data.hospital.hospitalName
            }
        });
    };

    return (
        <div className="modal-overlay-custom" onClick={onClose}>
            <div className="modal-content-glass" onClick={e => e.stopPropagation()}>
                <button className="close-modal-btn" onClick={onClose}>
                    <i className="fas fa-times"></i>
                </button>

                <div className="modal-header">
                    <h2>{data.hospital.hospitalName}</h2>
                </div>

                <div className="modal-body">
                    <div className="sub-table-header">
                        <i className="fas fa-info-circle"></i> Hospital Information
                    </div>
                    <div className="detail-row">
                        <div className="detail-item">
                            <strong>Registration ID</strong>
                            <span>{data.hospital.registrationId}</span>
                        </div>
                        <div className="detail-item">
                            <strong>Contact</strong>
                            <span>{data.hospital.contactNumber}</span>
                        </div>
                        <div className="detail-item">
                            <strong>Address</strong>
                            <span>{data.hospital.hospitalAddress}</span>
                        </div>
                        <div className="detail-item">
                            <strong>Email</strong>
                            <span>{data.hospital.email}</span>
                        </div>
                    </div>


                    <div className="sub-table-header">
                        <i className="fas fa-user-md"></i> Registered Doctors ({data.doctors.length})
                    </div>
                    <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                        <table className="custom-table" style={{ fontSize: '14px' }}>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Specialization</th>
                                    <th>Qualification</th>
                                    <th>Experience</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.doctors.length > 0 ? data.doctors.map(d => (
                                    <tr key={d._id}>
                                        <td>Dr. {d.name}</td>
                                        <td>{d.specialization}</td>
                                        <td>{d.qualification}</td>
                                        <td>{d.experience} Years</td>
                                        <td>
                                            <button
                                                className="btn btn-secondary btn-sm"
                                                title="View Appointment History"
                                                onClick={() => viewHistory(d)}
                                            >
                                                <i className="fas fa-history me-1"></i> History
                                            </button>
                                        </td>
                                    </tr>
                                )) : <tr><td colSpan="5" className="text-center">No doctors registered</td></tr>}
                            </tbody>
                        </table>
                    </div>


                    <div className="sub-table-header">
                        <i className="fas fa-ambulance"></i> Registered Ambulances ({data.ambulances.length})
                    </div>
                    <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                        <table className="custom-table" style={{ fontSize: '14px' }}>
                            <thead>
                                <tr>
                                    <th>Vehicle No</th>
                                    <th>Type</th>
                                    <th>Category</th>
                                    <th>Driver Contact</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.ambulances.length > 0 ? data.ambulances.map(a => (
                                    <tr key={a._id}>
                                        <td>{a.vehicleNumber}</td>
                                        <td>{a.ambulanceType}</td>
                                        <td>{a.category}</td>
                                        <td>{a.contactNumber}</td>
                                    </tr>
                                )) : <tr><td colSpan="4" className="text-center">No ambulances registered</td></tr>}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HospitalDetailsModal;
