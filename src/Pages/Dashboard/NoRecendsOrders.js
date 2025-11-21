import React, { useContext } from "react";
import { ConfigContext } from "../../Context/ConfigContext";
import { Link, useNavigate } from "react-router-dom";
import { DateFormater } from "../../Components/GlobalFunctions";
import { NoRecords } from "../../Components/Shimmer";

const NoRecentOrders = ({ list }) => {

    const { primaryColor } = useContext(ConfigContext);

    return (
        <div className="card shadow-sm border-0">
            <div className="card-header" style={{ background: primaryColor }}>
                <h5 className="mb-0 card-title text-white">
                    <i className="ri-store-2-line me-2"></i>
                    Businesses with No Recent Orders in 2 days
                </h5>
            </div>
            <div className="card-body">

                <div className="table-responsive">
                    <table className="table align-middle mb-0">
                        <thead className="table-light">
                            <tr>
                                <th className="text-start">Business Id</th>
                                <th className="text-start">Business Name</th>
                                <th>Contact</th>
                                <th>Email</th>
                                <th>Last Order Date</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                list?.length > 0 ?
                                    list.map((item, index) => (
                                        <tr key={index}>
                                            <td className="text-start fw-semibold">
                                                {item.business_id}
                                            </td>
                                            <td className="text-start fw-semibold">
                                                {item.business_name}
                                            </td>
                                            <td>{item.business_contact_number ?? "N/A"}</td>
                                            <td>{item.business_email ?? "N/A"}</td>
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
