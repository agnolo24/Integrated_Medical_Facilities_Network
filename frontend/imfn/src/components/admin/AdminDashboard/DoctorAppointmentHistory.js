import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';
import axios from 'axios';
import AdminSidebar from './AdminSidebar';
import './AdminDashboard.css';
import './DoctorAppointmentHistory.css';

const DoctorAppointmentHistory = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { doctor, hospitalName } = location.state || {};

    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const viewHistoryUrl = "http://127.0.0.1:8000/webAdmin/view_doctor_history/";

    useEffect(() => {
        if (!doctor) {
            navigate('/admin');
            return;
        }
        fetchAppointments();
    }, [doctor]);

    const fetchAppointments = async () => {
        setLoading(true);
        try {
            const response = await axios.get(viewHistoryUrl, {
                params: { doctorId: doctor._id }
            });
            setAppointments(response.data.appointments || response.data || []);
        } catch (error) {
            console.log(error);
            setAppointments([]);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    const formatTime = (timeString) => {
        if (!timeString || timeString === 'N/A') return 'Not Set';
        return timeString;
    };

    const getStatusClass = (status) => {
        const statusLower = (status || '').toLowerCase();
        const statusMap = {
            completed: 'status-completed',
            confirmed: 'status-confirmed',
            pending: 'status-pending',
            cancelled: 'status-cancelled'
        };
        return statusMap[statusLower] || 'status-default';
    };

    const getFilteredAppointments = () => {
        if (filter === 'all') return appointments;
        return appointments.filter(apt =>
            (apt.status || apt.appointment_status || '').toLowerCase() === filter
        );
    };

    const getStats = () => {
        const stats = { total: appointments.length, completed: 0, pending: 0, cancelled: 0 };
        appointments.forEach(apt => {
            const status = (apt.status || apt.appointment_status || '').toLowerCase();
            if (status === 'completed') stats.completed++;
            else if (status === 'pending') stats.pending++;
            else if (status === 'cancelled') stats.cancelled++;
        });
        return stats;
    };

    const stats = getStats();
    const filteredAppointments = getFilteredAppointments();

    if (!doctor) return null;

    return (
        <div className="admin-container">
            <AdminSidebar
                activeTab="hospitals"
                setActiveTab={() => navigate('/admin')}
                onLogout={handleLogout}
            />

            <main className="admin-main">
                <header className="page-header">
                    <div className="header-nav">
                        {/* <button className="minimal-back" onClick={() => navigate(-1)}>
                            <i className="fas fa-chevron-left"></i> Back to Doctors
                        </button> */}
                        <div className="title-group">
                            <h1>Dr. {doctor.name}</h1>
                            <span className="subtitle">{hospitalName} • Appointment History</span>
                        </div>
                    </div>
                    {/* <button className="action-btn outline" onClick={fetchAppointments} disabled={loading}>
                        <i className={`fas fa-sync-alt ${loading ? 'fa-spin' : ''}`}></i> Refresh
                    </button> */}
                </header>

                <section className="stats-grid">
                    <div className={`stat-card total ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>
                        <div className="icon-box"><i className="fas fa-calendar-alt"></i></div>
                        <div className="stat-info"><h3>{stats.total}</h3><p>Total</p></div>
                    </div>
                    <div className={`stat-card success ${filter === 'completed' ? 'active' : ''}`} onClick={() => setFilter('completed')}>
                        <div className="icon-box"><i className="fas fa-check-circle"></i></div>
                        <div className="stat-info"><h3>{stats.completed}</h3><p>Completed</p></div>
                    </div>
                    <div className={`stat-card warning ${filter === 'pending' ? 'active' : ''}`} onClick={() => setFilter('pending')}>
                        <div className="icon-box"><i className="fas fa-clock"></i></div>
                        <div className="stat-info"><h3>{stats.pending}</h3><p>Pending</p></div>
                    </div>
                    <div className={`stat-card danger ${filter === 'cancelled' ? 'active' : ''}`} onClick={() => setFilter('cancelled')}>
                        <div className="icon-box"><i className="fas fa-times-circle"></i></div>
                        <div className="stat-info"><h3>{stats.cancelled}</h3><p>Cancelled</p></div>
                    </div>
                </section>

                <div className="content-card">
                    <div className="filter-bar">
                        <div className="tabs">
                            {['all', 'completed', 'confirmed', 'pending', 'cancelled'].map(f => (
                                <button key={f} className={`tab-btn ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
                                    {f.charAt(0).toUpperCase() + f.slice(1)}
                                </button>
                            ))}
                        </div>
                        <div className="results-info">Showing {filteredAppointments.length} records</div>
                    </div>

                    <div className="appointments-list-container">
                        {loading ? (
                            <div className="skeleton-loader">
                                <div className="spinner"></div>
                                <p>Syncing appointments...</p>
                            </div>
                        ) : filteredAppointments.length === 0 ? (
                            <div className="empty-state">
                                <i className="fas fa-folder-open"></i>
                                <h3>No data available</h3>
                                <p>Try changing the filter or refresh the page.</p>
                            </div>
                        ) : (
                            <div className="history-table">
                                <div className="table-header">
                                    <span>Patient</span>
                                    <span>Date & Time</span>
                                    <span>Reason</span>
                                    <span>Status</span>
                                </div>
                                {filteredAppointments.map((apt, index) => (
                                    <div key={apt._id || index} className="table-row">
                                        <div className="patient-cell">
                                            <div className="avatar-small">{(apt.patient_name || 'P')[0]}</div>
                                            <div className="details">
                                                <strong>{apt.patient_name || 'Unknown'}</strong>
                                                {/* <small>{apt.patient_phone || 'No Contact'}</small> */}
                                            </div>
                                        </div>
                                        <div className="time-cell">
                                            <div className="date">{formatDate(apt.appointment_date)}</div>
                                            <div className="time"><i className="far fa-clock"></i> {formatTime(apt.time_slot)}</div>
                                        </div>
                                        <div className="reason-cell">
                                            {apt.reason || apt.symptoms || <span className="no-data">Regular Checkup</span>}
                                        </div>
                                        <div className="status-cell">
                                            <span className={`badge-pill ${getStatusClass(apt.status || apt.appointment_status)}`}>
                                                {apt.status || 'Unknown'}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default DoctorAppointmentHistory;