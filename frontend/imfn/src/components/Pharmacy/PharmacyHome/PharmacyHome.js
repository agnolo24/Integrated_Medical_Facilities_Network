import React from 'react';
import PharmacyHeader from '../PharmacyHeader/PharmacyHeader';
import PharmacyFooter from '../PharmacyFooter/PharmacyFooter';

export default function PharmacyHome() {
    return (
        <div>
            <PharmacyHeader />
            <main>
                <section className="breadcrumb-area d-flex align-items-center" style={{ backgroundImage: `url(${require('../../../asset/user_assets/img/testimonial/test-bg.jpg')})` }}>
                    <div className="container">
                        <div className="row align-items-center">
                            <div className="col-xl-12 col-lg-12">
                                <div className="breadcrumb-wrap text-left">
                                    <div className="breadcrumb-title">
                                        <h2>Pharmacy Dashboard</h2>
                                        <div className="breadcrumb-menu">
                                            <nav aria-label="breadcrumb">
                                                <ol className="breadcrumb">
                                                    <li className="breadcrumb-item"><a href="/pharmacyhome">Home</a></li>
                                                    <li className="breadcrumb-item active" aria-current="page">Dashboard</li>
                                                </ol>
                                            </nav>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="about-area pt-120 pb-90">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="section-title text-center mb-50">
                                    <h5>Welcome to Pharmacy Portal</h5>
                                    <h2>Manage your pharmacy efficiently</h2>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <PharmacyFooter />
        </div>
    );
}
