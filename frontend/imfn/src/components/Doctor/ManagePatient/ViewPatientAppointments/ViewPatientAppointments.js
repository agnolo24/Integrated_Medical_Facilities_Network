import React, { useState, useEffect } from 'react';
import DoctorHeader from '../../DoctorHeader/DoctorHeader';
import DoctorFooter from '../../DoctorFooter/DoctorFooter';
import './ViewPatientAppointments.css';
import axios from 'axios';
import ViewPatientAppointmentDetails from '../ViewPatientAppointmentDetails/ViewPatientAppointmentDetails';
import CheckHistoryCode from '../CheckHistoryCode/CheckHistoryCode';
import ViewPrescriptionByDoctor from '../ViewPrescriptionByDoctor/ViewPrescriptionByDoctor';

export default function ViewPatientAppointments() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('scheduled');
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState([])
  const [isAppointmentDetailsOpen, setIsAppointmentDetailsOpen] = useState(false)
  const [isCheckHistoryCodeOpen, setIsCheckHistoryCodeOpen] = useState(false)
  const [isViewPrescriptionOpen, setIsViewPrescriptionOpen] = useState(false)

  const openViewPrescription = (_id) => {
    setSelectedAppointmentId(_id)
    setIsViewPrescriptionOpen(true)
  }

  const closeViewPrescription = () => setIsViewPrescriptionOpen(false)

  const openAppointmentDetails = (_id) => {
    setSelectedAppointmentId(_id)
    setIsAppointmentDetailsOpen(true)
  }

  const openCheckHistoryCode = (_id) => {
    setSelectedAppointmentId(_id)
    setIsCheckHistoryCodeOpen(true)
  }

  const closeCheckHistoryCode = () => setIsCheckHistoryCodeOpen(false)

  const closeAppointmentDetails = () =>{ 
    setIsAppointmentDetailsOpen(false)
    fetchData()
  }



  const fetchData = async () => {

    const URL = "http://127.0.0.1:8000/doctor/get_patient_appointment/"

    const login_id = localStorage.getItem("loginId")
    const response = await axios.get(URL, { params: { login_id: login_id, time_filter: filterStatus } });
    if (response.data && response.data.appointments) {
      setAppointments(response.data.appointments);
    }
  }
  useEffect(() => {
    fetchData();
  }, [filterStatus]);

  const filteredAppointments = appointments.filter(apt => {
    const matchesSearch = apt.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (apt._id && apt._id.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = filterStatus === 'all' || apt.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'scheduled': return 'vpa-status-scheduled';
      case 'completed': return 'vpa-status-completed';
      case 'cancelled': return 'vpa-status-cancelled';
      default: return '';
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <DoctorHeader />

      <div className="vpa-container">
        <div className="vpa-header">
          <h1 className="vpa-title">My Appointments</h1>
          <p className="vpa-subtitle">Manage and view your upcoming patient schedules</p>
        </div>

        <div className="vpa-content">
          <div className="vpa-controls">
            <div className="vpa-search-box">
              <i className="fas fa-search vpa-search-icon"></i>
              <input
                type="text"
                className="vpa-search-input"
                placeholder="Search patients or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="vpa-filter-group">
              {['all', 'scheduled', 'completed', 'cancelled',].map(status => (
                <button
                  key={status}
                  className={`vpa-filter-btn ${filterStatus === status ? 'active' : ''}`}
                  onClick={() => setFilterStatus(status)}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="vpa-table-wrapper">
            <table className="vpa-table">
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Date & Time</th>
                  <th>Type</th>
                  <th>Reason</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredAppointments.length > 0 ? (
                  filteredAppointments.map(apt => (
                    <tr key={apt._id}>
                      <td>
                        <div style={{ fontWeight: '600', color: '#2c3e50' }}>{apt.patientName}</div>
                        {/* <div style={{ fontSize: '0.8rem', color: '#95a5a6' }}>ID: {apt.id} • {apt.age}y/{apt.gender}</div> */}
                      </td>
                      <td>
                        <div style={{ color: '#34495e' }}>{apt.appointment_date}</div>
                        <div style={{ fontSize: '0.85rem', color: '#7f8c8d' }}>{apt.time_slot}</div>
                      </td>
                      <td>{apt.appointment_type}</td>
                      <td>
                        <div style={{ maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: '#7f8c8d' }}>
                          {apt.reason}
                        </div>
                      </td>
                      <td>
                        <span className={`vpa-status-badge ${getStatusBadgeClass(apt.status)}`}>
                          {apt.status}
                        </span>
                      </td>
                      <td>

                        {/*  View Details */}
                        <button className="vpa-action-btn vpa-btn-view" title="View Details" onClick={() => openAppointmentDetails(apt._id)} >
                          <i className="fas fa-eye"></i>
                        </button>

                        {/* View Prescription */}
                        <button className="vpa-action-btn vpa-btn-prescription" title="View Prescription" onClick={() => openViewPrescription(apt._id)}>
                          <i className="fas fa-file-medical"></i>
                        </button>

                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '3rem', color: '#bdc3c7' }}>
                      <i className="far fa-calendar-times" style={{ fontSize: '2rem', marginBottom: '1rem', display: 'block' }}></i>
                      No appointments found matching your criteria
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {
        isAppointmentDetailsOpen && (
          <ViewPatientAppointmentDetails selectedAppointmentId={selectedAppointmentId} closeAppointmentDetails={closeAppointmentDetails} openCheckHistoryCode={openCheckHistoryCode} openViewPrescription={openViewPrescription} />
        )
      }
      {
        isCheckHistoryCodeOpen && (
          <CheckHistoryCode selectedAppointmentId={selectedAppointmentId} closeCheckHistoryCode={closeCheckHistoryCode} />
        )
      }
      
      {
        isViewPrescriptionOpen && (
          <ViewPrescriptionByDoctor selectedAppointmentId={selectedAppointmentId} closeViewPrescription={closeViewPrescription} />
        )
      }

      <DoctorFooter />
    </div>
  );
}
