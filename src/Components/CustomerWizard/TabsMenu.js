import { useContext, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Swal from "sweetalert2"
import axios from 'axios';
import { ConfigContext } from '../../Context/ConfigContext';


const TabsMenu = ({ business_id }) => {
    const location = useLocation();

    const { apiURL, apiHeaderJson } = useContext(ConfigContext);
    const [businessVerify, setBusinessVerify] = useState({})
    const [loading, setLoading] = useState(true)

    const GetBusinessInfo = async () => {
        try {
            const headers = apiHeaderJson
            const response = await axios.get(`${apiURL}Business/GetBusinessInfo`, { params: { business_id }, headers })

            if (response?.data?.success) {

                const data = response?.data?.data[0];
                setBusinessVerify(data)

            }

        } catch (error) {
            console.log("error =>", error)
        } finally {
            setLoading(false)
        }
    }

    const getCurrentTab = () => {
        if (location.pathname.includes("CustomerDashboard")) return "dashboard";
        if (location.pathname.includes("CustomerInfo")) return "info";
        if (location.pathname.includes("CustomerDocument")) return "document";
        if (location.pathname.includes("CustomerBrands")) return "brands";
        if (location.pathname.includes("CustomerOrders")) return "orders";
        if (location.pathname.includes("CustomerTransactions")) return "credit-transaction";
        if (location.pathname.includes("CustomerUsers")) return "users";
        if (location.pathname.includes("CustomerRequestCreditLimit")) return "requestcreditlimit";
        if (location.pathname.includes("CustomerRequestDueDays")) return "requested-duedays";
        if (location.pathname.includes("CustomerRewardsPoints")) return "rewardsPoints";
        return "";
    };

    const currentTab = getCurrentTab();

    useEffect(() => {
        GetBusinessInfo()
    }, [])

    return (
        <div className="d-flex profile-wrapper">
            <ul className="nav nav-pills animation-nav profile-nav gap-2 gap-lg-3 flex-grow-1" role="tablist">
                <li className="nav-item">
                    <Link
                        className={`nav-link fs-14 ${currentTab === "dashboard" ? "active" : ""}`}
                        to={`/CustomerDashboard/${business_id}`}>
                        <i className="ri-airplay-fill d-inline-block d-md-none" />
                        <span className="d-none d-md-inline-block">Dashboard</span>
                    </Link>
                </li>
                <li className="nav-item">
                    <Link
                        className={`nav-link fs-14 ${currentTab === "info" ? "active" : ""}`}
                        to={`/CustomerInfo/${business_id}`}>
                        <i className="ri-airplay-fill d-inline-block d-md-none" />
                        <span className="d-none d-md-inline-block">Business Info</span>
                    </Link>
                </li>
                <li className="nav-item">
                    <Link
                        className={`nav-link fs-14 ${currentTab === "document" ? "active" : ""}`}
                        to={`/CustomerDocument/${business_id}`}>
                        <i className="ri-list-unordered d-inline-block d-md-none" />
                        <span className="d-none d-md-inline-block">Document</span>
                    </Link>
                </li>
                <li className="nav-item">
                    <Link
                        className={`nav-link fs-14 ${currentTab === "brands" ? "active" : ""}`}
                        to={`/CustomerBrands/${business_id}`}>
                        <i className="ri-price-tag-line d-inline-block d-md-none" />
                        <span className="d-none d-md-inline-block">Brands</span>
                    </Link>
                </li>
                <li className="nav-item">
                    <Link
                        className={`nav-link fs-14 ${currentTab === "orders" ? "active" : ""}`}
                        to={`/CustomerOrders/${business_id}`}>
                        <i className="ri-folder-4-line d-inline-block d-md-none" />
                        <span className="d-none d-md-inline-block">Orders</span>
                    </Link>
                </li>

                {/* <li className="nav-item">
                    <Link
                        className={`nav-link fs-14 ${currentTab === "users" ? "active" : ""}`}
                        to={`/CustomerUsers/${business_id}`}>
                        <i className="ri-bank-card-line d-inline-block d-md-none" />
                        <span className="d-none d-md-inline-block">Users</span>
                    </Link>
                </li> */}

                <li className="nav-item">
                    <Link
                        className={`nav-link fs-14 ${currentTab === "requestcreditlimit" ? "active" : ""}`}
                        to={`/CustomerRequestCreditLimit/${business_id}`}>
                        <i className="ri-bank-card-line d-inline-block d-md-none" />
                        <span className="d-none d-md-inline-block">Credit Limit</span>
                    </Link>
                </li>

                <li className="nav-item">
                    <Link
                        className={`nav-link fs-14 ${currentTab === "requested-duedays" ? "active" : ""}`}
                        to={`/CustomerRequestDueDays/${business_id}`}>
                        <i className="ri-bank-card-line d-inline-block d-md-none" />
                        <span className="d-none d-md-inline-block">Due Days</span>
                    </Link>
                </li>

            </ul>


        </div>
    );
};

export default TabsMenu;
