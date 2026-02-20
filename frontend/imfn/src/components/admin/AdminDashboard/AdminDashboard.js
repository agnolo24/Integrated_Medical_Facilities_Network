import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import axios from 'axios';
import './AdminDashboard.css';

// Components
import AdminSidebar from './AdminSidebar';
import StatsCard from './StatsCard';
import HospitalTable from './HospitalTable';
import HospitalDetailsModal from './HospitalDetailsModal';
import ManageReports from '../ManageReports/ManageReports';

export default function AdminDashboard() {

    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('dashboard');
    const [pendingHospitals, setPendingHospitals] = useState([]);
    const [verifiedHospitals, setVerifiedHospitals] = useState([]);
    const [selectedHospital, setSelectedHospital] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Fetch Hospitals Data
    const fetchHospitals = async () => {
        try {
            const response = await axios.get("http://127.0.0.1:8000/webAdmin/get_hospitals/");
            const allHospitals = response.data;
            setPendingHospitals(allHospitals.filter(h => h.status !== 'verified'));
            setVerifiedHospitals(allHospitals.filter(h => h.status === 'verified'));
        } catch (error) {
            console.error("Error fetching hospitals:", error);
        }
    };

    useEffect(() => {
        fetchHospitals();
    }, []);

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    const handleVerify = async (hospitalId) => {
        if (!window.confirm("Verify this hospital?")) return;
        try {
            await axios.post("http://127.0.0.1:8000/webAdmin/verify_hospital/", { hospital_id: hospitalId });
            alert("Hospital Verified Successfully");
            fetchHospitals();
        } catch (error) {
            console.error("Error verifying:", error);
            alert("Verification Failed");
        }
    };

    const handleViewDetails = async (hospitalLoginId) => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/webAdmin/get_hospital_details/`, {
                params: { hospital_login_id: hospitalLoginId }
            });
            setSelectedHospital(response.data);
            setIsModalOpen(true);
        } catch (error) {
            console.error("Error fetching details:", error);
            alert("Failed to load details");
        }
    };

    return (
        <div className="admin-container">
            <AdminSidebar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                onLogout={handleLogout}
            />

            <main className="admin-main">
                <div className="admin-header">
                    <div className="header-title">
                        <h1>{activeTab === 'dashboard' ? 'Overview' : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h1>
                        <p>Welcome back, Admin</p>
                    </div>
                    <div className="admin-profile">
                        {/* Can add notifications bell here */}
                        <div className="admin-avatar">A</div>
                        <span style={{ fontWeight: 600 }}>Administrator</span>
                    </div>
                </div>

                {activeTab === 'dashboard' && (
                    <>
                        <div className="stats-grid">
                            <StatsCard
                                icon="fa-hospital-user"
                                title="Total Hospitals"
                                value={pendingHospitals.length + verifiedHospitals.length}
                                color="#4361ee"
                            />
                            <StatsCard
                                icon="fa-clock"
                                title="Pending Requests"
                                value={pendingHospitals.length}
                                color="#f72585"
                            />
                            <StatsCard
                                icon="fa-check-circle"
                                title="Verified Hospitals"
                                value={verifiedHospitals.length}
                                color="#4cc9f0"
                            />
                        </div>

                        <HospitalTable
                            title="Pending Verification Requests"
                            hospitals={pendingHospitals}
                            type="pending"
                            onAction={handleVerify}
                        />

                        <HospitalTable
                            title="Verified Hospitals"
                            hospitals={verifiedHospitals}
                            type="verified"
                            onAction={handleViewDetails}
                        />
                    </>
                )}

                {activeTab === 'hospitals' && (
                    <HospitalTable
                        title="All Verified Hospitals"
                        hospitals={verifiedHospitals}
                        type="verified"
                        onAction={handleViewDetails}
                    />
                )}

                {activeTab === 'users' && (
                    <div style={{ textAlign: 'center', padding: '50px', color: '#999' }}>
                        <h3>User Management Module</h3>
                        <p>Coming Soon</p>
                    </div>
                )}

                {activeTab === 'reports' && (
                    <ManageReports />
                )}


            </main>

            {isModalOpen && (
                <HospitalDetailsModal
                    data={selectedHospital}
                    onClose={() => setIsModalOpen(false)}
                />
            )}
        </div>
    );
}
