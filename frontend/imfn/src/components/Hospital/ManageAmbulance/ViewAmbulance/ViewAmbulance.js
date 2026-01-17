import React, { useEffect, useState } from 'react';
import axios from 'axios';

import HospitalHeader from '../../HospitalHeader/HospitalHeader';
import HospitalFooter from '../../HospitalFooter/HospitalFooter';
// import EditAmbulance from '../EditAmbulance/EditAmbulance'; // Not implemented yet

import './ViewAmbulance.css';

function ViewAmbulance() {
  const viewAmbulanceUrl = 'http://127.0.0.1:8000/hospital/view_ambulance/';
  const hospital_login_id = localStorage.getItem('loginId');

  const [ambulances, setAmbulances] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedAmbulance, setSelectedAmbulance] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
    // setSelectedAmbulance(ambulance);
    // setIsModalOpen(true);
    alert("Edit functionality is currently under development.");
  };

  const handleCloseModel = () => {
    setIsModalOpen(false);
    setSelectedAmbulance(null);
    getData();
  };

  const handleDelete = async (ambulance) => {
    const res = window.confirm(`Are you sure you want to delete ${ambulance.name}?`);

    if (res) {
      alert("Delete functionality is currently under development (requires backend support).");
      /* 
      // Implementation for when endpoint is available
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
       */
    }
  };

  return (
    <div className="page-container">
      <HospitalHeader />

      <main className="content-wrapper">
        <header className="view-header">
          <h1>Emergency Fleet</h1>
          <p>Manage and view all registered ambulances for this facility.</p>
        </header>

        {loading ? (
          <div className="loader">Loading Ambulances...</div>
        ) : ambulances.length > 0 ? (
          <div className="ambulance-grid">
            {ambulances.map((amp) => (
              <div key={amp._id} className="ambulance-card">
                <div className="card-badge">{amp.category}</div>
                <div className="ambulance-info">
                  <h3>{amp.name}</h3>
                  <p className="ambulance-type">{amp.ambulanceType}</p>
                  <div className="details">
                    <span><strong>Vehicle No:</strong> {amp.vehicleNumber}</span>
                    <span><strong>Contact:</strong> {amp.contactNumber}</span>
                  </div>
                  <div className='container mt-3'>
                    <div className='row'>
                      <div className='button-doc col align-self-center'>
                        <button className='btn btn-secondary' style={{ 'borderRadius': '25px' }} onClick={() => handleEditClick(amp)}>Edit</button>
                      </div>
                      <div className='button-doc col align-self-center'>
                        <button className='btn btn-warning' style={{ 'borderRadius': '25px' }} onClick={() => handleDelete(amp)}>Delete</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-data">No ambulances registered.</div>
        )}
      </main>

      {
        isModalOpen && (
          <div className="modal-overlay">
            <div className="modal-content">
              <button className="close-button" onClick={handleCloseModel}>&times;</button>
              <div style={{ padding: '2rem' }}>
                <h2>Edit Ambulance</h2>
                <p>Edit form component would go here.</p>
              </div>
              {/* <EditAmbulance ambulanceData={selectedAmbulance} onClose={handleCloseModel} /> */}
            </div>
          </div>
        )
      }

      <HospitalFooter />
    </div>
  );
}

export default ViewAmbulance;
