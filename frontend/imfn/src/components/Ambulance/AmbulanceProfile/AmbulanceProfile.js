import React from "react";
import './AmbulanceProfile.css'

function AmbulanceProfile({ AmbulanceData, handleOpenEditProfile, handleOpenChangePassword, onClose }) {

  return (
    <div className="ambulance-profile-overlay" onClick={onClose}>
      <div className="ambulance-profile-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-modal-btn" onClick={onClose}>&times;</button>
        <div className="ambulance-profile-card">

          <div className="profile-header-section">
            <div className="profile-avatar-wrapper">
              <i className="fas fa-ambulance profile-avatar-icon"></i>
            </div>
            <h2 className="profile-name">AMBULANCE DETAILS</h2>
            <span className="profile-badge">{AmbulanceData.ambulanceType || 'General'}</span>
          </div>

          <div className="profile-details-section">
            <div className="detail-row">
              <span className="detail-label">Category</span>
              <span className="detail-value">{AmbulanceData.category || 'N/A'}</span>
            </div>

            <div className="detail-row">
              <span className="detail-label">Email</span>
              <span className="detail-value">
                <a href={`mailto:${AmbulanceData.email}`} className="contact-link">{AmbulanceData.email}</a>
              </span>
            </div>

            <div className="detail-row">
              <span className="detail-label">Phone</span>
              <span className="detail-value">
                <a href={`tel:${AmbulanceData.contactNumber}`} className="contact-link">{AmbulanceData.contactNumber}</a>
              </span>
            </div>
          </div>

          <div className="profile-actions-section">
            <button className="action-btn primary-btn" onClick={handleOpenEditProfile}>
              <i className="fas fa-edit"></i> Edit Profile
            </button>
            <button className="action-btn secondary-btn" onClick={handleOpenChangePassword}>
              <i className="fas fa-key"></i> Change Password
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default AmbulanceProfile;