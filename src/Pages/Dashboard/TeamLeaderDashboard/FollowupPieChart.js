import { useContext, useEffect, useState } from 'react'
import ReactECharts from 'echarts-for-react'
import axios from 'axios'
import { ConfigContext } from '../../../Context/ConfigContext'
import { Link } from 'react-router-dom'
import { ContentLoader } from '../../../Components/Shimmer'

const FollowupPieChart = () => {

    const { apiHeaderJson, apiURL } = useContext(ConfigContext)
    const [data, setData] = useState({})
    const [loading, setLoading] = useState(true)

    const getFollowupData = async () => {
        try {
            const headers = apiHeaderJson
            const response = await axios.get(`${apiURL}Dashboard/GetFollowTypeChart`, { headers })

            const { success, data } = response.data

            if (success) {
                setData(data)
            } else {
                setData({})
            }
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getFollowupData()
    }, [])

    const pieData = [
        { value: data.meet_count || 0, name: "Meeting" },
        { value: data.call_count || 0, name: "Call" },
        { value: data.visit_count || 0, name: "Visit" },
        { value: data.whatsapp_count || 0, name: "Whatsapp" },
        { value: data.email_count || 0, name: "Mail" },
    ].filter(item => item.value > 0)

    const option = {
        tooltip: {
            trigger: 'item'
        },
        legend: {
            orient: 'horizontal',
            bottom: '0%'
        },
        series: [
            {
                name: 'Followups',
                type: 'pie',
                radius: '70%',
                avoidLabelOverlap: false,
                itemStyle: {
                    borderRadius: 10,
                    borderColor: '#fff',
                    borderWidth: 2
                },
                label: {
                    show: true,
                    position: 'outside',
                    formatter: '{b} : {c}'
                },
                emphasis: {
                    label: {
                        show: true,
                        fontSize: 16,
                        fontWeight: 'bold'
                    }
                },
                data: pieData
            }
        ]
    }

    return (
        <div className="col-md-4">
            <div className="card">
                <div className="card-header d-flex align-items-center justify-content-between">
                    <h5 className="mb-0">Followup Types</h5>

                    <Link to={"/Reports/FollowupReport"} className='text-decoration-underline text-muted small fw-semibold'>
                        View Report
                    </Link>
                </div>
                <div className="card-body">
                    {loading ? (
                        <ContentLoader height={325} />
                    ) : pieData.length === 0 ? (
                        <div className="text-center text-muted">No data found</div>
                    ) : (
                        <ReactECharts
                            option={option}
                            style={{ height: 325 }}
                        />
                    )}
                </div>
            </div>
        </div>
    )
}

export default FollowupPieChart
