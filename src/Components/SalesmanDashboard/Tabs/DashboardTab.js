import { DateFormater } from '../../GlobalFunctions';
import SalesChart from '../../../Pages/Dashboard/SalesChart';
import BusinessesChart from '../../../Pages/Dashboard/BusinessesChart';
import NoRecentOrders from '../../../Pages/Dashboard/NoRecendsOrders';
import { Link } from 'react-router-dom';

const DashboardTab = ({ data, salesman_data, sales_data }) => {

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
            title: "Inactive Accounts",
            icon: "ri-building-line",
            arrowIcon: "ri-arrow-down-circle-line",
            arrowColor: "text-danger",
            iconColor: "text-danger",
            value: data?.total_inactive_business,
            link: "/Salesman/AllBusinesses/0"
        },
        {
            title: "Total Assign Accounts",
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
            target: salesman_data?.target_amount,
            from: salesman_data?.target_from,
            to: salesman_data?.target_to,
        });
    }

    console.log(sales_data)

    const dailyCards = [
        {
            title: "Total Orders",
            value: sales_data?.total_orders || 0,
            subValue: `${Number(sales_data?.total_amount || 0)?.toFixed(2)} AED`,
            icon: "ri-shopping-bag-line",
            bg: "bg-primary-subtle",
            iconBg: "bg-primary",
            text: "text-primary"
        },
        {
            title: "Pending",
            value: sales_data?.pending_count || 0,
            subValue: `${Number(sales_data?.pending_amount || 0)?.toFixed(2)} AED`,
            icon: "ri-time-line",
            bg: "bg-warning-subtle",
            iconBg: "bg-warning",
            text: "text-warning"
        },
        {
            title: "In Progress",
            value: sales_data?.in_progress_count || 0,
            subValue: `${Number(sales_data?.in_progress_amount || 0)?.toFixed(2)} AED`,
            icon: "ri-loader-4-line",
            bg: "bg-info-subtle",
            iconBg: "bg-info",
            text: "text-info"
        },
        {
            title: "Delivered",
            value: sales_data?.delivered_count || 0,
            subValue: `${Number(sales_data?.delivered_amount || 0)?.toFixed(2)} AED`,
            icon: "ri-checkbox-circle-line",
            bg: "bg-success-subtle",
            iconBg: "bg-success",
            text: "text-success"
        },
        {
            title: "Returned",
            value: sales_data?.returned_count || 0,
            subValue: `${Number(sales_data?.returned_amount || 0)?.toFixed(2)} AED`,
            icon: "ri-arrow-go-back-line",
            bg: "bg-secondary-subtle",
            iconBg: "bg-secondary",
            text: "text-secondary"
        },
        {
            title: "Cancelled",
            value: sales_data?.cancelled_count || 0,
            subValue: `${Number(sales_data?.cancelled_amount || 0)?.toFixed(2)} AED`,
            icon: "ri-close-circle-line",
            bg: "bg-danger-subtle",
            iconBg: "bg-danger",
            text: "text-danger"
        }
    ];

    return (
        <>
            <div className='tab-pane fade show active'>
                <div className="container-fluid px-2 px-md-3">
                    <div className="row g-3 g-md-4">
                        {dashboardCards.map((card, index) => (
                            <div className="col-12 col-sm-6 col-md-6 col-lg-3" key={index}>
                                <div className="card border-0 shadow-sm">
                                    <div className="card-body">
                                        <h6 className="text-muted text-uppercase fs-13 mb-3 d-flex justify-content-between align-items-center">
                                            {card.title}
                                            <i className={`${card.arrowIcon} ${card.arrowColor} fs-18`} />
                                        </h6>

                                        {card.name ? (
                                            <div>
                                                <div className="small mb-1">Target Amount: {card.target} AED</div>
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
                        <div className="col-lg-7 col-md-12 col-sm-12">
                            <div className="card border-0 shadow-sm">
                                <div className="card-body pb-2">

                                    {/* Header */}
                                    <div className="d-flex align-items-center justify-content-between mb-3">
                                        <div>
                                            <h6 className="mb-1 fw-semibold text-dark">
                                                Daily Sales Summary
                                            </h6>
                                            <small className="text-muted">
                                                Salesman performance overview
                                            </small>
                                        </div>

                                        <span className="badge bg-light text-dark border">
                                            {sales_data?.sale_date}
                                        </span>
                                    </div>

                                    {/* Stats */}
                                    <div className="row">
                                        {dailyCards.map((card, index) => (
                                            <div className="col-xl-6 col-lg-4 col-md-4 col-sm-6" key={index}>
                                                <div className={`card border-0 shadow-sm ${card.bg}`}>
                                                    <div className="card-body">

                                                        <div className="d-flex justify-content-between align-items-start">

                                                            <div>

                                                                <small className="text-muted fw-semibold text-uppercase">
                                                                    {card.title}
                                                                </small>

                                                                <h3 className={`fw-bold mb-1 mt-2 ${card.text}`}>
                                                                    {card.value}
                                                                </h3>

                                                                <small className="fw-semibold text-dark">
                                                                    Amount: {card.subValue}
                                                                </small>

                                                            </div>

                                                            <div
                                                                className={`${card.iconBg} rounded-circle text-white d-flex align-items-center justify-content-center`}
                                                                style={{
                                                                    width: 46,
                                                                    height: 46
                                                                }}
                                                            >
                                                                <i className={`${card.icon} fs-5`}></i>
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
                        <BusinessesChart />
                    </div>

                    <div className="row g-4">
                        <SalesChart />
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
