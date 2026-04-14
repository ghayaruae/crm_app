import React, { useContext, useEffect, useState } from 'react'
import { ConfigContext } from '../../Context/ConfigContext';
import axios from 'axios';
import PageTitle from '../../Components/PageTitle';
import { NoRecords, TableRows } from '../../Components/Shimmer';
import { Link, useSearchParams } from 'react-router-dom';
import { DateFormater } from '../../Components/GlobalFunctions';
import TableFooter from '../../Components/Table/TableFooter';
import * as XLSX from "xlsx";

const AllNoRecentOrdersReport = () => {

    const { apiHeaderJson, apiURL, primaryColor } = useContext(ConfigContext);
    const headers = apiHeaderJson;
    const [noRecentOrders, setNoRecentOrders] = useState([]);

    const [next, setNext] = useState(false)
    const [prev, setPrev] = useState(false)
    const [totalRecords, setTotalRecords] = useState(0)
    const [totalPages, setTotalPages] = useState(0)
    const [loading, setLoading] = useState(true)
    const [keyword, setKeyword] = useState('')
    const [isUpdate, setIsUpdate] = useState(false)

    const [searchParams, setSearchParams] = useSearchParams();

    const pageFromUrl = Number(searchParams.get("page")) || 1;
    const limitFromUrl = Number(searchParams.get("limit")) || 10;

    const [page, setPage] = useState(pageFromUrl);
    const [limit, setLimit] = useState(limitFromUrl);

    const [exporting, setExporting] = useState(false);
    const [progress, setProgress] = useState(0);

    const GetBusinessesNoRecentOrders = async () => {
        try {
            const response = await axios.get(`${apiURL}Reports/AllNoRecentOrders`, { params: { limit, page, keyword }, headers });
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

    const handleSearch = () => {
        if (keyword) {
            GetBusinessesNoRecentOrders();
        } else {
            return;
        }
    }

    const handelClear = () => {
        if (keyword) {
            setKeyword("");
            setIsUpdate(prev => !prev)
        }
    };

    const handleExportExcel = () => {
        if (!noRecentOrders.length) return;

        try {
            setExporting(true);
            setProgress(20);

            const exportData = noRecentOrders.map((row) => ({
                "Account ID": row.business_id,
                "Account Name": row.business_name,
                "Salesman Name": row.business_salesmen_name || "-",
                "Contact": row.business_contact_number || "N/A",
                "Email": row.business_email || "N/A",
                "Total Orders": row.total_orders || 0,
                "No Order Since (Days)": row.no_order_since_days,
                "Last Order Date": row.last_order_date
                    ? DateFormater(row.last_order_date)
                    : "No Orders Yet"
            }));

            setProgress(60);

            const worksheet = XLSX.utils.json_to_sheet(exportData);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "No Recent Orders");

            setProgress(90);

            XLSX.writeFile(
                workbook,
                `No_Recent_Orders_${new Date().toISOString().slice(0, 10)}.xlsx`
            );

            setProgress(100);
        } catch (err) {
            console.error("Export Error:", err);
        } finally {
            setTimeout(() => {
                setExporting(false);
                setProgress(0);
            }, 500);
        }
    };

    useEffect(() => {
        setSearchParams(prev => {
            const params = new URLSearchParams(prev);
            params.set("page", page);
            params.set("limit", limit);
            return params;
        });
    }, [page, limit]);

    useEffect(() => {
        GetBusinessesNoRecentOrders()
    }, [page, limit, isUpdate])

    return (
        <div className='main-content'>
            <div className='page-content'>
                <div className='container-fluid'>
                    <PageTitle title="All No Recent Orders" primary="Reports" />
                    <div className="card shadow-sm border-0">
                        <div
                            className="card-header d-flex align-items-center justify-content-between"
                            style={{ backgroundColor: primaryColor }}
                        >
                            <h5 className="mb-0 text-white">
                                <i className="ri-store-2-line me-2"></i>
                                No Recent Orders By Salesman
                            </h5>

                            {noRecentOrders.length > 0 && (
                                <button
                                    className="btn btn-success btn-sm btn-label"
                                    onClick={handleExportExcel}
                                    disabled={exporting}
                                >
                                    <i className="ri-file-excel-2-line label-icon"></i>
                                    {exporting ? "Exporting..." : "Export"}
                                </button>
                            )}
                        </div>
                        {exporting && (
                            <div className="px-3 pt-2 pb-1 bg-white border-bottom">
                                <div className="d-flex justify-content-between mb-1">
                                    <small className="text-muted fw-semibold">
                                        Exporting, please wait...
                                    </small>
                                    <small className="text-muted fw-bold">
                                        {progress}%
                                    </small>
                                </div>

                                <div className="progress" style={{ height: "8px", borderRadius: "20px" }}>
                                    <div
                                        className="progress-bar progress-bar-striped progress-bar-animated bg-success"
                                        role="progressbar"
                                        style={{
                                            width: `${progress}%`,
                                            borderRadius: "20px",
                                            transition: "width 0.4s ease"
                                        }}
                                    />
                                </div>
                            </div>
                        )}
                        <div className="card-body">
                            <div className="row mb-4 align-items-center">
                                <div className="col-md-3">
                                    <div className="position-relative w-100">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Search by Account Name"
                                            name="keyword"
                                            value={keyword}
                                            onChange={(e) => setKeyword(e.target.value)}
                                        />
                                        <span className="position-absolute end-0 top-50 translate-middle-y me-3">
                                            <i className="ri-search-line"></i>
                                        </span>
                                    </div>
                                </div>
                                <div className="col-md-3 d-flex gap-3 mt-2 mt-md-0">
                                    <button
                                        type="button"
                                        className="btn btn-danger btn-label right"
                                        onClick={handleSearch}
                                        disabled={keyword ? false : true}
                                    >
                                        Filter
                                        <i className="ri-filter-line label-icon align-middle fs-16 ms-2"></i>
                                    </button>

                                    <button
                                        type="button"
                                        className="btn btn-light"
                                        onClick={handelClear}
                                        disabled={keyword ? false : true}
                                    >
                                        Reset
                                    </button>
                                </div>
                            </div>
                            <div className="table-responsive table-card">
                                <table className="table align-middle table-nowrap mb-0">
                                    <thead className="table-light">
                                        <tr>
                                            <th className="text-start">Account Id</th>
                                            <th className="text-start">Account Name</th>
                                            <th className="text-start">Salesman Name</th>
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
                                            <TableRows rows="10" colspan="10" />
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
                                                                    <td className='text-dark fw-bold'>
                                                                        <span
                                                                            className="text-ellipsis" title={item?.business_salesmen_name}
                                                                        >
                                                                            {item?.business_salesmen_name || "-"}
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
                                                                <td colSpan={10} className="text-center py-4">
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

export default AllNoRecentOrdersReport
