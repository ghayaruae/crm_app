import React, { useContext, useEffect, useState } from "react";
import DashboardCards from "./DashboardCards";
import SalesChart from "./SalesChart";
import BusinessesChart from "./BusinessesChart";
import { ConfigContext } from "../../Context/ConfigContext";
import axios from "axios";
import SalesmanInfo from "./SalesmanInfo";

const Dashboard = () => {

  const { primaryColor, apiHeaderJson, apiURL } = useContext(ConfigContext)
  const [data, setData] = useState({})
  const [salesmanData, setSalesmanData] = useState({})
  const [loading, setLoading] = useState(true)

  const getData = async () => {
    try {
      const headers = apiHeaderJson
      setLoading(true)

      const response = await axios.get(`${apiURL}Dashboard/GetDashboardData`, { headers })

      const { success, data, salesman_info } = response.data

      if (success) {
        setData(data)
        setSalesmanData(salesman_info)
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

  return (
    <>
      <div className="main-content">
        <div className="page-content">
          <div className="container-fluid">
            <div className="row">
              <DashboardCards data={data} />
            </div>
            <div className="row">
              <SalesmanInfo salesmanData={salesmanData} />
            </div>
            <div className="row">
              <SalesChart />
              <BusinessesChart data={data} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
