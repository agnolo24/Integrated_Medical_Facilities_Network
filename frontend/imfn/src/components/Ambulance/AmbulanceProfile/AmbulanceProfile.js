import React,{useEffect} from "react";

import './AmbulanceProfile.css'

function AmbulanceProfile({AmbulanceData, handleOpenEditProfile, handleOpenChangePassword}){

    return (
    <div className="profile-card">
      <div className="profile-icon-container">
        <i className="fas fa-user-md profile-icon"></i>
      </div>
      <h2>AMBULANCE DETAILS</h2>
      <h4>{AmbulanceData.ambulanceType}</h4>
      <p>{AmbulanceData.category}</p>
      <p>Email: <a href={`mailto:${AmbulanceData.email}`}>{AmbulanceData.email}</a></p>
      <p>Phone: <a href={`tel:${AmbulanceData.contactNumber}`}>{AmbulanceData.contactNumber}</a></p>
      <div className="profile-actions">
        <button className="edit-button"
          onClick={handleOpenEditProfile}
        >Edit</button>
        <button className="password-btn" onClick={handleOpenChangePassword} >Change Password</button>
      </div>
    </div>
  );
}


export default AmbulanceProfile