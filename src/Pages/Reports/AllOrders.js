import { useContext, useEffect, useRef, useState } from 'react'
import PageTitle from '../../Components/PageTitle'
import { ConfigContext } from '../../Context/ConfigContext'
import axios from 'axios'
import Flatpicker from "react-flatpickr";
import { TableRows, NoRecords } from '../../Components/Shimmer'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { GlobalLimitChanger } from '../../Components/InputElements'
import { DateFormater, getCurrentDate } from '../../Components/GlobalFunctions'
import { GetStatusBadge } from '../../Utils/GetStatusBadge'
import { downloadExcel } from '../../Components/FileDownloader';

const AllOrders = () => {

    const { primaryColor, apiHeaderJson, apiURL } = useContext(ConfigContext)
    const headers = apiHeaderJson
    const datePickerRef = useRef(null)
    const { status } = useParams()

    const [data, setData] = useState([])
    const [next, setNext] = useState(false)
    const [prev, setPrev] = useState(false)
    const [totalRecords, setTotalRecords] = useState(0)
    const [totalPages, setTotalPages] = useState(0)
    const [loading, setLoading] = useState(true)
    const [keyword, setKeyword] = useState('')
    const [dateRange, setDateRange] = useState([])
    const [isUpdate, setIsUpdate] = useState(false)

    const [searchParams, setSearchParams] = useSearchParams();

    const pageFromUrl = Number(searchParams.get("page")) || 1;
    const limitFromUrl = Number(searchParams.get("limit")) || 10;

    const [page, setPage] = useState(pageFromUrl);
    const [limit, setLimit] = useState(limitFromUrl);

    const getData = async () => {
        try {
            setLoading(true)
            const response = await axios.get(`${apiURL}Reports/GetBusinessAllOrdersReport`, {
                headers,
                params: {
                    keyword,
                    page,
                    limit,
                    from_date: dateRange[0] || "",
                    to_date: dateRange[1] || "",
                    status
                }
            })
            const { success, data, page: currentPage, next, prev, total_pages, total_records } = response.data

            if (success) {
                setData(data)
                setPage(currentPage)
                setNext(next)
                setPrev(prev)
                setTotalPages(total_pages)
                setTotalRecords(total_records)
            }
        } catch (error) {
            console.error('Error getting data:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleDownload = () => {
        const excelCols = [
            { label: "Order ID", key: "secret_order_id" },
            { label: "Account ID", key: "business_order_business_id" },
            { label: "Account Name", key: "business_name" },
            { label: "Order Date", key: "business_order_date" },
            { label: "Payment Method", key: "business_order_payment_method" },
            { label: "Total Amount", key: "corrected_grand_total" },
            { label: "Reward Points", key: "business_order_earned_points" },
            { label: "Status", key: "business_order_status" }
        ];

        downloadExcel({
            apiURL,
            endpoint: "Reports/GetBusinessAllOrdersReport",
            headers,
            params: {
                page: 1,
                limit: totalRecords || 100000,
                keyword,
                from_date: dateRange[0] || "",
                to_date: dateRange[1] || "",
                status
            },
            cols: excelCols,
            fileName: `Salesman_Orders_${getCurrentDate()}.xlsx`
        });
    };

    const handlePrev = () => {
        if (prev) {
            setPage(prev => prev - 1)
        }
    }

    const handleNext = () => {
        if (next) {
            setPage(prev => prev + 1)
        }
    }

    const handleChange = (e) => {
        setPage(parseInt(e.target.value, 10))
    }

    const handleSearch = () => {
        setPage(1);
        setIsUpdate(prev => !prev);
    }

    const handelClear = () => {
        setKeyword("");
        setDateRange([])
        setPage(1)
        if (datePickerRef.current && datePickerRef.current.flatpickr) {
            datePickerRef.current.flatpickr.clear();
        }
        setIsUpdate(prev => !prev)
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
        getData();
    }, [limit, page, isUpdate])

    return (
        <>
            <div className="main-content">
                <div className="page-content">
                    <div className="container-fluid">
                        <PageTitle title="Salesman Orders" primary="Reports" />

                        <div className="row">
                            <div className="col-md-12">
                                <div className="card">
                                    <div
                                        className="card-header d-flex align-items-center justify-content-between"
                                        style={{ backgroundColor: primaryColor }}
                                    >
                                        <h5 className="mb-0 text-white">
                                            Salesman Orders List
                                        </h5>

                                        {data.length > 0 && (
                                            <button
                                                className="btn btn-success btn-sm btn-label"
                                                onClick={handleDownload}
                                            >
                                                <i className="ri-file-excel-2-line label-icon"></i>
                                                Export
                                            </button>
                                        )}
                                    </div>

                                    <div className="card-body">
                                        <div className="row mb-4 g-3 align-items-center">
                                            
                                            <div className="col-lg-3 col-md-6 col-12">
                                                <div className="position-relative w-100">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="Search by Account ID"
                                                        name="keyword"
                                                        value={keyword}
                                                        onChange={(e) => setKeyword(e.target.value)}
                                                    />
                                                    <span className="position-absolute end-0 top-50 translate-middle-y me-3">
                                                        <i className="ri-search-line"></i>
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Date Range */}
                                            <div className="col-lg-3 col-md-6 col-12">
                                                <Flatpicker
                                                    ref={datePickerRef}
                                                    className="form-control"
                                                    options={{
                                                        dateFormat: "Y-m-d",
                                                        mode: "range",
                                                    }}
                                                    onChange={(selectedDates) => setDateRange(selectedDates)}
                                                    value={dateRange}
                                                    placeholder="Date Range"
                                                />
                                            </div>

                                            {/* Buttons */}
                                            <div className="col-lg-3 col-md-6 col-12 d-flex gap-3 flex-lg-nowrap flex-wrap">
                                                <button
                                                    type="button"
                                                    className="btn btn-danger btn-label right"
                                                    onClick={handleSearch}
                                                    disabled={!keyword && dateRange.length === 0}
                                                >
                                                    Filter
                                                    <i className="ri-filter-line label-icon align-middle fs-16 ms-2"></i>
                                                </button>

                                                <button
                                                    type="button"
                                                    className="btn btn-light"
                                                    onClick={handelClear}
                                                    disabled={!keyword && dateRange.length === 0}
                                                >
                                                    Reset
                                                </button>
                                            </div>

                                        </div>
                                        <div className="table-card table-responsive">
                                            <table className="table table-bordered table-striped table-hover table-nowrap mb-0">

                                                <thead className="table-light text-center">
                                                    <tr>
                                                        <th width="5%">Order ID</th>
                                                        <th width="5%">Account ID</th>
                                                        <th width="5%">Account Name</th>
                                                        <th width="10%">Order Date</th>
                                                        <th width="5%">Payment Method</th>
                                                        <th width="15%">Total Amount</th>
                                                        <th width="10%">Reward Points</th>
                                                        <th width="7%">Status</th>
                                                        <th width="7%">Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {loading ? (
                                                        <TableRows colspan={11} rows={10} />
                                                    ) : data.length > 0 ? (
                                                        data.map((row) => (
                                                            <tr key={row.business_order_id} className="text-center">
                                                                <td>
                                                                    <Link style={{ color: primaryColor, fontWeight: "bolder" }}
                                                                        to={`/OrderInfo/${row.business_order_id}/${row.secret_order_id}/${row.business_order_business_id}`}
                                                                    >
                                                                        {row.secret_order_id}
                                                                    </Link>
                                                                </td>
                                                                <td>
                                                                    <Link style={{ color: primaryColor, fontWeight: "bolder" }} to={`/CustomerDashboard/${row.business_order_business_id}`}>
                                                                        {row.business_order_business_id}
                                                                    </Link>
                                                                </td>
                                                                <td>
                                                                    <Link style={{ color: primaryColor, fontWeight: "bolder" }} to={`/CustomerDashboard/${row.business_order_business_id}`}>
                                                                        {row.business_name}
                                                                    </Link>
                                                                </td>
                                                                <td>{DateFormater(row.business_order_date)}</td>
                                                                <td>{row.business_order_payment_method}</td>
                                                                <td className='text-success fw-bold'>{row.business_order_grand_total?.toFixed(2)} AED</td>
                                                                <td>
                                                                    <span className='badge bg-success'>
                                                                        {row?.business_order_earned_points} Points
                                                                    </span>
                                                                </td>
                                                                <td>{GetStatusBadge(row.business_order_status)}</td>
                                                                <td className='d-flex gap-2 justify-content-center'>
                                                                    <Link to={`/OrderInfo/${row.business_order_id}/${row.secret_order_id}/${row.business_order_business_id}`}>
                                                                        <button
                                                                            className="btn btn-sm btn-soft-info"
                                                                        >
                                                                            <i className='ri-eye-line'></i>
                                                                        </button>
                                                                    </Link>
                                                                </td>
                                                            </tr>
                                                        ))
                                                    ) : (
                                                        <tr>
                                                            <td colSpan={11}>
                                                                <NoRecords />
                                                            </td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                                {data.length > 0 && (
                                                    <tfoot className='table-light'>
                                                        <tr>
                                                            <th colSpan={11}>
                                                                <div className="d-flex justify-content-between">
                                                                    <button disabled={!prev && !loading} type="button" onClick={handlePrev} className={`btn btn-warning btn-label waves-effect waves-light`}>
                                                                        <i className="ri-arrow-left-line label-icon align-middle fs-16 me-2" /> Previous
                                                                    </button>
                                                                    <div className='col-md-4' style={{ display: 'flex', alignItems: 'center' }}>
                                                                        <small>Total Records: {totalRecords} | Total Pages: {totalPages} | Current Page: {page}</small>
                                                                    </div>
                                                                    <div className='col-md-2'>
                                                                        <select className="form-select" value={page} onChange={handleChange}>
                                                                            {Array.from({ length: totalPages }, (_, i) => (
                                                                                <option key={i + 1} value={i + 1}>
                                                                                    {i + 1}
                                                                                </option>
                                                                            ))}
                                                                        </select>
                                                                    </div>
                                                                    <div className='col-md-2'>
                                                                        <GlobalLimitChanger
                                                                            placeholder="Set limit:"
                                                                            name="globalLimit"
                                                                            value={limit}
                                                                            onChange={setLimit}
                                                                            showAllValue={totalRecords}
                                                                        />
                                                                    </div>
                                                                    <button disabled={!next && !loading} type="button" onClick={handleNext} className={`btn btn-primary btn-label waves-effect right waves-light`}>
                                                                        <i className="ri-arrow-right-line label-icon align-middle fs-16 ms-2" /> Next
                                                                    </button>
                                                                </div>
                                                            </th>
                                                        </tr>
                                                    </tfoot>
                                                )}
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AllOrders