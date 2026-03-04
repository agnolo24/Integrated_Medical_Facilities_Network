import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BillingHeader from '../BillingHeader/BillingHeader';
import BillingFooter from '../BillingFooter/BillingFooter';
import InvoiceDetailsModal from '../ManageInvoices/InvoiceDetailsModal';
import './PaymentHistory.css';
import '../ManageInvoices/ManageInvoices.css';

const PaymentHistory = () => {
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const loginId = localStorage.getItem("loginId");

    const fetchInvoices = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`http://127.0.0.1:8000/billing/get_all_invoices/`, {
                params: { login_id: loginId }
            });
            // Filter only paid invoices for payment history
            const allInvoices = response.data.invoices || [];
            setInvoices(allInvoices.filter(inv => inv.status === 'paid'));
        } catch (error) {
            console.error("Error fetching payment history:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (loginId) fetchInvoices();
    }, [loginId]);

    const handleViewDetails = async (invoiceId) => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/billing/get_invoice_details/`, {
                params: { invoice_id: invoiceId }
            });
            setSelectedInvoice(response.data);
            setIsModalOpen(true);
        } catch (error) {
            console.error("Error details:", error);
            alert("Failed to fetch details");
        }
    };

    const filteredInvoices = invoices.filter(inv => {
        const ptName = inv.patient_name || "";
        const drName = inv.doctor_name || "";
        return ptName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            drName.toLowerCase().includes(searchTerm.toLowerCase());
    });

    return (
        <div className="ph-outer-wrapper">
            <BillingHeader />

            <main className="ph-dashboard-wrapper">
                <div className="ph-inner-container">
                    <div className="ph-title-section">
                        <h2>Payment History</h2>
                        <p>View all previously settled patient accounts and transaction logs.</p>
                    </div>

                    <div className="ph-card-box">
                        <div className="ph-filter-row">
                            <div className="ph-search-input-group">
                                <i className="fas fa-search"></i>
                                <input
                                    className="ph-main-input"
                                    type="text"
                                    placeholder="Search by patient or doctor..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>

                        {loading ? (
                            <div style={{ textAlign: 'center', padding: '50px 0' }}>
                                <div className="spinner-border text-success" role="status"></div>
                                <p className="mt-2 text-muted">Retrieving history...</p>
                            </div>
                        ) : (
                            <div className="ph-table-scroller">
                                <table className="ph-master-history-table">
                                    <thead>
                                        <tr>
                                            <th className="col-pt">Patient</th>
                                            <th className="col-dr">Physician</th>
                                            <th className="col-dt">Settled Date</th>
                                            <th className="col-am">Total Paid</th>
                                            <th className="col-st">Status</th>
                                            <th className="col-ac">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredInvoices.map(invoice => (
                                            <tr key={invoice.invoice_id || invoice.id} className="ph-table-row-data">
                                                <td>
                                                    <div style={{ fontWeight: '600' }}>{invoice.patient_name}</div>
                                                    <small className="text-muted">ID: {invoice.invoice_id.slice(-8).toUpperCase()}</small>
                                                </td>
                                                <td>{invoice.doctor_name}</td>
                                                <td>{invoice.date}</td>
                                                <td style={{ fontWeight: '800', color: '#166534' }}>₹{invoice.total_amount}</td>
                                                <td>
                                                    <span className="ph-status-pill paid">
                                                        <i className="fas fa-check-circle mr-1"></i> Paid
                                                    </span>
                                                </td>
                                                <td style={{ textAlign: 'center' }}>
                                                    <button className="ph-action-icon view" title="View Bill" onClick={() => handleViewDetails(invoice.invoice_id)}>
                                                        <i className="fas fa-file-invoice"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                        {filteredInvoices.length === 0 && (
                                            <tr className="ph-table-row-data">
                                                <td colSpan="6" style={{ textAlign: 'center', padding: '100px', color: '#64748b' }}>
                                                    <div className="mb-3">
                                                        <i className="fas fa-receipt fa-3x" style={{ opacity: 0.2 }}></i>
                                                    </div>
                                                    No payment history records found.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <InvoiceDetailsModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                invoice={selectedInvoice}
                onUpdate={fetchInvoices}
            />

            <BillingFooter />
        </div>
    );
};

export default PaymentHistory;
