import React, { useState, useEffect } from 'react';
import DoctorHeader from '../../DoctorHeader/DoctorHeader';
import DoctorFooter from '../../DoctorFooter/DoctorFooter';
import './ViewPatientAppointments.css';

export default function ViewPatientAppointments() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('scheduled');
  const [appointments, setAppointments] = useState([]);

  // Mock data to simulate API response

  const fetchData = async () => {
    const mockData = [
      {
        id: 'APT001',
        patientName: 'John Doe',
        age: 32,
        gender: 'Male',
        date: '2023-10-25',
        time: '09:00 AM',
        type: 'General Checkup',
        status: 'scheduled',
        reason: 'Persistent headache and fatigue'
      },
      {
        id: 'APT002',
        patientName: 'Sarah Smith',
        age: 28,
        gender: 'Female',
        date: '2023-10-25',
        time: '10:30 AM',
        type: 'Follow-up',
        status: 'completed',
        reason: 'Post-surgery review'
      },
      {
        id: 'APT003',
        patientName: 'Michael Brown',
        age: 45,
        gender: 'Male',
        date: '2023-10-26',
        time: '11:00 AM',
        type: 'Consultation',
        status: 'scheduled',
        reason: 'Knee pain evaluation'
      },
      {
        id: 'APT004',
        patientName: 'Emily Wilson',
        age: 35,
        gender: 'Female',
        date: '2023-10-24',
        time: '02:00 PM',
        type: 'Emergency',
        status: 'cancelled',
        reason: 'High fever'
      },
      {
        id: 'APT005',
        patientName: 'Robert Johnson',
        age: 55,
        gender: 'Male',
        date: '2023-10-27',
        time: '09:30 AM',
        type: 'Routine Checkup',
        status: 'scheduled',
        reason: 'Annual physical'
      }
    ];
    setAppointments(mockData);
  }
  useEffect(() => {
    fetchData();
  }, []);

  const filteredAppointments = appointments.filter(apt => {
    const matchesSearch = apt.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.id.toLowerCase().includes(searchTerm.toLowerCase());
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
              {['all', 'scheduled', 'completed', 'cancelled'].map(status => (
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
                    <tr key={apt.id}>
                      <td>
                        <div style={{ fontWeight: '600', color: '#2c3e50' }}>{apt.patientName}</div>
                        {/* <div style={{ fontSize: '0.8rem', color: '#95a5a6' }}>ID: {apt.id} • {apt.age}y/{apt.gender}</div> */}
                      </td>
                      <td>
                        <div style={{ color: '#34495e' }}>{apt.date}</div>
                        <div style={{ fontSize: '0.85rem', color: '#7f8c8d' }}>{apt.time}</div>
                      </td>
                      <td>{apt.type}</td>
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
                        <button className="vpa-action-btn vpa-btn-view" title="View Details">
                          <i className="fas fa-eye"></i>
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

      <DoctorFooter />
    </div>
  );
}
