import React from 'react';
import PharmacyHeader from '../PharmacyHeader/PharmacyHeader';
import PharmacyFooter from '../PharmacyFooter/PharmacyFooter';
import CardView from '../../Hospital/HospitalComponents/CardView';

export default function PharmacyHome() {
    const card = [
        { id: 1, name: "Manage Medicine", link: "/manageMedicine" },
        { id: 2, name: "Completed Appointments", link: "/viewCompletedAppointments" },
    ];

    return (
        <div style={{ backgroundColor: "#f4f7f6", minHeight: "100vh" }}>
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
                        <div className="row">
                            {card.map((data) => (
                                <div key={data.id} className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
                                    <CardView
                                        name={data.name}
                                        link={data.link} />
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>
            <PharmacyFooter />
        </div>
    );
}
