import React, { useEffect } from 'react';

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

function LandingHome() {
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
                                                    <a href="index.html">Home</a>
                                                    <ul>
                                                        <li><a href="index.html">Home Page 01</a></li>
                                                        <li><a href="index-2.html">Home Page 02</a></li>
                                                        <li><a href="index-3.html">Home Page 03</a></li>
                                                    </ul>
                                                </li>
                                                <li><a href="about.html">About Us</a></li>
                                                <li className="has-sub">
                                                    <a href="services.html">Services</a>
                                                    <ul>
                                                        <li><a href="services.html">Services</a></li>
                                                        <li><a href="services-detail.html">Services Details</a></li>
                                                    </ul>
                                                </li>
                                                <li className="has-sub"><a href="#">Other Page</a>
                                                    <ul>
                                                        <li><a href="pricing.html">Pricing</a></li>
                                                        <li><a href="team.html">Team</a></li>
                                                        <li><a href="shop.html">Shop</a></li>
                                                        <li><a href="shop-details.html">Shop Details</a></li>
                                                    </ul>
                                                </li>
                                                <li className="has-sub">
                                                    <a href="departments.html">Departments</a>
                                                    <ul>
                                                        <li><a href="departments.html">Departments</a></li>
                                                        <li><a href="departments-detail.html">Departments Details</a></li>
                                                    </ul>
                                                </li>

                                                <li className="has-sub">
                                                    <a href="blog.html">Blog</a>
                                                    <ul>
                                                        <li><a href="blog.html">Blog</a></li>
                                                        <li><a href="blog-details.html">Blog Details</a></li>
                                                    </ul>
                                                </li>
                                            </ul>
                                        </nav>
                                    </div>
                                </div>
                                <div className="col-xl-2 col-lg-2 d-none d-lg-block">
                                    <a href="contact.html" className="top-btn">Get A Quote <i className="fas fa-chevron-right"></i></a>

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
                                            <h2 data-animation="fadeInUp" data-delay=".4s">Get Better Care For Your <span>Health</span></h2>
                                            <p data-animation="fadeInUp" data-delay=".6s">Quisque leo augue, lobortis ac tellus nec, posuere ultricies nulla. Praesent massa odio, pellentesque in consectetur quis, volutpat sit amet erat.</p>
                                            <div className="slider-btn mt-25">
                                                <a href="#" className="btn ss-btn" data-animation="fadeInRight" data-delay=".8s">Learn More <i className="fas fa-chevron-right"></i></a>
                                            </div>
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
                <section id="booking" className="booking-area p-relative">
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
                                                <select className="custom-select" id="inputGroupSelect04" aria-label="Example select with button addon" defaultValue="Select Doctor...">
                                                    <option>Select Doctor...</option>
                                                    <option value="1">One</option>
                                                    <option value="2">Two</option>
                                                    <option value="3">Three</option>
                                                </select>
                                            </div>
                                        </li>
                                        <li>
                                            <div className="contact-field p-relative c-subject mb-20">
                                                <select className="custom-select" id="inputGroupSelect05" aria-label="Example select with button addon" defaultValue="Select Department...">
                                                    <option>Select Department...</option>
                                                    <option value="1">One</option>
                                                    <option value="2">Two</option>
                                                    <option value="3">Three</option>
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
                </section>
                {/* booking-area-end */}

                {/* services-area */}
                <section id="services" className="services-area services-bg services-two pt-100" style={{ backgroundImage: `url(${require('../../asset/user_assets/img/an-bg/an-bg02.png')})`, backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'center center' }}>
                    <div className="container">
                        <div className="row justify-content-center">
                            <div className="col-xl-8 col-lg-8">
                                <div className="section-title text-center pl-40 pr-40 mb-80" >
                                    <span> our services</span>
                                    <h2>Our Special Services For You</h2>
                                    <p className="mt-10">Fusce pharetra odio in urna laoreet laoreet. Aliquam erat volutpat. Phasellus nec ligula arcu. Aliquam eu urna pulvinar, iaculis ipsum in, porta massa.</p>
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
                                        <h5><a href="services-detail.html">Online Emergency</a></h5>
                                        <p>Mauris nunc felis, congue eu convallis in, bibendum vitae nisl. Duis vestibulum eget orci maximus pretium.</p>
                                    </div>

                                </div>
                            </div>
                            <div className="col-lg-4 col-md-12">
                                <div className="s-single-services text-center" >
                                    <div className="services-icon">
                                        <img src={require('../../asset/user_assets/img/icon/sr-icon02.png')} alt="img" />
                                    </div>
                                    <div className="second-services-content">
                                        <h5><a href="services-detail.html">Medication Service</a></h5>
                                        <p>Mauris nunc felis, congue eu convallis in, bibendum vitae nisl. Duis vestibulum eget orci maximus pretium.</p>
                                    </div>

                                </div>
                            </div>
                            <div className="col-lg-4 col-md-12">
                                <div className="s-single-services text-center" >
                                    <div className="services-icon">
                                        <img src={require('../../asset/user_assets/img/icon/sr-icon03.png')} alt="img" />
                                    </div>
                                    <div className="second-services-content">
                                        <h5><a href="services-detail.html">24hr Health Program</a></h5>
                                        <p>Mauris nunc felis, congue eu convallis in, bibendum vitae nisl. Duis vestibulum eget orci maximus pretium.</p>
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
                                        <h2>We Are Specialize in Medical Diagnositics</h2>
                                    </div>
                                    <p>Nulla lacinia sapien a diam ullamcorper, sed congue leo vulputate. Phasellus et ante ultrices, sagittis purus vitae, sagittis quam. Quisque urna lectus, auctor quis tristique tincidunt, semper vel lectus. Mauris eget eleifend massa. Praesent ex felis, laoreet nec tellus in, laoreet commodo ipsum.</p>

                                    <ul>
                                        <li>
                                            <div className="icon"><i className="fas fa-chevron-right"></i></div>
                                            <div className="text">Pellentesque placerat, nisi congue vehicula efficitur.
                                            </div>
                                        </li>
                                        <li>
                                            <div className="icon"><i className="fas fa-chevron-right"></i></div>
                                            <div className="text">Pellentesque placerat, nisi congue vehicula efficitur.
                                            </div>
                                        </li>
                                        <li>
                                            <div className="icon"><i className="fas fa-chevron-right"></i></div>
                                            <div className="text">Phasellus mattis vitae magna in suscipit. Nam tristique posuere sem, mattis molestie est bibendum.
                                            </div>
                                        </li>
                                        <div></div>
                                    </ul>

                                    <div className="slider-btn mt-30">
                                        <a href="#" className="btn ss-btn" data-animation="fadeInRight" data-delay=".8s">Read More <i className="fas fa-chevron-right"></i></a>
                                    </div>
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
                                        <span className="count">500</span><small>+</small>
                                    </div>
                                    <p>Doctors At Work</p>
                                </div>
                            </div>
                            <div className="col-lg-3 col-md-6 col-sm-12">
                                <div className="single-counter text-center" >
                                    <img src={require('../../asset/user_assets/img/icon/cunt-icon02.png')} alt="img" />
                                    <div className="counter p-relative">
                                        <span className="count">58796</span><small>+</small>
                                    </div>
                                    <p>Happy Patients</p>
                                </div>
                            </div>
                            <div className="col-lg-3 col-md-6 col-sm-12">
                                <div className="single-counter text-center" >
                                    <img src={require('../../asset/user_assets/img/icon/cunt-icon03.png')} alt="img" />
                                    <div className="counter p-relative">
                                        <span className="count">500</span><small>+</small>
                                    </div>
                                    <p>Medical Beds</p>
                                </div>
                            </div>
                            <div className="col-lg-3 col-md-6 col-sm-12">
                                <div className="single-counter text-center" >
                                    <img src={require('../../asset/user_assets/img/icon/cunt-icon04.png')} alt="img" />
                                    <div className="counter p-relative">
                                        <span className="count">200</span><small>+</small>
                                    </div>
                                    <p>Winning Awards</p>
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
                                        <a href="departments-detail.html" className="text">
                                            <h3>Pedlatric</h3>
                                            Fusce eget condimentum lectus, sed commodo dui. Suspendisse non vehicula ant aecenas placerat finibus metus, at finibus neque.
                                        </a>
                                    </li>
                                    <li>
                                        <div className="icon">
                                            <div><img src={require('../../asset/user_assets/img/icon/de-icon02.png')} alt="de-icon" /></div></div>
                                        <a href="departments-detail.html" className="text">
                                            <h3>Dental</h3>
                                            Fusce eget condimentum lectus, sed commodo dui. Suspendisse non vehicula ant aecenas placerat finibus metus, at finibus neque.
                                        </a>
                                    </li>
                                    <li>
                                        <div className="icon">
                                            <div><img src={require('../../asset/user_assets/img/icon/de-icon03.png')} alt="de-icon" /></div></div>
                                        <a href="departments-detail.html" className="text">
                                            <h3>Physicians</h3>
                                            Fusce eget condimentum lectus, sed commodo dui. Suspendisse non vehicula ant aecenas placerat finibus metus, at finibus neque.
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
                <section id="team" className="pb-20" style={{ backgroundImage: `url(${require('../../asset/user_assets/img/an-bg/an-bg13.png')})`, backgroundSize: 'contain', backgroundPosition: 'center center', backgroundRepeat: 'no-repeat' }}>

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
                                        <h4><a href="team-details.html">Samanta Crane</a></h4>
                                        <span>Internist, General Practitoner</span>
                                        <p>Working Since 2004</p>
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
                                        <h4><a href="team-details.html">Ostin Green</a></h4>
                                        <span>Internist, General Practitoner</span>
                                        <p>Working Since 2004</p>
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
                                        <h4><a href="team-details.html">Norman Colins</a></h4>
                                        <span>SALES MANAGER</span>
                                        <p>Working Since 2004</p>
                                    </div>
                                </div>
                            </div>

                            {/* Duplicate items for demo purposes */}
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
                                        <h4><a href="team-details.html">Samanta Crane</a></h4>
                                        <span>Internist, General Practitoner</span>
                                        <p>Working Since 2004</p>
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
                                        <h4><a href="team-details.html">Ostin Green</a></h4>
                                        <span>Internist, General Practitoner</span>
                                        <p>Working Since 2004</p>
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
                                        <h4><a href="team-details.html">Norman Colins</a></h4>
                                        <span>SALES MANAGER</span>
                                        <p>Working Since 2004</p>
                                    </div>
                                </div>
                            </div>


                        </div>
                    </div>
                </section>
                {/* team-area-end */}

                {/* newslater-area */}
                <section className="newslater-area pb-50" style={{ backgroundImage: `url(${require('../../asset/user_assets/img/an-bg/an-bg06.png')})`, backgroundPosition: 'center bottom', backgroundRepeat: 'no-repeat' }} >
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
                                    {/* /Form-email */}
                                </form>
                            </div>
                            <div className="col-xl-4 col-lg-4">
                                <img src={require('../../asset/user_assets/img/bg/news-illustration.png')} alt="img" />
                            </div>
                        </div>

                    </div>
                </section>
                {/* newslater-aread-end */}

                {/* testimonial-area */}
                <section id="testimonios" className="testimonial-area testimonial-p pt-50 pb-85 fix" style={{ backgroundImage: `url(${require('../../asset/user_assets/img/an-bg/an-bg07.png')})`, backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundSize: 'contain' }} >
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
                                                    <h6>Adam McWilliams</h6>
                                                    <span>CEO & Founder</span>

                                                </div>
                                            </div>
                                            <p>Nullam metus mi, sollicitudin eu elit non, laoreet consectetur urna. Nullam quis aliquet elit. Cras augue tortor, lacinia et fermentum eget, suscipit id ligula. Donec id mollis sem, nec tincidunt neque. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.</p>
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
                                                    <h6>Rose Dose</h6>
                                                    <span>Sale Executive</span>

                                                </div>
                                            </div>
                                            <p>Nullam metus mi, sollicitudin eu elit non, laoreet consectetur urna. Nullam quis aliquet elit. Cras augue tortor, lacinia et fermentum eget, suscipit id ligula. Donec id mollis sem, nec tincidunt neque. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.</p>
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
                                                    <h6>Margie R. Robinson</h6>
                                                    <span>Web Developer</span>

                                                </div>
                                            </div>
                                            <p>Nullam metus mi, sollicitudin eu elit non, laoreet consectetur urna. Nullam quis aliquet elit. Cras augue tortor, lacinia et fermentum eget, suscipit id ligula. Donec id mollis sem, nec tincidunt neque. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.</p>
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
                                                    <h6>Jone Dose</h6>
                                                    <span>MD & Founder</span>

                                                </div>
                                            </div>
                                            <p>Nullam metus mi, sollicitudin eu elit non, laoreet consectetur urna. Nullam quis aliquet elit. Cras augue tortor, lacinia et fermentum eget, suscipit id ligula. Donec id mollis sem, nec tincidunt neque. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.</p>
                                        </div>

                                    </div>


                                </div>
                            </div>

                        </div>
                    </div>
                </section>
                {/* testimonial-area-end */}

                {/* pricing-area */}
                <section id="pricing" className="pricing-area pb-70" style={{ backgroundImage: `url(${require('../../asset/user_assets/img/an-bg/an-bg08.png')})`, backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }} >
                    <div className="container">

                        <div className="row justify-content-center">
                            <div className="col-lg-8">
                                <div className="section-title center-align mb-60 text-center">
                                    <span>OUR PRICING</span>
                                    <h2>Afforable Pricing Packages</h2>
                                    <p>Fusce pharetra odio in urna laoreet laoreet. Aliquam erat volutpat. Phasellus nec ligula arcu. Aliquam eu urna pulvinar, iaculis ipsum in, porta massa.</p>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-lg-4 col-md-12">
                                <div className="pricing-box text-center mb-60" >
                                    <div className="pricing-head">
                                        <h4>Sliver Plan</h4>
                                        <div className="price-count mb-30">
                                            <h2>$25.99</h2>
                                        </div>
                                        <img src={require('../../asset/user_assets/img/icon/pr-icon01.png')} alt="pricon" />
                                    </div>
                                    <div className="pricing-body mb-40 text-left">
                                        <p>It is a long established fact that a reader will be distracted.</p>
                                        <ul>
                                            <li>Update</li>
                                            <li>File compressed</li>
                                            <li>Commercial use</li>
                                            <li>Support</li>
                                        </ul>
                                    </div>
                                    <div className="pricing-btn">
                                        <a href="#" className="btn">Choose Plan <i className="fas fa-chevron-right"></i></a>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-4 col-md-12">
                                <div className="pricing-box active text-center mb-60" >
                                    <div className="pricing-head">
                                        <h4>Gold Plan</h4>
                                        <div className="price-count mb-30">
                                            <h2>$25.99</h2>
                                        </div>
                                        <img src={require('../../asset/user_assets/img/icon/pr-icon02.png')} alt="pricon" />
                                    </div>
                                    <div className="pricing-body mb-40 text-left">
                                        <p>It is a long established fact that a reader will be distracted.</p>
                                        <ul>
                                            <li>Update</li>
                                            <li>File compressed</li>
                                            <li>Commercial use</li>
                                            <li>Support</li>
                                        </ul>
                                    </div>
                                    <div className="pricing-btn">
                                        <a href="#" className="btn">Choose Plan <i className="fas fa-chevron-right"></i></a>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-4 col-md-12">
                                <div className="pricing-box text-center mb-60" >
                                    <div className="pricing-head">
                                        <h4>Platinum Plan</h4>
                                        <div className="price-count mb-30">
                                            <h2>$25.99</h2>
                                        </div>
                                        <img src={require('../../asset/user_assets/img/icon/pr-icon03.png')} alt="pricon" />
                                    </div>
                                    <div className="pricing-body mb-40 text-left">
                                        <p>It is a long established fact that a reader will be distracted.</p>
                                        <ul>
                                            <li>Update</li>
                                            <li>File compressed</li>
                                            <li>Commercial use</li>
                                            <li>Support</li>
                                        </ul>
                                    </div>
                                    <div className="pricing-btn">
                                        <a href="#" className="btn">Choose Plan <i className="fas fa-chevron-right"></i></a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                {/* pricing-area-end */}

                {/* call-area */}
                <div className="call-area pb-50" style={{ backgroundImage: `url(${require('../../asset/user_assets/img/an-bg/an-bg09.png')})`, backgroundRepeat: 'no-repeat', backgroundPosition: 'bottom' }}>
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
                </div>
                {/* call-area-end */}

                {/* blog-area */}
                <section id="blog" className="blog-area p-relative pt-100 pb-90 fix" style={{ backgroundImage: `url(${require('../../asset/user_assets/img/an-bg/an-bg10.png')})`, backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'center center' }}>
                    <div className="container">
                        <div className="row justify-content-center">
                            <div className="col-xl-8 col-lg-10">
                                <div className="section-title text-center mb-80" >
                                    <span> OUR LATEST BOLG </span>
                                    <h2>Stay Updated To Our Blog & News</h2>
                                    <p >Fusce pharetra odio in urna laoreet laoreet. Aliquam erat volutpat. Phasellus nec ligula arcu. Aliquam eu urna pulvinar, iaculis ipsum in, porta massa.</p>
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
                                                    <i className="far fa-calendar-alt"></i>  7 March, 2019
                                                </div>
                                                <div className="col-lg-6 col-md-6">
                                                    <i className="fas fa-user"></i> By Jhone Doe
                                                </div>
                                            </div>
                                        </div>
                                        <h4><a href="blog-details.html">Praesent justo mauris, tincidunt vitae nisi ultricies.</a></h4>
                                        <p>Aenean sed velit nulla. Etiam viverra scelerisque porta. Quisque ut dolor aliquam, gravida lacus.</p>
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
                                                    <i className="far fa-calendar-alt"></i>  7 March, 2019
                                                </div>
                                                <div className="col-lg-6 col-md-6">
                                                    <i className="fas fa-user"></i> By Jhone Doe
                                                </div>
                                            </div>
                                        </div>
                                        <h4><a href="blog-details.html">Monthly eraesent justo mauris, vitae nisi ultricies.</a></h4>                       <p>Aenean sed velit nulla. Etiam viverra scelerisque porta. Quisque ut dolor aliquam, gravida lacus.</p>
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
                                                    <i className="far fa-calendar-alt"></i>  7 March, 2019
                                                </div>
                                                <div className="col-lg-6 col-md-6">
                                                    <i className="fas fa-user"></i> By Jhone Doe
                                                </div>
                                            </div>
                                        </div>
                                        <h4><a href="blog-details.html">User Experience Psychology And Performance Smashing</a></h4>                          <p>Aenean sed velit nulla. Etiam viverra scelerisque porta. Quisque ut dolor aliquam, gravida lacus.</p>
                                        <div className="blog-btn"><a href="#">Read More<i className="fas fa-chevron-right"></i></a></div>
                                    </div>

                                </div>
                            </div>

                        </div>
                    </div>
                </section>
                {/* blog-area-end */}

                {/* contact-area */}
                <section id="contact" className="contact-area contact-bg pb-70 p-relative fix" style={{ backgroundImage: `url(${require('../../asset/user_assets/img/an-bg/an-bg11.png')})`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat' }}>
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
                                                <input type="text" placeholder="Write here youremail" />
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

                </section>
                {/* contact-area-end */}

                {/* brand-area */}
                <div className="brand-area" style={{ backgroundImage: `url(${require('../../asset/user_assets/img/an-bg/an-bg12.png')})`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat' }}>
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
                </div>
                {/* brand-area-end */}
            </main>
            {/* main-area-end */}

            {/* footer */}
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
                                        <p>Sed ut perspiciatis unde om is nerror sit voluptatem accustium dolorem tium totam rem aperam eaque ipsa quae ab illose
                                            inntore veritatis</p>
                                    </div>
                                    <div className="footer-social">
                                        <a href="#"><i className="fab fa-facebook-f"></i></a>
                                        <a href="#"><i className="fab fa-twitter"></i></a>
                                        <a href="#"><i className="fab fa-instagram"></i></a>
                                        <a href="#"><i className="fab fa-google-plus-g"></i></a>
                                    </div>
                                </div>
                            </div>


                            <div className="col-xl-2 col-lg-2 col-sm-6">
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
                            </div>
                            <div className="col-xl-2 col-lg-2 col-sm-6">
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
                            </div>
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
                                                    <span>1800-121-3637<br />+91 555 234-8765</span>
                                                </li>
                                                <li>
                                                    <i className="icon dripicons-mail"></i>
                                                    <span><a href="mailto:info@example.com">info@example.com</a><br /><a href="mailto:sale@example.com">sale@example.com</a></span>
                                                </li>
                                                <li>
                                                    <i className="fal fa-map-marker-alt"></i>
                                                    <span>380 St Kilda Road, Melbourne<br />VIC 3004, Australia</span>
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
                                    <p>&copy; 2020 Mecare  All design Zcube.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}

export default LandingHome