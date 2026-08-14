import { useContext, useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/themes/material_blue.css';
import { ConfigContext } from '../../Context/ConfigContext';
import axios from 'axios';
import { DateFormater } from '../../Components/GlobalFunctions';

const SalesChart = () => {
    const [chartData, setChartData] = useState({
        labels: [],
        pending: [],
        inProgress: [],
        delivered: [],
        returned: [],
        cancelled: []
    });
    const [summary, setSummary] = useState({
        total_orders: 0,
        total_amount: 0,
        total_pending: 0,
        total_in_progress: 0,
        total_delivered: 0,
        total_returned: 0,
        total_cancelled: 0
    });
    const [loading, setLoading] = useState(true);
    const { primaryColor, apiHeaderJson, apiURL } = useContext(ConfigContext);

    const now = new Date();

    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    const [fromDate, setFromDate] = useState(
        formatDate(new Date(now.getFullYear(), now.getMonth(), 1))
    );

    const [toDate, setToDate] = useState(
        formatDate(new Date(now.getFullYear(), now.getMonth() + 1, 0))
    );

    const getData = async () => {
        if (!fromDate || !toDate) return;

        try {
            const from_date = fromDate
            const to_date = toDate

            setLoading(true);

            const response = await axios.get(`${apiURL}Dashboard/GetMonthlySalesBySalesman`, {
                headers: apiHeaderJson,
                params: { from_date, to_date }
            });

            const {
                success,
                labels,
                pending_amount,
                in_progress_amount,
                delivered_amount,
                returned_amount,
                cancelled_amount
            } = response.data;

            if (success) {
                setChartData({
                    labels: labels.map(DateFormater),

                    pending: pending_amount.map(Number),
                    inProgress: in_progress_amount.map(Number),
                    delivered: delivered_amount.map(Number),
                    returned: returned_amount.map(Number),
                    cancelled: cancelled_amount.map(Number)
                });

                setSummary({
                    total_orders: response.data.total_orders,
                    total_amount: response.data.total_amount,
                    total_pending: response.data.total_pending,
                    total_in_progress: response.data.total_in_progress,
                    total_delivered: response.data.total_delivered,
                    total_returned: response.data.total_returned,
                    total_cancelled: response.data.total_cancelled
                });
            }

        } catch (error) {
            console.error('Error fetching chart data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (fromDate && toDate) {
            getData();
        }
    }, [fromDate, toDate]);

    const option = {
        tooltip: {
            trigger: "axis",
            formatter(params) {
                let html = `<b>${params[0].axisValue}</b><br/>`;

                params.forEach(item => {
                    html += `
                    <span style="
                        display:inline-block;
                        width:10px;
                        height:10px;
                        border-radius:50%;
                        background:${item.color};
                        margin-right:6px;
                    "></span>
                    ${item.seriesName}: ${Number(item.value)?.toFixed(2)} AED<br/>
                `;
                });

                return html;
            }
        },

        legend: {
            top: 0,
            data: [
                "Pending",
                "In Progress",
                "Delivered",
                "Returned",
                "Cancelled"
            ]
        },

        grid: {
            left: 50,
            right: 20,
            bottom: 70,
            top: 50
        },

        xAxis: {
            type: "category",
            data: chartData.labels,
            axisLabel: {
                rotate: 45
            }
        },

        yAxis: {
            type: "value",
            name: "Sales (AED)"
        },

        series: [
            {
                name: "Pending",
                type: "line",
                smooth: true,
                data: chartData.pending,
                color: "#f39c12"
            },
            {
                name: "In Progress",
                type: "line",
                smooth: true,
                data: chartData.inProgress,
                color: "#3498db"
            },
            {
                name: "Delivered",
                type: "line",
                smooth: true,
                data: chartData.delivered,
                color: "#2ecc71"
            },
            {
                name: "Returned",
                type: "line",
                smooth: true,
                data: chartData.returned,
                color: "#9b59b6"
            },
            {
                name: "Cancelled",
                type: "line",
                smooth: true,
                data: chartData.cancelled,
                color: "#e74c3c"
            }
        ]
    };


    return (
        <div className="col-lg-12 col-md-12">
            <div className="card shadow border-0 rounded mb-0">
                <h5 className="card-header">
                    Sales Overview
                </h5>
                <div className="card-body">
                    <div className="row mb-3">
                        <div className="col-md-6">
                            <label className="form-label">From Date</label>
                            <Flatpickr
                                value={fromDate}
                                options={{
                                    dateFormat: "Y-m-d",
                                    maxDate: toDate || null
                                }}
                                onChange={(dates, dateStr) => {
                                    setFromDate(dateStr);

                                    if (toDate && dateStr > toDate) {
                                        setToDate(null);
                                    }
                                }}
                                className="form-control"
                            />
                        </div>

                        <div className="col-md-6">
                            <label className="form-label">To Date</label>
                            <Flatpickr
                                value={toDate}
                                options={{
                                    dateFormat: "Y-m-d",
                                    minDate: fromDate || null
                                }}
                                onChange={(dates, dateStr) => {
                                    setToDate(dateStr);
                                }}
                                className="form-control"
                                disabled={!fromDate}
                            />
                        </div>
                    </div>

                    {/* Summary */}
                    <div className="row g-3 mb-4">
                        <div className="col-md-6">
                            <div className="border rounded p-3 h-100 bg-light">
                                <div className="text-muted small">
                                    Total Orders
                                </div>

                                <h3 className="mb-0 fw-bold">
                                    {Number(summary.total_orders).toLocaleString()}
                                </h3>
                            </div>
                        </div>

                        <div className="col-md-6">
                            <div className="border rounded p-3 h-100 bg-light">
                                <div className="text-muted small">
                                    Total Sales Amount
                                </div>

                                <h3 className="mb-0 fw-bold text-success">
                                    AED {Number(summary.total_amount).toLocaleString(undefined, {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2
                                    })}
                                </h3>
                            </div>
                        </div>
                    </div>

                    {loading ? (
                        <div className="text-center py-5">
                            <div className="spinner-border" style={{ color: primaryColor }} />
                        </div>
                    ) : (
                        <ReactECharts option={option} style={{ height: "350px", width: "100%" }} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default SalesChart;
