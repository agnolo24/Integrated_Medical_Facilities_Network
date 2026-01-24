import React from 'react'
import DoctorHeader from '../DoctorHeader/DoctorHeader'
import DoctorFooter from '../DoctorFooter/DoctorFooter'
import CardView from '../../Hospital/HospitalComponents/CardView';

export default function DoctorHome() {
    const card = [
        { id: 1, name: "View Patient Appointments", link: "/ViewPatientAppointments" },
        { id: 2, name: "View Ambulance", link: "#" },
    ];

    return (
        <div style={{ backgroundColor: "#f4f7f6", minHeight: "100vh" }}>
            <DoctorHeader />
            <div className="container py-5">
                <h1 className="text-center mb-5 fw-bold">Hospital Dashboard</h1>
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
            <DoctorFooter />
        </div>
    );
}
