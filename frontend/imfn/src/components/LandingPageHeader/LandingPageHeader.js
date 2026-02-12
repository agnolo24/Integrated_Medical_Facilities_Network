import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router';
import LoginPage from '../loginPage/LoginPage';
import RegForm1 from '../forms/userRegForm/RegForm1';
import HospitalRegForm from '../forms/hospitalRegForm/HospitalRegForm';

// CSS Imports
import '../../asset/user_assets/css/bootstrap.min.css';
import '../../asset/user_assets/css/animate.min.css';
import '../../asset/user_assets/css/magnific-popup.css';
import '../../asset/user_assets/fontawesome/css/all.min.css';
import '../../asset/user_assets/css/dripicons.css';
import '../../asset/user_assets/css/slick.css';
import '../../asset/user_assets/css/default.css';
import '../../asset/user_assets/css/meanmenu.css';
import '../../asset/user_assets/css/style.css';
import '../../asset/user_assets/css/responsive.css';

function LandingPageHeader() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSticky, setIsSticky] = useState(false);
    const [modalType, setModalType] = useState(null); // 'login', 'patient', 'hospital'

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const openModal = (type) => {
        setModalType(type);
        setIsMobileMenuOpen(false);
    };

    const closeModal = () => {
        setModalType(null);
    };

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
                                            <span>support@imfn.org</span>
                                        </li>
                                        <li>
                                            <i className="icon dripicons-phone"></i>
                                            <span>+1 (800) IMFN-HELP</span>
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
                                        <a href="index.html"><img src={require('../../asset/user_assets/img/logo/logo.png')} alt="logo" /></a>
                                    </div>
                                </div>
                                <div className="col-xl-8 col-lg-8 d-none d-lg-block">
                                    <div className="main-menu text-right pr-15">
                                        <nav id="mobile-menu-desktop">
                                            <ul>
                                                <li>
                                                    <NavLink to="/">Home</NavLink>
                                                </li>
                                                {/* <li>
                                                    <a href="#about">About Us</a>
                                                </li>
                                                <li>
                                                    <a href="#services">Services</a>
                                                </li>
                                                <li>
                                                    <a href="#blog">Blog</a>
                                                </li> */}
                                                <li>
                                                    <a href="#" onClick={(e) => { e.preventDefault(); openModal('patient'); }}>Patient Registration</a>
                                                </li>
                                                <li>
                                                    <a href="#" onClick={(e) => { e.preventDefault(); openModal('hospital'); }}>Hospital Registration</a>
                                                </li>
                                            </ul>
                                        </nav>
                                    </div>
                                </div>
                                <div className="col-xl-2 col-lg-2 d-none d-lg-block">
                                    <button className="top-btn" onClick={() => openModal('login')}>Login</button>
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
                    <li><NavLink to="/" onClick={toggleMobileMenu}>Home</NavLink></li>
                    <li><a href="#about" onClick={toggleMobileMenu}>About Us</a></li>
                    <li><a href="#services" onClick={toggleMobileMenu}>Services</a></li>
                    <li><a href="#blog" onClick={toggleMobileMenu}>Blog</a></li>
                    <li>
                        <a href="#" onClick={(e) => { e.preventDefault(); e.stopPropagation(); openModal('patient'); }}>Patient Registration</a>
                    </li>
                    <li>
                        <a href="#" onClick={(e) => { e.preventDefault(); e.stopPropagation(); openModal('hospital'); }}>Hospital Registration</a>
                    </li>
                    <li><a href="#" onClick={(e) => { e.preventDefault(); e.stopPropagation(); openModal('login'); }}>Login</a></li>
                </ul>

                <div className="side-social" style={{ marginTop: '20px' }}>
                    <a href="#"><i className="fab fa-facebook-f"></i></a>
                    <a href="#"><i className="fab fa-twitter"></i></a>
                    <a href="#"><i className="fab fa-linkedin-in"></i></a>
                    <a href="#"><i className="fab fa-google-plus-g"></i></a>
                </div>
            </div>

            <div className={`offcanvas-overly ${isMobileMenuOpen ? 'active' : ''}`} onClick={toggleMobileMenu}></div>

            {/* Modal Implementation */}
            {modalType && (
                <div className="custom-modal-overlay" onClick={closeModal} style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(0,0,0,0.7)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 9999,
                    overflowY: 'auto',
                    padding: '20px'
                }}>
                    <div className="custom-modal-content" onClick={(e) => e.stopPropagation()} style={{
                        backgroundColor: '#fff',
                        borderRadius: '10px',
                        width: '100%',
                        maxWidth: modalType === 'login' ? '500px' : '800px',
                        position: 'relative',
                        animation: 'fadeInUp 0.3s ease-out'
                    }}>
                        <button onClick={closeModal} style={{
                            position: 'absolute',
                            right: '15px',
                            top: '15px',
                            border: 'none',
                            background: 'none',
                            fontSize: '24px',
                            cursor: 'pointer',
                            zIndex: 10001,
                            color: '#333'
                        }}>&times;</button>

                        <div style={{ maxHeight: '90vh', overflowY: 'auto', paddingBottom: '20px' }}>
                            {modalType === 'login' && <LoginPage hideHeaderFooter={true} />}
                            {modalType === 'patient' && <RegForm1 hideHeaderFooter={true} />}
                            {modalType === 'hospital' && <HospitalRegForm hideHeaderFooter={true} />}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default LandingPageHeader;