import React, { useEffect, useState, useContext, useRef } from "react";
import { ConfigContext } from "../../../../../Context/ConfigContext";
import axios from "axios";
import Select from "react-select";
import * as echarts from "echarts";

const YearWiseOrdersChart = ({ business_id }) => {
    const { apiURL, apiHeaderJson } = useContext(ConfigContext);
    const chartRef = useRef(null);

    const [chartData, setChartData] = useState([]);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

    const yearsOptions = Array.from({ length: 5 }, (_, i) => {
        const y = new Date().getFullYear() - i;
        return { value: y, label: y.toString() };
    });

    const fetchData = async () => {
        try {
            const response = await axios.get(
                `${apiURL}Dashboard/GetBusinessYearwiseOrders`,
                {
                    params: { business_id, year: selectedYear },
                    headers: apiHeaderJson,
                }
            );
            setChartData(response.data.data || []);
        } catch (error) {
            console.error("Error fetching year-wise orders:", error);
        }
    };

    useEffect(() => {
        if (business_id) fetchData();
    }, [business_id, selectedYear]);

    useEffect(() => {
        if (chartRef.current) {
            const chartInstance = echarts.init(chartRef.current);

            const monthsLabels = [
                "Jan", "Feb", "Mar", "Apr", "May", "Jun",
                "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
            ];

            const monthOrders = Array(12).fill(0);
            chartData.forEach(item => {
                monthOrders[item.month - 1] = item.total_orders;
            });

            const option = {
                title: {
                    text: `Orders Overview - ${selectedYear}`,
                    left: "center",
                    textStyle: {
                        fontSize: 16,
                        fontWeight: "600",
                        color: "#333"
                    }
                },
                tooltip: {
                    trigger: "axis",
                    axisPointer: { type: "shadow" },
                    backgroundColor: "rgba(0,0,0,0.75)",
                    textStyle: { color: "#fff" },
                    borderRadius: 6
                },
                grid: { left: "5%", right: "5%", bottom: "10%", containLabel: true },
                xAxis: {
                    type: "category",
                    data: monthsLabels,
                    axisLine: { lineStyle: { color: "#ccc" } },
                    axisTick: { show: false }
                },
                yAxis: {
                    type: "value",
                    min: 0,
                    splitLine: { lineStyle: { type: "dashed", color: "#ddd" } },
                    axisLine: { show: false },
                    axisTick: { show: false }
                },
                series: [
                    {
                        name: "Orders",
                        type: "bar",
                        data: monthOrders,
                        barWidth: "50%",
                        itemStyle: {
                            borderRadius: [6, 6, 0, 0],
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                { offset: 0, color: "#42a5f5" },
                                { offset: 1, color: "#1e88e5" }
                            ])
                        }
                    }
                ],
                animationDuration: 1000
            };

            chartInstance.setOption(option);

            window.addEventListener("resize", chartInstance.resize);
            return () => {
                window.removeEventListener("resize", chartInstance.resize);
                chartInstance.dispose();
            };
        }
    }, [chartData, selectedYear]);

    return (
        <div className="card">
            <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="card-title mb-0">Year-wise Orders</h5>
                    <div style={{ width: "180px" }}>
                        <Select
                            options={yearsOptions}
                            value={yearsOptions.find((y) => y.value === selectedYear)}
                            onChange={(option) => setSelectedYear(option.value)}
                        />
                    </div>
                </div>

                <div ref={chartRef} style={{ width: "100%", height: "400px" }} />
            </div>
        </div>
    );
};

export default YearWiseOrdersChart;
