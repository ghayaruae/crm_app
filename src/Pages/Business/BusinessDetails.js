import React, { useContext, useEffect, useState } from "react";
import PageTitle from "../../Components/PageTitle";
import { ConfigContext } from "../../Context/ConfigContext";
import axios from "axios";
import { ContentLoader } from "../../Components/Shimmer";
import { Link, useParams } from "react-router-dom";
import { DateFormater } from "../../Components/GlobalFunctions";

const BusinessDetails = () => {
    const { primaryColor, apiHeaderJson, apiURL } = useContext(ConfigContext);
    const headers = apiHeaderJson;
    const { business_id } = useParams();

    const [data, setData] = useState({});
    const [loading, setLoading] = useState(true);

    const getInfo = async () => {
        try {
            const response = await axios.get(`${apiURL}Business/GetBusinessInfo`, {
                headers,
                params: { business_id },
            });
            const { success, data } = response.data;
            if (success) setData(data);
        } catch (error) {
            console.log("error", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getInfo();
    }, [business_id]);

    if (loading) {
        return (
            <div className="main-content">
                <div className="page-content">
                    <div className="container-fluid">
                        <PageTitle title="Business Details" primary="Business Management" />
                        <ContentLoader />
                    </div>
                </div>
            </div>
        );
    }

    const statusBadge = (status) => {
        return status
            ? <span className="badge bg-success">Active</span>
            : <span className="badge bg-danger">Inactive</span>;
    };

    return (
        <div className="main-content">
            <div className="page-content">
                <div className="container-fluid">
                    <PageTitle title="Business Details" primary="Business Management" />

                    <div className="row justify-content-center">
                        <div className="col-xxl-9 col-xl-10 col-lg-11">
                            <div className="card shadow-sm border-0">
                                <div className="card-header bg-light p-4 border-bottom">
                                    <div className="d-flex align-items-center justify-content-between">
                                        <img
                                            src="/assets/images/main-logo.png"
                                            alt="logo"
                                            width={100}
                                        />
                                        <h5 className="mb-0 text-uppercase fw-bold">
                                            {data.business_name || "Business Details"}
                                        </h5>
                                    </div>
                                </div>

                                <div className="card-body p-4">
                                    <div className="row g-4">
                                        <div className="col-md-4">
                                            <p className="text-muted mb-1 fw-semibold">Business ID</p>
                                            <h6>{data.business_id}</h6>
                                        </div>

                                        <div className="col-md-4">
                                            <p className="text-muted mb-1 fw-semibold">Level</p>
                                            <h6>{data.business_level_title}</h6>
                                        </div>

                                        <div className="col-md-4">
                                            <p className="text-muted mb-1 fw-semibold">Contact Person</p>
                                            <h6>{data.business_contact_person}</h6>
                                        </div>

                                        <div className="col-md-4">
                                            <p className="text-muted mb-1 fw-semibold">Contact Number</p>
                                            <h6>{data.business_contact_number}</h6>
                                        </div>

                                        <div className="col-md-4">
                                            <p className="text-muted mb-1 fw-semibold">Email</p>
                                            <h6>{data.business_email}</h6>
                                        </div>

                                        <div className="col-md-4">
                                            <p className="text-muted mb-1 fw-semibold">TRN</p>
                                            <h6>{data.busienss_trn}</h6>
                                        </div>

                                        <div className="col-md-4">
                                            <p className="text-muted mb-1 fw-semibold">Credit Limit</p>
                                            <h6>₹{data.business_credit_limit?.toLocaleString("en-IN")}</h6>
                                        </div>

                                        <div className="col-md-4">
                                            <p className="text-muted mb-1 fw-semibold">Credit Balance</p>
                                            <h6>₹{data.business_credit_balance?.toLocaleString("en-IN")}</h6>
                                        </div>

                                        <div className="col-md-4">
                                            <p className="text-muted mb-1 fw-semibold">Credit Expiry</p>
                                            <h6>{DateFormater(data.business_credit_expiry)}</h6>
                                        </div>

                                        <div className="col-md-4">
                                            <p className="text-muted mb-1 fw-semibold">Reward Points</p>
                                            <h6>{data.business_reward_points_balance}</h6>
                                        </div>

                                        <div className="col-md-4">
                                            <p className="text-muted mb-1 fw-semibold">Opening Points</p>
                                            <h6>{data.opening_points}</h6>
                                        </div>

                                        <div className="col-md-4">
                                            <p className="text-muted mb-1 fw-semibold">Minimum Order Limit</p>
                                            <h6>₹{data.minimum_order_limit?.toLocaleString("en-IN")}</h6>
                                        </div>

                                        <div className="col-md-4">
                                            <p className="text-muted mb-1 fw-semibold">Registered Date</p>
                                            <h6>{DateFormater(data.business_registered_date)}</h6>
                                        </div>

                                        <div className="col-md-4">
                                            <p className="text-muted mb-1 fw-semibold">Due Days</p>
                                            <h6>{data.due_days}</h6>
                                        </div>

                                        <div className="col-md-4">
                                            <p className="text-muted mb-1 fw-semibold">COD Status</p>
                                            <h6>
                                                {data.business_cod_status === 1 ? "Enabled" : "Disabled"}
                                            </h6>
                                        </div>

                                        <div className="col-md-4">
                                            <p className="text-muted mb-1 fw-semibold">Account Status</p>
                                            <h6>{statusBadge(data.is_active)}</h6>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="text-end mt-4">
                                <Link to="/Business/List">
                                    <button className="btn btn-primary btn-label left">
                                        <i className="ri-arrow-left-line label-icon"></i> Back
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BusinessDetails;
