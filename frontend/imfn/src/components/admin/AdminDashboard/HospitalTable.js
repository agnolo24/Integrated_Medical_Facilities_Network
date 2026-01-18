import React from 'react';

const HospitalTable = ({ title, hospitals, type, onAction }) => {
    return (
        <div className="table-section">
            <div className="section-header">
                <h3 className="section-title">{title}</h3>
                {/* Could add filters here */}
            </div>
            {hospitals.length === 0 ? (
                <div style={{ padding: '20px', textAlign: 'center', color: '#888' }}>
                    No records found
                </div>
            ) : (
                <table className="custom-table">
                    <thead>
                        <tr>
                            <th>Hospital Name</th>
                            <th>Reg ID</th>
                            <th>Address</th>
                            <th>Contact</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {hospitals.map((h) => (
                            <tr key={h._id}>
                                <td>{h.hospitalName}</td>
                                <td>{h.registrationId}</td>
                                <td>{h.hospitalAddress}</td>
                                <td>{h.contactNumber}</td>
                                <td>
                                    <span className={`status-badge status-${type}`}>
                                        {type === 'pending' ? 'Pending' : 'Verified'}
                                    </span>
                                </td>
                                <td>
                                    {type === 'pending' ? (
                                        <button className="action-btn btn-verify" onClick={() => onAction(h._id)}>
                                            Verify
                                        </button>
                                    ) : (
                                        <button className="action-btn btn-view" onClick={() => onAction(h.login_id)}>
                                            Details
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default HospitalTable;
