import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios';
import { DateFormater, TimeFormater } from '../../GlobalFunctions';
import { NoRecords, TableRows } from '../../Shimmer';
import { ConfigContext } from '../../../Context/ConfigContext';
import { GetStatusBadge } from '../../../Utils/GetStatusBadge';

const CustomerOrderHistory = ({ business_id }) => {

    const { apiURL, apiHeaderJson, PrimaryColor } = useContext(ConfigContext);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const GetBusinessOrderHistory = async () => {
        try {
            const headers = apiHeaderJson;

            const response = await axios.get(`${apiURL}Business/GetBusinessOrdersList`, {
                params: { business_id }, headers
            })

            const { data, success } = response?.data;

            if (success) {
                setOrders(data)
            }

        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        GetBusinessOrderHistory()
    }, [business_id])

    return (
        <div className='row'>
            <div className="col-md-12">
                <div className="card">
                    <div className="card-header border border-bottom">
                        <h5 className='mb-0'>Order History</h5>
                    </div>
                    <div className="card-body">
                        <div className="table-responsive">
                            <table className="table table-striped text-center">
                                <thead>
                                    <tr>
                                        <th>Order Id</th>
                                        <th>Order UID</th>
                                        <th>Order Date</th>
                                        <th>Payment Method</th>
                                        <th>Total</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        loading ?
                                            <TableRows colspan={12} rows={10} />
                                            :
                                            orders?.length > 0 ?
                                                orders?.map((item, index) => {
                                                    return (
                                                        <tr key={index}>
                                                            <td className='fw-bold'>{item?.business_order_id}</td>
                                                            <td className='fw-bold' style={{ color: PrimaryColor }}>{item?.secret_order_id}</td>
                                                            <td>
                                                                {DateFormater(item?.business_order_date)}
                                                            </td>
                                                            <td
                                                                className={`${item?.business_order_payment_method === "credit"
                                                                    || item?.business_order_payment_method === "Credit" ? "text-danger fw-bold" : ""} text-capitalize`}
                                                            >
                                                                {item?.business_order_payment_method}
                                                            </td>
                                                            <td className='text-success fw-bold'>
                                                                AED {item?.business_order_grand_total}
                                                            </td>
                                                            <td>
                                                                {GetStatusBadge(item?.business_order_status)}
                                                            </td>
                                                        </tr>
                                                    )
                                                })
                                                : <tr>
                                                    <td colspan={8}>
                                                        <NoRecords />
                                                    </td>
                                                </tr>
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

export default CustomerOrderHistory
