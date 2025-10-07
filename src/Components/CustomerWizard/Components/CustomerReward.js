import React, { useContext, useEffect, useState } from 'react';
import { ConfigContext } from '../../../../Context/ConfigContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import RewardPointsHistory from '../../RewardsPointsWizard/RewardPointsHistory';

const CustomerReward = ({ business_id }) => {
    const { apiURL, apiHeaderJson } = useContext(ConfigContext);
    const [reward, setReward] = useState({});
    const navigate = useNavigate()

    const GetRewardsPointsInfo = async () => {
        try {
            const headers = apiHeaderJson;
            const response = await axios.get(`${apiURL}Masters/RewardsPointsInfo`, {
                params: { business_id },
                headers
            });
            if (response?.data) {
                const data = response?.data?.data[0];
                setReward(data);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        GetRewardsPointsInfo();
    }, [business_id]);

    return (
        <div className="row">
            <div className="col-md-12">
                <div className="card shadow-sm border-0">
                    <div className="card-header d-flex justify-content-between align-items-center bg-white border-bottom">
                        <h5 className="mb-0">
                            <i className="fa-solid fa-gift text-primary me-2" />
                            Rewards Summary
                        </h5>
                        <span className="badge bg-primary fs-6">
                            Business ID : {business_id}
                        </span>
                    </div>

                    <div className="card-body">
                        {/* Rewards Cards */}
                        <div className="row g-4 text-center mb-4">

                            {/* Total Earned */}
                            <div className="col-md-4 col-lg-3">
                                <div className="border rounded-3 p-4 bg-white shadow-sm h-100">
                                    <div className="mb-2">
                                        <i className="fa-solid fa-star fs-2 text-info" />
                                    </div>
                                    <h6 className="text-muted">Total Rewards Points</h6>
                                    <h4 className="text-info fw-bold">{reward?.total_rewards_points ?? 0}</h4>
                                </div>
                            </div>

                            {/* Available Points */}
                            <div className="col-md-4 col-lg-3">
                                <div className="border rounded-3 p-4 bg-white shadow-sm h-100">
                                    <div className="mb-2">
                                        <i className="fa-solid fa-coins fs-2 text-success" />
                                    </div>
                                    <h6 className="text-muted">Available Reward Points</h6>
                                    <h4 className="text-success fw-bold">{reward?.total_rewards_points ?? 0}</h4>
                                </div>
                            </div>

                            {/* Total Used */}
                            <div className="col-md-4 col-lg-3">
                                <div className="border rounded-3 p-4 bg-white shadow-sm h-100">
                                    <div className="mb-2">
                                        <i className="fa-solid fa-check-circle fs-2 text-secondary" />
                                    </div>
                                    <h6 className="text-muted">Total Used Points</h6>
                                    <h4 className="text-secondary fw-bold">{reward?.total_used_points ?? 0}</h4>
                                </div>
                            </div>

                            {/* Total Expired */}
                            <div className="col-md-4 col-lg-3">
                                <div className="border rounded-3 p-4 bg-white shadow-sm h-100">
                                    <div className="mb-2">
                                        <i className="fa-solid fa-ban fs-2 text-danger" />
                                    </div>
                                    <h6 className="text-muted">Total Expired Points</h6>
                                    <h4 className="text-danger fw-bold">{reward?.total_expired_points ?? 0}</h4>
                                </div>
                            </div>

                            {/* Next Expiry Date */}
                            <div className="col-md-4 col-lg-3">
                                <div className="border rounded-3 p-4 bg-white shadow-sm h-100">
                                    <div className="mb-2">
                                        <i className="fa-solid fa-calendar-xmark fs-2 text-danger" />
                                    </div>
                                    <h6 className="text-muted">Last Order Expiry Date</h6>
                                    <h4 className="text-danger fw-bold">
                                        {!reward?.next_expiry_date
                                            ? new Date().toLocaleDateString('en-GB', {
                                                day: '2-digit',
                                                month: 'short',
                                                year: 'numeric'
                                            })
                                            : '-'}
                                    </h4>
                                </div>
                            </div>

                            {/* Last Redeemed */}
                            <div className="col-md-4 col-lg-3">
                                <div className="border rounded-3 p-4 bg-white shadow-sm h-100">
                                    <div className="mb-2">
                                        <i className="fa-solid fa-arrow-right-arrow-left fs-2 text-warning" />
                                    </div>
                                    <h6 className="text-muted">Last Redeemed Points</h6>
                                    <h4 className="text-warning fw-bold">
                                        {reward?.last_redeemed_points ?? 0}
                                    </h4>
                                    <p className="text-muted small mb-0">
                                        on {!reward?.last_redeemed_date
                                            ? new Date().toLocaleDateString('en-GB', {
                                                day: '2-digit',
                                                month: 'short',
                                                year: 'numeric'
                                            })
                                            : 'N/A'}
                                    </p>
                                </div>
                            </div>

                        </div>

                        <div className="text-center mb-4">
                            <button className="btn btn-outline-primary px-4" onClick={() => navigate(`/business/ViewRedeemOffers/${business_id}`)}>
                                <i className="fa-solid fa-tags me-2" />
                                View Offers
                            </button>
                        </div>

                        {
                            reward?.total_rewards_points > 0 &&
                            <div className="alert alert-warning d-flex align-items-center">
                                <i className="fa-solid fa-triangle-exclamation me-2 fs-5" />
                                <div>
                                    <strong>{reward?.total_rewards_points ?? 0} points</strong> will expire on <strong className='text-danger'>
                                        {!reward?.next_expiry_date
                                            ? new Date().toLocaleDateString('en-GB', {
                                                day: '2-digit',
                                                month: 'short',
                                                year: 'numeric'
                                            })
                                            : '-'}
                                    </strong>. Use them before they’re gone!
                                </div>
                            </div>
                        }

                        {
                            reward?.total_rewards_points > 0 &&
                            <RewardPointsHistory business_id={business_id} />
                        }

                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerReward;
