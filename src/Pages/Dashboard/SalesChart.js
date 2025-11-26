import { useContext, useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/themes/material_blue.css';
import { ConfigContext } from '../../Context/ConfigContext';
import axios from 'axios';
import { DateFormater } from '../../Components/GlobalFunctions';

const SalesChart = () => {
    const [chartData, setChartData] = useState({ labels: [], sales: [], orders: [] });
    const [loading, setLoading] = useState(true);
    const { primaryColor, apiHeaderJson, apiURL } = useContext(ConfigContext);

    const getDefaultDateRange = () => {
        const now = new Date();
        const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        return [firstDay, lastDay];
    };

    const [dateRange, setDateRange] = useState(getDefaultDateRange());

    const getData = async () => {
        try {
            const [from, to] = dateRange;

            const from_date = from.toISOString().split("T")[0];
            const to_date = to.toISOString().split("T")[0];

            setLoading(true);

            const response = await axios.get(`${apiURL}Dashboard/GetMonthlySalesBySalesman`, {
                headers: apiHeaderJson,
                params: { from_date, to_date }
            });

            const { success, labels, sales, orders } = response.data;

            if (success) {
                setChartData({
                    labels: labels.map(d => DateFormater(d)),
                    sales: sales.map(s => parseFloat(s).toFixed(2)),
                    orders: orders.map(o => parseInt(o))  // orders without decimals
                });
            }

        } catch (error) {
            console.error('Error fetching chart data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getData();
    }, [dateRange]);

    const option = {
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: ['Sales']
        },
        xAxis: {
            type: 'category',
            data: chartData.labels || [],
            axisLabel: {
                rotate: 45,
                fontSize: 11
            }
        },
        yAxis: {
            type: 'value',
            name: 'Sales'
        },
        series: [
            {
                name: 'Sales',
                data: chartData.sales,
                type: 'line',
                smooth: true,
                lineStyle: { color: primaryColor },
                itemStyle: { color: primaryColor },
                areaStyle: { opacity: 0.1, color: primaryColor }
            }
        ]
    };


    return (
        <div className="col-12 col-md-7">
            <div className="card shadow border-0 rounded mb-0">
                    <h5 className="card-header">
                        Sales Overview
                    </h5>
                <div className="card-body">
                    <div className="mb-3">
                        <Flatpickr
                            value={dateRange}
                            options={{
                                mode: "range",
                                dateFormat: "Y-m-d"
                            }}
                            onChange={(dates) => {
                                if (dates.length === 2) setDateRange(dates);
                            }}
                            className="form-control"
                        />
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
