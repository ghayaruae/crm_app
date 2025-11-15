import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import DashboardTab from '../Tabs/DashboardTab';
import { ConfigContext } from '../../../Context/ConfigContext';
import axios from 'axios';
import TargetsTab from '../Tabs/TargetsTab';
import FollowupsTab from '../Tabs/FollowupsTab';
import InquiriesTab from '../Tabs/InquiriesTab';

const TabsMenu = () => {

    const { apiURL, apiHeaderJson } = useContext(ConfigContext);
    const headers = apiHeaderJson

    const [activeTab, setActiveTab] = useState("dashboard");
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState({})
    const [salesmanData, setSalesmanData] = useState({})

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    const getSalesmanData = async () => {
        try {
            const response = await axios.get(`${apiURL}Dashboard/GetDashboardData`, { headers })
            const { success, data, salesman_info } = response.data

            if (success) {
                setData(data)
                setSalesmanData(salesman_info)
            }
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getSalesmanData()
    }, [])

    return (
        <>
            <div className="d-flex profile-wrapper pt-3">
                <ul className="nav nav-pills animation-nav profile-nav gap-2 gap-lg-3 flex-grow-1" role="tablist">

                    <li className="nav-item">
                        <a
                            className={`nav-link fs-14 ${activeTab === "dashboard" ? "active" : ""}`}
                            role='button'
                            onClick={() => handleTabChange("dashboard")}
                        >
                            <i className="ri-dashboard-3-line d-inline-block d-md-none" />
                            <span className="d-none d-md-inline-block">Dashboard</span>
                        </a>
                    </li>
                    <li className="nav-item">
                        <a
                            className={`nav-link fs-14 ${activeTab === "targets" ? "active" : ""}`}
                            role='button'
                            onClick={() => handleTabChange("targets")}
                        >
                            <i className="mdi mdi-bullseye-arrow d-inline-block d-md-none" />
                            <span className="d-none d-md-inline-block">Targets</span>
                        </a>
                    </li>
                    <li className="nav-item">
                        <a
                            className={`nav-link fs-14 ${activeTab === "followup" ? "active" : ""}`}
                            role='button'
                            onClick={() => handleTabChange("followup")}
                        >
                            <i className="ri-dashboard-3-line d-inline-block d-md-none" />
                            <span className="d-none d-md-inline-block">Followups</span>
                        </a>
                    </li>
                    <li className="nav-item">
                        <a
                            className={`nav-link fs-14 ${activeTab === "inquiries" ? "active" : ""}`}
                            role='button'
                            onClick={() => handleTabChange("inquiries")}
                        >
                            <i className="ri-dashboard-3-line d-inline-block d-md-none" />
                            <span className="d-none d-md-inline-block">Part Inquiries</span>
                        </a>
                    </li>
                </ul>
            </div>
            <div className="tab-content pt-4 text-muted">
                {activeTab === "dashboard" && (
                    <DashboardTab
                        data={data}
                        salesman_data={salesmanData}
                    />
                )}
                {activeTab === "targets" && (
                    <TargetsTab />
                )}
                {activeTab === "followup" && (
                    <FollowupsTab />
                )}
                {activeTab === "inquiries" && (
                    <InquiriesTab />
                )}
            </div>
        </>
    )
}

export default TabsMenu