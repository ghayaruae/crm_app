import React, { useContext } from "react";
import { ConfigContext } from "../../Context/ConfigContext";
import { useNavigate } from "react-router-dom";

const NoRecentOrders = ({ list }) => {

    const { primaryColor } = useContext(ConfigContext);
    const navigate = useNavigate();

    if (!list || list.length === 0) {
        return (
            <div className="card shadow-sm border-0">
                <div className="card-body">
                    <h5 className="text-primary mb-3">
                        Businesses with No Recent Orders
                    </h5>
                    <p className="text-muted mb-0">No data available</p>
                </div>
            </div>
        );
    }

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
                                <th>Last Order</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {list.map((item, index) => (
                                <tr key={index}>
                                    <td className="text-start fw-semibold">
                                        {item.business_id}
                                    </td>
                                    <td className="text-start fw-semibold">
                                        {item.business_name}
                                    </td>
                                    <td>{item.business_contact_number ?? "N/A"}</td>
                                    <td>{item.business_email ?? "N/A"}</td>
                                    <td className="text-muted small">
                                        {item.last_order_date ?? "No Orders Yet"}
                                    </td>
                                    <td>
                                        <button
                                            onClick={() => navigate("/Masters/ManageFollowup")}
                                            className="btn btn-dark btn-sm"
                                        >Follow up</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

            </div>
        </div>
    );
};

export default NoRecentOrders;
