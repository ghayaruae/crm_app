import { useContext, useEffect, useState } from "react";
import ReactECharts from "echarts-for-react";
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

    const noData =
        !getTargetAmount ||
        (
            parseFloat(getTargetAmount?.total_achievement_amount || 0) === 0 &&
            parseFloat(getTargetAmount?.total_pending_amount || 0) === 0 &&
            parseFloat(getTargetAmount?.above_achievement_amount || 0) === 0
        );

    const option = {
        tooltip: {
            trigger: "item",
            backgroundColor: "#fff",
            borderColor: "#ddd",
            borderWidth: 1,
            textStyle: { color: "#333" },
            formatter: "{b}: {c} ({d}%)"
        },
        legend: {
            bottom: 0,
            left: "center",
            textStyle: { color: "#666", fontSize: 12 }
        },
        series: [
            {
                name: "Business Status",
                type: "pie",
                radius: ["40%", "70%"],
                avoidLabelOverlap: false,
                label: { show: false },
                emphasis: {
                    label: {
                        show: true,
                        fontSize: 14,
                        fontWeight: "bold",
                        color: "#333"
                    }
                },
                labelLine: { show: false },
                data: [
                    {
                        value: parseFloat(getTargetAmount?.total_achievement_amount || 0).toFixed(2),
                        name: "Achievement Amount",
                        itemStyle: { color: "#2b7a78" }
                    },
                    {
                        value: parseFloat(getTargetAmount?.total_pending_amount || 0).toFixed(2),
                        name: "Pending Amount",
                        itemStyle: { color: "#d9534f" }
                    },
                    {
                        value: parseFloat(getTargetAmount?.above_achievement_amount || 0).toFixed(2),
                        name: "Above Achievement",
                        itemStyle: { color: "#34568B" }
                    }
                ]
            }
        ]
    };

    return (
        <div className="col-lg-5 col-md-12">
            <div className="card shadow border-0 rounded h-100">

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
                    className="card-body d-flex flex-column justify-content-evenly p-0"
                    style={{ position: "relative" }}
                >

                    {/* Loader */}
                    {loading && (
                        <div
                            className="d-flex justify-content-center align-items-center"
                            style={{ height: "250px" }}
                        >
                            <div className="spinner-border text-primary"></div>
                        </div>
                    )}

                    {/* No Data */}
                    {!loading && noData && !getTargetAmount?.target_expired && (
                        <div
                            style={{
                                height: "250px",
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

                    {/* Chart */}
                    {!loading && !noData && (
                        <ReactECharts
                            option={option}
                            style={{
                                width: "100%",
                                height: "350px",
                                opacity: getTargetAmount?.target_expired ? 0.4 : 1
                            }}
                            opts={{ renderer: "svg" }}
                        />
                    )}

                    {/* Expired Overlay */}
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
                                padding: "20px"
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
