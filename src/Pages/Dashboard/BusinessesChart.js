import React, { useContext, useEffect, useState } from 'react'
import ReactECharts from 'echarts-for-react'
import axios from 'axios';
import { ConfigContext } from '../../Context/ConfigContext';

const BusinessesChart = () => {
    const { apiHeaderJson, apiURL } = useContext(ConfigContext)
    const [getTargetAmount, setGetTargetAmount] = useState([]);

    const GetSalesmanTargetChartData = async () => {
        try {
            const headers = apiHeaderJson;
            const response = await axios.get(`${apiURL}Dashboard/GetSalesmanTargetChartData`, { headers })

            if (response?.data?.success) {
                const data = response?.data?.data;
                setGetTargetAmount(data);
            }

        } catch (error) {
            console.log(error)
        }
    }

    const option = {
        tooltip: {
            trigger: 'item',
            backgroundColor: '#fff',
            borderColor: '#ddd',
            borderWidth: 1,
            textStyle: { color: '#333' },
            formatter: '{b}: {c} ({d}%)'
        },
        legend: {
            bottom: 0,
            left: 'center',
            textStyle: { color: '#666', fontSize: 12 },
        },
        series: [
            {
                name: 'Business Status',
                type: 'pie',
                radius: ['40%', '70%'],
                avoidLabelOverlap: false,
                label: { show: false, position: 'center' },
                emphasis: {
                    label: {
                        show: true,
                        fontSize: 14,
                        fontWeight: 'bold',
                        color: '#333'
                    }
                },
                labelLine: { show: false },
                data: [
                    { value: getTargetAmount?.total_achievement_amount, name: 'Achievement Amount', itemStyle: { color: '#2b7a78' } },
                    { value: getTargetAmount?.total_pending_amount, name: 'Pending Amount', itemStyle: { color: '#d9534f' } }
                ]
            }
        ]
    }

    const chartStyle = {
        width: '100%',
        height: '90%',
        minHeight: '300px',
    }

    useEffect(() => {
        GetSalesmanTargetChartData();
    }, [])

    return (
        <div className="col-12 col-md-5">
            <div className="card shadow border-0 rounded h-100">
                <div className="card-body d-flex flex-column justify-content-between">
                    <h5 className="card-title mb-3 text-dark fw-semibold text-center text-md-start">
                        Achievment Target Overview
                    </h5>
                    <div style={{ flex: 1 }}>
                        <ReactECharts
                            option={option}
                            style={chartStyle}
                            opts={{ renderer: 'svg' }}
                            notMerge={true}
                            lazyUpdate={true}
                            theme={"light"}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BusinessesChart
