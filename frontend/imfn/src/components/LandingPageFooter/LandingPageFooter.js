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

function LandingPageFooter() {
    return (
        <div>
            <footer className="footer-bg footer-p" >
                <div className="overly"><img src={require('../../asset/user_assets/img/an-bg/footer-bg.png')} alt="rest" /></div>
                <div className="footer-top pb-30" style={{ backgroundColor: '#ECF1FA' }}>
                    <div className="container">
                        <div className="row justify-content-between">

                            <div className="col-xl-3 col-lg-3 col-sm-6">
                                <div className="footer-widget mb-30">
                                    <div className="flog mb-35">
                                        <a href="#"><img src={require('../../asset/user_assets/img/logo/logo.png')} alt="logo" /></a>
                                    </div>
                                    <div className="footer-text mb-20">
                                        <p>The Integrated Medical Facility Network (IMFN) is a next-generation healthcare coordination platform designed to bridge the gap between hospitals, doctors, and patients through advanced technology and real-time data integration.</p>
                                    </div>
                                    {/* <div className="footer-social">
                                        <a href="#"><i className="fab fa-facebook-f"></i></a>
                                        <a href="#"><i className="fab fa-twitter"></i></a>
                                        <a href="#"><i className="fab fa-instagram"></i></a>
                                        <a href="#"><i className="fab fa-google-plus-g"></i></a>
                                    </div> */}
                                </div>
                            </div>


                            {/* <div className="col-xl-2 col-lg-2 col-sm-6">
                                <div className="footer-widget mb-30">
                                    <div className="f-widget-title">
                                        <h5>Our Links</h5>
                                    </div>
                                    <div className="footer-link">
                                        <ul>
                                            <li><a href="#"><i className="fas fa-chevron-right"></i> Partners</a></li>
                                            <li><a href="#"><i className="fas fa-chevron-right"></i> About Us</a></li>
                                            <li><a href="#"><i className="fas fa-chevron-right"></i> Career</a></li>
                                            <li><a href="#"><i className="fas fa-chevron-right"></i> Reviews</a></li>
                                            <li><a href="#"><i className="fas fa-chevron-right"></i> Terms & Conditions</a></li>
                                            <li><a href="#"><i className="fas fa-chevron-right"></i> Help</a></li>
                                        </ul>
                                    </div>
                                </div>
                            </div> */}

                            {/* <div className="col-xl-2 col-lg-2 col-sm-6">
                                <div className="footer-widget mb-30">
                                    <div className="f-widget-title">
                                        <h5>Other Links</h5>
                                    </div>
                                    <div className="footer-link">
                                        <ul>
                                            <li><a href="#"><i className="fas fa-chevron-right"></i> Home</a></li>
                                            <li><a href="#"><i className="fas fa-chevron-right"></i> About Us</a></li>
                                            <li><a href="#"><i className="fas fa-chevron-right"></i> Services</a></li>
                                            <li><a href="#"><i className="fas fa-chevron-right"></i> Project</a></li>
                                            <li><a href="#"><i className="fas fa-chevron-right"></i> Our Team</a></li>
                                            <li><a href="#"><i className="fas fa-chevron-right"></i> Latest Blog</a></li>
                                        </ul>
                                    </div>
                                </div>
                            </div> */}
                            
                            <div className="col-xl-3 col-lg-3 col-sm-6">
                                <div className="footer-widget mb-30">
                                    <div className="f-widget-title">
                                        <h5>Contact Us</h5>
                                    </div>
                                    <div className="footer-link">
                                        <div className="f-contact">
                                            <ul>
                                                <li>
                                                    <i className="icon dripicons-phone"></i>
                                                    <span>+1 800-IMFN-911<br />+1 555-0199-HELP</span>
                                                </li>
                                                <li>
                                                    <i className="icon dripicons-mail"></i>
                                                    <span><a href="mailto:info@imfn.org">info@imfn.org</a><br /><a href="mailto:support@imfn.org">support@imfn.org</a></span>
                                                </li>
                                                <li>
                                                    <i className="fal fa-map-marker-alt"></i>
                                                    <span>123 Medical Plaza, Health City<br />Integrated Network Hub, NY 10001</span>
                                                </li>
                                            </ul>

                                        </div>


                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
                <div className="copyright-wrap">
                    <div className="container">
                        <div className="row">
                            <div className="col-12">
                                <div className="copyright-text text-center">
                                    <p>&copy; {new Date().getFullYear()} Integrated Medical Facility Network (IMFN). All Rights Reserved.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}

export default LandingPageFooter