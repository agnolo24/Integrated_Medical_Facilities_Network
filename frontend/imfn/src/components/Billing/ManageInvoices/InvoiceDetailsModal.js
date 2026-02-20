import React, { useState,useEffect } from 'react';
import axios from 'axios';

const InvoiceDetailsModal = ({ isOpen, onClose, invoice, onUpdate }) => {
    const [updating, setUpdating] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editableCharges, setEditableCharges] = useState([]);

    useEffect(() => {
        if (invoice && invoice.items) {
            const initialOtherCharges = invoice.items
                .filter(item => item.type === 'other')
                .map(item => ({ name: item.name, price: item.price }));
            setEditableCharges(initialOtherCharges);
        }
    }, [invoice]);

    if (!isOpen || !invoice) return null;

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

    const handleAddCharge = () => {
        setEditableCharges([...editableCharges, { name: '', price: '' }]);
    };

    const handleRemoveCharge = (index) => {
        setEditableCharges(editableCharges.filter((_, i) => i !== index));
    };

    const handleChargeChange = (index, field, value) => {
        const updated = [...editableCharges];
        updated[index][field] = value;
        setEditableCharges(updated);
    };

    const handleSaveCharges = async () => {
        const validCharges = editableCharges.filter(c => c.name && c.price);
        try {
            setUpdating(true);
            await axios.post(`http://127.0.0.1:8000/billing/add_other_charges/`, {
                invoice_id: invoice.invoice_id,
                charge_details: validCharges.map(c => ({
                    name: c.name,
                    price: parseFloat(c.price)
                }))
            });
            alert("Charges synchronized successfully!");
            setIsEditMode(false);
            onUpdate();
        } catch (error) {
            alert("Failed to sync charges");
        } finally {
            setUpdating(false);
        }
    };

    const pharmacyItems = invoice.items.filter(i => i.type === 'pharmacy');
    const otherItems = invoice.items.filter(i => i.type === 'other');

    return (
        <div className="mi-modal-backdrop" style={{ zIndex: 1100 }}>
            <div className="mi-modal-content bill-view" style={{ maxWidth: '750px' }}>
                <div className="mi-modal-top">
                    <h3>Invoice Statement</h3>
                    <div className="d-flex align-items-center">
                        {invoice.status === 'unpaid' && !isEditMode && (
                            <button className="btn btn-sm btn-outline-primary mr-3 rounded-pill" onClick={() => setIsEditMode(true)}>
                                <i className="fas fa-edit mr-1"></i> Manage Charges
                            </button>
                        )}
                        <button className="mi-action-icon" onClick={onClose}>
                            <i className="fas fa-times"></i>
                        </button>
                    </div>
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
                                {/* Pharmacy Items - Read Only */}
                                {pharmacyItems.map((item, idx) => (
                                    <tr key={`ph-${idx}`}>
                                        <td>
                                            <span style={{ fontWeight: '600' }}>{item.name}</span>
                                            {item.quantity > 1 && <span className="small text-muted ml-2">(x{item.quantity})</span>}
                                            <span className="type-tag pharmacy">pharmacy</span>
                                        </td>
                                        <td className="price-col">₹{item.price.toFixed(2)}</td>
                                    </tr>
                                ))}

                                {/* Other Charges - View/Edit */}
                                {!isEditMode ? (
                                    otherItems.map((item, idx) => (
                                        <tr key={`ot-${idx}`}>
                                            <td>
                                                <span style={{ fontWeight: '600' }}>{item.name}</span>
                                                <span className="type-tag other">other</span>
                                            </td>
                                            <td className="price-col">₹{item.price.toFixed(2)}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <>
                                        {editableCharges.map((charge, idx) => (
                                            <tr key={`edit-${idx}`} className="edit-mode-row">
                                                <td>
                                                    <div className="d-flex align-items-center">
                                                        <input
                                                            className="mi-field form-control-sm mr-2"
                                                            value={charge.name}
                                                            onChange={(e) => handleChargeChange(idx, 'name', e.target.value)}
                                                            placeholder="Charge description..."
                                                        />
                                                        <span className="type-tag other">other</span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="d-flex align-items-center justify-content-end">
                                                        <input
                                                            type="number"
                                                            className="mi-field form-control-sm text-right mr-2"
                                                            style={{ width: '100px' }}
                                                            value={charge.price}
                                                            onChange={(e) => handleChargeChange(idx, 'price', e.target.value)}
                                                            placeholder="Amount"
                                                        />
                                                        <button className="btn btn-link text-danger p-0" onClick={() => handleRemoveCharge(idx)}>
                                                            <i className="fas fa-trash-alt"></i>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                        <tr>
                                            <td colSpan="2" className="text-center p-0">
                                                <button className="btn btn-link btn-sm text-primary" onClick={handleAddCharge}>
                                                    <i className="fas fa-plus-circle mr-1"></i> Add New Charge Row
                                                </button>
                                            </td>
                                        </tr>
                                    </>
                                )}
                            </tbody>
                        </table>

                        <div className="mi-bill-summary">
                            <div className="mi-summary-row">
                                <span>Subtotal</span>
                                <strong>₹{invoice.total_amount.toFixed(2)}</strong>
                            </div>
                            <div className="mi-summary-row">
                                <span>Tax (0%)</span>
                                <strong>₹0.00</strong>
                            </div>
                            <div className="mi-summary-row grand-total">
                                <span>Total Payable</span>
                                <strong>₹{invoice.total_amount.toFixed(2)}</strong>
                            </div>
                        </div>

                        {isEditMode && (
                            <div className="alert alert-info mt-3 small">
                                <i className="fas fa-info-circle mr-2"></i>
                                You are in <strong>Charge Management Mode</strong>. Changes will not be applied to the total above until you click <strong>Save Changes</strong>.
                            </div>
                        )}

                        <footer className="mi-bill-footer-note">
                            <p><strong>Note:</strong> This is a computer-generated document and does not require a physical signature. Please keep this for your medical and insurance records.</p>
                            <p style={{ marginTop: '10px' }}>Thank you for choosing MeCare for your medical needs.</p>
                        </footer>
                    </div>
                </div>

                <div className="mi-bill-actions-sticky">
                    <div className="mi-modal-right-actions" style={{ display: 'flex', gap: '12px', width: '100%', justifyContent: 'flex-end' }}>
                        {isEditMode ? (
                            <>
                                <button className="mi-outline-btn" onClick={() => setIsEditMode(false)} disabled={updating}>Cancel</button>
                                <button className="mi-primary-btn" onClick={handleSaveCharges} disabled={updating}>
                                    {updating ? 'Saving...' : 'Save Changes'}
                                </button>
                            </>
                        ) : (
                            <>
                                <button className="mi-outline-btn" onClick={onClose}>Close</button>
                                {invoice.status === 'unpaid' && (
                                    <button className="mi-primary-btn" style={{ background: '#16a34a' }} onClick={() => handleUpdateStatus(invoice.invoice_id, 'paid')} disabled={updating}>
                                        <i className="fas fa-check-double mr-1"></i> Mark as Paid
                                    </button>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InvoiceDetailsModal;
