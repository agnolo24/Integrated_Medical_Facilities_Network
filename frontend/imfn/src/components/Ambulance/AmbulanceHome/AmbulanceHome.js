import React, { useEffect, useState } from "react";
import axios from "axios";
import AmbulanceHeader from "../AmbulanceHeader/AmbulanceHeader";
import AmbulanceFooter from "../AmbulanceFooter/AmbulanceFooter";

function AmbulanceHome() {
    const [duty, setDuty] = useState(null);
    const [loading, setLoading] = useState(true);

    const getDutyUrl = "http://127.0.0.1:8000/ambulance/get_duty/";

    useEffect(() => {
        getDuty();
    }, []);

    async function getDuty() {
        try {
            const response = await axios.get(getDutyUrl, {
                params: { ambulanceId: localStorage.getItem("loginId") },
            });
            setDuty(response.data[0]);
        } catch (error) {
            console.error("No duty or server error", error);
            setDuty(null);
        } finally {
            setLoading(false);
        }
    }

    const getRiskBadge = (level) => {
        const map = {
            high: "bg-danger",
            medium: "bg-warning text-dark",
            low: "bg-success",
        };
        return `badge ${map[level] || "bg-secondary"} px-3 py-2 text-uppercase`;
    };

    return (
        <div className="bg-light min-vh-100">
            <AmbulanceHeader />

            <div className="container py-5">
                <div className="text-center mb-5">
                    <h1 className="fw-bold text-primary">Ambulance Dashboard</h1>
                    <p className="text-muted mb-0">
                        Active emergency assignment overview
                    </p>
                </div>

                <div className="row justify-content-center">
                    <div className="col-lg-6 col-md-8">
                        {loading ? (
                            <div className="text-center py-5">
                                <div className="spinner-border text-primary" />
                                <p className="mt-3 text-muted">
                                    Loading duty details...
                                </p>
                            </div>
                        ) : duty ? (
                            /* ACTIVE DUTY CARD */
                            <div className="card border-0 shadow-sm rounded-4">
                                <div className="card-header bg-white border-0 d-flex justify-content-between align-items-center px-4 pt-4">
                                    <h5 className="fw-bold mb-0">
                                        Active Assignment
                                    </h5>
                                    <span className={getRiskBadge(duty.risk_level)}>
                                        {duty.risk_level} Risk
                                    </span>
                                </div>

                                <div className="card-body px-4 pb-4">
                                    {/* LOCATIONS */}
                                    <div className="d-flex gap-3 mb-4">
                                        <div className="text-center">
                                            <div className="rounded-circle bg-primary-subtle text-primary p-2 mb-2">
                                                <i className="bi bi-geo-alt-fill" />
                                            </div>
                                            <div
                                                className="mx-auto"
                                                style={{
                                                    width: "2px",
                                                    height: "40px",
                                                    background: "#dee2e6",
                                                }}
                                            />
                                            <div className="rounded-circle bg-success-subtle text-success p-2 mt-2">
                                                <i className="bi bi-hospital-fill" />
                                            </div>
                                        </div>

                                        <div className="flex-grow-1">
                                            <div className="mb-3">
                                                <small className="text-muted text-uppercase fw-semibold">
                                                    Pickup Location
                                                </small>
                                                <p className="mb-0 fw-semibold">
                                                    {duty.from_address}
                                                </p>
                                            </div>

                                            <div>
                                                <small className="text-muted text-uppercase fw-semibold">
                                                    Destination
                                                </small>
                                                <p className="mb-0 fw-semibold">
                                                    {duty.to_address}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* META INFO */}
                                    <div className="bg-light rounded-3 p-3 mb-4">
                                        <div className="row text-center">
                                            <div className="col border-end">
                                                <small className="text-muted d-block">
                                                    Status
                                                </small>
                                                <span className="fw-bold text-primary">
                                                    {duty.status}
                                                </span>
                                            </div>
                                            <div className="col">
                                                <small className="text-muted d-block">
                                                    Assigned At
                                                </small>
                                                <span className="fw-bold">
                                                    {new Date(
                                                        duty.created_at
                                                    ).toLocaleTimeString()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <button className="btn btn-primary w-100 py-3 fw-semibold shadow-sm">
                                        <i className="bi bi-navigation me-2" />
                                        Accept & Start Navigation
                                    </button>
                                </div>
                            </div>
                        ) : (
                            /* NO DUTY STATE */
                            <div className="card border-0 shadow-sm rounded-4 text-center p-5">
                                <div className="mb-3 text-secondary">
                                    <i className="bi bi-clock-history fs-1" />
                                </div>
                                <h5 className="fw-bold">No Active Duties</h5>
                                <p className="text-muted mb-4">
                                    You are currently available and waiting for
                                    new assignments.
                                </p>
                                <button
                                    onClick={getDuty}
                                    className="btn btn-outline-primary px-4"
                                >
                                    <i className="bi bi-arrow-clockwise me-2" />
                                    Refresh Status
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <AmbulanceFooter />
        </div>
    );
}

export default AmbulanceHome;
