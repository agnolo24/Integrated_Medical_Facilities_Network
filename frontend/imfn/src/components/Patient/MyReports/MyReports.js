
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PatientHeader from '../PatientHeader/PatientHeader';
import PatientFooter from '../PatientFooter/PatientFooter';
import './MyReports.css';

function MyReports() {
    const [reports, setReports] = useState([]);
    const [selectedReport, setSelectedReport] = useState(null);
    const [chats, setChats] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const loginId = localStorage.getItem('loginId');

    const baseUrl = "http://127.0.0.1:8000/patient/";

    useEffect(() => {
        fetchReports();
    }, []);

    useEffect(() => {
        if (selectedReport) {
            fetchChats(selectedReport._id);
            const interval = setInterval(() => fetchChats(selectedReport._id), 3000); // Polling for new messages
            return () => clearInterval(interval);
        }
    }, [selectedReport]);

    const fetchReports = async () => {
        try {
            const response = await axios.get(`${baseUrl}my_reports/?login_id=${loginId}`);
            setReports(response.data);
        } catch (error) {
            console.error("Error fetching reports:", error);
        }
    };

    const fetchChats = async (reportId) => {
        try {
            const response = await axios.get(`${baseUrl}report_chat/?report_id=${reportId}`);
            setChats(response.data);
        } catch (error) {
            console.error("Error fetching chats:", error);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        try {
            await axios.post(`${baseUrl}send_report_message/`, {
                report_id: selectedReport._id,
                sender_id: loginId,
                sender_type: 'patient',
                message: newMessage
            });
            setNewMessage('');
            fetchChats(selectedReport._id);
        } catch (error) {
            console.error("Error sending message:", error);
            alert("Failed to send message");
        }
    };

    return (
        <div className="my-reports-page">
            <PatientHeader />
            <div className="reports-container">
                <div className="reports-sidebar">
                    <h2>My Reports</h2>
                    <div className="reports-list">
                        {reports.length === 0 ? (
                            <p className="no-reports">No reports submitted yet.</p>
                        ) : (
                            reports.map(report => (
                                <div
                                    key={report._id}
                                    className={`report-item ${selectedReport?._id === report._id ? 'active' : ''}`}
                                    onClick={() => setSelectedReport(report)}
                                >
                                    <h3>{report.hospital_name}</h3>
                                    <p className="report-date">{new Date(report.created_at).toLocaleDateString()}</p>
                                    <span className={`status-badge ${report.status}`}>{report.status}</span>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="chat-section">
                    {selectedReport ? (
                        <>
                            <div className="chat-header">
                                <h2>Report against {selectedReport.hospital_name}</h2>
                                <p className="report-text-summary">Reason: {selectedReport.report_text}</p>
                            </div>
                            <div className="chat-box">
                                {chats.map((chat, index) => (
                                    <div key={index} className={`chat-message ${chat.sender_type}`}>
                                        <div className="message-content">
                                            <p>{chat.message}</p>
                                            <span className="message-time">
                                                {new Date(chat.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <form className="chat-input-form" onSubmit={handleSendMessage}>
                                <input
                                    type="text"
                                    placeholder="Type your message..."
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                />
                                <button type="submit">Send</button>
                            </form>
                        </>
                    ) : (
                        <div className="no-report-selected">
                            <p>Select a report to view discussion with Admin</p>
                        </div>
                    )}
                </div>
            </div>
            <PatientFooter />
        </div>
    );
}

export default MyReports;
