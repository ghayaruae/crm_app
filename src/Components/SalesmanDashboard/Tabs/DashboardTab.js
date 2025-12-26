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
                        <div className="col-md-12">
                            <div className="card border-0 shadow-sm">
                                <div className="card-body">

                                    {/* Header */}
                                    <div className="d-flex align-items-center justify-content-between mb-4">
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
                                    <div className="row g-3">

                                        {/* Total Orders */}
                                        <div className="col-md-6 col-sm-6">
                                            <div className="p-3 rounded bg-primary-subtle h-100">
                                                <div className="d-flex align-items-center">
                                                    <div className="me-3">
                                                        <div className="avatar-sm">
                                                            <span className="avatar-title rounded-circle bg-primary text-white">
                                                                <i className="ri-shopping-bag-line fs-5"></i>
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <h5 className="mb-0 fw-bold">
                                                            {sales_data?.total_orders ?? 0}
                                                        </h5>
                                                        <small className="text-muted">
                                                            Total Orders
                                                        </small>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Total Sales */}
                                        <div className="col-md-6 col-sm-6">
                                            <div className="p-3 rounded bg-success-subtle h-100">
                                                <div className="d-flex align-items-center">
                                                    <div className="me-3">
                                                        <div className="avatar-sm">
                                                            <span className="avatar-title rounded-circle bg-success text-white">
                                                                <i className="ri-money-dollar-circle-line fs-5"></i>
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <h5 className="mb-0 fw-bold">
                                                            AED {Number(sales_data?.total_sales || 0).toLocaleString("en-AE")}
                                                        </h5>
                                                        <small className="text-muted">
                                                            Total Sales
                                                        </small>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row g-4">
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
