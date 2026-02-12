import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router';
import axios from 'axios';

// CSS Imports
import '../../../asset/user_assets/css/bootstrap.min.css';
import '../../../asset/user_assets/css/animate.min.css';
import '../../../asset/user_assets/css/magnific-popup.css';
import '../../../asset/user_assets/fontawesome/css/all.min.css';
import '../../../asset/user_assets/css/dripicons.css';
import '../../../asset/user_assets/css/slick.css';
import '../../../asset/user_assets/css/default.css';
import '../../../asset/user_assets/css/meanmenu.css';
import '../../../asset/user_assets/css/style.css';
import '../../../asset/user_assets/css/responsive.css';

import '../HospitalHome/HospitalHome.css';

import HospitalProfile from '../HospitalProfile/HospitalProfile';
import HospitalEditProfile from '../HospitalEditProfile/HospitalEditProfile';

function HospitalHeader() {
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSticky, setIsSticky] = useState(false);

    // Profile State
    const [hospitalData, setHospitalData] = useState(null);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    useEffect(() => {
        const fetchHospitalData = async () => {
            const loginId = localStorage.getItem('loginId');
            if (loginId) {
                try {
                    const response = await axios.get(`http://127.0.0.1:8000/hospital/getHospitalData/?login_id=${loginId}`);
                    setHospitalData(response.data);
                } catch (error) {
                    console.error("Error fetching hospital data", error);
                }
            }
        };
        fetchHospitalData();

        const handleScroll = () => {
            if (window.scrollY > 150) {
                setIsSticky(true);
            } else {
                setIsSticky(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const handleLogout = () => {
        localStorage.clear();
        navigate('/')
    }

    const handleOpenEditProfile = () => {
        setIsProfileOpen(false);
        setIsEditProfileOpen(true);
    };

    return (
        <div>
            {/* header */}
            <header className="header-area">
                <div className="header-top second-header d-none d-md-block">
                    <div className="container">
                        <div className="row align-items-center">
                            <div className="col-lg-3 col-md-3 d-none d-lg-block">
                            </div>
                            <div className="col-lg-4 col-md-8 d-none d-md-block">
                                <div className="header-cta">
                                    <ul>
                                        <li>
                                            <i className="icon dripicons-mail"></i>
                                            <span>info@example.com</span>
                                        </li>
                                        <li>
                                            <i className="icon dripicons-phone"></i>
                                            <span>+8 12 3456897</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div className="col-lg-5 col-md-3 d-none d-lg-block">
                                <div className="header-social text-right">
                                    <span>
                                        <a href="#" title="Facebook"><i className="fab fa-facebook"></i></a>
                                        <a href="#" title="Twitter"><i className="fab fa-twitter"></i></a>
                                        <a href="#" title="LinkedIn"><i className="fab fa-linkedin-in"></i></a>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="header-sticky" className={`menu-area ${isSticky ? 'sticky-menu' : ''}`}>
                    <div className="container">
                        <div className="second-menu">
                            <div className="row align-items-center">
                                <div className="col-xl-2 col-lg-2 col-md-6 col-6">
                                    <div className="logo" style={{ background: 'none', width: '100%' }}>
                                        <a href="index.html"><img src={require('../../../asset/user_assets/img/logo/logo.png')} alt="logo" /></a>
                                    </div>
                                </div>
                                <div className="col-xl-8 col-lg-8 d-none d-lg-block">
                                    <div className="main-menu text-right pr-15">
                                        <nav id="mobile-menu-desktop">
                                            <ul>
                                                <li className="has-sub">
                                                    <NavLink to="/hospitalhome"><h6>Home</h6></NavLink>
                                                </li>
                                                <li className="has-sub">
                                                    <h6>Registration</h6>
                                                    <ul>
                                                        <li><NavLink to="/registerDoctor">Doctor Registration</NavLink></li>
                                                        <li><NavLink to="/RegAmbulance">Ambulance Registration</NavLink></li>
                                                        <li><NavLink to="/registerPharmacy">Pharmacy Registration</NavLink></li>
                                                    </ul>
                                                </li>
                                            </ul>
                                        </nav>
                                    </div>
                                </div>
                                <div className="col-xl-2 col-lg-2 d-none d-lg-block">
                                    <div className="d-flex align-items-center justify-content-end">
                                        <button
                                            onClick={() => setIsProfileOpen(true)}
                                            style={{ background: 'none', border: 'none', padding: 0, marginRight: '15px', width: '60px', cursor: 'pointer' }}
                                        >
                                            <i className="fas fa-user-circle" style={{ fontSize: '45px', color: '#1E0B9B' }}></i>
                                        </button>
                                        <button onClick={handleLogout} className="top-btn" style={{ padding: '12px 30px', fontSize: '16px' }}>Logout</button>
                                    </div>
                                </div>
                                <div className="col-md-6 col-6 d-block d-lg-none">
                                    <div className="mobile-menu-toggle d-flex justify-content-end align-items-center">
                                        <div className="responsive" onClick={toggleMobileMenu} style={{ display: 'block', cursor: 'pointer', marginTop: 0 }}>
                                            <i className="fas fa-bars" style={{ fontSize: '25px', color: '#1E0B9B' }}></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
            {/* Header End */}

            {/* Offcanvas Menu */}
            <div className={`offcanvas-menu ${isMobileMenuOpen ? 'active' : ''}`}>
                <span className="menu-close" onClick={toggleMobileMenu}>
                    <i className="fas fa-times"></i>
                </span>

                <ul className="d-block" style={{ marginTop: '40px' }}>
                    <li><NavLink to="/hospitalhome" onClick={toggleMobileMenu}>Home</NavLink></li>
                    <li>
                        Registration
                        <ul className="sub-menu pl-3" style={{ display: 'block' }}>
                            <li><NavLink to="/doctorReg" onClick={toggleMobileMenu}>Doctor Registration</NavLink></li>
                            <li><NavLink to="/ambulance" onClick={toggleMobileMenu}>Ambulance Registration</NavLink></li>
                        </ul>
                    </li>
                    <li><span onClick={handleLogout} style={{ cursor: 'pointer', color: '#333', fontWeight: '500' }}>Logout</span></li>
                </ul>

                <div className="side-social" style={{ marginTop: '20px' }}>
                    <a href="#"><i className="fab fa-facebook-f"></i></a>
                    <a href="#"><i className="fab fa-twitter"></i></a>
                    <a href="#"><i className="fab fa-linkedin-in"></i></a>
                    <a href="#"><i className="fab fa-google-plus-g"></i></a>
                </div>
            </div>

            <div className={`offcanvas-overly ${isMobileMenuOpen ? 'active' : ''}`} onClick={toggleMobileMenu}></div>

            <div className="hp-management-ribbon">
                <div className="hp-ribbon-content">
                    <div className="hp-ribbon-group">
                        <span className="hp-ribbon-label">Fleet & Staff Management</span>
                        <div className="hp-action-chips">
                            <a href="/viewDoctors" className="hp-chip">
                                <i className="fas fa-user-md"></i> View Doctors
                            </a>
                            <a href="/viewAmbulance" className="hp-chip">
                                <i className="fas fa-truck-medical"></i> Fleet Management
                            </a>
                            {/* <a href="/scheduleDoctor" className="hp-chip">
                                <i className="fas fa-calendar-check"></i> Rosters & Schedules
                            </a> */}
                        </div>
                    </div>
                </div>
            </div>

            {/* Models */}
            {isProfileOpen && (
                <HospitalProfile
                    hospitalData={hospitalData}
                    handleOpenEditProfile={handleOpenEditProfile}
                    onClose={() => setIsProfileOpen(false)}
                />
            )}

            {isEditProfileOpen && (
                <HospitalEditProfile
                    hospitalData={hospitalData}
                    onClose={() => setIsEditProfileOpen(false)}
                />
            )}
        </div>
    );
}

export default HospitalHeader;