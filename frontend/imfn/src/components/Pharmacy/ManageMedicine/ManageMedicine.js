import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PharmacyHeader from '../PharmacyHeader/PharmacyHeader';
import PharmacyFooter from '../PharmacyFooter/PharmacyFooter';
import './ManageMedicine.css';

function ManageMedicine() {
    const [medicines, setMedicines] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [formData, setFormData] = useState({ medicine_id: null, name: '', description: '', price: '', stock: '', expiry_date: '' });
    const [loading, setLoading] = useState(true);

    const pharmacyLoginId = localStorage.getItem("loginId");

    useEffect(() => {
        fetchMedicines();
    }, []);

    const fetchMedicines = async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://127.0.0.1:8000/pharmacy/view_medicines/', {
                params: { pharmacy_login_id: pharmacyLoginId }
            });
            setMedicines(response.data.medicines || []);
        } catch (error) {
            console.error("Error fetching medicines:", error);
            // alert("Failed to fetch medicines");
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };


    const handleOpenModal = (medicine = null) => {
        if (medicine) {
            setIsEditMode(true);
            setFormData(medicine);
        } else {
            setIsEditMode(false);
            setFormData({ medicine_id: null, name: '', description: '', price: '', stock: '', expiry_date: '' });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditMode) {
                const response = await axios.post('http://127.0.0.1:8000/pharmacy/edit_medicine/', {
                    ...formData,
                    pharmacy_login_id: pharmacyLoginId
                });
                alert(response.data.message);
            } else {
                const response = await axios.post('http://127.0.0.1:8000/pharmacy/add_medicine/', {
                    ...formData,
                    pharmacy_login_id: pharmacyLoginId
                });
                alert(response.data.message);
            }
            handleCloseModal();
            fetchMedicines(); // Refresh the list
        } catch (error) {
            console.error("Submission error:", error);
            alert(error.response?.data?.error || "Something went wrong");
        }
    };

    const handleDelete = async (medicine_id) => {
        if (window.confirm("Are you sure you want to delete this item?")) {
            try {
                const response = await axios.post('http://127.0.0.1:8000/pharmacy/delete_medicine/', {
                    pharmacy_login_id: pharmacyLoginId,
                    medicine_id: medicine_id
                });
                alert(response.data.message);
                fetchMedicines();
            } catch (error) {
                console.error("Delete error:", error);
                alert(error.response?.data?.error || "Failed to delete medicine");
            }
        }
    };

    const filteredMedicines = medicines.filter(med =>
        med.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="manage-medicine-page">
            <PharmacyHeader />

            <main className="medicine-main">
                {/* <section className="breadcrumb-area d-flex align-items-center" style={{ backgroundImage: `url(${require('../../../asset/user_assets/img/testimonial/test-bg.jpg')})` }}>
                    <div className="container">
                        <div className="row align-items-center">
                            <div className="col-xl-12 col-lg-12">
                                <div className="breadcrumb-wrap text-left">
                                    <div className="breadcrumb-title">
                                        <h2>Manage Medicines</h2>
                                        <div className="breadcrumb-inner">
                                            <nav aria-label="breadcrumb">
                                                <ol className="breadcrumb">
                                                    <li className="breadcrumb-item"><a href="/pharmacyhome">Home</a></li>
                                                    <li className="breadcrumb-item active" aria-current="page">Manage Medicines</li>
                                                </ol>
                                            </nav>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section> */}

                <div className="container mt-50 mb-50">
                    <div className="table-controls mb-30">
                        <div className="search-container">
                            <input
                                type="text"
                                placeholder="Search medicines..."
                                value={searchTerm}
                                onChange={handleSearch}
                                className="search-input"
                            />
                            <i className="fas fa-search search-icon"></i>
                        </div>
                        <div className="button-group">
                            <button className="btn ss-btn add-btn" onClick={() => handleOpenModal()}>
                                <i className="fas fa-plus"></i> Add Medicine
                            </button>
                        </div>
                    </div>

                    <div className="medicine-table-container">
                        <table className="table medicine-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Description</th>
                                    <th>Price (₹)</th>
                                    <th>Stock</th>
                                    <th>Expiry Date</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan="6" className="text-center">Loading medicines...</td>
                                    </tr>
                                ) : filteredMedicines.length > 0 ? (
                                    filteredMedicines.map((med) => (
                                        <tr key={med.medicine_id}>
                                            <td><strong>{med.name}</strong></td>
                                            <td>{med.description}</td>
                                            <td>{parseFloat(med.price).toFixed(2)}</td>
                                            <td>
                                                <span className={`stock-status ${parseInt(med.stock) < 20 ? 'low' : 'good'}`}>
                                                    {med.stock}
                                                </span>
                                            </td>
                                            <td>{med.expiry_date}</td>
                                            <td>
                                                <button className="action-btn edit-btn" onClick={() => handleOpenModal(med)}>
                                                    Edit
                                                </button>
                                                <button className="action-btn delete-btn" onClick={() => handleDelete(med.medicine_id)}>
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="text-center">No medicines found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {isModalOpen && (
                    <div className="modal-overlay">
                        <div className="medicine-modal">
                            <div className="modal-header">
                                <h2>{isEditMode ? 'Edit Medicine' : 'Add New Medicine'}</h2>
                                <button className="close-btn" onClick={handleCloseModal}>&times;</button>
                            </div>
                            <form onSubmit={handleSubmit} className="modal-body">
                                <div className="form-group mb-3">
                                    <label>Medicine Name</label>
                                    <input type="text" name="name" className="form-control" value={formData.name} onChange={handleInputChange} required />
                                </div>
                                <div className="form-group mb-3">
                                    <label>Description</label>
                                    <textarea name="description" className="form-control" value={formData.description} onChange={handleInputChange}></textarea>
                                </div>
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label>Price (₹)</label>
                                        <input type="number" step="0.01" name="price" className="form-control" value={formData.price} onChange={handleInputChange} required />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label>Stock Quantity</label>
                                        <input type="number" name="stock" className="form-control" value={formData.stock} onChange={handleInputChange} required />
                                    </div>
                                </div>
                                <div className="form-group mb-3">
                                    <label>Expiry Date</label>
                                    <input type="date" name="expiry_date" className="form-control" value={formData.expiry_date} onChange={handleInputChange} required />
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" style={{ borderRadius: '25px' }} onClick={handleCloseModal}>Cancel</button>
                                    <button type="submit" className="btn ss-btn">{isEditMode ? 'Update' : 'Add'}</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </main>

            <PharmacyFooter />
        </div>
    );
}

export default ManageMedicine;
