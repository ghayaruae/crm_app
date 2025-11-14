import React, { useContext, useEffect, useState } from "react";
import { ConfigContext } from "../../../Context/ConfigContext";
import axios from "axios";
import CountUp from "react-countup";
import { Link } from "react-router-dom";
import PendingAmount from "./PendingAmount";
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
            title: "Salesman Targets",
            key: "total_salesman_targets",
            color: "text-info",
            bg: "bg-info-subtle",
            icon: "mdi mdi-bullseye-arrow",
            link: "/Reports/TargetReport"
        },
        {
            title: "Assigned Business",
            key: "total_assigned_business",
            color: "text-warning",
            bg: "bg-warning-subtle",
            icon: "ri-briefcase-line",
            link: "/Reports/AllBusinessesReport"
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
            title: "In Processing Orders",
            key: "in_processing_orders",
            color: "text-secondary",
            bg: "bg-secondary-subtle",
            icon: "mdi mdi-progress-wrench",
            link: "/Reports/OrderByStatusReport"
        },
        {
            title: "Pending Orders",
            key: "total_pending_orders",
            color: "text-danger",
            bg: "bg-danger-subtle",
            icon: "ri-time-line",
            link: "/Reports/OrderByStatusReport/0"
        },
    ];

    return (
        <div className="main-content">
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
                        {cardItems.map((item, index) => (
                            <div className="col-xl-4 col-md-6" key={index}>
                                <div className="card card-animate">
                                    <div className="card-body">
                                        <div className="d-flex align-items-center justify-content-between">
                                            <div>
                                                <p className="text-uppercase fw-medium text-muted mb-2">
                                                    {item.title}
                                                </p>
                                                <h4 className={`mb-0 fw-semibold ${item.color}`}>
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
                        ))}
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
