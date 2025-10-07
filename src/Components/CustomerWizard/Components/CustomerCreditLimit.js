import React, { useContext, useEffect, useState } from 'react'
import { ConfigContext } from '../../../Context/ConfigContext';
import axios from 'axios';
import { TableRows } from '../../Shimmer';

const CustomerCreditLimit = ({ business_id }) => {
    const { apiURL, apiHeaderJson } = useContext(ConfigContext);
    const headers = apiHeaderJson;

    const [details, setDetails] = useState([]);
    const [loading, setLoading] = useState(true);

    const GetCreditLimit = async () => {
        try {
            const response = await axios.get(`${apiURL}Business/GetBusinessCrditLimit`, { params: { business_id }, headers });

            const { success, data } = response?.data;

            if (success) {
                setDetails(data || []);
            }
        } catch (error) {
            console.log("error ===>", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (business_id) {
            GetCreditLimit();
        }
    }, [business_id]);

    return (
        <div className='row'>
            <div className="col-md-12">
                <div className="card shadow-sm">
                    <div className="card-header">
                        <h5 className="card-title mb-0">Credit Limit Info</h5>
                    </div>
                    <div className="card-body">
                        <div className="table-responsive">
                            <table className="table table-striped text-center">
                                <thead>
                                    <tr>
                                        <th>Business Id</th>
                                        <th>Existing Credit Limit</th>
                                        <th>Request Credit Limit</th>
                                        <th>Approve Credit Limit</th>
                                        <th>Request By</th>
                                        <th>Approve By</th>
                                        <th>Credit Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        loading ?
                                            <TableRows colspan={12} rows={10} />
                                            :
                                            details?.length > 0 ?
                                                details?.map((item, index) => {
                                                    return (
                                                        <tr key={index}>
                                                            <td className='fw-bold'>{item?.business_id}</td>
                                                            <td className={`${item?.existing_credit_limit > 0 ? "text-success" : "text-danger"} fw-bold`}>{item?.existing_credit_limit}</td>
                                                            <td className='text-warning fw-bold'>{item?.requested_credit_limit}</td>
                                                            <td className={`${item?.approved_credit_limit > 0 ? "text-success" : "text-danger"} fw-bold`}>{item?.approved_credit_limit}</td>
                                                            <td>{item?.requested_by_name ?? "-"}</td>
                                                            <td>{item?.approved_by_name ?? "-"}</td>
                                                            <td>
                                                                {
                                                                    item?.request_status === 0 ?
                                                                        <span className='badge bg-warning text-uppercase'>pending</span>
                                                                        : item?.request_status === 1 ?
                                                                            <span className='badge bg-success text-uppercase'>Approved</span>
                                                                            : item?.request_status === 2 ?
                                                                                <span className='badge bg-danger text-uppercase'>Rejected</span>
                                                                                : "-"
                                                                }
                                                            </td>
                                                        </tr>
                                                    )
                                                })
                                                : ""
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default CustomerCreditLimit;
