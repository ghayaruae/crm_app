import { useContext, useEffect, useState } from 'react'
import PageTitle from '../../Components/PageTitle'
import { ConfigContext } from '../../Context/ConfigContext'
import axios from 'axios'
import { TableRows, NoRecords } from '../../Components/Shimmer'
import { Link, useParams } from 'react-router-dom'
import { GlobalLimitChanger } from '../../Components/InputElements'
import * as XLSX from 'xlsx'

const AllBusinessesReport = () => {

    const { primaryColor, apiHeaderJson, apiURL } = useContext(ConfigContext)
    const headers = apiHeaderJson;

    const { status } = useParams();

    const [data, setData] = useState([])
    const [next, setNext] = useState(false)
    const [prev, setPrev] = useState(false)
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(10)
    const [totalRecords, setTotalRecords] = useState(0)
    const [totalPages, setTotalPages] = useState(0)
    const [loading, setLoading] = useState(true)
    const [keyword, setKeyword] = useState('')
    const [isUpdate, setIsUpdate] = useState(false)
    const [exporting, setExporting] = useState(false)
    const [progress, setProgress] = useState(0)

    const getData = async () => {
        try {
            setLoading(true)
            const response = await axios.get(`${apiURL}Reports/AllSalesmanAssignBusinessReport`, {
                headers,
                params: {
                    keyword,
                    page,
                    limit,
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

    const handleExportExcel = () => {
        if (!data.length) return

        try {
            setExporting(true)
            setProgress(20)

            const exportData = data.map((row) => ({
                "Account ID": row.business_id,
                "Salesman Name": row.business_salesmen_name,
                "Account Name": row.business_name,
                "Owner Name": row.business_contact_person,
                "Contact No": row.business_contact_number,
                "TRN No": row.busienss_trn,
                "Email": row.business_email,
                "Credit Limit": row.business_credit_limit,
                "Total Orders": row.total_orders || "No Order yet"
            }))

            setProgress(60)

            const worksheet = XLSX.utils.json_to_sheet(exportData)
            const workbook = XLSX.utils.book_new()
            XLSX.utils.book_append_sheet(workbook, worksheet, "All Accounts Report")

            setProgress(90)

            XLSX.writeFile(
                workbook,
                `All_Accounts_Report_${new Date().toISOString().slice(0, 10)}.xlsx`
            )

            setProgress(100)
        } catch (err) {
            console.error("Export Error:", err)
        } finally {
            setTimeout(() => {
                setExporting(false)
                setProgress(0)
            }, 500)
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
        if (keyword) {
            getData();
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

    useEffect(() => {
        getData();
    }, [limit, page, isUpdate])

    useEffect(() => {
        if (keyword === "") {
            getData();
        }
    }, [keyword])

    return (
        <>
            <div className="main-content">
                <div className="page-content">
                    <div className="container-fluid">
                        <PageTitle title="All Accounts" primary="Business" />

                        <div className="row">
                            <div className="col-md-12">
                                <div className="card">
                                    <div
                                        className="card-header d-flex align-items-center justify-content-between"
                                        style={{ backgroundColor: primaryColor }}
                                    >
                                        <h5 className="mb-0 text-white">All Account List</h5>

                                        {data.length > 0 && (
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
                                        <div className="table-card table-responsive">
                                            <table className="table table-bordered table-striped table-hover table-nowrap mb-0">
                                                <thead className="table-light text-center">
                                                    <tr>
                                                        <th>Account ID</th>
                                                        <th>Salesman Name</th>
                                                        <th>Account Name</th>
                                                        <th>Owner Name</th>
                                                        <th>Contact No</th>
                                                        <th>TRN No</th>
                                                        <th>Email</th>
                                                        <th>Credit Limit</th>
                                                        <th>Total Orders</th>
                                                    </tr>
                                                </thead>

                                                {loading ? (
                                                    <TableRows rows="10" colspan="10" />
                                                ) : (
                                                    <>
                                                        <tbody>
                                                            {data.length > 0 ? (
                                                                data.map((row) => (
                                                                    <tr key={row.business_id} className="text-center">
                                                                        <td
                                                                            style={{
                                                                                color: primaryColor,
                                                                                fontWeight: "bolder"
                                                                            }}
                                                                        >
                                                                            <Link to={`/CustomerDashboard/${row?.business_id}`}>
                                                                                {row?.business_id}
                                                                            </Link>
                                                                        </td>

                                                                        <td className="text-success fw-bold">
                                                                            {row?.business_salesmen_name}
                                                                        </td>

                                                                        <td
                                                                            style={{
                                                                                color: primaryColor,
                                                                                fontWeight: "bolder"
                                                                            }}
                                                                        >
                                                                            <span
                                                                                className="text-ellipsis"
                                                                                title={row?.business_name}
                                                                            >
                                                                                {row?.business_name}
                                                                            </span>
                                                                        </td>

                                                                        <td className="text-info fw-bold">
                                                                            <span
                                                                                className="text-ellipsis"
                                                                                title={
                                                                                    row?.business_contact_person
                                                                                }
                                                                            >
                                                                                {row?.business_contact_person}
                                                                            </span>
                                                                        </td>

                                                                        <td>{row?.business_contact_number}</td>
                                                                        <td>{row?.busienss_trn}</td>
                                                                        <td>{row?.business_email}</td>
                                                                        <td className="text-danger fw-bold">
                                                                            AED {row?.business_credit_limit}
                                                                        </td>
                                                                        <td>{row?.total_orders || "No Order yet"}</td>
                                                                    </tr>
                                                                ))
                                                            ) : (
                                                                <tr>
                                                                    <td colSpan={10}>
                                                                        <NoRecords />
                                                                    </td>
                                                                </tr>
                                                            )}
                                                        </tbody>

                                                        <tfoot className="table-light">
                                                            <tr>
                                                                <th colSpan={10}>
                                                                    <div className="d-flex justify-content-between">
                                                                        <button
                                                                            disabled={!prev || loading}
                                                                            type="button"
                                                                            onClick={handlePrev}
                                                                            className="btn btn-warning btn-label waves-effect waves-light"
                                                                        >
                                                                            <i className="ri-arrow-left-line label-icon align-middle fs-16 me-2" />
                                                                            Previous
                                                                        </button>

                                                                        <div
                                                                            className="col-md-4"
                                                                            style={{ display: "flex", alignItems: "center" }}
                                                                        >
                                                                            <small>
                                                                                Total Records: {totalRecords} | Total Pages:{" "}
                                                                                {totalPages} | Current Page: {page}
                                                                            </small>
                                                                        </div>

                                                                        <div className="col-md-2">
                                                                            <select
                                                                                className="form-select"
                                                                                value={page}
                                                                                onChange={handleChange}
                                                                            >
                                                                                {Array.from(
                                                                                    { length: totalPages },
                                                                                    (_, i) => (
                                                                                        <option
                                                                                            key={i + 1}
                                                                                            value={i + 1}
                                                                                        >
                                                                                            {i + 1}
                                                                                        </option>
                                                                                    )
                                                                                )}
                                                                            </select>
                                                                        </div>

                                                                        <div className="col-md-2">
                                                                            <GlobalLimitChanger
                                                                                placeholder="Set limit:"
                                                                                name="globalLimit"
                                                                                value={limit}
                                                                                onChange={setLimit}
                                                                                showAllValue={totalRecords}
                                                                            />
                                                                        </div>

                                                                        <button
                                                                            disabled={!next || loading}
                                                                            type="button"
                                                                            onClick={handleNext}
                                                                            className="btn btn-primary btn-label waves-effect right waves-light"
                                                                        >
                                                                            Next
                                                                            <i className="ri-arrow-right-line label-icon align-middle fs-16 ms-2" />
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
        </>
    )
}

export default AllBusinessesReport