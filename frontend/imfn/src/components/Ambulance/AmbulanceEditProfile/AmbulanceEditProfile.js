import React,{useEffect,useState} from "react";
import axios from "axios";


function AmbulanceEditProfile({ambulanceData}){

    const editAmbulanceUrl = 'http://127.0.0.1:8000/hospital/edit_ambulance/';

    const ambulance_choices = [
        'bls',
        'als',
        'micu',
        'icu'
    ];

    const category_choice = [
        'Category 1: Life-threatening emergencies',
        'Category 2: Emergency calls',
        'Category 3: Urgent problems',
        'Category 4: Non-urgent problems'
    ];

    const [formData, setFormData] = useState({
        name: '',
        ambulanceType: '',
        vehicleNumber: '',
        category: '',
        contactNumber: ''
    });

    useEffect(() => {
        if (ambulanceData) {
            setFormData({
                ambulance_id: ambulanceData._id,
                name: ambulanceData.name || '',
                ambulanceType: ambulanceData.ambulanceType || '',
                vehicleNumber: ambulanceData.vehicleNumber || '',
                category: ambulanceData.category || '',
                contactNumber: ambulanceData.contactNumber || '',
            });
        }
    }, [ambulanceData]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.put(editAmbulanceUrl, formData);

            if (response.status === 200) {
                alert("Ambulance details updated successfully!");
                onClose();
            }
        } catch (error) {
            console.error("Error updating ambulance:", error);
            alert(error?.response?.data?.error || "An error occurred while updating ambulance details.");
        }
    };

    return (
        <div className="edit-ambulance-container">
            <div className="card border-0 shadow-sm">
                <div className="card-header bg-primary text-white">
                    <h5 className="mb-0">Edit Ambulance Profile</h5>
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        {/* Name & Ambulance Type */}
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label htmlFor="name" className="form-label">Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="name"
                                    id="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label htmlFor="ambulanceType" className="form-label">Ambulance Type</label>
                                <select
                                    name="ambulanceType"
                                    id="ambulanceType"
                                    className="form-select"
                                    value={formData.ambulanceType}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select Type</option>
                                    {ambulance_choices.map((cho, index) => (
                                        <option key={index} value={cho}>{cho.toUpperCase()}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Vehicle Number & Category */}
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label htmlFor="vehicleNumber" className="form-label">Vehicle Number</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="vehicleNumber"
                                    id="vehicleNumber"
                                    value={formData.vehicleNumber}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label htmlFor="category" className="form-label">Category</label>
                                <select
                                    name="category"
                                    id="category"
                                    className="form-select"
                                    value={formData.category}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select Category</option>
                                    {category_choice.map((cat, index) => (
                                        <option value={cat} key={index}>{cat}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Contact & Email */}
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label htmlFor="contactNumber" className="form-label">Contact Number</label>
                                <input
                                    type="tel"
                                    className="form-control"
                                    name="contactNumber"
                                    id="contactNumber"
                                    value={formData.contactNumber}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="d-flex gap-2 justify-content-end mt-3">
                            <button type="button" className="btn btn-secondary" >Cancel</button>
                            <button type="submit" className="btn btn-primary">Update Details</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );

}

export default AmbulanceEditProfile