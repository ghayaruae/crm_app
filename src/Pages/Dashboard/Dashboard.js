import React, { useContext, useEffect, useState } from "react";
import DashboardCards from "./DashboardCards";
import SalesChart from "./SalesChart";
import BusinessesChart from "./BusinessesChart";
import { ConfigContext } from "../../Context/ConfigContext";
import axios from "axios";
import NoRecentOrders from "./NoRecendsOrders";

const Dashboard = () => {

  const { apiHeaderJson, apiURL } = useContext(ConfigContext);
  const headers = apiHeaderJson;

  const [data, setData] = useState({});
  const [salesmanData, setSalesmanData] = useState({});
  const [noRecentOrders, setNoRecentOrders] = useState([]);

  const GetBusinessesNoRecentOrders = async () => {
    try {
      const response = await axios.get(`${apiURL}Dashboard/GetBusinessesNoRecentOrders`, { headers });
      if (response.data.success) {
        setNoRecentOrders(response.data.data);
      }
    } catch (error) {
      console.log(error)
    }
  };

  const getData = async () => {
    try {
      const response = await axios.get(`${apiURL}Dashboard/GetDashboardData`, { headers })
      const { success, data, salesman_info } = response.data
      if (success) {
        setData(data)
        setSalesmanData(salesman_info)
      }
    } catch (error) {
      console.error('Error fetching chart data:', error)
    }
  }

  useEffect(() => {
    getData();
    GetBusinessesNoRecentOrders();
  }, []);

  return (
    <div className="main-content">
      <div className="page-content">
        <div className="container-fluid">

          {/* Top Cards */}
          <div className="row">
            <DashboardCards data={data} salesman_data={salesmanData} />
          </div>

          {/* Charts */}
          <div className="row">
            <SalesChart />
            <BusinessesChart />
          </div>

          {/* ✅ No Recent Order Businesses List */}
          <div className="row mt-4">
            <div className="col-12">
              <NoRecentOrders list={noRecentOrders} />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
