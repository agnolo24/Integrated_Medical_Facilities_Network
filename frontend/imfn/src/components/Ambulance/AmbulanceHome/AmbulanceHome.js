import React from "react";
import AmbulanceHeader from "../AmbulanceHeader/AmbulanceHeader";
import AmbulanceFooter from "../AmbulanceFooter/AmbulanceFooter";
import CardView from "../../Hospital/HospitalComponents/CardView";


function AmbulanceHome(){
  const card = [
        { id: 1, name: "View Doctors", link: "/viewDoctors"},
        { id: 2, name: "View Ambulance", link: "#"},
    ];

    return (
        <div style={{ backgroundColor: "#f4f7f6", minHeight: "100vh" }}>
            <AmbulanceHeader />
            <div className="container py-5">
                <h1 className="text-center mb-5 fw-bold">Ambulance Dashboard</h1>
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
            <AmbulanceFooter />
        </div>
    );
}

export default AmbulanceHome