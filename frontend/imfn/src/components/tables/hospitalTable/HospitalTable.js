import React, { useState } from 'react';
import './HospitalTable.css';

// AdminLTE Dependencies (Reusing common imports)
import '../../../asset/AdminLTE/bower_components/bootstrap/dist/css/bootstrap.min.css';
import '../../../asset/AdminLTE/bower_components/font-awesome/css/font-awesome.min.css';
import '../../../asset/AdminLTE/bower_components/Ionicons/css/ionicons.min.css';
import '../../../asset/AdminLTE/dist/css/AdminLTE.min.css';
import '../../../asset/AdminLTE/dist/css/skins/_all-skins.min.css';

// Mock Data
const initialData = [
    {
        station_id: 'ST001',
        address_line_1: '123 Main St, Kochi',
        contact: '0484-1234567',
        login_id: {
            email: 'station1@keralapolice.gov.in',
            id: 1,
            varification_status: 'pending'
        }
    },
    {
        station_id: 'ST002',
        address_line_1: '456 Park Ave, Trivandrum',
        contact: '0471-9876543',
        login_id: {
            email: 'station2@keralapolice.gov.in',
            id: 2,
            varification_status: 'verified'
        }
    },
    {
        station_id: 'ST003',
        address_line_1: '789 Beach Rd, Calicut',
        contact: '0495-2345678',
        login_id: {
            email: 'station3@keralapolice.gov.in',
            id: 3,
            varification_status: 'pending'
        }
    }
];

function HospitalTable() {
    const [searchTerm, setSearchTerm] = useState('');
    const [data] = useState(initialData);

    // Search Filter Logic
    const filteredData = data.filter(item => {
        const lowerTerm = searchTerm.toLowerCase();
        return (
            item.station_id.toLowerCase().includes(lowerTerm) ||
            item.address_line_1.toLowerCase().includes(lowerTerm) ||
            item.contact.toLowerCase().includes(lowerTerm) ||
            item.login_id.email.toLowerCase().includes(lowerTerm)
        );
    });

    return (
        <div className="hold-transition skin-blue sidebar-mini">
            <div className="wrapper" style={{ overflow: 'hidden' }}>

                {/* Header (Copied from AdminHomePage) */}
                <header className="main-header">
                    <a href="#" className="logo">
                        <span className="logo-mini"><b>A</b>LT</span>
                        <span className="logo-lg"><b>Admin</b> page</span>
                    </a>
                    <nav className="navbar navbar-static-top"></nav>
                </header>

                {/* Sidebar (Copied from AdminHomePage) */}
                <aside className="main-sidebar">
                    <section className="sidebar">
                        <ul className="sidebar-menu" data-widget="tree">
                            <li className="header">MAIN NAVIGATION</li>
                            <li>
                                <a href="#" style={{ padding: '12px 20px', display: 'flex', alignItems: 'center', gap: '12px', color: '#b8c7ce', borderLeft: '3px solid transparent' }}>
                                    <i className="fa fa-building" style={{ fontSize: '16px', width: '20px' }}></i>
                                    <span>Registered Stations</span>
                                </a>
                            </li>
                            <li>
                                <a href="#" style={{ padding: '12px 20px', display: 'flex', alignItems: 'center', gap: '12px', color: '#b8c7ce', borderLeft: '3px solid transparent' }}>
                                    <i className="fa fa-users" style={{ fontSize: '16px', width: '20px' }}></i>
                                    <span>Registered Staff</span>
                                </a>
                            </li>
                        </ul>
                    </section>
                </aside>

                {/* Content Wrapper */}
                <div className="content-wrapper">
                    <section className="content-header">
                        <h1>
                            Police Stations
                            <small>Registration Management</small>
                        </h1>
                        <ol className="breadcrumb">
                            <li><a href="#"><i className="fa fa-dashboard"></i> Home</a></li>
                            <li className="active">Police Stations</li>
                        </ol>
                    </section>

                    <section className="content">
                        <div className="box">
                            <div className="box-header">
                                <h3 className="box-title" style={{ display: 'inline-block' }}>Police Station Registration Details</h3>
                                <div className="search-container" style={{ float: 'right' }}>
                                    <div className="input-group" style={{ width: '300px' }}>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Search stations..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                        <span className="input-group-btn">
                                            <button className="btn btn-default" type="button">
                                                <i className="fa fa-search"></i>
                                            </button>
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="table-responsive">
                                <table className="table table-bordered table-striped">
                                    <thead>
                                        <tr>
                                            <th>Station ID</th>
                                            <th>Address Line 1</th>
                                            {/* <th>Address Line 2</th> */}
                                            {/* <th>District</th>
                                            <th>City</th> */}
                                            <th>Contact</th>
                                            <th>Email</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredData.map((item, index) => (
                                            <tr key={index}>
                                                <td>{item.station_id}</td>
                                                <td>{item.address_line_1}</td>
                                                {/* <td>{item.address_line_2}</td> */}
                                                {/* <td>{item.district}</td> */}
                                                {/* <td>{item.city}</td> */}
                                                <td>{item.contact}</td>
                                                <td>{item.login_id.email}</td>
                                                <td className="text-center">
                                                    {item.login_id.varification_status !== 'verified' ? (
                                                        <button className="btn btn-success btn-sm">
                                                            <i className="fa fa-check"></i> Accept
                                                        </button>
                                                    ) : (
                                                        <button className="btn btn-danger btn-sm">
                                                            <i className="fa fa-times"></i> Reject
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </section>
                </div>
                <footer className="main-footer">
                    <div className="pull-right hidden-xs">
                        <b>Version</b> 2.4.13
                    </div>
                    <strong>Copyright &copy; 2023-2026 <a href="#">Kerala Police</a>.</strong> All rights reserved.
                </footer>
            </div>
        </div>
    );
}

export default HospitalTable;
