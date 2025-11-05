import React, { useContext, useEffect, useState } from 'react';
import { ConfigContext } from '../../../Context/ConfigContext';
import axios from 'axios';
import CountUp from 'react-countup';
import { Link } from 'react-router-dom';
import PendingAmount from './PendingAmount';

const MainDashboard = () => {

    const { apiHeaderJson, apiURL } = useContext(ConfigContext);
    const headers = apiHeaderJson;

    const [info, setInfo] = useState({});

    const GetTeamLeaderDashboardStates = async () => {
        try {
            const response = await axios.get(`${apiURL}Dashboard/GetTeamLeaderDashboardStates`, { headers });

            if (response?.data?.success) {
                setInfo(response?.data?.data);
            } else {
                console.log("Dashboard error : ")
            }

        } catch (error) {
            console.log("error", error)
        }
    }

    useEffect(() => {
        GetTeamLeaderDashboardStates();
    }, []);

    const cardItems = [
        {
            title: "Total Salesman",
            key: "total_salesman",
            color: "text-success",
            avatar_color_subtle: "bg-success",
            icon_color: "green"
        },
        {
            title: "Salesman Targets",
            key: "total_salesman_targets",
            color: "text-info",
            avatar_color_subtle: "bg-info",
            icon_color: "blue"
        },
        {
            title: "Assigned Business",
            key: "total_assigned_business",
            color: "text-warning",
            avatar_color_subtle: "bg-warning",
            icon_color: "yellow"
        },
        {
            title: "Total Orders",
            key: "total_orders",
            color: "text-primary",
            avatar_color_subtle: "bg-primary",
            icon_color: "blue"
        },
        {
            title: "In Processing Orders",
            key: "in_processing_orders",
            color: "text-secondary",
            avatar_color_subtle: "bg-secondary",
            icon_color: "red"
        },
        {
            title: "Pending Orders",
            key: "total_pending_orders",
            color: "text-danger",
            avatar_color_subtle: "bg-danger",
            icon_color: "red"
        }
    ];

    return (
        <div className="main-content">
            <div className="page-content">
                <div className="container-fluid">

                    <PendingAmount pending_amount={info?.pending_amount} />

                    <div className="row">
                        {cardItems?.map((item, index) => (
                            <div className="col-md-4" key={index}>
                                <div className="card shadow-sm border-0 position-relative overflow-hidden">
                                    <div className="card-body">

                                        <h6 className="text-uppercase text-muted small mb-3">{item.title}</h6>

                                        <h3 className={`fw-bold ${item.color} mb-2`}>
                                            <CountUp end={info?.[item.key] ?? 0} duration={1.5} />
                                        </h3>

                                        <div className="d-flex justify-content-between align-items-center">
                                            <Link to="/" className="small fw-semibold text-decoration-underline">View Report</Link>

                                            <div className="avatar-sm flex-shrink-0">
                                                <span className={`avatar-title ${item?.avatar_color_subtle}-subtle rounded fs-3`}>

                                                    <svg height={30} width={30} fill={item?.icon_color}
                                                        viewBox="0 0 55 80"
                                                        xmlns="http://www.w3.org/2000/svg">
                                                        <g transform="matrix(1 0 0 -1 0 80)">
                                                            <rect width={10} height={20} rx={3}>
                                                                <animate attributeName="height" begin="0s" dur="4.3s"
                                                                    values="20;45;57;80;64;32;66;45;64;23;66;13;64;56;34;34;2;23;76;79;20"
                                                                    repeatCount="indefinite" />
                                                            </rect>
                                                            <rect x={15} width={10} height={80} rx={3}>
                                                                <animate attributeName="height" begin="0s" dur="2s"
                                                                    values="80;55;33;5;75;23;73;33;12;14;60;80"
                                                                    repeatCount="indefinite" />
                                                            </rect>
                                                            <rect x={30} width={10} height={50} rx={3}>
                                                                <animate attributeName="height" begin="0s" dur="1.4s"
                                                                    values="50;34;78;23;56;23;34;76;80;54;21;50"
                                                                    repeatCount="indefinite" />
                                                            </rect>
                                                            <rect x={45} width={10} height={30} rx={3}>
                                                                <animate attributeName="height" begin="0s" dur="2s"
                                                                    values="30;45;13;80;56;72;45;76;34;23;67;30"
                                                                    repeatCount="indefinite" />
                                                            </rect>
                                                        </g>
                                                    </svg>

                                                </span>
                                            </div>
                                        </div>

                                    </div>

                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </div>
    );
}

export default MainDashboard;
