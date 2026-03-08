import React, { useEffect } from 'react';
import PharmacyHeader from '../PharmacyHeader/PharmacyHeader';
import PharmacyFooter from '../PharmacyFooter/PharmacyFooter';
import './PharmacyHome.css';
import {
    Pill,
    CalendarCheck,
    Package,
    LayoutDashboard,
    ArrowRight,
    TrendingUp,
    AlertCircle,
    History
} from 'lucide-react';

const PharmacyHome = () => {
    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const features = [
        {
            id: 1,
            name: "Manage Medicine",
            description: "Update inventory, add new medicines, and track expiration dates for your stock.",
            link: "/manageMedicine",
            icon: <Pill className="ph-action-icon" />,
            color: "#0d9488"
        },
        {
            id: 2,
            name: "Today's Prescriptions",
            description: "Access today's completed doctor consultations with active prescriptions ready for dispensing.",
            link: "/viewCompletedAppointments",
            icon: <CalendarCheck className="ph-action-icon" />,
            color: "#0ea5e9"
        },
        {
            id: 3,
            name: "Medicine Records",
            description: "View history of all medicines dispensed to patients through doctor prescriptions.",
            link: "/pharmacyHistory",
            icon: <History className="ph-action-icon" />,
            color: "#6366f1"
        },
    ];


    return (
        <div className="ph-container">
            <PharmacyHeader />

            <main>
                {/* Hero Section */}
                <section
                    className="ph-hero"
                    style={{ backgroundImage: `url(${require('../../../asset/user_assets/img/bg/ph-hero.png')})` }}
                >
                    <div className="container">
                        <div className="row align-items-center">
                            <div className="col-lg-8">
                                <div className="ph-hero-content">
                                    <div className="d-flex align-items-center gap-2 mb-3">
                                        <LayoutDashboard size={20} className="text-white opacity-75" />
                                        <span className="text-uppercase tracking-wider fw-bold small opacity-75">Pharmacy Management System</span>
                                    </div>
                                    <h1>Pharmacy Central <br />Dashboard</h1>
                                    <p>Comprehensive tools for medical inventory management, prescription tracking, and facility operations in one unified workspace.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>


                {/* Features Section */}
                <section className="ph-main-section">
                    <div className="container">
                        <div className="ph-section-header">
                            <h5>Core Operations</h5>
                            <h2>Manage your facility with precision</h2>
                            <div className="divider"></div>
                        </div>

                        <div className="row justify-content-center g-4">
                            {features.map((item) => (
                                <div key={item.id} className="col-xl-5 col-lg-6">
                                    <a href={item.link} className="ph-action-card ph-glass">
                                        <div className="ph-action-icon-wrapper" style={{ color: item.color }}>
                                            {item.icon}
                                        </div>
                                        <h3>{item.name}</h3>
                                        <p>{item.description}</p>
                                        <div className="ph-card-footer">
                                            Manage Now <ArrowRight size={18} />
                                        </div>
                                    </a>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Quick Help / Info Section */}
                <section className="pb-100">
                    <div className="container">
                        <div className="p-5 ph-glass rounded-4 border-0 shadow-sm d-flex align-items-center justify-content-between flex-wrap gap-4">
                            <div>
                                <h4 className="fw-bold mb-1">Need technical assistance?</h4>
                                <p className="text-muted mb-0">Our support team is available 24/7 for emergency inventory system issues.</p>
                            </div>
                            <button className="btn px-4 py-2 rounded-pill fw-bold" style={{ backgroundColor: '#0d9488', color: 'white' }}>
                                Contact Support
                            </button>
                        </div>
                    </div>
                </section>
            </main>

            <PharmacyFooter />
        </div>
    );
};

export default PharmacyHome;
