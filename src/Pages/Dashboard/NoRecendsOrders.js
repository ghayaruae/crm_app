import { useContext, useEffect, useState } from "react";
import { ConfigContext } from "../../Context/ConfigContext";
import { Link } from "react-router-dom";
import { DateFormater } from "../../Components/GlobalFunctions";
import { NoRecords } from "../../Components/Shimmer";
import axios from "axios";

const NoRecentOrders = () => {

    const { primaryColor } = useContext(ConfigContext);

    const { apiHeaderJson, apiURL } = useContext(ConfigContext);
    const headers = apiHeaderJson;
    const [noRecentOrders, setNoRecentOrders] = useState([]);


    const GetBusinessesNoRecentOrders = async () => {
        try {
            const response = await axios.get(`${apiURL}Dashboard/GetBusinessesNoRecentOrders`, { params: { limit: 5, page: 1 }, headers });
            if (response.data.success) {
                setNoRecentOrders(response.data.data);
            }
        } catch (error) {
            console.log(error)
        }
    };

    useEffect(() => {
        GetBusinessesNoRecentOrders()
    }, [])

    return (
        <div className="card shadow-sm border-0">
            <div className="card-header" style={{ background: primaryColor }}>
                <div className="d-flex justify-content-between align-items-center">

                    <h5 className="mb-0 card-title text-white">
                        <i className="ri-store-2-line me-2"></i>
                        No Recent Orders By Business
                    </h5>
                    <Link to={"/Reports/NoRecendsOrderReport"}>
                        <button className="btn btn-light btn-sm">
                            View More
                        </button>
                    </Link>
                </div>
            </div>
            <div className="card-body p-0">
                <div className="table-responsive tabel-card">
                    <table className="table align-middle mb-0">
                        <thead className="table-light">
                            <tr>
                                <th className="text-start">Business Id</th>
                                <th className="text-start">Business Name</th>
                                <th>Contact</th>
                                <th>Email</th>
                                <th>Days</th>
                                <th>Last Order Date</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                noRecentOrders?.length > 0 ?
                                    noRecentOrders?.map((item, index) => (
                                        <tr key={index}>
                                            <td className="text-start fw-semibold">
                                                {item.business_id}
                                            </td>
                                            <td className="text-start fw-semibold">
                                                {item.business_name}
                                            </td>
                                            <td>{item.business_contact_number ?? "N/A"}</td>
                                            <td>{item.business_email ?? "N/A"}</td>
                                            <td className="text-danger fw-bold">{item.no_order_since_days ?? "N/A"} Days</td>
                                            <td className="text-dark fw-bold">
                                                {DateFormater(item.last_order_date) ?? "No Orders Yet"}
                                            </td>
                                            <td>
                                                <Link to={`/Masters/ManageFollowup/0/${item.business_id}`}>
                                                    <button className="btn btn-dark btn-sm">
                                                        Follow up
                                                    </button>
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                    :
                                    <tr>
                                        <td colSpan={6} className="text-center py-4">
                                            <div className="d-flex justify-content-center align-items-center">
                                                <NoRecords />
                                            </div>
                                        </td>
                                    </tr>
                            }
                        </tbody>
                    </table>
                </div>

            </div>
        </div>
    );
};

export default NoRecentOrders;
