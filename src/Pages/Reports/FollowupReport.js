import { useContext, useEffect, useState } from 'react'
import PageTitle from '../../Components/PageTitle'
import { ConfigContext } from '../../Context/ConfigContext'
import axios from 'axios'
import Flatpicker from "react-flatpickr";
import { TableRows, NoRecords } from '../../Components/Shimmer'
import { GlobalLimitChanger } from '../../Components/InputElements'
import { DateFormater } from '../../Components/GlobalFunctions'
import Select from 'react-select';
import { Link } from 'react-router-dom';
import * as XLSX from 'xlsx';

const FollowupReport = () => {
    const { primaryColor, apiHeaderJson, apiURL, selectTheme, selectStyle } = useContext(ConfigContext)
    const headers = apiHeaderJson

    const [data, setData] = useState([])
    const [next, setNext] = useState(false)
    const [prev, setPrev] = useState(false)
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(10)
    const [totalRecords, setTotalRecords] = useState(0)
    const [totalPages, setTotalPages] = useState(0)
    const [loading, setLoading] = useState(false)
    const [selectedSalesman, setSelectedSalesman] = useState(null)
    const [salesmanOptions, setSalesmanOptions] = useState([])
    const [from_date, setFrom_date] = useState("")
    const [to_date, setTo_date] = useState("")
    const [filtersApplied, setFiltersApplied] = useState(false)

    /* NEW STATES FOR EXPORT */
    const [exporting, setExporting] = useState(false)
    const [progress, setProgress] = useState(0)

    const getData = async () => {
        try {
            setLoading(true)
            const response = await axios.get(`${apiURL}Reports/GetAllFollowupsReports`, {
                headers,
                params: {
                    page,
                    limit,
                    business_salesman_id: selectedSalesman || null,
                    from_date: from_date || "",
                    to_date: to_date || ""
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
            } else {
                setData([])
            }
        } catch (error) {
            console.error('Error getting data:', error)
        } finally {
            setLoading(false)
        }
    }

    const getSalesmanList = async () => {
        try {
            const response = await axios.get(`${apiURL}Masters/GetSalesmanList`, { headers })
            const { success, data } = response.data

            if (success) {
                const options = data.map((item) => ({
                    value: item.business_salesman_id,
                    label: item.business_salesmen_name
                }))
                setSalesmanOptions(options)
            }
        } catch (error) {
            console.error(error)
        }
    }

    const handlePrev = () => {
        if (prev) {
            setPage(p => p - 1)
            getData()
        }
    }

    const handleNext = () => {
        if (next) {
            setPage(p => p + 1)
            getData()
        }
    }

    const handleChange = (e) => {
        const newPage = parseInt(e.target.value, 10)
        setPage(newPage)
        getData()
    }

    const handleFilter = () => {
        if (!selectedSalesman && !from_date && !to_date) return;
        setFiltersApplied(prev => !prev)
        setPage(1)
        getData()
    }

    const handleReset = () => {
        if (!selectedSalesman && !from_date && !to_date) return;
        setSelectedSalesman(null)
        setFrom_date("")
        setTo_date("")
        setFiltersApplied(prev => !prev)
        setData([])
        setPage(1)
        setLimit(10)
        setTotalRecords(0)
        setTotalPages(0)
    }

    const handleLimitChange = (newLimit) => {
        setLimit(newLimit)
        setPage(1)
        if (filtersApplied) {
            getData()
        }
    }

    const handleExportExcel = () => {
        if (!data.length) return

        try {
            setExporting(true)
            setProgress(20)

            const exportData = data.map((row) => ({
                ID: row.business_salesman_followup_id,
                Salesman: row.business_salesmen_name,
                Contact: row.business_salesmen_contact_number,
                Email: row.business_salesman_email,
                Type: row.business_salesman_followup_type,
                Date: DateFormater(row.business_salesman_followup_date),
                Response: row.business_salesman_business_response,
                Remark: row.business_salesman_followup_remark,
            }))

            setProgress(60)

            const worksheet = XLSX.utils.json_to_sheet(exportData)
            const workbook = XLSX.utils.book_new()
            XLSX.utils.book_append_sheet(workbook, worksheet, "Followup Report")

            setProgress(90)

            XLSX.writeFile(
                workbook,
                `Followup_Report_Page_${page}.xlsx`
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

    useEffect(() => {
        getSalesmanList()
    }, [])

    return (
        <div className="main-content">
            <div className="page-content">
                <div className="container-fluid">
                    <PageTitle title="Followup Report" primary="Reports" />

                    <div className="row">
                        <div className="col-md-12">
                            <div className="card">

                                <div
                                    className="card-header d-flex align-items-center justify-content-between"
                                    style={{ backgroundColor: primaryColor }}
                                >
                                    <h5 className="mb-0 text-white">Followup List</h5>

                                    {filtersApplied && data.length > 0 && (
                                        <button
                                            className="btn btn-soft-success btn-sm"
                                            onClick={handleExportExcel}
                                            disabled={exporting}
                                        >
                                            <i className="ri-file-excel-2-line me-1"></i>
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
                                    <div className="row mb-4 g-3 align-items-center">
                                        <div className="col-md-3">
                                            <Select
                                                name='selectedSalesman'
                                                theme={selectTheme}
                                                styles={selectStyle}
                                                options={salesmanOptions}
                                                value={salesmanOptions.find(opt => opt.value === selectedSalesman) || null}
                                                onChange={(selected) => setSelectedSalesman(selected?.value)}
                                                placeholder="Select Salesman"
                                            />
                                        </div>

                                        <div className="col-md-3">
                                            <Flatpicker
                                                className="form-control"
                                                onChange={(_, dateStr) => setFrom_date(dateStr)}
                                                value={from_date}
                                                placeholder="From Date"
                                                name='from_date'
                                            />
                                        </div>

                                        <div className="col-md-3">
                                            <Flatpicker
                                                className="form-control"
                                                onChange={(_, dateStr) => setTo_date(dateStr)}
                                                value={to_date}
                                                placeholder="To Date"
                                                name='to_date'
                                            />
                                        </div>

                                        <div className="col-md-3 d-flex gap-3">
                                            <button
                                                type="button"
                                                className="btn btn-danger btn-label right"
                                                onClick={handleFilter}
                                            >
                                                Filter
                                                <i className="ri-filter-line label-icon align-middle fs-16 ms-2"></i>
                                            </button>

                                            <button
                                                type="button"
                                                className="btn btn-light"
                                                onClick={handleReset}
                                            >
                                                Reset
                                            </button>
                                        </div>
                                    </div>

                                    <div className="table-card table-responsive">
                                        <table className="table table-bordered table-striped table-hover table-nowrap mb-0">
                                            <thead className="table-light text-center">
                                                <tr>
                                                    <th>ID</th>
                                                    <th>Salesman</th>
                                                    <th>Contact</th>
                                                    <th>Email</th>
                                                    <th>Type</th>
                                                    <th>Date</th>
                                                    <th>Response</th>
                                                    <th>Remark</th>
                                                </tr>
                                            </thead>

                                            <tbody>
                                                {filtersApplied ? (
                                                    loading ? (
                                                        <tr><td colSpan="8"><TableRows /></td></tr>
                                                    ) : data.length > 0 ? (
                                                        data.map((row) => (
                                                            <tr key={row.business_salesman_followup_id} className="text-center">
                                                                <td>{row.business_salesman_followup_id}</td>
                                                                <td>{row.business_salesmen_name}</td>
                                                                <td>{row.business_salesmen_contact_number}</td>
                                                                <td>{row.business_salesman_email}</td>
                                                                <td>{row.business_salesman_followup_type}</td>
                                                                <td>{DateFormater(row.business_salesman_followup_date)}</td>
                                                                <td>
                                                                    <span className="text-ellipsis" title={row?.business_salesman_business_response}>
                                                                        {row?.business_salesman_business_response}
                                                                    </span>
                                                                </td>
                                                                <td>
                                                                    <span className="text-ellipsis" title={row.business_salesman_followup_remark}>
                                                                        {row.business_salesman_followup_remark}
                                                                    </span>
                                                                </td>
                                                            </tr>
                                                        ))
                                                    ) : (
                                                        <tr><td colSpan="8"><NoRecords /></td></tr>
                                                    )
                                                ) : (
                                                    <tr><td colSpan="8" className='text-center text-muted'>Apply filter to view records</td></tr>
                                                )}
                                            </tbody>

                                            {filtersApplied && data.length > 0 && (
                                                <tfoot className='table-light'>
                                                    <tr>
                                                        <th colSpan={8}>
                                                            <div className="d-flex justify-content-between">
                                                                <button
                                                                    disabled={!prev || loading}
                                                                    type="button"
                                                                    onClick={handlePrev}
                                                                    className="btn btn-warning btn-label waves-effect waves-light"
                                                                >
                                                                    <i className="ri-arrow-left-line label-icon align-middle fs-16 me-2" /> Previous
                                                                </button>

                                                                <div className='col-md-4' style={{ display: 'flex', alignItems: 'center' }}>
                                                                    <small>Total Records: {totalRecords} | Total Pages: {totalPages} | Current Page: {page}</small>
                                                                </div>

                                                                <div className='col-md-2'>
                                                                    <select
                                                                        className="form-select"
                                                                        value={page}
                                                                        onChange={handleChange}
                                                                        disabled={loading}
                                                                    >
                                                                        {Array.from({ length: totalPages }, (_, i) => (
                                                                            <option key={i + 1} value={i + 1}>{i + 1}</option>
                                                                        ))}
                                                                    </select>
                                                                </div>

                                                                <div className='col-md-2'>
                                                                    <GlobalLimitChanger
                                                                        placeholder="Set limit:"
                                                                        name="globalLimit"
                                                                        value={limit}
                                                                        onChange={handleLimitChange}
                                                                        showAllValue={totalRecords}
                                                                        disabled={loading}
                                                                    />
                                                                </div>

                                                                <button
                                                                    disabled={!next || loading}
                                                                    type="button"
                                                                    onClick={handleNext}
                                                                    className="btn btn-primary btn-label waves-effect right waves-light"
                                                                >
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
    )
}

export default FollowupReport
