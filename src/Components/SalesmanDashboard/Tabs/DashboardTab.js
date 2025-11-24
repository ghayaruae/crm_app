import React, { useContext, useEffect, useState } from 'react'
import DashboardCards from '../../../Pages/Dashboard/DashboardCards'
import { DateFormater } from '../../GlobalFunctions';
import SalesChart from '../../../Pages/Dashboard/SalesChart';
import BusinessesChart from '../../../Pages/Dashboard/BusinessesChart';
import { ConfigContext } from '../../../Context/ConfigContext';
import axios from 'axios';
import NoRecentOrders from '../../../Pages/Dashboard/NoRecendsOrders';
import { Link } from 'react-router-dom';

const DashboardTab = ({ data, salesman_data }) => {

    const dashboardCards = [
        {
            title: "Pending Orders",
            icon: "ri-time-line",
            arrowIcon: "ri-error-warning-line",
            arrowColor: "text-warning",
            iconColor: "text-warning",
            value: data?.total_pending_orders,
            link: "/Reports/SalesmanOrders/0"
        },
        {
            title: "Inactive Businesses",
            icon: "ri-building-line",
            arrowIcon: "ri-arrow-down-circle-line",
            arrowColor: "text-danger",
            iconColor: "text-danger",
            value: data?.total_inactive_business,
            link: "/Salesman/AllBusinesses/0"
        },
        {
            title: "Total Assign Business",
            icon: "ri-check-line",
            arrowIcon: "ri-arrow-up-circle-line",
            arrowColor: "text-success",
            iconColor: "text-primary",
            value: data?.total_assign_business,
            link: "/Salesman/AllBusinesses"
        },
    ];


    if (salesman_data) {
        dashboardCards.push({
            title: "Salesman Target",
            icon: "ri-user-star-line",
            arrowIcon: "ri-information-line",
            arrowColor: "text-primary",
            iconColor: "text-primary",
            name: salesman_data?.business_salesmen_name,
            target: salesman_data?.business_salesman_target,
            from: salesman_data?.business_salesman_target_from,
            to: salesman_data?.business_salesman_target_to,
        });
    }

    return (
        <>
            <div className='tab-pane fade show active'>
                <div className="container-fluid px-2 px-md-3">
                    <div className="row g-3 g-md-4">
                        {dashboardCards.map((card, index) => (
                            <div className="col-12 col-sm-6 col-md-4 col-lg-3" key={index}>
                                <div className="card border-0 shadow-sm">
                                    <div className="card-body">
                                        <h6 className="text-muted text-uppercase fs-13 mb-3 d-flex justify-content-between align-items-center">
                                            {card.title}
                                            <i className={`${card.arrowIcon} ${card.arrowColor} fs-18`} />
                                        </h6>

                                        {card.name ? (
                                            <div>
                                                <div className="small mb-1">Target Amount: AED {card.target}</div>
                                                <div className="small text-muted">
                                                    Target Date: {DateFormater(card.from)} → {DateFormater(card.to)}
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="d-flex align-items-center justify-content-between">
                                                <div className="d-flex align-items-center mt-1">
                                                    <div className="flex-shrink-0">
                                                        <i className={`${card.icon} fs-3 ${card.iconColor}`} />
                                                    </div>

                                                    <div className="flex-grow-1 ms-3">
                                                        <h4 className="mb-0 fw-semibold">
                                                            {card.value ?? 0}
                                                        </h4>
                                                    </div>
                                                </div>
                                                {card.link && (
                                                    <Link
                                                        to={card.link}
                                                        className="text-decoration-underline text-muted small fw-semibold ms-3 mt-auto"
                                                    >
                                                        View Report
                                                    </Link>
                                                )}

                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="row">
                        <SalesChart />
                        <BusinessesChart />
                    </div>

                    <div className="row mt-4">
                        <div className="col-12">
                            <NoRecentOrders />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default DashboardTab
