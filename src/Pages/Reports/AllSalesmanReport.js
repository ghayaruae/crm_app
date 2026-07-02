import { useContext, useEffect, useState } from 'react'
import PageTitle from '../../Components/PageTitle'
import { ConfigContext } from '../../Context/ConfigContext'
import axios from 'axios'
import { TableRows, NoRecords } from '../../Components/Shimmer'
import { GlobalLimitChanger } from '../../Components/InputElements'
import { useSearchParams } from 'react-router-dom'
import { downloadExcel } from '../../Components/FileDownloader'
import { getCurrentDate } from '../../Components/GlobalFunctions'

const AllSalesmanReport = () => {

    const { primaryColor, apiHeaderJson, apiURL } = useContext(ConfigContext)
    const headers = apiHeaderJson

    const [data, setData] = useState([])
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

    const getData = async () => {
        try {
            setLoading(true)
            const response = await axios.get(`${apiURL}Reports/AllSalesmanReport`, {
                headers,
                params: {
                    keyword,
                    page,
                    limit,
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
            { label: "ID", key: "business_salesman_id" },
            { label: "Salesman Name", key: "business_salesmen_name" },
            { label: "Contact", key: "business_salesmen_contact_number" },
            { label: "Email", key: "business_salesman_email" }
        ];

        downloadExcel({
            apiURL,
            endpoint: "Reports/AllSalesmanReport",
            headers,
            params: {
                page: 1,
                limit: totalRecords || 100000,
                keyword
            },
            cols: excelCols,
            fileName: `Salesman_Report_${getCurrentDate()}.xlsx`
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
                        <PageTitle title="All Salesman" primary="Business" />

                        <div className="row">
                            <div className="col-md-12">
                                <div className="card">
                                    <div
                                        className="card-header d-flex align-items-center justify-content-between"
                                        style={{ backgroundColor: primaryColor }}
                                    >
                                        <h5 className="mb-0 text-white">All Salesman List</h5>

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
                                        <div className="row mb-4 align-items-center">
                                            <div className="col-md-3">
                                                <div className="position-relative w-100">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="Search by Salesman Name"
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
                                                        <th>ID</th>
                                                        <th>Salesman Name</th>
                                                        <th>Contact</th>
                                                        <th>Email</th>
                                                    </tr>
                                                </thead>

                                                {loading ? (
                                                    <TableRows rows="10" colspan="4" />
                                                ) : (
                                                    <>
                                                        <tbody>
                                                            {data.length > 0 ? (
                                                                data.map((row) => (
                                                                    <tr
                                                                        key={row.business_salesman_id}
                                                                        className="text-center"
                                                                    >
                                                                        <td>{row.business_salesman_id}</td>
                                                                        <td>{row.business_salesmen_name}</td>
                                                                        <td>{row.business_salesmen_contact_number}</td>
                                                                        <td>{row.business_salesman_email}</td>
                                                                    </tr>
                                                                ))
                                                            ) : (
                                                                <tr>
                                                                    <td colSpan={4}>
                                                                        <NoRecords />
                                                                    </td>
                                                                </tr>
                                                            )}
                                                        </tbody>

                                                        <tfoot className="table-light">
                                                            <tr>
                                                                <th colSpan={4}>
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

export default AllSalesmanReport