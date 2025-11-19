import React, { useContext, useEffect, useState } from "react";
import { ConfigContext } from "../../../Context/ConfigContext";
import axios from "axios";
import CountUp from "react-countup";
import { Link } from "react-router-dom";
import AchievementStats from "./AchievementStats";
import LastPartInquiries from "./LastPartInquiries";

const MainDashboard = () => {
    const { apiHeaderJson, apiURL } = useContext(ConfigContext);
    const headers = apiHeaderJson;

    const [info, setInfo] = useState({});
    const [aboveTargetData, setAboveTargetData] = useState([]);
    const [belowTargetData, setBelowTargetData] = useState([]);
    const [inquiryData, setInquiryData] = useState([]);

    const GetTeamLeaderDashboardStates = async () => {
        try {
            const response = await axios.get(`${apiURL}Dashboard/GetTeamLeaderDashboardStates`, { headers });
            if (response?.data?.success) {
                setInfo(response?.data?.data);
            } else {
                console.log("Dashboard error");
            }
        } catch (error) {
            console.log("error", error);
        }
    };

    const GetLastPartInquiries = async () => {
        try {
            const response = await axios.get(`${apiURL}Dashboard/GetLastPartInquiries`, { headers });
            if (response?.data?.success) {
                setInquiryData(response?.data?.data)
            } else {
                console.log("Dashboard error");
            }
        } catch (error) {
            console.log("error", error);
        }
    };

    const getAchievementReports = async () => {
        try {
            const response = await axios.get(`${apiURL}Dashboard/GetTargetAchievementReport`, { headers });
            const { success, data } = response.data
            if (success) {
                setAboveTargetData(data?.above_target)
                setBelowTargetData(data?.below_target)
            } else {
                console.log("Dashboard error");
            }
        } catch (error) {
            console.log("error", error);
        }
    }

    useEffect(() => {
        GetTeamLeaderDashboardStates();
        getAchievementReports()
        GetLastPartInquiries()
    }, []);

    const cardItems = [
        {
            title: "Total Salesman",
            key: "total_salesman",
            color: "text-success",
            bg: "bg-success-subtle",
            icon: "ri-user-3-line",
            link: "/Reports/AllSalesmanReport"
        },
        {
            title: "Total Salesman Targets Amount",
            key: "total_salesman_targets",
            color: "text-info",
            bg: "bg-info-subtle",
            icon: "mdi mdi-bullseye-arrow",
            link: "/Reports/TargetReport"
        },
        {
            title: "Total business Assigned by salesman",
            key: "total_assigned_business",
            color: "text-warning",
            bg: "bg-warning-subtle",
            icon: "ri-briefcase-line",
            link: "/Reports/AllBusinessesReport"
        },
        {
            title: "Business In-Active",
            key: "business_in_active",
            color: "text-secondary",
            bg: "bg-secondary-subtle",
            icon: "ri-alert-line",
            link: "/Reports/AllBusinessesReport?status=inactive"
        },
        {
            title: "Total Orders",
            key: "total_orders",
            color: "text-primary",
            bg: "bg-primary-subtle",
            icon: "ri-shopping-bag-3-line",
            link: "/Reports/FullOrdersReport"
        },
        {
            title: "Pending Orders",
            key: "total_pending_orders",
            color: "text-danger",
            bg: "bg-danger-subtle",
            icon: "ri-time-line",
            link: "/Reports/OrderByStatusReport/0"
        }
    ];

    // Custom CSS for alert animation
    const alertCardStyle = `
        .alert-card {
            border-left: 4px solid #6c757d;
            animation: pulse-alert 2s infinite;
            box-shadow: 0 0.5rem 1rem rgba(108, 117, 125, 0.15);
            position: relative;
            overflow: hidden;
        }
        
        .alert-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, rgba(108, 117, 125, 0.05) 0%, transparent 50%);
            z-index: 0;
        }
        
        .alert-card .card-body {
            position: relative;
            z-index: 1;
        }
        
        @keyframes pulse-alert {
            0% {
                box-shadow: 0 0.5rem 1rem rgba(108, 117, 125, 0.15);
            }
            50% {
                box-shadow: 0 0.5rem 1.5rem rgba(108, 117, 125, 0.25);
            }
            100% {
                box-shadow: 0 0.5rem 1rem rgba(108, 117, 125, 0.15);
            }
        }
        
        .alert-icon {
            animation: shake 2s infinite;
        }
        
        @keyframes shake {
            0%, 100% {
                transform: rotate(0deg);
            }
            10%, 30%, 50%, 70%, 90% {
                transform: rotate(-5deg);
            }
            20%, 40%, 60%, 80% {
                transform: rotate(5deg);
            }
        }
        
        .alert-badge {
            animation: blink 2s infinite;
        }
        
        @keyframes blink {
            0%, 50% {
                opacity: 1;
            }
            51%, 100% {
                opacity: 0.5;
            }
        }
    `;

    return (
        <div className="main-content">
            <style>{alertCardStyle}</style>
            <div className="page-content">
                <div className="container-fluid">

                    <div className="row mb-4">
                        <div className="col-12">
                            <h4 className="fw-bold">Welcome to Ghayar CRM Management</h4>
                            <p className="text-muted mb-0">
                                Manage your customers, track sales performance, and monitor team progress efficiently.
                            </p>
                        </div>
                    </div>

                    <div className="row">
                        {cardItems.map((item, index) => {
                            // Special design for Business In-Active card
                            if (item.key === "business_in_active") {
                                return (
                                    <div className="col-xl-4 col-md-6" key={index}>
                                        <div className="card alert-card">
                                            <div className="card-body">
                                                <div className="d-flex align-items-center justify-content-between">
                                                    <div>
                                                        <div className="d-flex align-items-center mb-2">
                                                            <p className="text-uppercase fw-medium text-muted mb-0 me-2">
                                                                {item.title}
                                                            </p>
                                                            <span className="badge alert-badge bg-danger">Attention Required</span>
                                                        </div>
                                                        <h4 className="mb-0 fw-semibold text-secondary">
                                                            <CountUp
                                                                end={info?.[item.key] ?? 0}
                                                                duration={1.5}
                                                                separator=","
                                                            />
                                                        </h4>
                                                    </div>
                                                    <div
                                                        className={`avatar-sm flex-shrink-0 bg-secondary-subtle rounded-circle d-flex align-items-center justify-content-center alert-icon`}
                                                    >
                                                        <i className={`ri-alert-line fs-3 text-secondary`}></i>
                                                    </div>
                                                </div>

                                                <div className="mt-3 d-flex justify-content-between align-items-center">
                                                    <Link
                                                        to={item.link}
                                                        className="text-decoration-underline text-danger small fw-semibold"
                                                    >
                                                        Review Inactive Businesses
                                                    </Link>
                                                    <span className="badge bg-light text-muted border">
                                                        Requires Action
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            }

                            // Regular design for other cards
                            return (
                                <div className="col-xl-4 col-md-6" key={index}>
                                    <div className="card card-animate">
                                        <div className="card-body">
                                            <div className="d-flex align-items-center justify-content-between">
                                                <div>
                                                    <p className="text-uppercase fw-medium text-muted mb-2">
                                                        {item.title}
                                                    </p>
                                                    <h4 className={`mb-0 fw-semibold ${item.color}`}>
                                                        {item.key === "total_salesman_targets" && "AED "}
                                                        <CountUp
                                                            end={info?.[item.key] ?? 0}
                                                            duration={1.5}
                                                            separator=","
                                                        />
                                                    </h4>
                                                </div>
                                                <div
                                                    className={`avatar-sm flex-shrink-0 ${item.bg} rounded-circle d-flex align-items-center justify-content-center`}
                                                >
                                                    <i className={`${item.icon} fs-3 ${item.color}`}></i>
                                                </div>
                                            </div>

                                            <div className="mt-3 d-flex justify-content-between align-items-center">
                                                <Link
                                                    to={item.link}
                                                    className="text-decoration-underline text-muted small fw-semibold"
                                                >
                                                    View Report
                                                </Link>
                                                <span className="badge bg-light text-muted border">
                                                    Updated just now
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="row">
                        <AchievementStats
                            aboveTargetData={aboveTargetData}
                            belowTargetData={belowTargetData}
                        />
                    </div>
                    <div className="row">
                        <LastPartInquiries
                            inquiryData={inquiryData}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MainDashboard;