import React, { useEffect } from 'react';
import { NavLink } from 'react-router';

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
                                    {/*  /social media icon redux */}
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
                <div id="header-sticky" className="menu-area">
                    <div className="container">
                        <div className="second-menu">
                            <div className="row align-items-center">
                                <div className="col-xl-2 col-lg-2">
                                    <div className="logo">
                                        <a href="index.html"><img src={require('../../asset/user_assets/img/logo/logo.png')} alt="logo" /></a>
                                    </div>
                                </div>
                                <div className="col-xl-8 col-lg-8">
                                    <div className="main-menu text-right pr-15">
                                        <nav id="mobile-menu">
                                            <ul>
                                                <li className="has-sub">
                                                    <NavLink to="/"><h6>Home</h6></NavLink>
                                                </li>
                                                <li><a href="about.html">About Us</a></li>
                                                <li className="has-sub">
                                                    <a href="services.html">Services</a>
                                                    <ul>
                                                        <li><a href="services.html">Services</a></li>
                                                        <li><a href="services-detail.html">Services Details</a></li>
                                                    </ul>
                                                </li>

                                                <li className="has-sub">
                                                    <a href="blog.html">Blog</a>
                                                    <ul>
                                                        <li><a href="blog.html">Blog</a></li>
                                                        <li><a href="blog-details.html">Blog Details</a></li>
                                                    </ul>
                                                </li>
                                                <li className="has-sub">
                                                    <h6>Registration</h6>
                                                    <ul>
                                                        <li><NavLink to="/userReg">User Registration</NavLink></li>
                                                        <li><NavLink to="/hospitalReg">Hospital Registration</NavLink></li>
                                                        <li><NavLink to="/ambulance">Ambulance Registration</NavLink></li>
                                                    </ul>
                                                </li>
                                            </ul>
                                        </nav>
                                    </div>
                                </div>
                                <div className="col-xl-2 col-lg-2 d-none d-lg-block">
                                    <NavLink to="/login"><button className="top-btn">Login</button></NavLink>

                                </div>
                                <div className="col-12">
                                    <div className="mobile-menu"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
            {/* header-end */}

        </div>
    )
}

export default LandingPageHeader