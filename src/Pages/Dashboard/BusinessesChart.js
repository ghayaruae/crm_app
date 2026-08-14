import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { ConfigContext } from "../../Context/ConfigContext";
import { DateFormater } from "../../Components/GlobalFunctions";

const BusinessesChart = () => {
    const { apiHeaderJson, apiURL } = useContext(ConfigContext);

    const [getTargetAmount, setGetTargetAmount] = useState(null);
    const [loading, setLoading] = useState(true);

    const GetSalesmanTargetChartData = async () => {
        try {
            setLoading(true);
            const headers = apiHeaderJson;

            const response = await axios.get(
                `${apiURL}Dashboard/GetSalesmanTargetChartData`,
                { headers }
            );

            if (response?.data?.success) {
                setGetTargetAmount(response?.data?.data);
            } else {
                setGetTargetAmount(null);
            }
        } catch (error) {
            console.log(error);
            setGetTargetAmount(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        GetSalesmanTargetChartData();
    }, []);

    // Calculate values based on actual API response structure
    const targetAmount = parseFloat(getTargetAmount?.total_target_amount || 0);
    const achievementAmount = parseFloat(getTargetAmount?.total_achievement_amount || 0);
    const pendingAmount = parseFloat(getTargetAmount?.total_pending_amount || 0);
    const aboveAchievement = parseFloat(getTargetAmount?.above_achievement_amount || 0);

    // Calculate achievement percentage
    const achievementPercentage = targetAmount > 0
        ? (achievementAmount / targetAmount) * 100
        : 0;

    const isAboveTarget = achievementAmount > targetAmount;
    const extraPercentage = targetAmount > 0
        ? ((achievementAmount - targetAmount) / targetAmount) * 100
        : 0;

    // Check if there's any data
    const noData =
        !getTargetAmount ||
        (achievementAmount === 0 && pendingAmount === 0 && aboveAchievement === 0);

    // Format currency with ₹ and thousand separators
    const formatCurrency = (amount) => {
        if (!amount && amount !== 0) return '0 AED';
        return `${amount.toFixed(2)} AED`;
    };

    // Get progress bar color based on percentage
    const getProgressColor = (percentage) => {
        if (percentage >= 100) return 'success';
        if (percentage >= 70) return 'info';
        if (percentage >= 40) return 'warning';
        return 'danger';
    };

    return (
        <div className="col-lg-5 col-md-12">
            <div className="card shadow border-0 rounded">

                {/* Header */}
                <div className="card-header d-flex justify-content-between align-items-center">
                    <h5 className="m-0">Achievement Target Overview</h5>

                    {getTargetAmount?.target_from && getTargetAmount?.target_to && (
                        <small className="text-muted fw-semibold">
                            {DateFormater(getTargetAmount.target_from)} → {DateFormater(getTargetAmount.target_to)}
                        </small>
                    )}
                </div>

                {/* Body */}
                <div
                    className="card-body d-flex flex-column justify-content-end p-4"
                    style={{ position: "relative", minHeight: "445px" }}
                >

                    {/* Loader */}
                    {loading && (
                        <div
                            className="d-flex justify-content-center align-items-center"
                            style={{ height: "400px" }}
                        >
                            <div className="spinner-border text-primary"></div>
                        </div>
                    )}

                    {/* No Data */}
                    {!loading && noData && !getTargetAmount?.target_expired && (
                        <div
                            style={{
                                height: "400px",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                alignItems: "center",
                                color: "#999",
                                textAlign: "center"
                            }}
                        >
                            <img
                                src="https://cdn-icons-png.flaticon.com/512/7465/7465709.png"
                                width="85"
                                style={{ opacity: 0.6, marginBottom: "10px" }}
                                alt="No data"
                            />
                            <p className="fw-semibold mb-0">No target data available</p>
                            <small>Please assign target to view progress</small>
                        </div>
                    )}

                    {/* Main Content */}
                    {!loading && !noData && (
                        <div style={{ opacity: getTargetAmount?.target_expired ? 0.4 : 1 }}>

                            {/* Achievement Percentage Display */}
                            <div className="text-center mb-4">
                                <div
                                    className="display-1 fw-bold"
                                    style={{
                                        fontSize: "4rem",
                                        lineHeight: 1,
                                        color: achievementPercentage >= 100 ? "#28a745" : "#007bff"
                                    }}
                                >
                                    {achievementPercentage.toFixed(1)}%
                                </div>
                                <small className="text-muted">Achievement Rate</small>

                                {isAboveTarget && (
                                    <span className="badge bg-success ms-2" style={{ fontSize: "0.9rem" }}>
                                        +{extraPercentage.toFixed(1)}% Above Target
                                    </span>
                                )}
                            </div>

                            {/* Progress Bar */}
                            <div className="mb-4">
                                <div className="d-flex justify-content-between mb-1">
                                    <small className="text-muted">Progress</small>
                                    <small className="text-muted">
                                        {formatCurrency(achievementAmount)} / {formatCurrency(targetAmount)}
                                    </small>
                                </div>
                                <div className="progress" style={{ height: "15px" }}>
                                    <div
                                        className={`progress-bar bg-${getProgressColor(achievementPercentage)}`}
                                        role="progressbar"
                                        style={{
                                            width: `${Math.min(achievementPercentage, 100)}%`,
                                            transition: "width 0.6s ease"
                                        }}
                                        aria-valuenow={achievementPercentage}
                                        aria-valuemin="0"
                                        aria-valuemax="100"
                                    >
                                        {achievementPercentage >= 100 && "✓"}
                                    </div>
                                </div>
                            </div>

                            {/* Stats Cards */}
                            <div className="row">
                                <div className="col-6 col-md-6">
                                    <div className="card bg-dark-subtle border-dark">
                                        <div className="card-body p-3 text-center">
                                            <small className="text-muted d-block">Target</small>
                                            <strong className="text-primary">
                                                {formatCurrency(targetAmount)}
                                            </strong>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-6 col-md-6">
                                    <div className="card bg-dark-subtle border-dark">
                                        <div className="card-body p-3 text-center">
                                            <small className="text-muted d-block">Achieved</small>
                                            <strong className="text-success">
                                                {formatCurrency(achievementAmount)}
                                            </strong>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-6 col-md-6">
                                    <div className="card bg-dark-subtle border-dark">
                                        <div className="card-body p-3 text-center">
                                            <small className="text-muted d-block">Pending</small>
                                            <strong className="text-danger">
                                                {formatCurrency(pendingAmount)}
                                            </strong>
                                        </div>
                                    </div>
                                </div>
                                {isAboveTarget && aboveAchievement > 0 && (
                                    <div className="col-6 col-md-6">
                                        <div className="card bg-dark-subtle border-dark">
                                            <div className="card-body p-3 text-center">
                                                <small className="text-muted d-block">Extra</small>
                                                <strong className="text-warning">
                                                    {formatCurrency(aboveAchievement)}
                                                </strong>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {!isAboveTarget && (
                                    <div className="col-6 col-md-6">
                                        <div className="card bg-dark-subtle border-dark">
                                            <div className="card-body p-3 text-center">
                                                <small className="text-muted d-block">Shortfall</small>
                                                <strong className="text-secondary">
                                                    {formatCurrency(Math.max(0, targetAmount - achievementAmount))}
                                                </strong>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Target Expired Overlay */}
                    {!loading && getTargetAmount?.target_expired && (
                        <div
                            style={{
                                position: "absolute",
                                inset: 0,
                                background: "rgba(255,255,255,0.85)",
                                backdropFilter: "blur(2px)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                zIndex: 10,
                                textAlign: "center",
                                padding: "20px",
                                borderRadius: "8px"
                            }}
                        >
                            <div>
                                <div
                                    style={{
                                        width: 64,
                                        height: 64,
                                        borderRadius: "50%",
                                        background: "#f8d7da",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        margin: "0 auto 12px",
                                        color: "#842029",
                                        fontSize: 28,
                                        fontWeight: 700
                                    }}
                                >
                                    !
                                </div>

                                <h6 style={{ color: "#842029", marginBottom: 6 }}>
                                    Target Expired
                                </h6>

                                <p style={{ fontSize: 13, color: "#555", margin: 0 }}>
                                    Current target has expired.<br />
                                    Set a new target to view statistics.
                                </p>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default BusinessesChart;