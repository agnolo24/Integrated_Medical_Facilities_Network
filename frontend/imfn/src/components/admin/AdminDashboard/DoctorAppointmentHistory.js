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
            weekday: 'short',
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    const formatTime = (timeString) => {
        if (!timeString) return 'N/A';
        if (timeString.includes(':')) {
            const [hours, minutes] = timeString.split(':');
            const hour = parseInt(hours, 10);
            const ampm = hour >= 12 ? 'PM' : 'AM';
            const hour12 = hour % 12 || 12;
            return `${hour12}:${minutes} ${ampm}`;
        }
        return timeString;
    };

    const getStatusClass = (status) => {
        const statusLower = (status || '').toLowerCase();
        const statusMap = {
            completed: 'status-completed',
            confirmed: 'status-confirmed',
            pending: 'status-pending',
            cancelled: 'status-cancelled',
            'no-show': 'status-noshow'
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
        const stats = {
            total: appointments.length,
            completed: 0,
            pending: 0,
            cancelled: 0
        };
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
                <div className="appointment-history-page">
                    {/* Header Section */}
                    <div className="history-header">
                        <div className="header-left">
                            <button className="back-btn" onClick={() => navigate(-1)}>
                                <i className="fas fa-arrow-left"></i>
                                Back
                            </button>
                            <div className="header-info">
                                <h1>
                                    <i className="fas fa-calendar-check"></i>
                                    Appointment History
                                </h1>
                                <p className="breadcrumb">
                                    <span>{hospitalName || 'Hospital'}</span>
                                    <i className="fas fa-chevron-right"></i>
                                    <span>Dr. {doctor.name}</span>
                                </p>
                            </div>
                        </div>
                        <div className="header-right">
                            <button className="refresh-btn" onClick={fetchAppointments} disabled={loading}>
                                <i className={`fas fa-sync-alt ${loading ? 'fa-spin' : ''}`}></i>
                                Refresh
                            </button>
                        </div>
                    </div>

                    {/* Doctor Info Card */}
                    {/* <div className="doctor-info-card sticky-card">
                        <div className="doctor-avatar">
                            <i className="fas fa-user-md"></i>
                        </div>
                        <div className="doctor-details">
                            <h2>Dr. {doctor.name}</h2>
                            <div className="doctor-meta">
                                <span><i className="fas fa-stethoscope"></i> {doctor.specialization}</span>
                                <span><i className="fas fa-graduation-cap"></i> {doctor.qualification}</span>
                                <span><i className="fas fa-briefcase"></i> {doctor.experience} Years Experience</span>
                            </div>
                        </div>
                    </div> */}

                    {/* Stats Section */}
                    <div className="stats-row">
                        <div className="stat-box total" onClick={() => setFilter('all')}>
                            <div className="stat-icon">
                                <i className="fas fa-calendar-alt"></i>
                            </div>
                            <div className="stat-content">
                                <h3>{stats.total}</h3>
                                <p>Total Appointments</p>
                            </div>
                        </div>
                        <div className="stat-box completed" onClick={() => setFilter('completed')}>
                            <div className="stat-icon">
                                <i className="fas fa-check-circle"></i>
                            </div>
                            <div className="stat-content">
                                <h3>{stats.completed}</h3>
                                <p>Completed</p>
                            </div>
                        </div>
                        <div className="stat-box pending" onClick={() => setFilter('pending')}>
                            <div className="stat-icon">
                                <i className="fas fa-clock"></i>
                            </div>
                            <div className="stat-content">
                                <h3>{stats.pending}</h3>
                                <p>Pending</p>
                            </div>
                        </div>
                        <div className="stat-box cancelled" onClick={() => setFilter('cancelled')}>
                            <div className="stat-icon">
                                <i className="fas fa-times-circle"></i>
                            </div>
                            <div className="stat-content">
                                <h3>{stats.cancelled}</h3>
                                <p>Cancelled</p>
                            </div>
                        </div>
                    </div>

                    {/* Filter Tabs */}
                    <div className="filter-section">
                        <div className="filter-tabs">
                            <button
                                className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
                                onClick={() => setFilter('all')}
                            >
                                All
                            </button>
                            <button
                                className={`filter-tab ${filter === 'completed' ? 'active' : ''}`}
                                onClick={() => setFilter('completed')}
                            >
                                Completed
                            </button>
                            <button
                                className={`filter-tab ${filter === 'confirmed' ? 'active' : ''}`}
                                onClick={() => setFilter('confirmed')}
                            >
                                Confirmed
                            </button>
                            <button
                                className={`filter-tab ${filter === 'pending' ? 'active' : ''}`}
                                onClick={() => setFilter('pending')}
                            >
                                Pending
                            </button>
                            <button
                                className={`filter-tab ${filter === 'cancelled' ? 'active' : ''}`}
                                onClick={() => setFilter('cancelled')}
                            >
                                Cancelled
                            </button>
                        </div>
                        <div className="results-count">
                            Showing {filteredAppointments.length} appointment{filteredAppointments.length !== 1 ? 's' : ''}
                        </div>
                    </div>

                    {/* Appointments Grid */}
                    <div className="appointments-container">
                        {loading ? (
                            <div className="loading-state">
                                <div className="spinner"></div>
                                <p>Loading appointments...</p>
                            </div>
                        ) : filteredAppointments.length === 0 ? (
                            <div className="empty-state">
                                <i className="fas fa-calendar-times"></i>
                                <h3>No Appointments Found</h3>
                                <p>
                                    {filter === 'all'
                                        ? 'This doctor has no appointment history yet.'
                                        : `No ${filter} appointments found.`
                                    }
                                </p>
                                {filter !== 'all' && (
                                    <button className="reset-filter-btn" onClick={() => setFilter('all')}>
                                        View All Appointments
                                    </button>
                                )}
                            </div>
                        ) : (
                            <div className="appointments-list">
                                {filteredAppointments.map((apt, index) => (
                                    <div key={apt._id || index} className="appointment-list-item">
                                        <div className="item-main">
                                            <div className="patient-info">
                                                <div className="patient-avatar">
                                                    {(apt.patientName || apt.patient_name || 'P').charAt(0).toUpperCase()}
                                                </div>
                                                <div className="patient-details">
                                                    <h4>{apt.patientName || apt.patient_name || 'Unknown Patient'}</h4>
                                                    <span className="patient-contact">
                                                        {apt.patientEmail || apt.patient_email || apt.patientPhone || apt.patient_phone || 'No contact info'}
                                                    </span>
                                                </div>
                                            </div>
                                            <span className={`status-badge ${getStatusClass(apt.status || apt.appointment_status)}`}>
                                                {apt.status || apt.appointment_status || 'Unknown'}
                                            </span>
                                        </div>

                                        <div className="item-meta">
                                            <div className="meta-item">
                                                <i className="fas fa-calendar-alt"></i>
                                                <span>{formatDate(apt.appointmentDate || apt.appointment_date || apt.date)}</span>
                                            </div>
                                            <div className="meta-item">
                                                <i className="fas fa-clock"></i>
                                                <span>{formatTime(apt.appointmentTime || apt.appointment_time || apt.time || apt.slot)}</span>
                                            </div>
                                        </div>

                                        {(apt.reason || apt.symptoms || apt.notes) && (
                                            <div className="item-notes">
                                                <i className="fas fa-notes-medical"></i>
                                                <p>{apt.reason || apt.symptoms || apt.notes}</p>
                                            </div>
                                        )}
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
