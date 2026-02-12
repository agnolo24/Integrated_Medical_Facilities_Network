import React, { useEffect, useState } from 'react';
import axios from 'axios';

import HospitalHeader from '../../HospitalHeader/HospitalHeader';
import HospitalFooter from '../../HospitalFooter/HospitalFooter';
import EditAmbulance from '../EditAmbulance/EditAmbulance';
import AssignDuty from '../AssignDuty/AssignDuty';

import './ViewAmbulance.css';

function ViewAmbulance() {
  const viewAmbulanceUrl = 'http://127.0.0.1:8000/hospital/view_ambulance/';
  const deleteAmbulanceUrl = 'http://127.0.0.1:8000/hospital/delete_ambulance/';

  const hospital_login_id = localStorage.getItem('loginId');

  const [ambulances, setAmbulances] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedAmbulance, setSelectedAmbulance] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [assignDuty, setAssignDuty] = useState(false)

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const response = await axios.get(viewAmbulanceUrl, {
        params: { hospital_login_id: hospital_login_id }
      });
      setAmbulances(response.data.ambulances);
    } catch (error) {
      console.error("Error fetching ambulances:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (ambulance) => {
    setSelectedAmbulance(ambulance);
    setIsModalOpen(true);
  };

  const handleCloseModel = () => {
    setIsModalOpen(false);
    setSelectedAmbulance(null);
    getData();
  };

  const handleDutyClick = (ambulance) => {
    setSelectedAmbulance(ambulance);
    setAssignDuty(true)
    console.log(ambulance)
  };

  const handleCloseAssignDuty = () => {
    setAssignDuty(false);
    setSelectedAmbulance(null);
    getData();
  };

  const handleDelete = async (ambulance) => {
    const res = window.confirm(`Are you sure you want to delete ${ambulance.name}?`);

    if (res) {
      try {
        await axios.delete(deleteAmbulanceUrl, {
          data: {
            ambulanceId: ambulance._id,
            hospital_login_id: hospital_login_id
          }
        });
        alert("Successfully Deleted " + ambulance.name);
        getData();
      } catch (error) {
        console.error("Delete error:", error);
        alert("Failed to delete.");
      }

    }
  };

  return (
    <div className="page-container">
      <HospitalHeader />

      <main className="content-wrapper">
        <header className="view-header">
          <h1>Emergency Fleet Explorer</h1>
          <p>Monitor and coordinate emergency response vehicles in real-time.</p>
        </header>

        {loading ? (
          <div className="loader">
            <i className="fas fa-spinner fa-spin"></i>
            <p>Scanning Emergency Network...</p>
          </div>
        ) : ambulances.length > 0 ? (
          <div className="ambulance-grid">
            {ambulances.map((amp) => (
              <div key={amp._id} className="ambulance-card">
                <div className="card-top-decoration"></div>
                <div className="card-badge">{amp.category}</div>

                <div className="ambulance-card-content">
                  <div className="ambulance-avatar-section">
                    <div className="ambulance-icon-box">
                      <i className="fas fa-ambulance"></i>
                    </div>
                    <div className="ambulance-main-info">
                      <h3>{amp.name}</h3>
                      <p className="ambulance-type">{amp.ambulanceType}</p>
                    </div>
                  </div>

                  <div className="details-grid">
                    <div className="detail-item">
                      <i className="fas fa-hashtag"></i>
                      <span><strong>Vehicle No:</strong> {amp.vehicleNumber}</span>
                    </div>
                    <div className="detail-item">
                      <i className="fas fa-phone-alt"></i>
                      <span><strong>Contact:</strong> {amp.contactNumber}</span>
                    </div>
                    <div className="detail-item">
                      <i className="fas fa-envelope-open"></i>
                      <span><strong>Email:</strong> {amp.email}</span>
                    </div>
                  </div>

                  <div className="ambulance-actions">
                    <div className="action-row-main">
                      <button className="modern-btn edit-btn" onClick={() => handleEditClick(amp)}>
                        <i className="fas fa-wrench"></i> Edit
                      </button>
                      <button className="modern-btn delete-btn" onClick={() => handleDelete(amp)}>
                        <i className="fas fa-trash-alt"></i> Retire
                      </button>
                    </div>

                    {amp.available === 0 ? (
                      <button className="modern-btn duty-btn pending" disabled>
                        <i className="fas fa-clock"></i> Duty Pending
                      </button>
                    ) : amp.available === 2 ? (
                      <button className="modern-btn duty-btn accepted" disabled>
                        <i className="fas fa-check-double"></i> Duty Accepted
                      </button>
                    ) : (
                      <button className="modern-btn duty-btn assign" onClick={() => handleDutyClick(amp)}>
                        <i className="fas fa-map-marked-alt"></i> Assign Emergency Duty
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-data">
            <i className="fas fa-truck-monster" style={{ fontSize: '3.5rem', color: '#fca5a5', marginBottom: '1.5rem' }}></i>
            <p>No emergency vehicles registered in your facility's fleet.</p>
            <button className="modern-btn duty-btn assign" style={{ maxWidth: '220px', margin: '1.5rem auto' }} onClick={() => window.location.reload()}>
              Refresh Fleet Status
            </button>
          </div>
        )}
      </main>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-button" onClick={handleCloseModel}>&times;</button>
            <div className="modal-inner-scroll">
              <EditAmbulance ambulanceData={selectedAmbulance} onClose={handleCloseModel} />
            </div>
          </div>
        </div>
      )}

      {assignDuty && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-button" onClick={handleCloseAssignDuty}>&times;</button>
            <div className="modal-inner-scroll">
              <AssignDuty ambulanceData={selectedAmbulance} onClose={handleCloseAssignDuty} />
            </div>
          </div>
        </div>
      )}

      <HospitalFooter />
    </div>
  );
}

export default ViewAmbulance;
