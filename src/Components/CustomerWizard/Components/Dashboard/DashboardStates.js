import React from 'react'
import CountUp from 'react-countup'

const DashboardStates = ({ dashboardData, loading }) => {
    return (
        <>
            {/* Total Orders */}
            <div className="col-md-3">
                <div className="card card-animate">
                    <div className="card-body">
                        <div className="d-flex align-items-center">
                            <div className="avatar-sm flex-shrink-0">
                                <span className="avatar-title bg-primary-subtle text-primary rounded-2 fs-2">
                                    <i className="ri-shopping-bag-3-line text-primary" />
                                </span>
                            </div>
                            <div className="flex-grow-1 overflow-hidden ms-3">
                                <p className="text-uppercase fw-medium text-muted text-truncate mb-3">
                                    Total Orders
                                </p>
                                <div className="d-flex align-items-center mb-3">
                                    <h4 className="flex-grow-1 mb-0">
                                        <span>
                                            <CountUp
                                                end={dashboardData?.total_orders || 0}
                                                duration={2}
                                            />
                                        </span>
                                    </h4>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Delivered Orders */}
            <div className="col-md-3">
                <div className="card card-animate">
                    <div className="card-body">
                        <div className="d-flex align-items-center">
                            <div className="avatar-sm flex-shrink-0">
                                <span className="avatar-title bg-success-subtle text-success rounded-2 fs-2">
                                    <i className="ri-check-double-line text-success" />
                                </span>
                            </div>
                            <div className="flex-grow-1 overflow-hidden ms-3">
                                <p className="text-uppercase fw-medium text-muted text-truncate mb-3">
                                    Delivered Orders
                                </p>
                                <div className="d-flex align-items-center mb-3">
                                    <h4 className="flex-grow-1 mb-0">
                                        <span>
                                            <CountUp
                                                end={dashboardData?.total_delivered_orders}
                                                duration={2}
                                            />
                                        </span>
                                    </h4>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Pending Orders */}
            <div className="col-md-3">
                <div className="card card-animate">
                    <div className="card-body">
                        <div className="d-flex align-items-center">
                            <div className="avatar-sm flex-shrink-0">
                                <span className="avatar-title bg-warning-subtle text-warning rounded-2 fs-2">
                                    <i className="ri-time-line text-warning" />
                                </span>
                            </div>
                            <div className="flex-grow-1 overflow-hidden ms-3">
                                <p className="text-uppercase fw-medium text-muted text-truncate mb-3">
                                    Pending Orders
                                </p>
                                <div className="d-flex align-items-center mb-3">
                                    <h4 className="flex-grow-1 mb-0">
                                        <span>
                                            <CountUp
                                                end={dashboardData?.total_pending_orders}
                                                duration={2}
                                            />
                                        </span>
                                    </h4>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Cancelled Orders */}
            <div className="col-md-3">
                <div className="card card-animate">
                    <div className="card-body">
                        <div className="d-flex align-items-center">
                            <div className="avatar-sm flex-shrink-0">
                                <span className="avatar-title bg-danger-subtle text-danger rounded-2 fs-2">
                                    <i className="ri-close-circle-line text-danger" />
                                </span>
                            </div>
                            <div className="flex-grow-1 overflow-hidden ms-3">
                                <p className="text-uppercase fw-medium text-muted text-truncate mb-3">
                                    Cancelled Orders
                                </p>
                                <div className="d-flex align-items-center mb-3">
                                    <h4 className="flex-grow-1 mb-0">
                                        <span>
                                            <CountUp
                                                end={dashboardData?.total_cancelled_orders}
                                                duration={2}
                                            />
                                        </span>
                                    </h4>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Total Credit */}
            <div className="col-md-3">
                <div className="card card-animate">
                    <div className="card-body">
                        <div className="d-flex align-items-center">
                            <div className="avatar-sm flex-shrink-0">
                                <span className="avatar-title bg-warning-subtle text-warning rounded-2 fs-2">
                                    <i className="ri-wallet-3-line text-warning" />
                                </span>
                            </div>
                            <div className="flex-grow-1 overflow-hidden ms-3">
                                <p className="text-uppercase fw-medium text-muted text-truncate mb-3">
                                    Total Credit Amount
                                </p>
                                <div className="d-flex align-items-center mb-3">
                                    <h4 className="flex-grow-1 mb-0">
                                        <span>
                                            <CountUp
                                                end={dashboardData?.total_credit_limit || 0}
                                                duration={2}
                                            />
                                        </span>
                                    </h4>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* used Credit Amount */}
            <div className="col-md-3">
                <div className="card card-animate">
                    <div className="card-body">
                        <div className="d-flex align-items-center">
                            <div className="avatar-sm flex-shrink-0">
                                <span className="avatar-title bg-success-subtle text-success rounded-2 fs-2">
                                    <i className="ri-bank-card-line text-success" />
                                </span>
                            </div>
                            <div className="flex-grow-1 overflow-hidden ms-3">
                                <p className="text-uppercase fw-medium text-muted text-truncate mb-3">
                                    Used Credit Amount
                                </p>
                                <div className="d-flex align-items-center mb-3">
                                    <h4 className="flex-grow-1 mb-0">
                                        <span>
                                            <CountUp
                                                end={dashboardData?.total_used_credit_amount}
                                                duration={2}
                                            />
                                        </span>
                                    </h4>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Total remainig credit amount */}
            <div className="col-md-3">
                <div className="card card-animate">
                    <div className="card-body">
                        <div className="d-flex align-items-center">
                            <div className="avatar-sm flex-shrink-0">
                                <span className="avatar-title bg-warning-subtle text-warning rounded-2 fs-2">
                                    <i className="ri-gift-line text-warning" />
                                </span>
                            </div>
                            <div className="flex-grow-1 overflow-hidden ms-3">
                                <p className="text-uppercase fw-medium text-muted text-truncate mb-3">
                                    Total Remainind credit
                                </p>
                                <div className="d-flex align-items-center mb-3">
                                    <h4 className="flex-grow-1 mb-0">
                                        <span>
                                            <CountUp
                                                end={dashboardData?.total_remaining_credit}
                                                duration={2}
                                            />
                                        </span>
                                    </h4>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Accept Redeem Request */}
            <div className="col-md-3">
                <div className="card card-animate">
                    <div className="card-body">
                        <div className="d-flex align-items-center">
                            <div className="avatar-sm flex-shrink-0">
                                <span className="avatar-title bg-primary-subtle text-primary rounded-2 fs-2">
                                    <i className="ri-hand-coin-line text-primary" />
                                </span>
                            </div>
                            <div className="flex-grow-1 overflow-hidden ms-3">
                                <p className="text-uppercase fw-medium text-muted text-truncate mb-3">
                                    Rewards Points
                                </p>
                                <div className="d-flex align-items-center mb-3">
                                    <h4 className="flex-grow-1 mb-0">
                                        <span>
                                            <CountUp
                                                end={dashboardData?.total_reward_points}
                                                duration={2}
                                            />
                                        </span>
                                    </h4>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default DashboardStates
