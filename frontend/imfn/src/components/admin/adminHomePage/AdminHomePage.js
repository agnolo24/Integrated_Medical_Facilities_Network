import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router'; // Corrected import
import axios from 'axios';

// AdminLTE Dependencies
import '../../../asset/AdminLTE/bower_components/bootstrap/dist/css/bootstrap.min.css';
import '../../../asset/AdminLTE/bower_components/font-awesome/css/font-awesome.min.css';
import '../../../asset/AdminLTE/bower_components/Ionicons/css/ionicons.min.css';
import '../../../asset/AdminLTE/dist/css/AdminLTE.min.css';
import '../../../asset/AdminLTE/dist/css/skins/_all-skins.min.css';
import '../../../asset/AdminLTE/bower_components/morris.js/morris.css';
import '../../../asset/AdminLTE/bower_components/jvectormap/jquery-jvectormap.css';
import img2 from '../../../asset/AdminLTE/images/img2.jpg';

function AdminHomePage() {
    const navigate = useNavigate();
    const [pendingHospitals, setPendingHospitals] = useState([]);
    const [verifiedHospitals, setVerifiedHospitals] = useState([]);
    const [selectedHospital, setSelectedHospital] = useState(null); // For detail view
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Fetch Hospitals
    const fetchHospitals = async () => {
        try {
            const response = await axios.get("http://127.0.0.1:8000/webAdmin/get_hospitals/");
            const allHospitals = response.data;

            // Filter locally or could filter in backend API
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
        if (!window.confirm("Are you sure you want to verify this hospital?")) return;

        try {
            await axios.post("http://127.0.0.1:8000/webAdmin/verify_hospital/", { hospital_id: hospitalId });
            alert("Hospital Verified Successfully");
            fetchHospitals(); // Refresh lists
        } catch (error) {
            console.error("Error verifying hospital:", error);
            alert("Failed to verify hospital");
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
            console.error("Error fetching hospital details:", error);
            alert("Failed to load details");
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedHospital(null);
    };


    return (
        <div className="hold-transition skin-blue sidebar-mini admin-home">
            <div className="wrapper" style={{ overflow: 'hidden' }}>

                {/* Header */}
                <header className="main-header">
                    <a href="#" className="logo">
                        <span className="logo-mini"><b>A</b>LT</span>
                        <span className="logo-lg"><b>Admin</b> page</span>
                    </a>
                    <nav className="navbar navbar-static-top">
                        <div className="navbar-custom-menu">
                            <ul className="nav navbar-nav">
                                <li>
                                    <button onClick={handleLogout} className="btn btn-danger btn-flat" style={{ margin: '8px' }}>Log out</button>
                                </li>
                            </ul>
                        </div>
                    </nav>
                </header>

                {/* Sidebar */}
                <aside className="main-sidebar">
                    <section className="sidebar">
                        <ul className="sidebar-menu" data-widget="tree">
                            <li className="header">MAIN NAVIGATION</li>
                            <li className="active">
                                <a href="#">
                                    <i className="fa fa-hospital-o"></i> <span>Hospitals</span>
                                </a>
                            </li>
                            {/* Placeholder links from template */}
                            <li><a href="#"><i className="fa fa-users"></i> <span>Other Users</span></a></li>
                        </ul>
                    </section>
                </aside>

                {/* Content */}
                <div className="content-wrapper">
                    <section className="content-header">
                        <h1>
                            Dashboard
                            <small>Hospital Management</small>
                        </h1>
                    </section>

                    {/* Main Content */}
                    <section className="content">

                        {/* Stats widgets could go here */}

                        <div className="row">

                            {/* Pending Hospitals Request */}
                            <div className="col-md-12">
                                <div className="box box-warning">
                                    <div className="box-header with-border">
                                        <h3 className="box-title">Pending Hospital Verifications</h3>
                                    </div>
                                    <div className="box-body table-responsive no-padding">
                                        <table className="table table-hover">
                                            <thead>
                                                <tr>
                                                    <th>Name</th>
                                                    <th>Registration ID</th>
                                                    <th>Address</th>
                                                    <th>Contact</th>
                                                    <th>Email</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {pendingHospitals.length === 0 ? (
                                                    <tr><td colSpan="6" className="text-center">No pending requests</td></tr>
                                                ) : (
                                                    pendingHospitals.map(h => (
                                                        <tr key={h._id}>
                                                            <td>{h.hospitalName}</td>
                                                            <td>{h.registrationId}</td>
                                                            <td>{h.hospitalAddress}</td>
                                                            <td>{h.contactNumber}</td>
                                                            <td>{h.email}</td>
                                                            <td>
                                                                <button className="btn btn-success btn-sm" onClick={() => handleVerify(h._id)}>Verify</button>
                                                            </td>
                                                        </tr>
                                                    ))
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>

                            {/* Verified Hospitals List */}
                            <div className="col-md-12">
                                <div className="box box-success">
                                    <div className="box-header with-border">
                                        <h3 className="box-title">Verified Hospitals</h3>
                                    </div>
                                    <div className="box-body table-responsive no-padding">
                                        <table className="table table-hover">
                                            <thead>
                                                <tr>
                                                    <th>Name</th>
                                                    <th>Registration ID</th>
                                                    <th>Address</th>
                                                    <th>Contact</th>
                                                    <th>Email</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {verifiedHospitals.length === 0 ? (
                                                    <tr><td colSpan="6" className="text-center">No verified hospitals</td></tr>
                                                ) : (
                                                    verifiedHospitals.map(h => (
                                                        <tr key={h._id}>
                                                            <td>{h.hospitalName}</td>
                                                            <td>{h.registrationId}</td>
                                                            <td>{h.hospitalAddress}</td>
                                                            <td>{h.contactNumber}</td>
                                                            <td>{h.email}</td>
                                                            <td>
                                                                <button className="btn btn-info btn-sm" onClick={() => handleViewDetails(h.login_id)}>View Details</button>
                                                            </td>
                                                        </tr>
                                                    ))
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </section>
                </div>

                <footer className="main-footer">
                    <strong>Copyright &copy; 2026 Admin Portal.</strong> All rights reserved.
                </footer>

                {/* Modal for Hospital Details */}
                {isModalOpen && selectedHospital && (
                    <div className="modal-backdrop-custom" style={{
                        position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                        backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex',
                        justifyContent: 'center', alignItems: 'center'
                    }}>
                        <div className="modal-content-custom bg-white" style={{
                            width: '80%', maxHeight: '90vh', overflowY: 'auto', padding: '20px', borderRadius: '5px', position: 'relative'
                        }}>
                            <button onClick={closeModal} style={{ position: 'absolute', right: '20px', top: '20px', fontSize: '20px', background: 'none', border: 'none' }}>&times;</button>

                            <h3>{selectedHospital.hospital.hospitalName} Details</h3>
                            <hr />
                            <div className="row">
                                <div className="col-md-6">
                                    <p><strong>Address:</strong> {selectedHospital.hospital.hospitalAddress}</p>
                                    <p><strong>Registration ID:</strong> {selectedHospital.hospital.registrationId}</p>
                                </div>
                                <div className="col-md-6">
                                    <p><strong>Contact:</strong> {selectedHospital.hospital.contactNumber}</p>
                                    <p><strong>Email:</strong> {selectedHospital.hospital.email}</p>
                                </div>
                            </div>

                            <h4 className="mt-4">Registered Doctors ({selectedHospital.doctors.length})</h4>
                            <table className="table table-bordered">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Spec</th>
                                        <th>Qual</th>
                                        <th>Exp</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedHospital.doctors.map(d => (
                                        <tr key={d._id}>
                                            <td>Dr. {d.name}</td>
                                            <td>{d.specialization}</td>
                                            <td>{d.qualification}</td>
                                            <td>{d.experience} Yrs</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            <h4 className="mt-4">Registered Ambulances ({selectedHospital.ambulances.length})</h4>
                            <table className="table table-bordered">
                                <thead>
                                    <tr>
                                        <th>Vehicle No</th>
                                        <th>Type</th>
                                        <th>Category</th>
                                        <th>Driver Contact</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedHospital.ambulances.map(a => (
                                        <tr key={a._id}>
                                            <td>{a.vehicleNumber}</td>
                                            <td>{a.ambulanceType}</td>
                                            <td>{a.category}</td>
                                            <td>{a.contactNumber}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            <div className="text-right mt-3">
                                <button className="btn btn-default" onClick={closeModal}>Close</button>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}

export default AdminHomePage;
