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
import DoctorEditProfile from '../DoctorEditProfile/DoctorEditProfile';
import DoctorProfile from '../DoctorProfile/DoctorProfile';

function DoctorHeader() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSticky, setIsSticky] = useState(false);

    const [doctorData, setDoctorData] = useState([]);
    // const [isModalOpen, setIsModalOpen] = useState(false);

    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);


    const handleCloseProfile = () => {
        setIsProfileOpen(false)
    }

    const handleOpenProfile = () => {
        setIsProfileOpen(true)
    }

    const handleOpenEditProfile = () => {
        setIsEditProfileOpen(true)
        handleCloseProfile();
    }

    const handleCloseEditProfile = () => {
        setIsEditProfileOpen(false)
        getDoctorData();
    }

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const getDoctorData = async () => {
        const dr_id = localStorage.getItem("loginId");
        const DoctorDataUrl = "";

        try {
            const response = await axios.get("http://127.0.0.1:8000/doctor/getDoctorData/", { params: { dr_id: dr_id } });
            console.log(response.data);
            setDoctorData(response.data);


        }
        catch (error) {
            console.error("Error fetching doctors:", error);
        }
    }

    useEffect(() => {
        getDoctorData();
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
                                                    <NavLink to="/doctorhome"><h6>Home</h6></NavLink>
                                                </li>
                                                {/* <li><a href="about.html">About Us</a></li> */}
                                                {/* <li className="has-sub">
                                                                <a href="services.html">Services</a>
                                                                <ul>
                                                                    <li><a href="services.html">Services</a></li>
                                                                    <li><a href="services-detail.html">Services Details</a></li>
                                                                </ul>
                                                            </li> */}

                                                {/* <li className="has-sub">
                                                                <a href="blog.html">Blog</a>
                                                                <ul>
                                                                    <li><a href="blog.html">Blog</a></li>
                                                                    <li><a href="blog-details.html">Blog Details</a></li>
                                                                </ul>
                                                            </li> */}
                                                <li className="has-sub">
                                                    <h6>Registration</h6>
                                                    <ul>
                                                        <li><NavLink to="/registerDoctor">Doctor Registration</NavLink></li>
                                                        <li><NavLink to="/RegAmbulance">Ambulance Registration</NavLink></li>
                                                    </ul>
                                                </li>
                                                <li>

                                                    <button onClick={handleOpenProfile} style={{ background: 'none', border: 'none', padding: 0 }}>
                                                        <i className="fas fa-user-circle" style={{ fontSize: '50px', color: '#1E0B9B' }}></i>
                                                    </button>

                                                </li>
                                            </ul>
                                        </nav>
                                    </div>
                                </div>
                                <div className="col-xl-2 col-lg-2 d-none d-lg-block">
                                    <NavLink to="/"><button className="top-btn">Logout</button></NavLink>
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
                    {/* <li><a href="about.html" onClick={toggleMobileMenu}>About Us</a></li> */}
                    {/* <li>
                                    <a href="#" onClick={(e) => e.preventDefault()}>Services</a>
                                    <ul className="sub-menu pl-3" style={{ display: 'block' }}>
                                        <li><a href="services.html" onClick={toggleMobileMenu}>Services</a></li>
                                        <li><a href="services-detail.html" onClick={toggleMobileMenu}>Services Details</a></li>
                                    </ul>
                                </li> */}
                    {/* <li>
                                    <a href="#" onClick={(e) => e.preventDefault()}>Blog</a>
                                    <ul className="sub-menu pl-3" style={{ display: 'block' }}>
                                        <li><a href="blog.html" onClick={toggleMobileMenu}>Blog</a></li>
                                        <li><a href="blog-details.html" onClick={toggleMobileMenu}>Blog Details</a></li>
                                    </ul>
                                </li> */}
                    <li>
                        Registration
                        <ul className="sub-menu pl-3" style={{ display: 'block' }}>
                            <li><NavLink to="/doctorReg" onClick={toggleMobileMenu}>Doctor Registration</NavLink></li>
                            <li><NavLink to="/ambulance" onClick={toggleMobileMenu}>Ambulance Registration</NavLink></li>
                        </ul>
                    </li>
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
                            {/* <DoctorEditProfile doctorData={doctorData} onClose={handleCloseProfile} /> */}
                            <DoctorProfile doctorData={doctorData} handleOpenEditProfile={handleOpenEditProfile} />
                        </div>
                    </div>
                )
            }
            {
                isEditProfileOpen && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <button className="close-button" onClick={handleCloseEditProfile} style={{ color: 'black' }}>&times;</button>
                            <DoctorEditProfile doctorData={doctorData} onClose={handleCloseEditProfile} />
                            {/* <DoctorProfile doctorData={doctorData}/> */}
                        </div>
                    </div>
                )
            }
        </div>
    );
}


export default DoctorHeader;