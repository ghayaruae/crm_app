import axios from 'axios'
import { useContext, useEffect, useState } from 'react'
import { NoRecords, TableRows } from '../../Components/Shimmer'
import { GlobalLimitChanger } from '../../Components/InputElements'
import { ConfigContext } from '../../Context/ConfigContext'
import PageTitle from '../../Components/PageTitle'
import { Link, useSearchParams } from 'react-router-dom'
import { DateFormater, getCurrentDate } from '../../Components/GlobalFunctions'
import { downloadExcel } from '../../Components/FileDownloader'

const RequestPartList = () => {

    const { primaryColor, apiHeaderJson, apiURL } = useContext(ConfigContext)
    const headers = apiHeaderJson;

    const [data, setData] = useState([])
    const [next, setNext] = useState(false);
    const [prev, setPrev] = useState(false);
    const [totalRecords, setTotalRecords] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(true)
    const [keyword, setKeyword] = useState("");

    const [searchParams, setSearchParams] = useSearchParams();

    const pageFromUrl = Number(searchParams.get("page")) || 1;
    const limitFromUrl = Number(searchParams.get("limit")) || 10;

    const [page, setPage] = useState(pageFromUrl);
    const [limit, setLimit] = useState(limitFromUrl);

    const getData = async () => {
        try {
            setLoading(true);

            const response = await axios.get(
                `${apiURL}Masters/GetRequestPartInquiry`,
                {
                    headers,
                    params: { page, limit, keyword }
                }
            );

            const {
                success,
                data,
                page: currentPage,
                next,
                prev,
                total_pages,
                total_records
            } = response.data;

            if (success) {
                setData(data);
                setPage(currentPage);
                setNext(next);
                setPrev(prev);
                setTotalPages(total_pages);
                setTotalRecords(total_records);
            }

        } catch (error) {
            console.log("error", error);
        } finally {
            setLoading(false);
        }
    };

    const handlePrev = () => prev && setPage((prevPage) => prevPage - 1);
    const handleNext = () => next && setPage((prevPage) => prevPage + 1);
    const handleChange = (e) => setPage(parseInt(e.target.value, 10));

    useEffect(() => {
        const delay = setTimeout(() => {
            getData();
        }, 500);

        return () => clearTimeout(delay);
    }, [keyword, page, limit]);


    const handleDownload = () => {
        const excelCols = [
            { label: "Salesman Name", key: "business_salesmen_name" },
            { label: "Part Name", key: "request_part_name" },
            { label: "Brand Name", key: "request_brand_name" },
            { label: "Part Number", key: "request_part_number" },
            { label: "Qty", key: "request_part_qty" },
            { label: "Market Price", key: "request_part_market_price" },
            { label: "Request Date", key: "request_date" }
        ];

        downloadExcel({
            apiURL,
            endpoint: "Masters/GetRequestPartInquiry",
            headers,
            params: {
                page: 1,
                limit: totalRecords || 100000,
                keyword
            },
            cols: excelCols,
            fileName: `Part_Inquiry_Report_${getCurrentDate()}.xlsx`
        });
    };

    useEffect(() => {
        setSearchParams(prev => {
            const params = new URLSearchParams(prev);
            params.set("page", page);
            params.set("limit", limit);
            return params;
        });
    }, [page, limit]);

    return (
        <>
            <div className="main-content">
                <div className="page-content">
                    <div className="container-fluid">

                        <PageTitle title="Part Inquiry Report" primary="Requests" />

                        <div className="row">
                            <div className="col-md-12">
                                <div className="card">

                                    <div
                                        className="card-header align-items-center d-flex"
                                        style={{ backgroundColor: primaryColor }}
                                    >
                                        <h4 className="text-white flex-grow-1 mb-0">Part Inquiry Report</h4>

                                        {data.length > 0 && (
                                            <button
                                                className="btn btn-success btn-sm btn-label"
                                                onClick={handleDownload}
                                            >
                                                <i className="ri-file-excel-2-line me-1 label-icon"></i>
                                                Export
                                            </button>
                                        )}
                                    </div>

                                    <div className="card-body">

                                        <div className="row mb-4 ">
                                            <div className="col-md-4">
                                                <div className="position-relative">
                                                    <input
                                                        type="text"
                                                        className="form-control pe-5"
                                                        placeholder="Search by Part name"
                                                        value={keyword}
                                                        onChange={(e) => setKeyword(e.target.value)}
                                                    />
                                                    <span className="position-absolute end-0 top-50 translate-middle-y me-3 text-muted">
                                                        <i className="ri-search-line"></i>
                                                    </span>
                                                </div>
                                            </div>

                                        </div>

                                        <div className="table-responsive table-card">
                                            <table className="table table-bordered table-hover mb-0 table-nowrap">

                                                <thead className="table-light text-center">
                                                    <tr>
                                                        <th>Salesman Name</th>
                                                        <th>Part Name</th>
                                                        <th>Brand</th>
                                                        <th>Part Number</th>
                                                        <th>Qty</th>
                                                        <th>Market Price</th>
                                                        <th>Request Date</th>
                                                    </tr>
                                                </thead>

                                                {loading ? (
                                                    <TableRows rows="10" colspan="8" />
                                                ) : (
                                                    <>
                                                        <tbody>
                                                            {data.length > 0 ? (
                                                                data.map((row) => (
                                                                    <tr key={row.inventory_part_request_id} className="text-center">
                                                                        <td className="text-dark fw-bold">
                                                                            {row.business_salesmen_name}
                                                                        </td>
                                                                        <td>{row.request_part_name}</td>
                                                                        <td>{row.request_brand_name}</td>
                                                                        <td>
                                                                            <span
                                                                                className="text-ellipsis"
                                                                                title={row?.request_part_number}
                                                                            >
                                                                                {row?.request_part_number}
                                                                            </span>
                                                                        </td>                                                                        <td>{row.request_part_qty}</td>
                                                                        <td>{row.request_part_market_price}</td>
                                                                        <td>{DateFormater(row?.request_date)}</td>
                                                                    </tr>
                                                                ))
                                                            ) : (
                                                                <tr>
                                                                    <td colSpan="8">
                                                                        <NoRecords />
                                                                    </td>
                                                                </tr>
                                                            )}
                                                        </tbody>

                                                        <tfoot className="table-light">
                                                            <tr>
                                                                <th colSpan={8}>
                                                                    <div className="d-flex align-items-center justify-content-between gap-2 flex-nowrap">
                                                                        <button
                                                                            disabled={!prev || loading}
                                                                            type="button"
                                                                            onClick={handlePrev}
                                                                            className="btn btn-warning btn-label"
                                                                        >
                                                                            <i className="ri-arrow-left-line label-icon me-2" />
                                                                            Previous
                                                                        </button>

                                                                        <div className="col-md-4 text-center">
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
                                                                            className="btn btn-primary btn-label"
                                                                        >
                                                                            Next
                                                                            <i className="ri-arrow-right-line label-icon ms-2" />
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

export default RequestPartList
