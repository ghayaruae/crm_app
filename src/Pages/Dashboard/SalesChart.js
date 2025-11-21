// import React, { useContext, useEffect, useState } from 'react'
// import ReactECharts from 'echarts-for-react'
// import { ConfigContext } from '../../Context/ConfigContext'
// import axios from 'axios'

// const SalesChart = () => {
//     const [chartData, setChartData] = useState({ labels: [], sales: [], orders: [] })
//     const [loading, setLoading] = useState(true)
//     const { primaryColor, apiHeaderJson, apiURL } = useContext(ConfigContext)

//     const getCurrentDates = () => {
//         const today = new Date()
//         const year = today.getFullYear()
//         const month = today.getMonth() + 1
//         return { year, month }
//     }

//     const getData = async () => {
//         try {
//             const { year, month } = getCurrentDates()
//             const headers = apiHeaderJson
//             setLoading(true)

//             const response = await axios.get(`${apiURL}Dashboard/GetMonthlySalesBySalesman`, {
//                 headers,
//                 params: { year, month }
//             })

//             const { success, labels, sales, orders } = response.data

//             if (success) {
//                 setChartData({ labels, sales, orders })
//             }
//         } catch (error) {
//             console.error('Error fetching chart data:', error)
//         } finally {
//             setLoading(false)
//         }
//     }

//     useEffect(() => {
//         getData()
//     }, [])

//     const option = {
//         tooltip: {
//             trigger: 'axis',
//             backgroundColor: '#fff',
//             borderColor: '#ddd',
//             borderWidth: 1,
//             textStyle: { color: '#333' },
//             formatter: (params) => {
//                 let tooltip = `<strong>${params[0].axisValue}</strong><br/>`
//                 params.forEach(item => {
//                     const value = item.value ? item.value.toLocaleString() : 0
//                     const label =
//                         item.seriesName === 'Sales'
//                             ? `AED ${value}`
//                             : value
//                     tooltip += `
//                     <span style="display:inline-block;margin-right:5px;border-radius:50%;width:8px;height:8px;background:${item.color};"></span>
//                     ${item.seriesName}: ${label}<br/>
//                 `
//                 })
//                 return tooltip
//             }
//         },
//         legend: {
//             data: ['Sales', 'Orders'],
//             textStyle: { color: '#555' },
//             top: 10
//         },
//         grid: {
//             left: '5%',
//             right: '5%',
//             bottom: '5%',
//             containLabel: true
//         },
//         xAxis: {
//             type: 'category',
//             data: chartData.labels || [],
//             axisLine: { lineStyle: { color: '#ccc' } },
//             axisLabel: {
//                 color: '#666',
//                 rotate: chartData.labels?.length > 4 ? 20 : 0,
//                 fontSize: 12
//             }
//         },
//         yAxis: {
//             type: 'value',
//             axisLine: { show: false },
//             splitLine: { lineStyle: { color: '#eee' } },
//             axisLabel: {
//                 color: '#666',
//                 formatter: (value) => `AED ${value.toLocaleString()}`
//             }
//         },
//         series: [
//             {
//                 name: 'Sales',
//                 data: chartData.sales || [],
//                 type: 'line',
//                 smooth: true,
//                 lineStyle: {
//                     color: primaryColor || '#132530',
//                     width: 3
//                 },
//                 itemStyle: { color: primaryColor || '#132530' },
//                 areaStyle: { color: 'rgba(19, 37, 48, 0.1)' }
//             },
//             {
//                 name: 'Orders',
//                 data: chartData.orders || [],
//                 type: 'line',
//                 smooth: true,
//                 lineStyle: {
//                     color: '#3b82f6',
//                     width: 3,
//                     type: 'dashed'
//                 },
//                 itemStyle: { color: '#3b82f6' },
//                 areaStyle: { color: 'rgba(59, 130, 246, 0.1)' }
//             }
//         ]
//     }

//     const getChartHeight = () => {
//         if (window.innerWidth < 576) return '250px'
//         if (window.innerWidth < 992) return '300px'
//         return '350px'
//     }

//     return (
//         <div className="col-12 col-md-7">
//             <div className="card shadow border-0 rounded mb-0">
//                 <div className="card-body">
//                     <h5 className="card-title mb-3 text-dark fw-semibold">
//                         Monthly Sales & Orders Overview
//                     </h5>

//                     {loading ? (
//                         <div className="text-center py-5">
//                             <div className="spinner-border" style={{ color: primaryColor }} role="status">
//                                 <span className="visually-hidden">Loading...</span>
//                             </div>
//                         </div>
//                     ) : (
//                         <ReactECharts
//                             option={option}
//                             style={{
//                                 height: getChartHeight(),
//                                 width: '100%',
//                             }}
//                             opts={{ renderer: 'svg' }}
//                         />
//                     )}
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default SalesChart


import React, { useContext, useEffect, useState } from 'react'
import ReactECharts from 'echarts-for-react'
import { ConfigContext } from '../../Context/ConfigContext'
import axios from 'axios'

const SalesChart = () => {
    const [chartData, setChartData] = useState({ labels: [], sales: [], orders: [] })
    const [loading, setLoading] = useState(true)
    const { primaryColor, apiHeaderJson, apiURL } = useContext(ConfigContext)

    const getCurrentDates = () => {
        const today = new Date()
        const year = today.getFullYear()
        const month = today.getMonth() + 1
        return { year, month }
    }

    const getData = async () => {
        try {
            const { year, month } = getCurrentDates()
            const headers = apiHeaderJson
            setLoading(true)

            const response = await axios.get(`${apiURL}Dashboard/GetMonthlySalesBySalesman`, {
                headers,
                params: { year, month }
            })

            const { success, labels, sales, orders } = response.data

            if (success) {
                setChartData({ labels, sales, orders })
            }
        } catch (error) {
            console.error('Error fetching chart data:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getData()
    }, [])

    const option = {
        tooltip: {
            trigger: 'axis',
        },
        xAxis: {
            type: 'category',
            data: chartData.labels || []
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
                name: 'Sales',
                data: chartData.sales || [],
                type: 'line',
                smooth: true,
                lineStyle: {
                    color: primaryColor || '#132530',
                    width: 3
                },
                itemStyle: { color: primaryColor || '#132530' },
                areaStyle: { color: 'rgba(19, 37, 48, 0.1)' }
            },
            {
                name: 'Orders',
                data: chartData.orders || [],
                type: 'line',
                smooth: true,
                lineStyle: {
                    color: '#3b82f6',
                    width: 3
                },
                itemStyle: { color: '#3b82f6' }
            }
        ]
    }

    return (
        <div className="col-12 col-md-7">
            <div className="card shadow border-0 rounded mb-0">
                <div className="card-body">
                    <h5 className="card-title mb-3 text-dark fw-semibold">
                        Monthly Sales & Orders Overview
                    </h5>

                    {loading ? (
                        <div className="text-center py-5">
                            <div className="spinner-border" style={{ color: primaryColor }} role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    ) : chartData.labels.length === 0 ? (
                        // 🟢 NO DATA DESIGN
                        <div className="text-center py-5">
                            <div style={{ fontSize: "45px", opacity: 0.4 }}>📊</div>
                            <h6 className="mt-3 fw-semibold text-muted">
                                No sales or orders found for this assign target
                            </h6>
                        </div>
                    ) : (
                        <ReactECharts
                            option={option}
                            style={{ height: "350px", width: "100%" }}
                            opts={{ renderer: 'svg' }}
                        />
                    )}
                </div>
            </div>
        </div>
    )
}

export default SalesChart
