import React from 'react'
import PatientHeader from '../PatientHeader/PatientHeader'
import PatientFooter from '../PatientFooter/PatientFooter'
import CardView from '../../Hospital/HospitalComponents/CardView';

export default function PatientHome() {
    const card = [
        { id: 1, name: "Find Doctors", link: "#" },
        { id: 2, name: "View Appointments", link: "#" },
    ];

    return (
        <div style={{ backgroundColor: "#f4f7f6", minHeight: "100vh" }}>
            <PatientHeader />
            <div className="container py-5">
                <h1 className="text-center mb-5 fw-bold">Patient Dashboard</h1>
                <div className="row">
                    {card.map((data) => (
                        <div key={data.id} className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
                            <CardView
                                name={data.name}
                                link={data.link} />
                        </div>
                    ))}
                </div>
            </div>
            <PatientFooter />
        </div>
    );
}