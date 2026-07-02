import { useContext, useEffect, useState } from 'react'
import PageTitle from '../../Components/PageTitle'
import { ConfigContext } from '../../Context/ConfigContext'
import axios from 'axios'
import Flatpicker from "react-flatpickr";
import { TableRows, NoRecords } from '../../Components/Shimmer'
import { GlobalLimitChanger } from '../../Components/InputElements'
import { DateFormater, getCurrentDate, getValidityDays } from '../../Components/GlobalFunctions'
import Select from 'react-select';
import { Link, useSearchParams } from 'react-router-dom';
import { downloadExcel } from '../../Components/FileDownloader';

const QuotationsReport = () => {
    const { primaryColor, apiHeaderJson, apiURL, selectTheme, selectStyle } = useContext(ConfigContext)
    const headers = apiHeaderJson

    const [data, setData] = useState([])
    const [next, setNext] = useState(false)
    const [prev, setPrev] = useState(false)
    const [totalRecords, setTotalRecords] = useState(0)
    const [totalPages, setTotalPages] = useState(0)
    const [loading, setLoading] = useState(true)
    const [selectedSalesman, setSelectedSalesman] = useState(null)
    const [salesmanOptions, setSalesmanOptions] = useState([])
    const [from_date, setFrom_date] = useState("")
    const [to_date, setTo_date] = useState("")
    const [applyFilter, setApplyFilter] = useState(0);

    const [searchParams, setSearchParams] = useSearchParams();

    const pageFromUrl = Number(searchParams.get("page")) || 1;
    const limitFromUrl = Number(searchParams.get("limit")) || 10;

    const [page, setPage] = useState(pageFromUrl);
    const [limit, setLimit] = useState(limitFromUrl);

    const getData = async () => {
        try {
            const response = await axios.get(`${apiURL}Masters/GetQuotationsReport`, {
                headers,
                params: {
                    page,
                    limit,
                    business_salesman_id: selectedSalesman || "",
                    from_date: from_date || "",
                    to_date: to_date || ""
                }
            })

            const { success, data, next, prev, total_pages, total_records } = response.data

            if (success) {
                setData(data)
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
        }
    }

    const handleNext = () => {
        if (next) {
            setPage(p => p + 1)
        }
    }

    const handleChange = (e) => {
        setPage(parseInt(e.target.value, 10))
    }

    const handleFilter = () => {
        setPage(1)
        getData()
        setApplyFilter(prev => prev + 1)
    }

    const handleReset = () => {
        setSelectedSalesman(null)
        setFrom_date("")
        setTo_date("")
        setPage(1)
        setLimit(10)
        setApplyFilter(prev => prev + 1)
    }

    const handleDownload = () => {
        const excelCols = [
            { label: "Quotation ID", key: "quotation_id" },
            { label: "Quotation No", key: "quotation_number" },
            { label: "Salesman", key: "business_salesmen_name" },
            { label: "Customer", key: "customer_name" },
            { label: "Issue Date", key: "issue_date" },
            { label: "Expiry Date", key: "expiry_date" },
            { label: "Validity (Days)", key: "validity_days" },
            { label: "Remark", key: "remark" }
        ];

        downloadExcel({
            apiURL,
            endpoint: "Masters/GetQuotationsReport",
            headers,
            params: {
                page: 1,
                limit: totalRecords || 100000,
                business_salesman_id: selectedSalesman || "",
                from_date: from_date || "",
                to_date: to_date || ""
            },
            cols: excelCols,
            fileName: `Quotations_Report_${getCurrentDate()}.xlsx`
        });
    };

    useEffect(() => {
        getSalesmanList()
    }, [])

    useEffect(() => {
        setSearchParams(prev => {
            const params = new URLSearchParams(prev);
            params.set("page", page);
            params.set("limit", limit);
            return params;
        });
    }, [page, limit]);

    useEffect(() => {
        getData()
    }, [page, limit, applyFilter])

    return (
        <div className="main-content">
            <div className="page-content">
                <div className="container-fluid">
                    <PageTitle title="Quotations Report" primary="Reports" />

                    <div className="row">
                        <div className="col-md-12">
                            <div className="card">

                                <div
                                    className="card-header d-flex align-items-center justify-content-between"
                                    style={{ backgroundColor: primaryColor }}
                                >
                                    <h5 className="mb-0 text-white">Quotations List</h5>

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
                                            />
                                        </div>

                                        <div className="col-md-3">
                                            <Flatpicker
                                                className="form-control"
                                                onChange={(_, dateStr) => setTo_date(dateStr)}
                                                value={to_date}
                                                placeholder="To Date"
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
                                                    <td>Salesman</td>
                                                    <th>Quotation No.</th>
                                                    <th>Customer Name</th>
                                                    <th>Issue Date</th>
                                                    <th>Expity Date</th>
                                                    <th>Validity</th>
                                                    <th>Remark</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>

                                            {loading ? (
                                                <TableRows rows="10" colspan="10" />
                                            ) : (
                                                <>
                                                    <tbody>
                                                        {data.length > 0 ? (
                                                            data.map((row) => (
                                                                <tr key={row.quotation_id} className="text-center">
                                                                    <td>{row.quotation_id}</td>
                                                                    <td>{row.business_salesmen_name}</td>
                                                                    <td>{row.quotation_number}</td>
                                                                    <td>{row.customer_name}</td>
                                                                    <td>{DateFormater(row.issue_date)}</td>
                                                                    <td>{DateFormater(row.expiry_date)}</td>
                                                                    <td>{getValidityDays(row)} days</td>
                                                                    <td>
                                                                        <span
                                                                            className="text-ellipsis"
                                                                            title={row.business_salesman_followup_remark}
                                                                        >
                                                                            {row.remark}
                                                                        </span>
                                                                    </td>
                                                                    <td>
                                                                        <Link
                                                                            to={`/Masters/ViewQuotation/${row.quotation_id}`}
                                                                        >
                                                                            <button className="btn btn-sm btn-soft-warning">
                                                                                <i className="ri-printer-line"></i>
                                                                            </button>
                                                                        </Link>
                                                                    </td>
                                                                </tr>
                                                            ))
                                                        ) : (
                                                            <tr>
                                                                <td colSpan="10">
                                                                    <NoRecords />
                                                                </td>
                                                            </tr>
                                                        )}
                                                    </tbody>

                                                    {data.length > 0 && (
                                                        <tfoot className="table-light">
                                                            <tr>
                                                                <th colSpan={10}>
                                                                    <div className="d-flex align-items-center justify-content-between flex-nowrap gap-2">
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
                                                                                {Array.from({ length: totalPages }, (_, i) => (
                                                                                    <option key={i + 1} value={i + 1}>
                                                                                        {i + 1}
                                                                                    </option>
                                                                                ))}
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
                                                                            <i className="ri-arrow-right-line label-icon align-middle fs-16 ms-2" />
                                                                            Next
                                                                        </button>
                                                                    </div>
                                                                </th>
                                                            </tr>
                                                        </tfoot>
                                                    )}
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

export default QuotationsReport
