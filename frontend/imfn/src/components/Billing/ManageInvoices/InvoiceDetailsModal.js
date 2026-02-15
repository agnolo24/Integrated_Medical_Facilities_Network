import React, { useState } from 'react';
import axios from 'axios';

const InvoiceDetailsModal = ({ isOpen, onClose, invoice, onUpdate }) => {
    const [updating, setUpdating] = useState(false);
    const [newCharges, setNewCharges] = useState([]);
    const [chargeName, setChargeName] = useState('');
    const [chargePrice, setChargePrice] = useState('');

    if (!isOpen || !invoice) return null;

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
                invoice_id: invoice.invoice_id,
                charge_details: newCharges
            });
            alert("Additional charges added");
            onUpdate();
            onClose();
        } catch (error) {
            alert("Failed to save charges");
        } finally {
            setUpdating(false);
        }
    };

    const handleUpdateStatus = async (invoiceId, newStatus) => {
        if (!window.confirm("Confirm payment status update?")) return;
        try {
            setUpdating(true);
            await axios.post(`http://127.0.0.1:8000/billing/update_invoice_status/`, {
                invoice_id: invoiceId,
                status: newStatus
            });
            alert("Invoice updated successfully!");
            onUpdate();
            onClose();
        } catch (error) {
            alert("Update failed");
        } finally {
            setUpdating(false);
        }
    };

    return (
        <div className="mi-modal-backdrop">
            <div className="mi-modal-content bill-view">
                <div className="mi-modal-top">
                    <h3>Invoice Statement</h3>
                    <button className="mi-action-icon" onClick={onClose}>
                        <i className="fas fa-times"></i>
                    </button>
                </div>

                <div className="mi-bill-scroll">
                    <div className="mi-bill-document">
                        <header className="mi-bill-header">
                            <div className="mi-hospital-brand">
                                <h1>MECARE</h1>
                                <p>Integrated Medical Facilities Network</p>
                                <p>123 Healthcare Blvd, Medical City</p>
                            </div>
                            <div className="mi-bill-type">
                                <h2>INVOICE</h2>
                                <p style={{ fontWeight: '700', color: '#1a237e', marginTop: '10px' }}>#{invoice.invoice_id.slice(-8).toUpperCase()}</p>
                            </div>
                        </header>

                        <div className="mi-bill-meta">
                            <div className="mi-meta-box">
                                <label>Bill To</label>
                                <strong>{invoice.patient_name}</strong>
                                <p>{invoice.patient_contact}</p>
                            </div>
                            <div className="mi-meta-box" style={{ textAlign: 'right' }}>
                                <label>Invoice Details</label>
                                <p>Date: <strong>{invoice.date}</strong></p>
                                <p>Doctor: <strong>Dr. {invoice.doctor_name}</strong></p>
                                {invoice.pharmacy_billing_date && (
                                    <p>Pharmacy Bill: <strong>{invoice.pharmacy_billing_date} {invoice.pharmacy_billing_time}</strong></p>
                                )}
                                <div style={{ marginTop: '10px' }}>
                                    <span className={`mi-status-pill ${invoice.status}`}>{invoice.status}</span>
                                </div>
                            </div>
                        </div>

                        <table className="mi-bill-table">
                            <thead>
                                <tr>
                                    <th>Service Description</th>
                                    <th style={{ textAlign: 'right' }}>Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {invoice.items.map((item, idx) => (
                                    <tr key={idx}>
                                        <td>
                                            <span style={{ fontWeight: '600' }}>{item.name}</span>
                                            <span className="type-tag">{item.type}</span>
                                        </td>
                                        <td className="price-col">₹{item.price}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <div className="mi-bill-summary">
                            <div className="mi-summary-row">
                                <span>Subtotal</span>
                                <strong>₹{invoice.total_amount}</strong>
                            </div>
                            <div className="mi-summary-row">
                                <span>Tax (0%)</span>
                                <strong>₹0</strong>
                            </div>
                            <div className="mi-summary-row grand-total">
                                <span>Total Payable</span>
                                <strong>₹{invoice.total_amount}</strong>
                            </div>
                        </div>

                        <footer className="mi-bill-footer-note">
                            <p><strong>Note:</strong> This is a computer-generated document and does not require a physical signature. Please keep this for your medical and insurance records.</p>
                            <p style={{ marginTop: '10px' }}>Thank you for choosing MeCare for your medical needs.</p>
                        </footer>
                    </div>
                </div>

                <div className="mi-bill-actions-sticky">
                    <div className="mi-modal-left-actions">
                        {invoice.status === 'unpaid' && (
                            <div className="mi-inline-add" style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                <input
                                    className="mi-field"
                                    placeholder="Add service..."
                                    value={chargeName}
                                    onChange={(e) => setChargeName(e.target.value)}
                                    style={{ width: '180px' }}
                                />
                                <input
                                    className="mi-field"
                                    type="number"
                                    placeholder="Amount"
                                    value={chargePrice}
                                    onChange={(e) => setChargePrice(e.target.value)}
                                    style={{ width: '100px' }}
                                />
                                <button className="mi-add-circle" onClick={handleAddChargeLine}>
                                    <i className="fas fa-plus"></i>
                                </button>
                                <div style={{ display: 'flex', gap: '5px' }}>
                                    {newCharges.map((c, i) => (
                                        <div key={i} className="mi-temp-item" style={{ margin: 0 }}>
                                            {c.price} <i className="fas fa-times" onClick={() => handleRemoveChargeLine(i)}></i>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="mi-modal-right-actions" style={{ display: 'flex', gap: '12px' }}>
                        <button className="mi-outline-btn" onClick={onClose}>Close</button>
                        {invoice.status === 'unpaid' && (
                            <>
                                {newCharges.length > 0 && (
                                    <button className="mi-primary-btn" onClick={handleSaveCharges} disabled={updating}>
                                        Save Charges
                                    </button>
                                )}
                                <button className="mi-primary-btn" style={{ background: '#16a34a' }} onClick={() => handleUpdateStatus(invoice.invoice_id, 'paid')} disabled={updating}>
                                    Mark as Paid
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InvoiceDetailsModal;
