import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PrescriptionToggle = ({ appointmentId, handleCloseModal }) => {
    const [prescription, setPrescription] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // New states for medicine management
    const [availableMedicines, setAvailableMedicines] = useState([]);
    const [medicine_details, setMedicineDetails] = useState([]);
    const [selectedMedicineId, setSelectedMedicineId] = useState("");
    const [quantity, setQuantity] = useState("1"); // Use string to allow clearing

    const pharmacyLoginId = localStorage.getItem("loginId");

    const fetchPrescription = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get('http://127.0.0.1:8000/pharmacy/get_prescription/', {
                params: { appointment_id: appointmentId }
            });
            setPrescription(response.data.prescription);
        } catch (err) {
            console.error("Error fetching prescription:", err);
            setError("Failed to load prescription.");
        } finally {
            setLoading(false);
        }
    };

    const fetchAvailableMedicines = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/pharmacy/view_medicines/', {
                params: { pharmacy_login_id: pharmacyLoginId }
            });
            setAvailableMedicines(response.data.medicines || []);
        } catch (error) {
            console.error("Error fetching medicines:", error);
        }
    };

    useEffect(() => {
        if (appointmentId) {
            fetchPrescription();
            fetchAvailableMedicines();
        }
    }, [appointmentId]);

    // Close modal on Escape key
    useEffect(() => {
        const handleEsc = (event) => {
            if (event.keyCode === 27) handleCloseModal();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [handleCloseModal]);

    const handleAddMedicine = () => {
        if (!selectedMedicineId) {
            alert("Please select a medicine");
            return;
        }

        if (!quantity || parseInt(quantity) <= 0) {
            alert("Please enter a valid quantity");
            return;
        }

        const selectedMed = availableMedicines.find(m => m.medicine_id.toString() === selectedMedicineId.toString());
        if (selectedMed) {
            const qtyToAdd = parseInt(quantity);

            // Stock Validation
            if (qtyToAdd > selectedMed.stock) {
                alert(`Insufficient stock! Only ${selectedMed.stock} units available.`);
                return;
            }

            const newEntry = {
                medicine_id: selectedMed.medicine_id, // Store ID for restoration
                medicine_name: selectedMed.name,
                quantity: qtyToAdd,
                price: selectedMed.price,
                expiry_date: selectedMed.expiry_date
            };

            // Update medicine details list
            setMedicineDetails([...medicine_details, newEntry]);

            // Real-time Stock Management: Decrement locally
            setAvailableMedicines(availableMedicines.map(med =>
                med.medicine_id === selectedMed.medicine_id
                    ? { ...med, stock: med.stock - qtyToAdd }
                    : med
            ));

            // Reset selection
            setSelectedMedicineId("");
            setQuantity("1");
        }
    };

    const handleRemoveMedicine = (index) => {
        const itemToRemove = medicine_details[index];

        // Real-time Stock Management: Restore stock locally
        setAvailableMedicines(availableMedicines.map(med =>
            med.medicine_id === itemToRemove.medicine_id
                ? { ...med, stock: med.stock + itemToRemove.quantity }
                : med
        ));

        const updated = medicine_details.filter((_, i) => i !== index);
        setMedicineDetails(updated);
    };

    const handleSave = async () => {
        if (medicine_details.length === 0) return;

        console.log("Saving records for:", medicine_details);
        const url = "http://127.0.0.1:8000/pharmacy/update_medicine_stock/";

        console.log("availableMedicines", availableMedicines);

        // Optimization: Only send essential data (ID and Updated Stock)
        const Medicine_Stock = availableMedicines.map(item => ({
            medicine_id: item.medicine_id,
            stock: item.stock,
        }));

        console.log("Medicine_Stock", Medicine_Stock);

        try {
            const response = await axios.post(url, {
                pharmacy_login_id: pharmacyLoginId,
                Medicine_Stock: Medicine_Stock,
            });

            if (response.status === 200) {
                alert("Dispensing records saved and stock updated successfully!");
                // Optionally close modal or clear list after save
                setMedicineDetails([]);
            }
        }
        catch (error) {
            console.error("Error updating medicine stock:", error);
            alert("Failed to update stock. Please try again.");
        }
    };

    const renderPrescriptionContent = (data) => {
        if (!data || data === "N/A" || (Array.isArray(data) && data.length === 0)) {
            return (
                <div className="no-prescription-notice">
                    <i className="fas fa-file-medical-alt mb-2"></i>
                    <p>No prescription details available for this appointment.</p>
                </div>
            );
        }

        if (typeof data === 'string') {
            return <p className="prescription-text-content">{data}</p>;
        }

        if (Array.isArray(data)) {
            return (
                <ul className="prescription-modal-list">
                    {data.map((item, index) => (
                        <li key={index} className="prescription-modal-item">
                            <div className="med-header">
                                <span className="med-name">{item.medicine_name}</span>
                                <span className="med-qty">{item.quantity} Qty</span>
                            </div>
                            <div className="med-footer">
                                <span className="med-dose"><i className="far fa-clock"></i> {item.dose_age}</span>
                                <span className="med-days"><i className="far fa-calendar-alt"></i> {item.days} Day(s)</span>
                            </div>
                        </li>
                    ))}
                </ul>
            );
        }

        return <pre className="raw-json">{JSON.stringify(data, null, 2)}</pre>;
    };

    return (
        <div className="prescription-modal-overlay" onClick={handleCloseModal}>
            <div className="prescription-modal-card" style={{ maxWidth: '800px' }} onClick={(e) => e.stopPropagation()}>
                <div className="modal-header-premium">
                    <h3><i className="fas fa-prescription"></i> Prescription & Billing Management</h3>
                    <button className="close-btn-minimal" onClick={handleCloseModal}>
                        <i className="fas fa-times"></i>
                    </button>
                </div>

                <div className="modal-body-premium">
                    <div className="row">
                        {/* Left Column: Doctor's Prescription */}
                        <div className="col-md-6 border-end">
                            <h4 className="mb-3 text-primary"><i className="fas fa-file-medical"></i> Prescribed by Doctor</h4>
                            {loading ? (
                                <div className="modal-loader">
                                    <div className="spinner-premium"></div>
                                    <p>Loading prescription...</p>
                                </div>
                            ) : error ? (
                                <div className="modal-error">
                                    <p>{error}</p>
                                    <button className="btn ss-btn btn-sm mt-2" onClick={fetchPrescription}>Retry</button>
                                </div>
                            ) : (
                                renderPrescriptionContent(prescription)
                            )}
                        </div>

                        {/* Right Column: Medicine Management */}
                        <div className="col-md-6 ps-md-4">
                            <h4 className="mb-3 text-success"><i className="fas fa-pills"></i> Medicine Management</h4>

                            <div className="add-medicine-section mb-4 p-3 bg-light rounded shadow-sm">
                                <div className="form-group mb-2">
                                    <label className="small font-weight-bold">Select Medicine:</label>
                                    <select
                                        className="form-control form-control-sm"
                                        value={selectedMedicineId}
                                        onChange={(e) => setSelectedMedicineId(e.target.value)}
                                    >
                                        <option value="">-- Choose Medicine --</option>
                                        {availableMedicines.map(med => (
                                            <option key={med.medicine_id} value={med.medicine_id}>
                                                {med.name} - ₹{med.price} (Stock: {med.stock}, Exp: {med.expiry_date})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group mb-3">
                                    <label className="small font-weight-bold">Quantity:</label>
                                    <input
                                        type="number"
                                        className="form-control form-control-sm"
                                        min="1"
                                        value={quantity}
                                        onChange={(e) => setQuantity(e.target.value)}
                                        placeholder="Qty"
                                        required
                                    />
                                </div>
                                <button className="btn btn-success btn-sm btn-block" onClick={handleAddMedicine}>
                                    <i className="fas fa-plus"></i> Add to List
                                </button>
                            </div>

                            <div className="medicine-details-list">
                                <h5 className="small font-weight-bold mb-2">Dispensing Details:</h5>
                                {medicine_details.length > 0 ? (
                                    <div className="table-responsive">
                                        <table className="table table-sm table-hover border">
                                            <thead className="thead-light">
                                                <tr style={{ fontSize: '0.8rem' }}>
                                                    <th>Medicine</th>
                                                    <th>Qty</th>
                                                    {/* <th>Exp Date</th> */}
                                                    <th>Price</th>
                                                    <th></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {medicine_details.map((item, index) => (
                                                    <tr key={index} style={{ fontSize: '0.9rem' }}>
                                                        <td>{item.medicine_name}</td>
                                                        <td>{item.quantity}</td>
                                                        {/* <td className="text-muted" style={{ fontSize: '0.75rem' }}>{item.expiry_date}</td> */}
                                                        <td>₹{(item.price * item.quantity).toFixed(2)}</td>
                                                        <td>
                                                            <button
                                                                className="btn btn-link btn-sm text-danger p-0"
                                                                onClick={() => handleRemoveMedicine(index)}
                                                            >
                                                                <i className="fas fa-times"></i>
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                            <tfoot>
                                                <tr>
                                                    <td colSpan="3" className="text-right font-weight-bold">Total:</td>
                                                    <td colSpan="2" className="font-weight-bold">
                                                        ₹{medicine_details.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}
                                                    </td>
                                                </tr>
                                            </tfoot>
                                        </table>
                                    </div>
                                ) : (
                                    <p className="text-muted small italic">No medicines added to dispensing list yet.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="modal-footer-premium justify-content-between">
                    <button className="btn ss-btn close-action-btn" onClick={handleCloseModal}>
                        Close
                    </button>
                    <button className="btn btn-primary ss-btn" onClick={handleSave} disabled={medicine_details.length === 0}>
                        <i className="fas fa-save"></i> Save Details
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PrescriptionToggle;

