import React from 'react';

const AdminSidebar = ({ activeTab, setActiveTab, onLogout }) => {
    return (
        <aside className="admin-sidebar">
            <div className="logo-section">
                <i className="fas fa-heartbeat logo-icon"></i>
                <span className="logo-text">MediNet Admin</span>
            </div>

            <ul className="nav-links">
                <li className="nav-item">
                    <a href="#"
                        className={`nav-link ${activeTab === 'dashboard' ? 'active' : ''}`}
                        onClick={() => setActiveTab('dashboard')}>
                        <i className="fas fa-th-large"></i>
                        <span>Dashboard</span>
                    </a>
                </li>
                <li className="nav-item">
                    <a href="#"
                        className={`nav-link ${activeTab === 'hospitals' ? 'active' : ''}`}
                        onClick={() => setActiveTab('hospitals')}>
                        <i className="fas fa-hospital"></i>
                        <span>Hospitals</span>
                    </a>
                </li>
                <li className="nav-item">
                    <a href="#"
                        className={`nav-link ${activeTab === 'users' ? 'active' : ''}`}
                        onClick={() => setActiveTab('users')}>
                        <i className="fas fa-user-friends"></i>
                        <span>Users</span>
                    </a>
                </li>
                <li className="nav-item">
                    <a href="#"
                        className={`nav-link ${activeTab === 'reports' ? 'active' : ''}`}
                        onClick={() => setActiveTab('reports')}>
                        <i className="fas fa-flag"></i>
                        <span>Reports</span>
                    </a>
                </li>
                {/* Add more links as needed */}

            </ul>

            <button className="logout-btn" onClick={onLogout}>
                <i className="fas fa-sign-out-alt"></i>
                <span className="logout-text">Logout</span>
            </button>
        </aside>
    );
};

export default AdminSidebar;
