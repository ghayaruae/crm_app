import React, { useContext, useEffect, useState, useRef } from 'react'
import PageTitle from '../../../Components/PageTitle'
import { ConfigContext } from '../../../Context/ConfigContext'
import Select from 'react-select'
import axios from 'axios'
import Swal from 'sweetalert2'
import Flatpicker from "react-flatpickr";
import { TableRows, NoRecords } from '../../../Components/Shimmer'
import { Link } from 'react-router-dom'
import { DateFormater } from '../../../Components/GlobalFunctions'
import { ActionBtns } from '../../../Components/ActionBtns'
import { GlobalLimitChanger } from '../../../Components/InputElements'
import { GetStatusBadge } from '../../../Utils/GetStatusBadge'

const BusinessOrders = () => {
    const { primaryColor, apiHeaderJson, apiURL, selectTheme, selectStyle, statusOptions } = useContext(ConfigContext)
    const headers = apiHeaderJson
    const datePickerRef = useRef(null)

    const [data, setData] = useState([])
    const [selectedStatus, setSelectedStatus] = useState(null)
    const [next, setNext] = useState(false)
    const [prev, setPrev] = useState(false)
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(10)
    const [totalRecords, setTotalRecords] = useState(0)
    const [totalPages, setTotalPages] = useState(0)
    const [loading, setLoading] = useState(true)
    const [keyword, setKeyword] = useState('')
    const [businessName, setBusinessName] = useState('')
    const [dateRange, setDateRange] = useState([])
    const [isUpdate, setIsUpdate] = useState(false)


    const getData = async () => {
        try {
            setLoading(true)
            const response = await axios.get(`${apiURL}Business/GetBusinessOrders`, {
                params: {
                    keyword,
                    business_name: businessName,
                    page,
                    limit,
                    from_date: dateRange[0] || "",
                    to_date: dateRange[1] || "",
                    status: selectedStatus
                },
                headers,
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
        if (dateRange.length > 0 || selectedStatus || businessName) {
            getData();
        } else {
            return;
        }
    }

    const handelClear = () => {
        if (dateRange.length > 0 || selectedStatus || businessName) {
            setDateRange([]);
            setSelectedStatus(null);
            setBusinessName('');
            if (datePickerRef.current && datePickerRef.current.flatpickr) {
                datePickerRef.current.flatpickr.clear();
            }
            setIsUpdate(prev => !prev)
        }
    };

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            getData()
        }, 500);

        return () => clearTimeout(delayDebounce);
    }, [keyword, isUpdate])

    useEffect(() => {
        getData();
    }, [limit, page])

    return (
        <div className="main-content">
            <div className="page-content">
                <div className="container-fluid">
                    <PageTitle title="Business Orders" primary="Inventory" />
                    <div className="row">
                        <div className="col-md-12">
                            <div className="card">
                                <div className="card-header" style={{ backgroundColor: primaryColor }}>
                                    <div className="row d-flex align-items-center">
                                        <div className="col-md-6">
                                            <h4 className='text-white mb-0'>Orders List</h4>
                                        </div>
                                    </div>
                                </div>

                                <div className="card-body">
                                    <div className="row g-3 align-items-end mb-4">

                                        <div className="col-md-3">
                                            <Select
                                                placeholder="Select Status"
                                                theme={selectTheme}
                                                styles={selectStyle}
                                                options={statusOptions}
                                                value={statusOptions.find(option => option.value === selectedStatus) || null}
                                                onChange={(selected) => setSelectedStatus(selected.value)}
                                            />
                                        </div>

                                        <div className="col-md-2">
                                            <Flatpicker
                                                ref={datePickerRef}
                                                className="form-control"
                                                options={{
                                                    dateFormat: "Y-m-d",
                                                    mode: "range",
                                                    placeholder: "Select Date Range"
                                                }}
                                                onChange={(selectedDates) => setDateRange(selectedDates)}
                                                value={dateRange}
                                                placeholder="Date Range"
                                            />
                                        </div>

                                        <div className="col-md-2">
                                            <div className="position-relative">
                                                <input
                                                    type="text"
                                                    className="form-control pe-5"
                                                    placeholder="Business Name"
                                                    name="businessName"
                                                    value={businessName}
                                                    onChange={(e) => setBusinessName(e.target.value)}
                                                />
                                                <span className="position-absolute end-0 top-50 translate-middle-y me-3 text-muted">
                                                    <i className="ri-search-line"></i>
                                                </span>
                                            </div>
                                        </div>

                                        <div className="col-md-3">
                                            <div className="position-relative">
                                                <input
                                                    type="text"
                                                    className="form-control pe-5"
                                                    placeholder="Search by Order ID"
                                                    name="keyword"
                                                    value={keyword}
                                                    onChange={(e) => setKeyword(e.target.value)}
                                                />
                                                <span className="position-absolute end-0 top-50 translate-middle-y me-3 text-muted">
                                                    <i className="ri-search-line"></i>
                                                </span>
                                            </div>
                                        </div>

                                        <div className="col-md-2 d-flex justify-content-md-end gap-2">
                                            <button
                                                type="button"
                                                className="btn btn-danger btn-label right"
                                                onClick={handleSearch}
                                                disabled={selectedStatus || dateRange.length > 0 || businessName ? false : true}
                                            >
                                                Filter
                                                <i className="ri-filter-line label-icon align-middle fs-16 ms-2"></i>
                                            </button>

                                            <button
                                                type="button"
                                                className="btn btn-light"
                                                onClick={handelClear}
                                                disabled={selectedStatus || dateRange.length > 0 || businessName ? false : true}
                                            >
                                                Reset
                                            </button>
                                        </div>

                                    </div>

                                    <div className="table-card table-responsive">
                                        <table className="table table-bordered table-striped table-nowrap table-hover mb-0">
                                            {loading ? (
                                                <TableRows rows="10" colspan="12" />
                                            ) : (
                                                <>
                                                    <thead className="table-light text-center">
                                                        <tr>
                                                            <th width="5%">Order ID</th>
                                                            <th width="5%">Business ID</th>
                                                            <th width="5%">Business Name</th>
                                                            <th width="10%">Order Date</th>
                                                            <th width="5%">Payment Method</th>
                                                            <th width="15%">Total Amount</th>
                                                            <th width="10%">Reward Points</th>
                                                            <th width="7%">Status</th>
                                                            <th width="10%">Actions</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {data.length > 0 ? (
                                                            data.map((row) => (
                                                                <tr key={row.business_order_id} className="text-center">
                                                                    <td>
                                                                        <Link style={{ color: primaryColor, fontWeight: "bolder" }} to={`/OrderInfo/${row.business_order_id}`}>
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
                                                                    <td className='text-success fw-bold'>AED {row.business_order_grand_total}</td>
                                                                    <td>{row.business_order_earned_points}</td>
                                                                    <td>{GetStatusBadge(row.business_order_status)}</td>
                                                                    <td className='d-flex gap-2 justify-content-center'>
                                                                        <Link to={`/OrderInfo/${row.business_order_id}`}>
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
                                                                <td colSpan={12}>
                                                                    <NoRecords />
                                                                </td>
                                                            </tr>
                                                        )}
                                                    </tbody>
                                                    <tfoot className='table-light'>
                                                        <tr>
                                                            <th colSpan={12}>
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
                                                </>
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
    )
}

export default BusinessOrders