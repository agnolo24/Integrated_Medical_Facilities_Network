import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { JitsiMeeting } from '@jitsi/react-sdk';
import axios from 'axios';
import './MeetingRoom.css';
import PatientHeader from '../Patient/PatientHeader/PatientHeader';
import DoctorHeader from '../Doctor/DoctorHeader/DoctorHeader';
import PatientFooter from '../Patient/PatientFooter/PatientFooter';
import DoctorFooter from '../Doctor/DoctorFooter/DoctorFooter';

const MeetingRoom = () => {
    const { appointmentId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [appointment, setAppointment] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const [roomName, setRoomName] = useState(null);
    const [displayName, setDisplayName] = useState('');

    useEffect(() => {
        const role = localStorage.getItem('role');
        const loginId = localStorage.getItem('loginId');
        setUserRole(role);

        if (!loginId || !appointmentId) {
            navigate('/login');
            return;
        }

        const verifyAndFetch = async () => {
            try {
                // 1. Verify access with backend portal check
                const portalResponse = await axios.get(`http://127.0.0.1:8000/patient/get_portal_data/`, {
                    params: { login_id: loginId, appointment_id: appointmentId }
                });

                if (portalResponse.status === 200) {
                    setRoomName(`IMFN-Meeting-${appointmentId}`);

                    // 2. Fetch display details based on role
                    if (role === 'patient') {
                        const aptResponse = await axios.get(`http://127.0.0.1:8000/patient/get_patient_med_history/`, {
                            params: { patient_login_id: loginId }
                        });
                        const currentApt = aptResponse.data.find(a => a.appointment_id === appointmentId);
                        setAppointment(currentApt);
                        setDisplayName(localStorage.getItem('userName') || 'Patient');
                    } else if (role === 'doctor') {
                        const aptResponse = await axios.get(`http://127.0.0.1:8000/doctor/get_patient_appointment_details/`, {
                            params: { login_id: loginId, apt_id: appointmentId }
                        });
                        const data = aptResponse.data;
                        // Map doctor data to a compatible format for the UI
                        setAppointment({
                            doctor_name: data.doctor_name,
                            patient_name: data.patient_name,
                            time_slot: data.time_slot
                        });
                        setDisplayName(`Dr. ${localStorage.getItem('userName')}` || 'Doctor');
                    }
                }
            } catch (err) {
                console.error("Portal access error:", err);
                setError(err.response?.data?.error || "You cannot join this meeting at this time.");
            } finally {
                setLoading(false);
            }
        };

        verifyAndFetch();
    }, [appointmentId, navigate]);

    if (loading) {
        return (
            <div className="meeting-status-container">
                <div className="spinner"></div>
                <h2>Verifying meeting access...</h2>
            </div>
        );
    }

    if (error) {
        return (
            <div className="meeting-status-container">
                <div className="error-card">
                    <i className="fas fa-exclamation-triangle fa-3x"></i>
                    <h2>Access Denied</h2>
                    <p>{error}</p>
                    <button onClick={() => navigate(-1)} className="back-btn">Go Back</button>
                </div>
            </div>
        );
    }

    return (
        <div className="meeting-page">
            {userRole === 'patient' ? <PatientHeader /> : <DoctorHeader />}

            <div className="meeting-container">
                <div className="meeting-info-bar">
                    <div className="info-item">
                        <span className="label">Appointment with</span>
                        <span className="value">{userRole === 'patient' ? `Dr. ${appointment?.doctor_name}` : appointment?.patient_name}</span>
                    </div>
                    <div className="info-item">
                        <span className="label">Scheduled Time</span>
                        <span className="value">{appointment?.time_slot}</span>
                    </div>
                    <button className="leave-btn" onClick={() => navigate(-1)}>
                        Leave Meeting
                    </button>
                </div>

                <div className="jitsi-wrapper">
                    <JitsiMeeting
                        domain="meet.jit.si"
                        roomName={roomName}
                        configOverwrite={{
                            startWithAudioMuted: true,
                            disableModeratorIndicator: true,
                            startScreenSharing: true,
                            enableEmailInStats: false
                        }}
                        interfaceConfigOverwrite={{
                            DISABLE_JOIN_LEAVE_NOTIFICATIONS: true
                        }}
                        userInfo={{
                            displayName: displayName
                        }}
                        onApiReady={(externalApi) => {
                            // setup event listeners if needed
                        }}
                        getIFrameRef={(iframeRef) => {
                            iframeRef.style.height = '700px';
                        }}
                    />
                </div>
            </div>

            {userRole === 'patient' ? <PatientFooter /> : <DoctorFooter />}
        </div>
    );
};

export default MeetingRoom;
