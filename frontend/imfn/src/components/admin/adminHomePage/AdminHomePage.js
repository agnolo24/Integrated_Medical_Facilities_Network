import React from 'react';

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
    return (
        <div className="hold-transition skin-blue sidebar-mini">
            {/* Wrapper to emulate body class behavior if needed, though 'hold-transition' usually goes on body */}
            <div className="wrapper" style={{ overflow: 'hidden' }}> {/* added overflow hidden to contain floats/margins */}

                <header className="main-header">
                    {/* Logo */}
                    <a href="#" className="logo">
                        {/* mini logo for sidebar mini 50x50 pixels */}
                        <span className="logo-mini"><b>A</b>LT</span>
                        {/* logo for regular state and mobile devices */}
                        <span className="logo-lg"><b>Admin</b> page</span>
                    </a>
                    {/* Header Navbar: style can be found in header.less */}
                    <nav className="navbar navbar-static-top">
                    </nav>
                </header>

                {/* Left side column. contains the logo and sidebar */}
                <aside className="main-sidebar">
                    {/* sidebar: style can be found in sidebar.less */}
                    <section className="sidebar">
                        {/* sidebar menu: : style can be found in sidebar.less */}
                        <ul className="sidebar-menu" data-widget="tree">
                            <li className="header">MAIN NAVIGATION</li>
                            <li>
                                <a href="#" style={{
                                    padding: '12px 20px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    color: '#b8c7ce',
                                    transition: 'all 0.3s ease',
                                    borderLeft: '3px solid transparent'
                                }}>
                                    <i className="fa fa-building" style={{ fontSize: '16px', width: '20px' }}></i>
                                    <span>Registered Stations</span>
                                </a>
                            </li>
                            <li>
                                <a href="#" style={{
                                    padding: '12px 20px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    color: '#b8c7ce',
                                    transition: 'all 0.3s ease',
                                    borderLeft: '3px solid transparent'
                                }}>
                                    <i className="fa fa-users" style={{ fontSize: '16px', width: '20px' }}></i>
                                    <span>Registered Staff</span>
                                </a>
                            </li>
                            <li>
                                <a href="#" style={{
                                    padding: '12px 20px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    color: '#b8c7ce',
                                    transition: 'all 0.3s ease',
                                    borderLeft: '3px solid transparent'
                                }}>
                                    <i className="fa fa-money" style={{ fontSize: '16px', width: '20px' }}></i>
                                    <span>Manage Salary</span>
                                </a>
                            </li>
                            <li>
                                <a href="#" style={{
                                    padding: '12px 20px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    color: '#b8c7ce',
                                    transition: 'all 0.3s ease',
                                    borderLeft: '3px solid transparent'
                                }}>
                                    <i className="fa fa-file-text" style={{ fontSize: '16px', width: '20px' }}></i>
                                    <span>View Complaints</span>
                                </a>
                            </li>
                            <li className="logout-item" style={{
                                marginTop: '20px',
                                background: 'rgba(255,255,255,0.1)',
                                borderRadius: '4px'
                            }}>
                                <a href="#" style={{
                                    padding: '15px 20px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    color: '#fff',
                                    fontSize: '16px',
                                    fontWeight: '500'
                                }}>
                                    <i className="fa fa-sign-out" style={{ fontSize: '18px' }}></i>
                                    <span>Log Out</span>
                                </a>
                            </li>
                        </ul>
                    </section>
                    {/* /.sidebar */}
                </aside>

                {/* Content Wrapper. Contains page content */}
                <div className="content-wrapper">
                    {/* Content Header (Page header) */}
                    <section className="content-header">
                        <h1>
                            Dashboard
                            <small>Control panel</small>
                        </h1>
                    </section>

                    {/* Add after content-header section */}
                    <div className="banner-section">
                        <div className="banner-image" style={{
                            height: '250px',
                            width: '100%',
                            backgroundColor: 'rgb(4, 234, 255)',
                            backgroundImage: `url(${img2})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat',
                            marginBottom: '30px',
                            position: 'relative',
                            borderRadius: '8px',
                            overflow: 'hidden'
                        }}>
                            <div className="banner-overlay" style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                background: 'rgba(0,0,0,0.5)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexDirection: 'column',
                                color: 'white'
                            }}>
                                <h2 style={{
                                    fontSize: '36px',
                                    fontWeight: '600',
                                    marginBottom: '10px',
                                    textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
                                }}>Administration Portal</h2>
                                <p style={{
                                    fontSize: '18px',
                                    margin: 0,
                                    textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
                                }}>Manage and monitor operations efficiently</p>
                            </div>
                        </div>
                    </div>

                    <section className="content">
                        <div className="row">
                            {/* Salary Management Box */}
                            <div className="col-lg-4 col-xs-6">
                                <div className="small-box bg-aqua">
                                    <div className="inner">
                                        <h3>Manage Salary</h3>
                                        <p>Edit staff salary details</p>
                                    </div>
                                    <div className="icon">
                                        <i className="ion ion-cash"></i>
                                    </div>
                                    <a href="#" className="small-box-footer">Manage <i className="fa fa-arrow-circle-right"></i></a>
                                </div>
                            </div>

                            {/* Complaints Box */}
                            <div className="col-lg-4 col-xs-6">
                                <div className="small-box bg-green">
                                    <div className="inner">
                                        <h3>Complaints</h3>
                                        <p>View complaints from public</p>
                                    </div>
                                    <div className="icon">
                                        <i className="ion ion-document-text"></i>
                                    </div>
                                    <a href="#" className="small-box-footer">View <i className="fa fa-arrow-circle-right"></i></a>
                                </div>
                            </div>

                            {/* Stations Box */}
                            <div className="col-lg-4 col-xs-6">
                                <div className="small-box bg-yellow">
                                    <div className="inner">
                                        <h3>Stations</h3>
                                        <p>Registered Police Stations</p>
                                    </div>
                                    <div className="icon">
                                        <i className="ion ion-android-home"></i>
                                    </div>
                                    <a href="#" className="small-box-footer">View Stations <i className="fa fa-arrow-circle-right"></i></a>
                                </div>
                            </div>

                            {/* Staff Management Box */}
                            <div className="col-lg-4 col-xs-6">
                                <div className="small-box bg-red">
                                    <div className="inner">
                                        <h3>Staff</h3>
                                        <p>Manage police staff</p>
                                    </div>
                                    <div className="icon">
                                        <i className="ion ion-person-stalker"></i>
                                    </div>
                                    <a href="#" className="small-box-footer">View Staff <i className="fa fa-arrow-circle-right"></i></a>
                                </div>
                            </div>
                        </div>
                    </section>
                    {/* /.content */}
                </div>
                {/* /.content-wrapper */}

                <footer className="main-footer">
                    <div className="pull-right hidden-xs">
                        <b>Version</b> 2.4.13
                    </div>
                    <strong>Copyright &copy; 2023-2026 <a href="#">Kerala Police</a>.</strong> All rights
                    reserved.
                </footer>

            </div>
            {/* ./wrapper */}
        </div>
    );
}

export default AdminHomePage;
