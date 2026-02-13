import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router';
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

import PatientProfile from '../PatientProfile/PatientProfile';
import PatientEditProfile from '../PatientEditProfile/PatientEditProfile';
import ChangePassword from '../../forms/ChangePassword/ChangePassword';

function PatientHeader() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSticky, setIsSticky] = useState(false);

    const [patientData, setPatientData] = useState([]);

    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
    const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);


    const handleCloseProfile = () => {
        setIsProfileOpen(false)
    }

    const handleOpenProfile = () => {
        setIsProfileOpen(true)
    }

    const handleOpenEditProfile = () => {
        setIsEditProfileOpen(true)
        // handleCloseProfile();
    }

    const handleCloseEditProfile = () => {
        setIsEditProfileOpen(false)
        getPatientData();
    }

    const handleOpenChangePassword = () => {
        setIsProfileOpen(false);
        setIsChangePasswordOpen(true);
    };

    const handleCloseChangePassword = () => {
        setIsChangePasswordOpen(false);
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const getPatientData = async () => {
        const login_id = localStorage.getItem("loginId");

        try {
            // Using request.query_params.get('login_id') in backend
            const response = await axios.get("http://127.0.0.1:8000/patient/getPatientData/", { params: { login_id: login_id } });
            console.log(response.data);
            setPatientData(response.data);
        }
        catch (error) {
            console.error("Error fetching patient data:", error);
        }
    }

    useEffect(() => {
        getPatientData();
    }, []);

    useEffect(() => {
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
                                                    <NavLink to="/patienthome"><h6>Home</h6></NavLink>
                                                </li>
                                                {/* Add more patient links here */}

                                            </ul>
                                        </nav>
                                    </div>
                                </div>
                                <div className="col-xl-2 col-lg-2 d-none d-lg-block">
                                    <div className="d-flex align-items-center justify-content-end">
                                        <button onClick={handleOpenProfile} style={{ background: 'none', border: 'none', padding: 0, marginRight: '15px', width: '60px' }}>
                                            <i className="fas fa-user-circle" style={{ fontSize: '45px', color: '#1E0B9B' }}></i>
                                        </button>
                                        <NavLink to="/"><button className="top-btn" style={{ padding: '12px 30px', fontSize: '16px' }}>Logout</button></NavLink>
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
                    <li><NavLink to="/patienthome" onClick={toggleMobileMenu}>Home</NavLink></li>

                    <li><NavLink to="/" onClick={toggleMobileMenu}>Logout</NavLink></li>
                </ul>

                <div className="side-social" style={{ marginTop: '20px' }}>
                    <a href="#"><i className="fab fa-facebook-f"></i></a>
                    <a href="#"><i className="fab fa-twitter"></i></a>
                    <a href="#"><i className="fab fa-linkedin-in"></i></a>
                    <a href="#"><i className="fab fa-google-plus-g"></i></a>
                </div>
            </div>

            <div className={`offcanvas-overly ${isMobileMenuOpen ? 'active' : ''}`} onClick={toggleMobileMenu}></div>
            {
                isProfileOpen && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <button className="close-button" onClick={handleCloseProfile} style={{ color: 'black' }}>&times;</button>
                            <PatientProfile
                                patientData={patientData}
                                handleOpenEditProfile={handleOpenEditProfile}
                                handleOpenChangePassword={handleOpenChangePassword}
                            />
                        </div>
                    </div>
                )
            }
            {
                isEditProfileOpen && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <button className="close-button" onClick={handleCloseEditProfile} style={{ color: 'black' }}>&times;</button>
                            <PatientEditProfile patientData={patientData} onClose={handleCloseEditProfile} />
                        </div>
                    </div>
                )
            }
            {
                isChangePasswordOpen && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <button className="close-button" onClick={handleCloseChangePassword} style={{ color: 'black' }}>&times;</button>
                            <ChangePassword onClose={handleCloseChangePassword} />
                        </div>
                    </div>
                )
            }
        </div>
    );
}


export default PatientHeader;
