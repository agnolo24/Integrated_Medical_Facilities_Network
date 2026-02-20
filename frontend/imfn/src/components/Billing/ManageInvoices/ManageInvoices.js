import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BillingHeader from '../BillingHeader/BillingHeader';
import BillingFooter from '../BillingFooter/BillingFooter';
import InvoiceDetailsModal from './InvoiceDetailsModal';
import './ManageInvoices.css';

const ManageInvoices = () => {
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('unpaid');
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const loginId = localStorage.getItem("loginId");

    const fetchInvoices = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`http://127.0.0.1:8000/billing/get_all_invoices/`, {
                params: { login_id: loginId }
            });
            setInvoices(response.data.invoices || []);
        } catch (error) {
            console.error("Error fetching invoices:", error);
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

    const handleUpdateStatus = async (invoiceId, newStatus) => {
        if (!window.confirm("Confirm payment status update?")) return;
        try {
            await axios.post(`http://127.0.0.1:8000/billing/update_invoice_status/`, {
                invoice_id: invoiceId,
                status: newStatus
            });
            alert("Invoice updated successfully!");
            fetchInvoices();
        } catch (error) {
            alert("Update failed");
        }
    };

    const filteredInvoices = invoices.filter(inv => {
        const ptName = inv.patient_name || "";
        const drName = inv.doctor_name || "";
        const matchesSearch = ptName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            drName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || inv.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const statsCounts = {
        total: invoices.length,
        unpaid: invoices.filter(i => i.status === 'unpaid').length,
        paid: invoices.filter(i => i.status === 'paid').length
    };

    return (
        <div className="mi-outer-wrapper">
            <BillingHeader />

            <main className="mi-dashboard-wrapper">
                <div className="mi-inner-container">
                    <div className="mi-title-section">
                        <h2>Billing & Invoices</h2>
                        <p>Detailed tracking of patient accounts and medical billing records.</p>
                    </div>

                    <div className="mi-stats-grid">
                        <div className="mi-stat-card">
                            <div className="mi-stat-icon total"><i className="fas fa-file-invoice"></i></div>
                            <div className="mi-stat-info">
                                <h3>{statsCounts.total}</h3>
                                <p>Total Records</p>
                            </div>
                        </div>
                        <div className="mi-stat-card">
                            <div className="mi-stat-icon pending"><i className="fas fa-clock"></i></div>
                            <div className="mi-stat-info">
                                <h3>{statsCounts.unpaid}</h3>
                                <p>Pending Bills</p>
                            </div>
                        </div>
                        <div className="mi-stat-card">
                            <div className="mi-stat-icon paid"><i className="fas fa-check-circle"></i></div>
                            <div className="mi-stat-info">
                                <h3>{statsCounts.paid}</h3>
                                <p>Total Settled</p>
                            </div>
                        </div>
                    </div>

                    <div className="mi-card-box">
                        <div className="mi-filter-row">
                            <div className="mi-search-input-group">
                                <i className="fas fa-search"></i>
                                <input
                                    className="mi-main-input"
                                    type="text"
                                    placeholder="Filter by patient or doctor..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <div className="mi-status-toggle">
                                {['all', 'unpaid', 'paid'].map(f => (
                                    <button
                                        key={f}
                                        className={`mi-toggle-btn ${statusFilter === f ? 'active' : ''}`}
                                        onClick={() => setStatusFilter(f)}
                                    >
                                        {f.charAt(0).toUpperCase() + f.slice(1)}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {loading ? (
                            <div style={{ textAlign: 'center', padding: '50px 0' }}>
                                <div className="spinner-border text-primary" role="status"></div>
                            </div>
                        ) : (
                            <div className="mi-table-scroller">
                                <table className="mi-master-invoice-table">
                                    <thead>
                                        <tr>
                                            <th className="col-pt">Patient</th>
                                            <th className="col-dr">Physician</th>
                                            <th className="col-dt">Accrued Date</th>
                                            <th className="col-am">Amount</th>
                                            <th className="col-st">Status</th>
                                            <th className="col-ac">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredInvoices.map(invoice => (
                                            <tr key={invoice.invoice_id || invoice.id} className="mi-table-row-data">
                                                <td>{invoice.patient_name}</td>
                                                <td>{invoice.doctor_name}</td>
                                                <td>{invoice.date}</td>
                                                <td style={{ fontWeight: '900', color: '#1a237e' }}>₹{invoice.total_amount}</td>
                                                <td>
                                                    <span className={`mi-status-pill ${invoice.status}`}>
                                                        {invoice.status}
                                                    </span>
                                                </td>
                                                <td style={{ textAlign: 'center' }}>
                                                    <button className="mi-action-icon view" title="View Details" onClick={() => handleViewDetails(invoice.invoice_id)}>
                                                        <i className="fas fa-eye"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                        {filteredInvoices.length === 0 && (
                                            <tr className="mi-table-row-data">
                                                <td colSpan="6" style={{ textAlign: 'center', padding: '60px', color: '#94a3b8' }}>
                                                    No invoice records found for this filter.
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

export default ManageInvoices;
