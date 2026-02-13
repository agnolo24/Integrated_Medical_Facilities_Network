import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BillingHeader from '../BillingHeader/BillingHeader';
import BillingFooter from '../BillingFooter/BillingFooter';
import './ManageInvoices.css';

const ManageInvoices = () => {
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('unpaid');
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [newCharges, setNewCharges] = useState([]);
    const [chargeName, setChargeName] = useState('');
    const [chargePrice, setChargePrice] = useState('');

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
            alert("Failed to fetch invoices");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (loginId) {
            fetchInvoices();
        }
    }, [loginId]);

    const handleViewDetails = async (invoiceId) => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/billing/get_invoice_details/`, {
                params: { invoice_id: invoiceId }
            });
            setSelectedInvoice(response.data);
            setNewCharges([]);
            setIsModalOpen(true);
        } catch (error) {
            console.error("Error fetching invoice details:", error);
            alert("Failed to fetch details");
        }
    };

    const handleAddChargeLine = () => {
        if (!chargeName || !chargePrice) return;
        setNewCharges([...newCharges, { name: chargeName, price: parseInt(chargePrice) }]);
        setChargeName('');
        setChargePrice('');
    };

    const handleRemoveChargeLine = (index) => {
        setNewCharges(newCharges.filter((_, i) => i !== index));
    };

    const handleSaveCharges = async () => {
        if (newCharges.length === 0) return;
        try {
            setUpdating(true);
            await axios.post(`http://127.0.0.1:8000/billing/add_other_charges/`, {
                invoice_id: selectedInvoice.invoice_id,
                charge_details: newCharges
            });
            alert("Additional charges added successfully");
            setIsModalOpen(false);
            fetchInvoices();
        } catch (error) {
            console.error("Error saving charges:", error);
            alert("Failed to save charges");
        } finally {
            setUpdating(false);
        }
    };

    const handleUpdateStatus = async (invoiceId, newStatus) => {
        if (!window.confirm(`Are you sure you want to mark this as ${newStatus}?`)) return;

        try {
            setUpdating(true);
            await axios.post(`http://127.0.0.1:8000/billing/update_invoice_status/`, {
                invoice_id: invoiceId,
                status: newStatus
            });
            alert("Status updated successfully");
            setIsModalOpen(false);
            fetchInvoices();
        } catch (error) {
            console.error("Error updating status:", error);
            alert("Failed to update status");
        } finally {
            setUpdating(false);
        }
    };

    const filteredInvoices = invoices.filter(inv => {
        const matchesSearch = inv.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            inv.doctor_name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || inv.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const stats = {
        total: invoices.length,
        pending: invoices.filter(i => i.status === 'unpaid').length,
        paid: invoices.filter(i => i.status === 'paid').length
    };

    return (
        <div style={{ backgroundColor: "#f4f7f6", minHeight: "100vh" }}>
            <BillingHeader />
            <main>
                <section className="breadcrumb-area d-flex align-items-center" style={{ backgroundImage: `url(${require('../../../asset/user_assets/img/testimonial/test-bg.jpg')})` }}>
                    <div className="container">
                        <div className="row align-items-center">
                            <div className="col-xl-12 col-lg-12">
                                <div className="breadcrumb-wrap text-left">
                                    <div className="breadcrumb-title">
                                        <h2>Manage Invoices</h2>
                                        <div className="breadcrumb-menu">
                                            <nav aria-label="breadcrumb">
                                                <ol className="breadcrumb">
                                                    <li className="breadcrumb-item"><a href="/billinghome">Home</a></li>
                                                    <li className="breadcrumb-item active" aria-current="page">Invoices</li>
                                                </ol>
                                            </nav>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="manage-invoices-container">
                    <div className="container">
                        <div className="dashboard-stats">
                            <div className="stat-card">
                                <div className="stat-icon total"><i className="fas fa-file-invoice"></i></div>
                                <div className="stat-info">
                                    <h3>{stats.total}</h3>
                                    <p>Total Invoices</p>
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon pending"><i className="fas fa-clock"></i></div>
                                <div className="stat-info">
                                    <h3>{stats.pending}</h3>
                                    <p>Pending Payment</p>
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon paid"><i className="fas fa-check-circle"></i></div>
                                <div className="stat-info">
                                    <h3>{stats.paid}</h3>
                                    <p>Paid Invoices</p>
                                </div>
                            </div>
                        </div>

                        <div className="invoice-table-wrapper">
                            <div className="filter-bar">
                                <div className="search-input">
                                    <i className="fas fa-search"></i>
                                    <input
                                        type="text"
                                        placeholder="Search by patient or doctor..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                                <div className="status-filters">
                                    <button
                                        className={`filter-btn ${statusFilter === 'all' ? 'active' : ''}`}
                                        onClick={() => setStatusFilter('all')}
                                    >All</button>
                                    <button
                                        className={`filter-btn ${statusFilter === 'unpaid' ? 'active' : ''}`}
                                        onClick={() => setStatusFilter('unpaid')}
                                    >Unpaid</button>
                                    <button
                                        className={`filter-btn ${statusFilter === 'paid' ? 'active' : ''}`}
                                        onClick={() => setStatusFilter('paid')}
                                    >Paid</button>
                                </div>
                            </div>

                            {loading ? (
                                <div className="text-center py-5">
                                    <div className="spinner-border text-primary" role="status">
                                        <span className="sr-only">Loading...</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="table-responsive">
                                    <table className="custom-table">
                                        <thead>
                                            <tr>
                                                <th>Patient Name</th>
                                                <th>Doctor Name</th>
                                                <th>Date</th>
                                                <th>Total Amount</th>
                                                <th>Status</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredInvoices.map(invoice => (
                                                <tr key={invoice.id} className="table-row">
                                                    <td>{invoice.patient_name}</td>
                                                    <td>{invoice.doctor_name}</td>
                                                    <td>{invoice.date}</td>
                                                    <td>₹{invoice.total_amount}</td>
                                                    <td>
                                                        <span className={`status-badge ${invoice.status}`}>
                                                            {invoice.status}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <button
                                                            className="action-btn view"
                                                            onClick={() => handleViewDetails(invoice.id)}
                                                            title="View Details"
                                                        >
                                                            <i className="fas fa-eye"></i>
                                                        </button>
                                                        {invoice.status === 'unpaid' && (
                                                            <button
                                                                className="action-btn pay"
                                                                onClick={() => handleUpdateStatus(invoice.id, 'paid')}
                                                                title="Mark as Paid"
                                                            >
                                                                <i className="fas fa-check"></i>
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                            {filteredInvoices.length === 0 && (
                                                <tr>
                                                    <td colSpan="6" className="text-center py-4">No invoices found</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            {isModalOpen && selectedInvoice && (
                <div className="modal-overlay">
                    <div className="invoice-modal" style={{ maxWidth: '700px' }}>
                        <button className="close-modal" onClick={() => setIsModalOpen(false)}>&times;</button>
                        <div className="invoice-details-header">
                            <h3>Invoice Details</h3>
                            <p className="text-muted">ID: {selectedInvoice.invoice_id}</p>
                        </div>
                        <div className="invoice-info-grid">
                            <div className="info-item">
                                <label>Patient</label>
                                <span>{selectedInvoice.patient_name}</span>
                            </div>
                            <div className="info-item">
                                <label>Contact</label>
                                <span>{selectedInvoice.patient_contact}</span>
                            </div>
                            <div className="info-item">
                                <label>Doctor</label>
                                <span>{selectedInvoice.doctor_name}</span>
                            </div>
                            <div className="info-item">
                                <label>Date</label>
                                <span>{selectedInvoice.date}</span>
                            </div>
                        </div>
                        <div className="item-list">
                            <label className="text-muted small uppercase mb-2 d-block">Itemized Breakdown</label>
                            {selectedInvoice.items.length > 0 ? (
                                selectedInvoice.items.map((item, idx) => (
                                    <div className="item-row" key={idx}>
                                        <span className="item-name">
                                            {item.name}
                                            <span className={`item-type-badge ${item.type}`}>
                                                {item.type}
                                            </span>
                                        </span>
                                        <span className="item-qty">x{item.quantity}</span>
                                        <span className="item-price">₹{item.price}</span>
                                    </div>
                                ))
                            ) : (
                                <p className="text-muted text-center py-2">No charges recorded yet.</p>
                            )}

                            {selectedInvoice.status === 'unpaid' && (
                                <div className="manual-charges-section">
                                    <label className="text-muted small uppercase mb-2 d-block">Add Additional Charges</label>
                                    <div className="charge-input-group">
                                        <input
                                            type="text"
                                            placeholder="Charge Name (e.g. Lab Test)"
                                            value={chargeName}
                                            onChange={(e) => setChargeName(e.target.value)}
                                        />
                                        <input
                                            type="number"
                                            placeholder="Price"
                                            value={chargePrice}
                                            onChange={(e) => setChargePrice(e.target.value)}
                                        />
                                        <button className="add-item-btn" onClick={handleAddChargeLine}>Add</button>
                                    </div>
                                    <div className="pending-charges">
                                        {newCharges.map((c, i) => (
                                            <div key={i} className="pending-charge-item">
                                                <span>{c.name} - ₹{c.price}</span>
                                                <i className="fas fa-times remove-charge" onClick={() => handleRemoveChargeLine(i)}></i>
                                            </div>
                                        ))}
                                    </div>
                                    {newCharges.length > 0 && (
                                        <button className="primary-btn btn-block mt-2" onClick={handleSaveCharges} disabled={updating}>
                                            {updating ? 'Saving...' : 'Save Additional Charges'}
                                        </button>
                                    )}
                                </div>
                            )}

                            <div className="total-row mt-4">
                                <span>Total Amount</span>
                                <span>₹{selectedInvoice.total_amount}</span>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="secondary-btn" onClick={() => setIsModalOpen(false)}>Close</button>
                            {selectedInvoice.status === 'unpaid' && (
                                <button
                                    className="primary-btn"
                                    onClick={() => handleUpdateStatus(selectedInvoice.invoice_id, 'paid')}
                                    disabled={updating}
                                >
                                    {updating ? 'Updating...' : 'Mark as Paid'}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
            <BillingFooter />
        </div>
    );
};

export default ManageInvoices;
