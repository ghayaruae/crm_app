import React from 'react'
import ReactECharts from 'echarts-for-react'

const BusinessesChart = ({ data }) => {
    const option = {
        tooltip: {
            trigger: 'item',
            backgroundColor: '#fff',
            borderColor: '#ddd',
            borderWidth: 1,
            textStyle: {
                color: '#333'
            },
            formatter: '{b}: {c} ({d}%)'
        },
        legend: {
            bottom: 0,
            left: 'center',
            textStyle: { color: '#666' }
        },
        series: [
            {
                name: 'Business Status',
                type: 'pie',
                radius: ['40%', '70%'],
                avoidLabelOverlap: false,
                label: {
                    show: false,
                    position: 'center'
                },
                emphasis: {
                    label: {
                        show: true,
                        fontSize: 16,
                        fontWeight: 'bold',
                        color: '#333'
                    }
                },
                labelLine: {
                    show: false
                },
                data: [
                    { value: data?.total_active_business, name: 'Active', itemStyle: { color: '#2b7a78' } },
                    { value: data?.total_inactive_business, name: 'Inactive', itemStyle: { color: '#d9534f' } }
                ]
            }
        ]
    }

    return (
        <div className="col-md-5">
            <div className="card shadow border-0 rounded">
                <div className="card-body">
                    <h5 className="card-title mb-3 text-dark fw-semibold">
                        Business Activity Overview
                    </h5>
                    <ReactECharts option={option} style={{ height: '350px', width: '100%' }} />
                </div>
            </div>
        </div>
    )
}

export default BusinessesChart
