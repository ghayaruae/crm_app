import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios';
import DashboardStates from './Dashboard/DashboardStates';
import { ConfigContext } from '../../../Context/ConfigContext';

const CustomerDashboard = ({ business_id }) => {

    const { apiURL, apiHeaderJson } = useContext(ConfigContext);
    const [loading, setLoading] = useState(true);
    const [dashboardData, setDashboardData] = useState({});

    const GetBusinessDashboard = async () => {
        try {
            const headers = apiHeaderJson;

            const response = await axios.get(`${apiURL}Business/GetBusinessDashboard`, { params: { business_id }, headers })

            if (response?.data) {
                const data = response?.data?.data;
                setDashboardData(data);
            }

        } catch (error) {
            console.error("Get Dashboard error : ", error)
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (business_id) {
            GetBusinessDashboard()
        }
    }, [business_id])

    return (
        <div className="row">
            <DashboardStates dashboardData={dashboardData} loading={loading} />
        </div>
    )
}

export default CustomerDashboard
