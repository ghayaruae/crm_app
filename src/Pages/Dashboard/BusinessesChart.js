import { useContext, useEffect, useState } from "react";
import ReactECharts from "echarts-for-react";
import axios from "axios";
import { ConfigContext } from "../../Context/ConfigContext";

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
        (parseFloat(getTargetAmount?.total_achievement_amount || 0) === 0 &&
            parseFloat(getTargetAmount?.total_pending_amount || 0) === 0 &&
            parseFloat(getTargetAmount?.above_achievement_amount || 0) === 0);

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
                        value: parseFloat(getTargetAmount?.total_achievement_amount)?.toFixed(2),
                        name: "Achievement Amount",
                        itemStyle: { color: "#2b7a78" }
                    },
                    {
                        value: parseFloat(getTargetAmount?.total_pending_amount)?.toFixed(2),
                        name: "Pending Amount",
                        itemStyle: { color: "#d9534f" }
                    },
                    {
                        value: parseFloat(getTargetAmount?.above_achievement_amount)?.toFixed(2),
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

                <div className="card-header d-flex justify-content-between align-items-center">
                    <h5 className="m-0">Achievement Target Overview</h5>

                    {getTargetAmount?.target_from && getTargetAmount?.target_to && (
                        <small className="text-muted fw-semibold">
                            {getTargetAmount.target_from} → {getTargetAmount.target_to}
                        </small>
                    )}
                </div>

                <div className="card-body d-flex flex-column justify-content-evenly p-0">

                    {loading && (
                        <div className="d-flex justify-content-center align-items-center" style={{ height: "250px" }}>
                            <div className="spinner-border text-primary"></div>
                        </div>
                    )}

                    {!loading && noData && (
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

                    {!loading && !noData && (
                        <ReactECharts
                            option={option}
                            style={{ width: "100%", height: "350px" }}
                            opts={{ renderer: "svg" }}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default BusinessesChart;
