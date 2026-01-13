import React from "react";
import HospitalHeader from "../HospitalHeader/HospitalHeader";
import HospitalFooter from "../HospitalFooter/HospitalFooter";
import CardView from "../HospitalComponents/CardView";

function HospitalHome() {
    const doctors = [
        { id: 1, name: "Register New Doctors", link: "/registerDoctor"},
        { id: 2, name: "John Doe", link: "#"},
        { id: 3, name: "Jane Smith", link: "#"},
    ];

    return (
        <div style={{ backgroundColor: "#f4f7f6", minHeight: "100vh" }}>
            <HospitalHeader />
            <div className="container py-5">
                <h1 className="text-center mb-5 fw-bold">Hospital Dashboard</h1>
                <div className="row">
                    {doctors.map((doc) => (
                        <div key={doc.id} className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
                            <CardView 
                                name={doc.name} 
                                link={doc.link}
                            />
                        </div>
                    ))}
                </div>
            </div>
            <HospitalFooter />
        </div>
    );
}
export default HospitalHome;