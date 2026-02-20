
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ManageReports.css';

function ManageReports() {
    const [reports, setReports] = useState([]);
    const [selectedReport, setSelectedReport] = useState(null);
    const [interactions, setInteractions] = useState([]);
    const [chats, setChats] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const adminLoginId = localStorage.getItem('loginId');
    const baseUrl = "http://127.0.0.1:8000/webAdmin/";
    const patientBaseUrl = "http://127.0.0.1:8000/patient/";

    useEffect(() => {
        fetchReports();
    }, []);

    useEffect(() => {
        if (selectedReport) {
            fetchInteractions(selectedReport.patient_login_id, selectedReport.hospital_login_id);
            fetchChats(selectedReport._id);
            const interval = setInterval(() => fetchChats(selectedReport._id), 3000);
            return () => clearInterval(interval);
        }
    }, [selectedReport]);

    const fetchReports = async () => {
        try {
            const response = await axios.get(`${baseUrl}get_all_reports/`);
            setReports(response.data);
        } catch (error) {
            console.error("Error fetching reports:", error);
        }
    };

    const fetchInteractions = async (patientId, hospitalId) => {
        try {
            const response = await axios.get(`${baseUrl}get_interactions/?patient_login_id=${patientId}&hospital_login_id=${hospitalId}`);
            setInteractions(response.data);
        } catch (error) {
            console.error("Error fetching interactions:", error);
        }
    };

    const fetchChats = async (reportId) => {
        try {
            const response = await axios.get(`${patientBaseUrl}report_chat/?report_id=${reportId}`);
            setChats(response.data);
        } catch (error) {
            console.error("Error fetching chats:", error);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        try {
            await axios.post(`${patientBaseUrl}send_report_message/`, {
                report_id: selectedReport._id,
                sender_id: adminLoginId,
                sender_type: 'admin',
                message: newMessage
            });
            setNewMessage('');
            fetchChats(selectedReport._id);

            // Auto update status to investigating if pending
            if (selectedReport.status === 'pending') {
                updateStatus(selectedReport._id, 'investigating');
            }
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    const updateStatus = async (reportId, newStatus) => {
        try {
            await axios.post(`${baseUrl}update_report_status/`, {
                report_id: reportId,
                status: newStatus
            });
            fetchReports();
            if (selectedReport?._id === reportId) {
                setSelectedReport({ ...selectedReport, status: newStatus });
            }
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    return (
        <div className="manage-reports-container">
            <div className="reports-list-panel">
                <div className="panel-header">
                    <h2>Patient Complaints</h2>
                </div>
                <div className="reports-scroll">
                    {reports.map(report => (
                        <div
                            key={report._id}
                            className={`report-card ${selectedReport?._id === report._id ? 'selected' : ''}`}
                            onClick={() => setSelectedReport(report)}
                        >
                            <div className="report-card-header">
                                <span className={`status-pill ${report.status}`}>{report.status}</span>
                                <span className="report-date">{new Date(report.created_at).toLocaleDateString()}</span>
                            </div>
                            <h3>{report.patient_name}</h3>
                            <p className="vs">vs</p>
                            <h3>{report.hospital_name}</h3>
                        </div>
                    ))}
                </div>
            </div>

            <div className="report-details-panel">
                {selectedReport ? (
                    <div className="details-layout">
                        <div className="main-content">
                            <div className="report-info">
                                <h2>Report Details</h2>
                                <div className="info-grid">
                                    <div className="info-item">
                                        <label>Patient</label>
                                        <p>{selectedReport.patient_name}</p>
                                    </div>
                                    <div className="info-item">
                                        <label>Hospital</label>
                                        <p>{selectedReport.hospital_name}</p>
                                    </div>
                                    <div className="info-item full">
                                        <label>Complaint</label>
                                        <p className="complaint-text">{selectedReport.report_text}</p>
                                    </div>
                                </div>
                                <div className="status-actions">
                                    <button onClick={() => updateStatus(selectedReport._id, 'investigating')} className="btn-investigate">Mark Investigating</button>
                                    <button onClick={() => updateStatus(selectedReport._id, 'resolved')} className="btn-resolve">Mark Resolved</button>
                                </div>
                            </div>

                            <div className="interactions-section">
                                <h2>Recent Interactions</h2>
                                <div className="interactions-list">
                                    {interactions.length === 0 ? <p>No previous interactions found.</p> :
                                        interactions.map((item, idx) => (
                                            <div key={idx} className={`interaction-item ${item.type}`}>
                                                <div className="type-icon">{item.type === 'appointment' ? '📅' : '🚨'}</div>
                                                <div className="item-info">
                                                    <strong>{item.type.toUpperCase()}</strong>
                                                    <span>{new Date(item.appointment_date || item.created_at).toLocaleDateString()}</span>
                                                    <p>{item.reason || item.emergency_type || 'No details provided'}</p>
                                                    <span className={`item-status ${item.status}`}>{item.status}</span>
                                                </div>
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                        </div>

                        <div className="admin-chat-sidebar">
                            <h3>Response Chat</h3>
                            <div className="chat-viewport">
                                {chats.map((chat, idx) => (
                                    <div key={idx} className={`message-wrapper ${chat.sender_type}`}>
                                        <div className="msg-bubble">
                                            <p>{chat.message}</p>
                                            <small>{new Date(chat.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</small>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <form className="chat-form" onSubmit={handleSendMessage}>
                                <input
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Type reply to patient..."
                                />
                                <button type="submit">Send</button>
                            </form>
                        </div>
                    </div>
                ) : (
                    <div className="empty-state">
                        <div className="empty-icon">📁</div>
                        <h3>Select a report to view details and interactions</h3>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ManageReports;
