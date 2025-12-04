import React, { useContext, useEffect, useState } from 'react'
import { ConfigContext } from '../../Context/ConfigContext';
import axios from 'axios';
import PageTitle from '../../Components/PageTitle';
import { NoRecords, TableRows } from '../../Components/Shimmer';
import { Link } from 'react-router-dom';
import { DateFormater } from '../../Components/GlobalFunctions';
import TableFooter from '../../Components/Table/TableFooter';

const NoRecendsOrderReports = () => {

    const { apiHeaderJson, apiURL, primaryColor } = useContext(ConfigContext);
    const headers = apiHeaderJson;
    const [noRecentOrders, setNoRecentOrders] = useState([]);

    const [next, setNext] = useState(false)
    const [prev, setPrev] = useState(false)
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(10)
    const [totalRecords, setTotalRecords] = useState(0)
    const [totalPages, setTotalPages] = useState(0)
    const [loading, setLoading] = useState(true)


    const GetBusinessesNoRecentOrders = async () => {
        try {
            const response = await axios.get(`${apiURL}Dashboard/GetBusinessesNoRecentOrders`, { params: { limit, page }, headers });
            const { success, data, page: currentPage, next, prev, total_pages, total_records } = response.data

            if (success) {
                setNoRecentOrders(data)
                setPage(currentPage)
                setNext(next)
                setPrev(prev)
                setTotalPages(total_pages)
                setTotalRecords(total_records)
            }
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    };

    useEffect(() => {
        GetBusinessesNoRecentOrders()
    }, [page, limit])

    return (
        <div className='main-content'>
            <div className='page-content'>
                <div className='container-fluid'>
                    <PageTitle title="All No Recends Order" primary="Reports" />
                    <div className="card shadow-sm border-0">
                        <div className="card-header" style={{ background: primaryColor }}>
                            <div className="d-flex justify-content-between align-items-center">

                                <h5 className="mb-0 card-title text-white">
                                    <i className="ri-store-2-line me-2"></i>
                                    No Recent Orders By Business
                                </h5>
                            </div>
                        </div>
                        <div className="card-body">

                            <div className="table-responsive table-card">
                                <table className="table align-middle table-nowrap mb-0">
                                    <thead className="table-light">
                                        <tr>
                                            <th className="text-start">Business Id</th>
                                            <th className="text-start">Business Name</th>
                                            <th>Contact</th>
                                            <th>Email</th>
                                            <th>Total Orders</th>
                                            <th>Last Order Gap</th>
                                            <th>Last Order Date</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    {
                                        loading ? (
                                            <TableRows rows="10" colspan="8" />
                                        ) : (
                                            <>
                                                <tbody>
                                                    {
                                                        noRecentOrders?.length > 0 ?
                                                            noRecentOrders?.map((item, index) => (
                                                                <tr key={index}>
                                                                    <td className="text-start fw-semibold">
                                                                        {item.business_id}
                                                                    </td>
                                                                    <td className='text-dark fw-bold'>
                                                                        <span
                                                                            className="text-ellipsis" title={item?.business_name}
                                                                        >
                                                                            {item?.business_name}
                                                                        </span>
                                                                    </td>
                                                                    <td>{item.business_contact_number ?? "N/A"}</td>
                                                                    <td>{item.business_email ?? "N/A"}</td>
                                                                    <td>{item.total_orders || "N/A"}</td>
                                                                    <td className="text-danger fw-bold">{item.no_order_since_days ?? "N/A"} Days</td>
                                                                    <td className={item.last_order_date ? "fw-bold" : "text-muted"}>
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
                                                                <td colSpan={8} className="text-center py-4">
                                                                    <div className="d-flex justify-content-center align-items-center">
                                                                        <NoRecords />
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                    }
                                                </tbody>
                                                <TableFooter
                                                    page={page}
                                                    setPage={setPage}
                                                    prev={prev}
                                                    next={next}
                                                    loading={loading}
                                                    limit={limit}
                                                    setLimit={setLimit}
                                                    totalRecords={totalRecords}
                                                    totalPages={totalPages}
                                                />
                                            </>
                                        )}
                                </table>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default NoRecendsOrderReports
