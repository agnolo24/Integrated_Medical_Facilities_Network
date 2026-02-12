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
import LandingPageHeader from '../LandingPageHeader/LandingPageHeader';
import LandingPageFooter from '../LandingPageFooter/LandingPageFooter';

function LandingHome() {
    return (
        <div>
            <LandingPageHeader />

            {/* main-area */}
            <main>
                {/* slider-area */}
                <section id="home" className="slider-area fix p-relative">

                    <div className="slider-active2">
                        <div className="single-slider slider-bg d-flex align-items-center" style={{ backgroundImage: `url(${require('../../asset/user_assets/img/an-bg/header-bg.png')})` }}>
                            <div className="container">
                                <div className="row align-items-center">
                                    <div className="col-lg-6">
                                        <div className="slider-content s-slider-content text-left">
                                            <h2 data-animation="fadeInUp" data-delay=".4s">Revolutionizing Healthcare with <span>Integrated Networks</span></h2>
                                            <p data-animation="fadeInUp" data-delay=".6s">The Integrated Medical Facility Network (IMFN) connects patients, doctors, and hospitals in a seamless ecosystem, ensuring rapid response and superior care through advanced technology.</p>
                                            {/* <div className="slider-btn mt-25">
                                                <a href="#about" className="btn ss-btn" data-animation="fadeInRight" data-delay=".8s">Discover More <i className="fas fa-chevron-right"></i></a>
                                            </div> */}
                                        </div>
                                    </div>
                                    <div className="col-lg-6">
                                        <img src={require('../../asset/user_assets/img/bg/header-img.png')} alt="header-img" className="header-img" />
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>


                </section>
                {/* slider-area-end */}

                {/* booking-area */}
                {/* <section id="booking" className="booking-area p-relative">
                    <div className="container">
                        <form action="#" className="contact-form" >
                            <div className="row">
                                <div className="col-lg-12">
                                    <ul>
                                        <li>
                                            <div className="contact-field p-relative c-name">
                                                <input type="text" placeholder="Enter Name" />
                                            </div>
                                        </li>
                                        <li>
                                            <div className="contact-field p-relative c-email">
                                                <select className="custom-select" id="inputGroupSelect04" aria-label="Example select with button addon" defaultValue="Select Medical Specialization...">
                                                    <option>Select Medical Specialization...</option>
                                                    <option value="1">Cardiology</option>
                                                    <option value="2">Neurology</option>
                                                    <option value="3">Pediatrics</option>
                                                    <option value="4">Trauma Surgery</option>
                                                </select>
                                            </div>
                                        </li>
                                        <li>
                                            <div className="contact-field p-relative c-subject mb-20">
                                                <select className="custom-select" id="inputGroupSelect05" aria-label="Example select with button addon" defaultValue="Select Facility Type...">
                                                    <option>Select Facility Type...</option>
                                                    <option value="1">General Hospital</option>
                                                    <option value="2">Diagnostic Center</option>
                                                    <option value="3">Pharmacy</option>
                                                    <option value="4">Ambulance Hub</option>
                                                </select>
                                            </div>

                                        </li>
                                        <li>
                                            <div className="slider-btn">
                                                <a href="#" className="btn ss-btn" data-animation="fadeInRight" data-delay=".8s">Submit Now <i className="fas fa-chevron-right"></i></a>
                                            </div>
                                        </li>
                                    </ul>
                                </div>

                            </div>

                        </form>
                    </div>
                </section> */}
                {/* booking-area-end */}

                {/* services-area */}
                <section id="services" className="services-area services-bg services-two pt-100" style={{ backgroundImage: `url(${require('../../asset/user_assets/img/an-bg/an-bg02.png')})`, backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'center center' }}>
                    <div className="container">
                        <div className="row justify-content-center">
                            <div className="col-xl-8 col-lg-8">
                                <div className="section-title text-center pl-40 pr-40 mb-80" >
                                    <span> OUR SERVICES</span>
                                    <h2>Excellence in Medical Integration</h2>
                                    <p className="mt-10">We provide a comprehensive suite of digital tools designed to optimize patient outcomes and streamline medical facility operations through real-time data sharing.</p>
                                </div>
                            </div>
                        </div>
                        <div className="row sr-line">
                            <div className="col-lg-4 col-md-12">
                                <div className="s-single-services text-center active" >
                                    <div className="services-icon">
                                        <img src={require('../../asset/user_assets/img/icon/sr-icon01.png')} alt="img" />
                                    </div>
                                    <div className="second-services-content">
                                        <h5><a href="#">Emergency Management</a></h5>
                                        <p>Smart emergency response system with real-time ambulance tracking and hospital readiness notifications.</p>
                                    </div>

                                </div>
                            </div>
                            <div className="col-lg-4 col-md-12">
                                <div className="s-single-services text-center" >
                                    <div className="services-icon">
                                        <img src={require('../../asset/user_assets/img/icon/sr-icon02.png')} alt="img" />
                                    </div>
                                    <div className="second-services-content">
                                        <h5><a href="#">Unified Health Records</a></h5>
                                        <p>A secure, centralized platform for patients and doctors to access medical history, prescriptions, and lab results.</p>
                                    </div>

                                </div>
                            </div>
                            <div className="col-lg-4 col-md-12">
                                <div className="s-single-services text-center" >
                                    <div className="services-icon">
                                        <img src={require('../../asset/user_assets/img/icon/sr-icon03.png')} alt="img" />
                                    </div>
                                    <div className="second-services-content">
                                        <h5><a href="#">Facility Coordination</a></h5>
                                        <p>Seamlessly transferring patient data and managing resources across multiple integrated medical facilities.</p>
                                    </div>

                                </div>
                            </div>


                        </div>

                    </div>
                </section>
                {/* services-area-end */}

                {/* about-area */}
                <section id="about" className="about-area about-p pt-65 pb-80 p-relative" style={{ backgroundImage: `url(${require('../../asset/user_assets/img/an-bg/an-bg03.png')})`, backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'center center' }}>
                    <div className="container">
                        <div className="row align-items-center">
                            <div className="col-lg-6 col-md-12 col-sm-12">
                                <div className="s-about-img p-relative">
                                    <img src={require('../../asset/user_assets/img/bg/illlustration.png')} alt="img" />

                                </div>
                            </div>
                            <div className="col-lg-6 col-md-12 col-sm-12">
                                <div className="about-content s-about-content pl-30">
                                    <div className="section-title mb-20">
                                        <span>About Us</span>
                                        <h2>Bridging the Gap in Modern Healthcare</h2>
                                    </div>
                                    <p>The Integrated Medical Facility Network (IMFN) is dedicated to transforming how medical services interact. By leveraging cutting-edge cloud technology and real-time data analytics, we ensure that every patient receives precisely what they need, exactly when they need it.</p>

                                    <ul>
                                        <li>
                                            <div className="icon"><i className="fas fa-chevron-right"></i></div>
                                            <div className="text">Secure and encrypted patient data management systems.
                                            </div>
                                        </li>
                                        <li>
                                            <div className="icon"><i className="fas fa-chevron-right"></i></div>
                                            <div className="text">Real-time collaboration tools for multidisciplinary medical teams.
                                            </div>
                                        </li>
                                        <li>
                                            <div className="icon"><i className="fas fa-chevron-right"></i></div>
                                            <div className="text">Integrated billing and resource management for hospitals.
                                            </div>
                                        </li>
                                        <div></div>
                                    </ul>

                                    {/* <div className="slider-btn mt-30">
                                        <a href="#" className="btn ss-btn" data-animation="fadeInRight" data-delay=".8s">Read More <i className="fas fa-chevron-right"></i></a>
                                    </div> */}
                                </div>
                            </div>

                        </div>
                    </div>
                </section>
                {/* about-area-end */}

                {/* counter-area */}
                <div className="counter-area pt-100 pb-100" style={{ backgroundImage: `url(${require('../../asset/user_assets/img/an-bg/an-bg04.png')})`, backgroundRepeat: 'no-repeat', backgroundSize: 'contain' }}>
                    <div className="container">
                        <div className="row align-items-end">
                            <div className="col-lg-3 col-md-6 col-sm-12">
                                <div className="single-counter text-center" >
                                    <img src={require('../../asset/user_assets/img/icon/cunt-icon01.png')} alt="img" />
                                    <div className="counter p-relative">
                                        <span className="count">120</span><small>+</small>
                                    </div>
                                    <p>Integrated Hospitals</p>
                                </div>
                            </div>
                            <div className="col-lg-3 col-md-6 col-sm-12">
                                <div className="single-counter text-center" >
                                    <img src={require('../../asset/user_assets/img/icon/cunt-icon02.png')} alt="img" />
                                    <div className="counter p-relative">
                                        <span className="count">15</span><small>K+</small>
                                    </div>
                                    <p>Verified Patients</p>
                                </div>
                            </div>
                            <div className="col-lg-3 col-md-6 col-sm-12">
                                <div className="single-counter text-center" >
                                    <img src={require('../../asset/user_assets/img/icon/cunt-icon03.png')} alt="img" />
                                    <div className="counter p-relative">
                                        <span className="count">850</span><small>+</small>
                                    </div>
                                    <p>Active Ambulances</p>
                                </div>
                            </div>
                            <div className="col-lg-3 col-md-6 col-sm-12">
                                <div className="single-counter text-center" >
                                    <img src={require('../../asset/user_assets/img/icon/cunt-icon04.png')} alt="img" />
                                    <div className="counter p-relative">
                                        <span className="count">25</span><small>+</small>
                                    </div>
                                    <p>Specialized Labs</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* counter-area-end */}

                {/* department-area */}
                <section className="department-area cta-bg pb-70 mt-10 fix" style={{ backgroundImage: `url(${require('../../asset/user_assets/img/an-bg/an-bg05.png')})`, backgroundSize: 'contain' }}>
                    <div className="container">
                        <div className="row align-items-center">
                            <div className="col-lg-6">
                                <div className="section-title mb-50  " >
                                    <span>OUR DEPARTMENTS</span>
                                    <h2>We Take Care Of Your Life Healthy Health</h2>
                                </div>
                                <ul>
                                    <li>
                                        <div className="icon">
                                            <div><img src={require('../../asset/user_assets/img/icon/de-icon01.png')} alt="de-icon" /></div></div>
                                        <a href="#" className="text">
                                            <h3>Emergency Care</h3>
                                            Integrated protocols for critical trauma management and rapid response coordination across the network.
                                        </a>
                                    </li>
                                    <li>
                                        <div className="icon">
                                            <div><img src={require('../../asset/user_assets/img/icon/de-icon02.png')} alt="de-icon" /></div></div>
                                        <a href="#" className="text">
                                            <h3>Specialized Surgery</h3>
                                            Connecting top-tier surgeons with advanced diagnostic facilities for complex medical procedures.
                                        </a>
                                    </li>
                                    <li>
                                        <div className="icon">
                                            <div><img src={require('../../asset/user_assets/img/icon/de-icon03.png')} alt="de-icon" /></div></div>
                                        <a href="#" className="text">
                                            <h3>Diagnostic Labs</h3>
                                            High-speed laboratory integration for faster results and automated record updates.
                                        </a>
                                    </li>
                                </ul>

                            </div>
                            <div className="col-lg-6">
                                <div className="s-d-img p-relative">
                                    <img src={require('../../asset/user_assets/img/bg/de-illustration.png')} alt="img" />

                                </div>

                            </div>
                        </div>
                    </div>
                </section>
                {/* department-area-end */}

                {/* team-area*/}
                {/* <section id="team" className="pb-20" style={{ backgroundImage: `url(${require('../../asset/user_assets/img/an-bg/an-bg13.png')})`, backgroundSize: 'contain', backgroundPosition: 'center center', backgroundRepeat: 'no-repeat' }}>

                    <div className="container">
                        <div className="row justify-content-center">
                            <div className="col-xl-8 col-lg-8">
                                <div className="section-title text-center mb-70">
                                    <span> OUR TEAM </span>
                                    <h2>Docter’s In The Medical Sciences</h2>
                                    <p>Fusce pharetra odio in urna laoreet laoreet. Aliquam erat volutpat. Phasellus nec ligula arcu. Aliquam eu urna pulvinar, iaculis ipsum in, porta massa.</p>
                                </div>
                            </div>
                        </div>
                        <div className="row team-active">
                            <div className="col-xl-4">
                                <div className="single-team mb-30" >
                                    <div className="team-thumb">
                                        <div className="brd">
                                            <img src={require('../../asset/user_assets/img/team/team01.png')} alt="img" />
                                        </div>

                                        <div className="dropdown">
                                            <a className="xbtn" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                +
                                            </a>
                                            <div className="dropdown-menu" aria-labelledby="dropdownMenu2">
                                                <div className="team-social mt-15">
                                                    <ul>
                                                        <li><a href="#"><i className="fab fa-facebook-f"></i></a></li>
                                                        <li> <a href="#"><i className="fab fa-twitter"></i></a></li>
                                                        <li><a href="#"><i className="fab fa-instagram"></i></a></li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>


                                    </div>
                                    <div className="team-info">
                                        <h4><a href="#">Dr. Sarah Johnson</a></h4>
                                        <span>Chief Medical Officer</span>
                                        <p>Expert in Healthcare Systems</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-xl-4">
                                <div className="single-team mb-30" >
                                    <div className="team-thumb">
                                        <div className="brd">
                                            <img src={require('../../asset/user_assets/img/team/team02.png')} alt="img" />
                                        </div>
                                        <div className="dropdown">
                                            <a className="xbtn" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                +
                                            </a>
                                            <div className="dropdown-menu" aria-labelledby="dropdownMenu2">
                                                <div className="team-social mt-15">
                                                    <ul>
                                                        <li><a href="#"><i className="fab fa-facebook-f"></i></a></li>
                                                        <li> <a href="#"><i className="fab fa-twitter"></i></a></li>
                                                        <li><a href="#"><i className="fab fa-instagram"></i></a></li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="team-info">
                                        <h4><a href="#">Dr. Michael Chen</a></h4>
                                        <span>Lead Trauma Surgeon</span>
                                        <p>Emergency Response Specialist</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-xl-4">
                                <div className="single-team mb-30" >
                                    <div className="team-thumb">
                                        <div className="brd">
                                            <img src={require('../../asset/user_assets/img/team/team03.png')} alt="img" />
                                        </div>
                                        <div className="dropdown">
                                            <a className="xbtn" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                +
                                            </a>
                                            <div className="dropdown-menu" aria-labelledby="dropdownMenu2">
                                                <div className="team-social mt-15">
                                                    <ul>
                                                        <li><a href="#"><i className="fab fa-facebook-f"></i></a></li>
                                                        <li> <a href="#"><i className="fab fa-twitter"></i></a></li>
                                                        <li><a href="#"><i className="fab fa-instagram"></i></a></li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="team-info">
                                        <h4><a href="#">Dr. Emily Davis</a></h4>
                                        <span>Diagnostic Director</span>
                                        <p>Radiology & Lab Management</p>
                                    </div>
                                </div>
                            </div>




                        </div>
                    </div>
                </section> */}
                {/* team-area-end */}

                {/* newslater-area */}
                {/* <section className="newslater-area pb-50" style={{ backgroundImage: `url(${require('../../asset/user_assets/img/an-bg/an-bg06.png')})`, backgroundPosition: 'center bottom', backgroundRepeat: 'no-repeat' }} >
                    <div className="container">
                        <div className="row align-items-end">
                            <div className="col-xl-4 col-lg-4 col-lg-4">
                                <div className="section-title mb-100">
                                    <span>NEWSLETTER</span>
                                    <h2>Subscribe To Our Newsletter</h2>
                                </div>
                            </div>
                            <div className="col-xl-4 col-lg-4">
                                <form name="ajax-form" id="contact-form4" action="#" method="post" className="contact-form newslater pb-130">
                                    <div className="form-group">
                                        <input className="form-control" id="email2" name="email" type="email" placeholder="Email Address..." value="" required="" />
                                        <button type="submit" className="btn btn-custom" id="send2">Subscribe <i className="fas fa-chevron-right"></i></button>
                                    </div>
                                    
                                </form>
                            </div>
                            <div className="col-xl-4 col-lg-4">
                                <img src={require('../../asset/user_assets/img/bg/news-illustration.png')} alt="img" />
                            </div>
                        </div>

                    </div>
                </section> */}
                {/* newslater-aread-end */}

                {/* testimonial-area */}
                {/* <section id="testimonios" className="testimonial-area testimonial-p pt-50 pb-85 fix" style={{ backgroundImage: `url(${require('../../asset/user_assets/img/an-bg/an-bg07.png')})`, backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundSize: 'contain' }} >
                    <div className="container">
                        <div className="row justify-content-center">

                            <div className="col-lg-8">
                                <div className="section-title center-align mb-60 text-center">
                                    <span>TESTIMONIAL</span>
                                    <h2>What Our Client’s Say’s</h2>
                                    <p>Fusce pharetra odio in urna laoreet laoreet. Aliquam erat volutpat. Phasellus nec ligula arcu. Aliquam eu urna pulvinar, iaculis ipsum in, porta massa.</p>
                                </div>
                            </div>
                        </div>

                        <div className="row justify-content-center">

                            <div className="col-lg-10">
                                <div className="testimonial-active">


                                    <div className="single-testimonial">
                                        <div className="testi-img">
                                            <img src={require('../../asset/user_assets/img/testimonial/testimonial-img.png')} alt="img" />
                                        </div>
                                        <div className="single-testimonial-bg">
                                            <div className="com-icon"><img src={require('../../asset/user_assets/img/testimonial/qutation.png')} alt="img" /></div>
                                            <div className="testi-author">
                                                <div className="ta-info">
                                                    <h6>Dr. Sarah Johnson</h6>
                                                    <span>Head of Cardiology, City Hospital</span>

                                                </div>
                                            </div>
                                            <p>"The IMFN system has revolutionized how we coordinate with emergency services. Having real-time access to patient vitals while they are still in the ambulance is a game-changer."</p>
                                        </div>

                                    </div>
                                    <div className="single-testimonial">
                                        <div className="testi-img">
                                            <img src={require('../../asset/user_assets/img/testimonial/testimonial-img.png')} alt="img" />
                                        </div>
                                        <div className="single-testimonial-bg">
                                            <div className="com-icon"><img src={require('../../asset/user_assets/img/testimonial/qutation.png')} alt="img" /></div>
                                            <div className="testi-author">
                                                <div className="ta-info">
                                                    <h6>Robert Williams</h6>
                                                    <span>Patient</span>

                                                </div>
                                            </div>
                                            <p>"I never have to worry about carrying my medical records anymore. Every doctor in the network knows my history, which makes every visit so much smoother and safer."</p>
                                        </div>

                                    </div>
                                    <div className="single-testimonial">
                                        <div className="testi-img">
                                            <img src={require('../../asset/user_assets/img/testimonial/testimonial-img.png')} alt="img" />
                                        </div>
                                        <div className="single-testimonial-bg">
                                            <div className="com-icon"><img src={require('../../asset/user_assets/img/testimonial/qutation.png')} alt="img" /></div>
                                            <div className="testi-author">
                                                <div className="ta-info">
                                                    <h6>David Chen</h6>
                                                    <span>Hospital Administrator</span>

                                                </div>
                                            </div>
                                            <p>"Resource management across multiple branches has never been easier. IMFN provides us with the data we need to optimize our staff and equipment allocation efficiently."</p>
                                        </div>

                                    </div>


                                </div>
                            </div>

                        </div>
                    </div>
                </section> */}
                {/* testimonial-area-end */}



                {/* call-area */}
                {/* <div className="call-area pb-50" style={{ backgroundImage: `url(${require('../../asset/user_assets/img/an-bg/an-bg09.png')})`, backgroundRepeat: 'no-repeat', backgroundPosition: 'bottom' }}>
                    <div className="container">
                        <div className="row align-items-center">
                            <div className="col-lg-5 col-md-12 col-sm-12">
                                <div className="single-counter-img fadeInUp animated" >
                                    <img src={require('../../asset/user_assets/img/bg/ap-illustration.png')} alt="img" className="img" />
                                </div>
                            </div>
                            <div className="col-lg-5 col-md-12 col-sm-12">
                                <div className="section-title mt-100">
                                    <span>APPOINTMENT</span>
                                    <h2>Make An Appointment For Emergency</h2>
                                </div>

                            </div>
                            <div className="col-lg-2 col-md-12 col-sm-12">
                                <div className="slider-btn mt-130">
                                    <a href="#" className="btn ss-btn" data-animation="fadeInRight" data-delay=".8s">Appointment <i className="fas fa-chevron-right"></i></a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div> */}
                {/* call-area-end */}

                {/* blog-area */}
                {/* <section id="blog" className="blog-area p-relative pt-100 pb-90 fix" style={{ backgroundImage: `url(${require('../../asset/user_assets/img/an-bg/an-bg10.png')})`, backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'center center' }}>
                    <div className="container">
                        <div className="row justify-content-center">
                            <div className="col-xl-8 col-lg-10">
                                <div className="section-title text-center mb-80" >
                                    <span> OUR LATEST UPDATES </span>
                                    <h2>Healthcare Insights & Network News</h2>
                                    <p >Stay informed with the latest advancements in medical technology and updates from our integrated network members.</p>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-lg-4 col-md-12">
                                <div className="single-post mb-30" >
                                    <div className="blog-thumb">
                                        <a href="blog-details.html">
                                            <img src={require('../../asset/user_assets/img/blog/blog_img01.jpg')} alt="img" />
                                            <img src={require('../../asset/user_assets/img/bg/b-link.png')} alt="b-link" className="b-link" />
                                        </a>
                                    </div>
                                    <div className="blog-content text-center">
                                        <div className="b-meta mb-20">
                                            <div className="row">
                                                <div className="col-lg-6 col-md-6">
                                                    <i className="far fa-calendar-alt"></i>  15 Feb, 2024
                                                </div>
                                                <div className="col-lg-6 col-md-6">
                                                    <i className="fas fa-user"></i> By IMFN Admin
                                                </div>
                                            </div>
                                        </div>
                                        <h4><a href="#">The Future of Integrated Patient Care Systems</a></h4>
                                        <p>Discover how data synchronization between facilities is saving lives and reducing medical errors.</p>
                                        <div className="blog-btn"><a href="#">Read More<i className="fas fa-chevron-right"></i></a></div>

                                    </div>


                                </div>
                            </div>
                            <div className="col-lg-4 col-md-12">
                                <div className="single-post active mb-30" >
                                    <div className="blog-thumb">
                                        <a href="blog-details.html">
                                            <img src={require('../../asset/user_assets/img/blog/blog_img02.jpg')} alt="img" />
                                            <img src={require('../../asset/user_assets/img/bg/b-link.png')} alt="b-link" className="b-link" />
                                        </a>

                                    </div>
                                    <div className="blog-content text-center">
                                        <div className="b-meta mb-20">
                                            <div className="row">
                                                <div className="col-lg-6 col-md-6">
                                                    <i className="far fa-calendar-alt"></i>  10 Feb, 2024
                                                </div>
                                                <div className="col-lg-6 col-md-6">
                                                    <i className="fas fa-user"></i> By Dr. Sarah Johnson
                                                </div>
                                            </div>
                                        </div>
                                        <h4><a href="#">Real-time Ambulance Tracking: A Case Study</a></h4>
                                        <p>A look into how our live tracking system improved emergency response times by 30%.</p>
                                        <div className="blog-btn"><a href="#">Read More<i className="fas fa-chevron-right"></i></a></div>
                                    </div>


                                </div>
                            </div>
                            <div className="col-lg-4 col-md-12">
                                <div className="single-post mb-30" >                               <div className="blog-thumb">
                                    <a href="blog-details.html">
                                        <img src={require('../../asset/user_assets/img/blog/blog_img03.jpg')} alt="img" />
                                        <img src={require('../../asset/user_assets/img/bg/b-link.png')} alt="b-link" className="b-link" />
                                    </a>
                                </div>
                                    <div className="blog-content text-center">
                                        <div className="b-meta mb-20">
                                            <div className="row">
                                                <div className="col-lg-6 col-md-6">
                                                    <i className="far fa-calendar-alt"></i>  05 Feb, 2024
                                                </div>
                                                <div className="col-lg-6 col-md-6">
                                                    <i className="fas fa-user"></i> By Network Security
                                                </div>
                                            </div>
                                        </div>
                                        <h4><a href="#">Ensuring Data Privacy in Healthcare Networks</a></h4>
                                        <p>Understanding the layers of encryption and security protocols protecting patient information.</p>
                                        <div className="blog-btn"><a href="#">Read More<i className="fas fa-chevron-right"></i></a></div>
                                    </div>

                                </div>
                            </div>

                        </div>
                    </div>
                </section> */}
                {/* blog-area-end */}

                {/* contact-area */}
                {/* <section id="contact" className="contact-area contact-bg pb-70 p-relative fix" style={{ backgroundImage: `url(${require('../../asset/user_assets/img/an-bg/an-bg11.png')})`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat' }}>
                    <div className="container">

                        <div className="row">
                            <div className="col-lg-6">
                                <div className="contact-img">
                                    <img src={require('../../asset/user_assets/img/bg/touch-illustration.png')} alt="touch-illustration" />
                                </div>
                            </div>
                            <div className="col-lg-6">
                                <div className="section-title mb-60" >
                                    <span>Contact</span>
                                    <h2>Get In Touch With Us</h2>
                                </div>
                                <form action="#" className="contact-form" >
                                    <div className="row">
                                        <div className="col-lg-6">
                                            <div className="contact-field p-relative c-name mb-20">
                                                <input type="text" placeholder="First Name" />
                                            </div>
                                        </div>
                                        <div className="col-lg-6">
                                            <div className="contact-field p-relative c-name mb-20">
                                                <input type="text" placeholder="Last Name" />
                                            </div>
                                        </div>
                                        <div className="col-lg-12">
                                            <div className="contact-field p-relative c-email mb-20">
                                                <input type="text" placeholder="Your Email Address" />
                                            </div>
                                        </div>
                                        <div className="col-lg-12">
                                            <div className="contact-field p-relative c-subject mb-20">
                                                <input type="text" placeholder="I would like to discuss" />
                                            </div>
                                        </div>
                                        <div className="col-lg-12">
                                            <div className="contact-field p-relative c-message mb-45">
                                                <textarea name="message" id="message" cols="30" rows="10" placeholder="Write comments" defaultValue=""></textarea>
                                            </div>
                                            <div className="slider-btn">
                                                <a href="#" className="btn ss-btn" data-animation="fadeInRight" data-delay=".8s">Send Message</a>
                                            </div>
                                        </div>
                                    </div>

                                </form>
                            </div>
                        </div>

                    </div>

                </section> */}
                {/* contact-area-end */}

                {/* brand-area */}
                {/* <div className="brand-area" style={{ backgroundImage: `url(${require('../../asset/user_assets/img/an-bg/an-bg12.png')})`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat' }}>
                    <div className="container">
                        <div className="row brand-active">
                            <div className="col-xl-2">
                                <div className="single-brand">
                                    <img src={require('../../asset/user_assets/img/brand/c-logo.png')} alt="img" />
                                </div>
                            </div>
                            <div className="col-xl-2">
                                <div className="single-brand active">
                                    <img src={require('../../asset/user_assets/img/brand/c-logo02.png')} alt="img" />
                                </div>
                            </div>
                            <div className="col-xl-2">
                                <div className="single-brand">
                                    <img src={require('../../asset/user_assets/img/brand/c-logo03.png')} alt="img" />
                                </div>
                            </div>
                            <div className="col-xl-2">
                                <div className="single-brand">
                                    <img src={require('../../asset/user_assets/img/brand/c-logo04.png')} alt="img" />
                                </div>
                            </div>
                            <div className="col-xl-2">
                                <div className="single-brand">
                                    <img src={require('../../asset/user_assets/img/brand/c-logo.png')} alt="img" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div> */}
                {/* brand-area-end */}
            </main>
            {/* main-area-end */}

            <LandingPageFooter />
        </div>
    )
}

export default LandingHome