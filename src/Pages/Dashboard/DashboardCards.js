import React from 'react'

const DashboardCards = ({ data }) => {

    const dashboardCards = [
        {
            title: "Total Orders",
            icon: "ri-shopping-bag-3-line",
            arrowIcon: "ri-arrow-up-circle-line",
            arrowColor: "text-success",
            iconColor: "text-primary",
            value: data?.total_orders,
            prefix: "",
            suffix: "",
        },
        {
            title: "Pending Orders",
            icon: "ri-time-line",
            arrowIcon: "ri-error-warning-line",
            arrowColor: "text-warning",
            iconColor: "text-warning",
            value: data?.total_pending_orders,
            prefix: "",
            suffix: "",
        },
        {
            title: "Active Businesses",
            icon: "ri-building-4-line",
            arrowIcon: "ri-arrow-up-circle-line",
            arrowColor: "text-success",
            iconColor: "text-success",
            value: data?.total_active_business,
            prefix: "",
            suffix: "",
        },
        {
            title: "Inactive Businesses",
            icon: "ri-building-line",
            arrowIcon: "ri-arrow-down-circle-line",
            arrowColor: "text-danger",
            iconColor: "text-danger",
            value: data?.total_inactive_business,
            prefix: "",
            suffix: "",
        },
        {
            title: "Pending Targets",
            icon: "ri-focus-3-line",
            arrowIcon: "ri-error-warning-line",
            arrowColor: "text-warning",
            iconColor: "text-warning",
            value: data?.total_pending_targets,
            prefix: "",
            suffix: "",
        },
        {
            title: "Total Targets",
            icon: "mdi mdi-bullseye-arrow",
            arrowIcon: "ri-arrow-up-circle-line",
            arrowColor: "text-success",
            iconColor: "text-primary",
            value: data?.total_targets,
            prefix: "",
            suffix: "",
        },
    ];

    return (
        <>
            <div className="col-md-12">
                <div className="card crm-widget shadow">
                    <div className="card-body p-0">
                        <div className="row row-cols-xxl-6 row-cols-md-3 row-cols-1 g-0">
                            {dashboardCards.map((card, index) => (
                                <div className="col" key={index}>
                                    <div className={`py-4 px-3 ${index > 0 ? "mt-3 mt-md-0" : ""}`}>
                                        <h5 className="text-muted text-uppercase fs-13 mb-3">
                                            {card.title}
                                            <i className={`${card.arrowIcon} ${card.arrowColor} fs-18 float-end align-middle`} />
                                        </h5>
                                        <div className="d-flex align-items-center">
                                            <div className="flex-shrink-0">
                                                <i className={`${card.icon} fs-3 ${card.iconColor}`} />
                                            </div>
                                            <div className="flex-grow-1 ms-3">
                                                <h4 className="mb-0">
                                                    {card.prefix}
                                                    <span className="counter-value" data-target={card.value}>
                                                        {card.value ?? 0}
                                                    </span>
                                                    {card.suffix}
                                                </h4>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default DashboardCards
