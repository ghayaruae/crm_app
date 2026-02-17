import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { ConfigContext } from "../../../Context/ConfigContext";
import { ContentLoader } from "../../Shimmer";

const CustomerInfo = ({ business_id }) => {
    const { apiURL, apiHeaderJson } = useContext(ConfigContext);
    const [businessInfo, setBusinessInfo] = useState([]);
    const [loading, setLoading] = useState(true);

    const GetBusinessInfo = async () => {
        try {
            const headers = apiHeaderJson;
            const response = await axios.get(`${apiURL}Business/GetBusinessInfo`, {
                params: { business_id },
                headers,
            });

            const { data, success } = response?.data;
            if (success) {
                setBusinessInfo(data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        GetBusinessInfo();
    }, [business_id]);

    const getStatusBadge = (status, type) => {
        switch (type) {

            case "active":
                return status === 1 ? (
                    <span className="badge bg-success">Active</span>
                ) : (
                    <span className="badge bg-secondary">Inactive</span>
                );
            case "cod":
                return status === 1 ? (
                    <span className="badge bg-primary">Applicable</span>
                ) : (
                    <span className="badge bg-danger">Not Applicable</span>
                );
            default:
                return null;
        }
    };

    return (
        <div className="row">
            <div className="col-md-12">
                {/* Profile Completion */}
                <div className="card shadow-sm border-0">
                    <div className="card-body">
                        <h5 className="card-title">Complete Your Profile</h5>
                        <div className="progress animated-progress custom-progress progress-label">
                            <div className="progress-bar bg-danger" role="progressbar" style={{ width: '30%' }} aria-valuenow={30} aria-valuemin={0} aria-valuemax={100}>
                                <div className="label">30%</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Business Info Card */}
            <div className="col-md-12 mb-3">
                <div className="card shadow-sm border-0">
                    <div className="card-body">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h5 className="card-title">Account Info</h5>
                        </div>

                        {loading ? (
                            <ContentLoader />
                        ) : businessInfo ? (
                            <div className="row g-3">

                                <div className="col-md-6">
                                    <div className="p-2 border rounded">
                                        <strong>Account Id : </strong> <span className="text-primary fw-bold">{businessInfo.business_id}</span>
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="p-2 border rounded">
                                        <strong>Account TRN : </strong> <span className="text-primary fw-bold">{businessInfo.busienss_trn}</span>
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="p-2 border rounded">
                                        <strong>Account Status : </strong> {getStatusBadge(businessInfo.is_active, "active")}
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="p-2 border rounded">
                                        <strong>Account Verification : </strong> {Number(businessInfo?.business_registered_verification_status) === 1
                                            ?
                                            <span className="badge bg-success">Verified</span>
                                            :
                                            <span className="badge bg-warning">Pending</span>
                                        }
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="p-2 border rounded">
                                        <strong>Account COD Applicable : </strong> {getStatusBadge(businessInfo.business_cod_status, "cod")}
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="p-2 border rounded">
                                        <strong>Account Level : </strong> <span className="badge bg-info">{businessInfo?.business_level_title}</span>
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="p-2 border rounded">
                                        <strong>Account Name : </strong> {businessInfo.business_name}
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="p-2 border rounded">
                                        <strong>Account Contact Person : </strong> {businessInfo.business_contact_person}
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="p-2 border rounded">
                                        <strong>Account Contact Number : </strong> {businessInfo.business_contact_number}
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="p-2 border rounded">
                                        <strong>Account Email : </strong> {businessInfo.business_email}
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="p-2 border rounded">
                                        <strong>Account Credit Limit : </strong> <span className="text-success fw-bold">{businessInfo.business_credit_limit} AED</span>
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="p-2 border rounded">
                                        <strong>Account Credit Balance : </strong> <span className="text-danger fw-bold">{businessInfo.business_credit_balance} AED</span>
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="p-2 border rounded">
                                        <strong>Account Reward Points : </strong> <span className="text-success fw-bold">{businessInfo.business_reward_points_balance}</span>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center text-muted py-3">No Account info added</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerInfo;
