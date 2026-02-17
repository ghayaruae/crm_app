import { DateFormater } from '../../Components/GlobalFunctions';

const DashboardCards = ({ data, salesman_data }) => {

    const dashboardCards = [
        {
            title: "Pending Orders",
            icon: "ri-time-line",
            arrowIcon: "ri-error-warning-line",
            arrowColor: "text-warning",
            iconColor: "text-warning",
            value: data?.total_pending_orders,
        },
        {
            title: "Inactive Businesses",
            icon: "ri-building-line",
            arrowIcon: "ri-arrow-down-circle-line",
            arrowColor: "text-danger",
            iconColor: "text-danger",
            value: data?.total_inactive_business,
        },
        {
            title: "Total Assign Business",
            icon: "mdi mdi-bullseye-arrow",
            arrowIcon: "ri-arrow-up-circle-line",
            arrowColor: "text-success",
            iconColor: "text-primary",
            value: data?.total_assign_business,
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
        <div className="col-12">
            <div className="card crm-widget shadow border-0">
                <div className="card-body p-0">
                    <div className="row">
                        {dashboardCards.map((card, index) => (
                            <div className="col-md-3" key={index}>
                                <div className={`py-4 px-3 border-end ${index === dashboardCards.length - 1 ? 'border-0' : ''}`}>
                                    <h5 className="text-muted text-uppercase fs-13 mb-3">
                                        {card.title}
                                        <i className={`${card.arrowIcon} ${card.arrowColor} fs-18 float-end align-middle`} />
                                    </h5>

                                    {card.name ? (
                                        <div>
                                            <div className="text-dark fw-bold fs-5 mb-1">{card.name}</div>
                                            <div className="small">Target Amount : {card.target} AED</div>
                                            <div className="small text-muted">
                                                Target Date :  {DateFormater(card.from)} → {DateFormater(card.to)}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="d-flex align-items-center">
                                            <div className="flex-shrink-0">
                                                <i className={`${card.icon} fs-3 ${card.iconColor}`} />
                                            </div>
                                            <div className="flex-grow-1 ms-3">
                                                <h4 className="mb-0">
                                                    {card.value ?? 0}
                                                </h4>
                                            </div>
                                        </div>
                                    )}

                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DashboardCards;
