import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { NoRecords, TableRows } from '../../Components/Shimmer'
import { GlobalLimitChanger } from '../../Components/InputElements'
import { ConfigContext } from '../../Context/ConfigContext'
import PageTitle from '../../Components/PageTitle'
import { Link } from 'react-router-dom'
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const RequestPartList = () => {

    const { primaryColor, apiHeaderJson, apiURL } = useContext(ConfigContext)
    const headers = apiHeaderJson;

    const [data, setData] = useState([])
    const [next, setNext] = useState(false);
    const [prev, setPrev] = useState(false);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [totalRecords, setTotalRecords] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(true)
    const [keyword, setKeyword] = useState("");

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
        try {
            const orderWorkSheet = XLSX.utils.json_to_sheet(
                data?.map((item) => ({
                    "Salesman Name": item?.business_salesmen_name,
                    "Part Name": item?.request_part_name,
                    "Brand Name": item?.request_brand_name,
                    "Part Number": item?.request_part_number,
                    "Qty": item?.request_part_qty,
                    "Market Price": item?.request_part_market_price,
                }))
            );

            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, orderWorkSheet, "business");

            const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

            // Avoid shadowing variable name "data"
            const blob = new Blob([excelBuffer], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            });

            saveAs(blob, 'partInquery.xlsx');
        } catch (error) {
            console.error("Excel download error:", error);
        }
    };

    return (
        <>
            <div className="main-content">
                <div className="page-content">
                    <div className="container-fluid">

                        <PageTitle title="All Part Inquiry Requests Report" primary="Requests" />

                        <div className="row">
                            <div className="col-md-12">
                                <div className="card">

                                    <div
                                        className="card-header align-items-center d-flex"
                                        style={{ backgroundColor: primaryColor }}
                                    >
                                        <h4 className="text-white flex-grow-1 mb-0">All Part Inquiry Requests Report</h4>

                                        <Link to={"/Request/RequestPartInquiry"}>
                                            <button
                                                type="button"
                                                className="btn btn-light btn-sm rounded-circle"
                                                title="Add New Request"
                                            >
                                                <i className="ri-add-line"></i>
                                            </button>
                                        </Link>
                                    </div>

                                    <div className="card-body">

                                        <div className="row w-100 mb-4">
                                            <div className="col-md-8">
                                                <ul className="nav nav-tabs nav-tabs-custom nav-success">
                                                    <button
                                                        className='btn btn-sm btn-success me-2 waves-light waves-effect'
                                                        onClick={handleDownload}
                                                    >
                                                        Excel
                                                    </button>
                                                </ul>
                                            </div>

                                            <div className="col-md-4">
                                                <div className="position-relative">
                                                    <input
                                                        type="text"
                                                        className="form-control pe-5"
                                                        placeholder="Search by Part name OR part number"
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

                                                {loading ? (
                                                    <TableRows rows="10" colspan="10" />
                                                ) : (
                                                    <>
                                                        <thead className="table-light text-center">
                                                            <tr>
                                                                <th>Salesman Name</th>
                                                                <th>Part Name</th>
                                                                <th>Brand</th>
                                                                <th>Part Number</th>
                                                                <th>Qty</th>
                                                                <th>Market Price</th>
                                                                <th>Action</th>
                                                            </tr>
                                                        </thead>

                                                        <tbody>
                                                            {data.length > 0 ? (
                                                                data.map((row) => (
                                                                    <tr key={row.inventory_part_request_id} className="text-center">

                                                                        <td className='text-dark fw-bold'>{row.business_salesmen_name}</td>
                                                                        <td>{row.request_part_name}</td>
                                                                        <td>{row.request_brand_name}</td>
                                                                        <td>{row.request_part_number}</td>
                                                                        <td>{row.request_part_qty}</td>
                                                                        <td>{row.request_part_market_price}</td>
                                                                        <td className="d-flex align-items-center justify-content-center gap-2">
                                                                            <Link to={`/Request/RequestPartInquiry/${row.inventory_part_request_id}`}>
                                                                                <button className="btn btn-sm btn-soft-primary">
                                                                                    <i className="ri-pencil-line"></i>
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

                                                        <tfoot className="table-light">
                                                            <tr>
                                                                <th colSpan={10}>
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
                                                                                Total Records: {totalRecords} |
                                                                                Total Pages: {totalPages} |
                                                                                Current Page: {page}
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
