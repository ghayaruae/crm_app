import React, { useContext, useEffect, useState } from 'react'
import { ConfigContext } from '../../../Context/ConfigContext';
import axios from 'axios';
import { TableRows } from '../../Shimmer';


const CustomerDueDays = ({ business_id }) => {
    const { apiURL, apiHeaderJson } = useContext(ConfigContext);
    const headers = apiHeaderJson;

    const [details, setDetails] = useState([]);
    const [loading, setLoading] = useState(true);

    const GetDueDaysInfo = async () => {
        try {
            const response = await axios.get(
                `${apiURL}Business/GetBusinessDueDays`,
                { params: { business_id }, headers }
            );

            const { success, data } = response?.data;
            if (success) {
                setDetails(data || []);
            }
        } catch (error) {
            console.log("error ===>", error);
        } finally {
            setLoading(false)
        }
    };

    useEffect(() => {
        if (business_id) {
            GetDueDaysInfo();
        }
    }, [business_id]);

    return (
        <div className='row'>
            <div className="col-md-12">
                <div className="card shadow-sm">
                    <div className="card-header d-flex justify-content-between align-items-center">
                        <h5 className="card-title mb-0">Due Days Info</h5>
                    </div>
                    <div className="card-body">
                        <div className="table-responsive">
                            <table className="table table-striped text-center">
                                <thead>
                                    <tr>
                                        <th>Business Id</th>
                                        <th>Existing Due Days</th>
                                        <th>Request Due Days</th>
                                        <th>Approve Due Days</th>
                                        <th>Request By</th>
                                        <th>Approve By</th>
                                        <th>Due Days Status</th>
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
                                                            <td>{item?.existing_due_days ?? "3"} Days</td>
                                                            <td className='text-warning fw-bold'>{item?.requested_due_days} Days</td>
                                                            <td className={`${item?.approved_due_days > 0 ? "text-success" : "text-danger"} fw-bold`}>{item?.approved_due_days ?? 3} Days</td>
                                                            <td>{item?.requested_by_name ?? "-"}</td>
                                                            <td>{item?.approved_by_name ?? "-"}</td>
                                                            <td>
                                                                {
                                                                    Number(item?.request_status) === 0 ?
                                                                        <span className='badge bg-warning text-uppercase'>pending</span>
                                                                        : Number(item?.request_status) === 1 ?
                                                                            <span className='badge bg-success text-uppercase'>Approved</span>
                                                                            : Number(item?.request_status) === 2 ?
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
        </div>
    )
}

export default CustomerDueDays
