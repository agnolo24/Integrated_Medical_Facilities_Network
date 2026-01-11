import React from "react";
import HospitalHeader from "../HospitalHeader/HospitalHeader";
import HospitalFooter from "../HospitalFooter/HospitalFooter";
import CardView from "../HospitalComponents/CardView";

function HospitalHome() {
    const doctors = [
        { id: 1, name: "Samanta Crane", specialty: "Internist", exp: "Since 2004" },
        { id: 2, name: "John Doe", specialty: "Surgeon", exp: "Since 2010" },
        { id: 3, name: "Jane Smith", specialty: "Pediatrician", exp: "Since 2015" },
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
                                specialty={doc.specialty} 
                                experience={doc.exp} 
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