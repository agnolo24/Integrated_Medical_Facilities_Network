import React from "react";
import HospitalHeader from "../HospitalHeader/HospitalHeader";
import HospitalFooter from "../HospitalFooter/HospitalFooter";
import CardView from "../HospitalComponents/CardView";

function HospitalHome() {
    const card = [
        { id: 1, name: "View Doctors", link: "/viewDoctors"},
        { id: 2, name: "View Ambulance", link: "#"},
    ];

    return (
        <div style={{ backgroundColor: "#f4f7f6", minHeight: "100vh" }}>
            <HospitalHeader />
            <div className="container py-5">
                <h1 className="text-center mb-5 fw-bold">Hospital Dashboard</h1>
                <div className="row">
                    {card.map((data) => (
                        <div key={data.id} className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
                            <CardView 
                                name={data.name} 
                                link={data.link}
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