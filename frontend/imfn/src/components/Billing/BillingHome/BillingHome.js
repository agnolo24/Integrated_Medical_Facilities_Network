import React, { useEffect } from 'react';
import BillingHeader from '../BillingHeader/BillingHeader';
import BillingFooter from '../BillingFooter/BillingFooter';
import './BillingHome.css';
import {
    FileText,
    History,
    LayoutDashboard,
    ArrowRight,
    CreditCard,
    ShieldCheck
} from 'lucide-react';
import { Link } from 'react-router';

export default function BillingHome() {
    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const actions = [
        {
            id: 1,
            name: "Manage Invoices",
            description: "Create, view, and track hospital invoices. Manage extra charges and billing statements for patients.",
            link: "/manageInvoices",
            icon: <FileText size={32} />,
            color: "#4f46e5",
            bgColor: "#eef2ff"
        },
        {
            id: 2,
            name: "Payment History",
            description: "Review all past transactions and payment records. Track received payments and outstanding balances.",
            link: "/paymentHistory",
            icon: <History size={32} />,
            color: "#0891b2",
            bgColor: "#ecfeff"
        },
    ];

    return (
        <div className="bh-root">
            <BillingHeader />

            <main className="bh-main">
                {/* Hero Section */}
                <section
                    className="bh-hero"
                    style={{ backgroundImage: `url(${require('../../../asset/user_assets/img/testimonial/test-bg.jpg')})` }}
                >
                    <div className="container">
                        <div className="row align-items-center">
                            <div className="col-lg-8">
                                <div className="bh-hero-content">
                                    <div className="bh-badge">
                                        <LayoutDashboard size={16} />
                                        <span>Financial Management System</span>
                                    </div>
                                    <h1>Billing Central <br />Dashboard</h1>
                                    <p>Streamlined financial operations for healthcare facilities. Manage invoices, track payments, and maintain accurate financial records with ease.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Operations Section */}
                <section className="container">
                    <div className="bh-section-header">
                        <h5>Account Management</h5>
                        <h2>Hospital Billing Controls</h2>
                        <div className="bh-divider"></div>
                    </div>

                    <div className="bh-card-grid">
                        {actions.map((action) => (
                            <Link to={action.link} key={action.id} className="bh-card">
                                <div
                                    className="bh-card-icon-wrapper"
                                    style={{ backgroundColor: action.bgColor, color: action.color }}
                                >
                                    {action.icon}
                                </div>
                                <h3>{action.name}</h3>
                                <p>{action.description}</p>
                                <div className="bh-card-action">
                                    Open Portal <ArrowRight size={18} />
                                </div>
                            </Link>
                        ))}
                    </div>

                    {/* Security/Help Section */}
                    <div className="bh-help-card">
                        <div className="d-flex align-items-center gap-4">
                            <div className="p-3 rounded-circle" style={{ backgroundColor: '#f0fdf4', color: '#16a34a' }}>
                                <ShieldCheck size={40} />
                            </div>
                            <div className="bh-help-content">
                                <h4>Security & Support</h4>
                                <p>Transactions are encrypted and secure. For billing discrepancies, contact financial support.</p>
                            </div>
                        </div>
                        <button className="bh-help-btn">Contact Support</button>
                    </div>
                </section>
            </main>

            <BillingFooter />
        </div>
    );
}
