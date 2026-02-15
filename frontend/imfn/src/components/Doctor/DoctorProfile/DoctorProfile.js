import '../../Hospital/HospitalProfile/HospitalProfile.css';
import React from 'react';

export default function DoctorProfile({ doctorData, handleOpenEditProfile, onClose , handleOpenChangePassword}) {

  return (
    <div className="profile-overlay" onClick={onClose}>
      <div className="profile-modal" onClick={(e) => e.stopPropagation()}>
        <button style={{'color':'blue'}} className="close-btn" onClick={onClose}>&times;</button>
        <div className="profile-header">
          <div className="profile-avatar">
            <i className="fas fa-user-md"></i>
          </div>
          <h2>Dr. {doctorData.name}</h2>
          <p className="profile-role">{doctorData.specialization}</p>
        </div>
        <div className="profile-body">
          <div className="info-group">
            <label>Qualification</label>
            <p>{doctorData.qualification}</p>
          </div>
          <div className="info-group">
            <label>Experience</label>
            <p>{doctorData.experience} Years</p>
          </div>
          <div className="info-group">
            <label>Email</label>
            <p>{doctorData.email}</p>
          </div>
          <div className="info-group">
            <label>Contact Number</label>
            <p>{doctorData.contactNumber}</p>
          </div>
          <div className="info-group">
            <label>Gender</label>
            <p>{doctorData.gender}</p>
          </div>
        </div>
        <div className="profile-footer">
          <button className="edit-btn" onClick={handleOpenEditProfile}>Edit Profile</button>

          {/* Reuse the style of change password button from HospitalProfile if possible, or keep simple button */}
          {/* Since DoctorProfile originally didn't implement change password logic here but just a button, we keep it simple or implement similar logic if requested. 
              The user asked to "change the design... just like the doctor, patent and ambulance". 
              Wait, the user said "like the doctor". But doctor didn't have the nice design. 
              The user said "i really like the design you implemented for the profile view... for the uniform design can you change the design of the doctor...".
              So I should use the new design.
          */}
          {/* Note: Original DoctorProfile had a placeholder Change Password. I'll add the button styled correctly but without logic for now unless I see it elsewhere. 
               Actually, I should probably add the logic if I can, but let's stick to design first.
           */}
          <button className="password-btn" onClick={handleOpenChangePassword}>Change Password</button>
        </div>
      </div>
    </div>
  );
}






