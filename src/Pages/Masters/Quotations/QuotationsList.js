import axios from 'axios'
import { useContext, useEffect, useState } from 'react'
import { NoRecords, TableRows } from '../../../Components/Shimmer'
import { GlobalLimitChanger } from '../../../Components/InputElements'
import { ConfigContext } from '../../../Context/ConfigContext'
import PageTitle from '../../../Components/PageTitle'
import Swal from 'sweetalert2'
import { DateFormater } from '../../../Components/GlobalFunctions'
import { Link } from 'react-router-dom'

const QuotationsList = () => {

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
            setLoading(true)
            const response = await axios.get(`${apiURL}Masters/GetQuotations`,
                {
                    headers,
                    params: { page, limit, keyword }
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
            console.log("error", error)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (quotation_id) => {
        try {
            const result = await Swal.fire({
                title: "Are you sure?",
                text: "This action will permanently delete the target.",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes!",
                cancelButtonText: "Cancel"
            });

            if (result.isConfirmed) {
                const body = { quotation_id };

                const response = await axios.post(`${apiURL}Masters/DeleteQuotation`, body, { headers });
                const { success, message } = response.data;

                if (success) {
                    Swal.fire("Deleted!", message, "success");
                    getData();
                }
            }
        } catch (error) {
            console.error(error);
        }
    };

    const getValidityDays = (row) => {
        const { issue_date, expiry_date } = row;

        if (!issue_date || !expiry_date) return "-";

        const issue = new Date(issue_date);
        const expiry = new Date(expiry_date);

        const diffTime = expiry - issue;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        return diffDays;
    };

    const handlePrev = () => prev && setPage((prevPage) => prevPage - 1);
    const handleNext = () => next && setPage((prevPage) => prevPage + 1);
    const handleChange = (e) => setPage(parseInt(e.target.value, 10));

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            getData();
        }, 500);

        return () => clearTimeout(delayDebounce);
    }, [keyword, page, limit]);

    return (
        <>
            <div className="main-content">
                <div className="page-content">
                    <div className="container-fluid">
                        <PageTitle title="Quotations List" primary="Masters" />
                        <div className="row">
                            <div className="col-md-12">
                                <div className="card">
                                    <div className="card-header align-items-center d-flex" style={{ backgroundColor: primaryColor }}>
                                        <h4 className="text-white flex-grow-1 mb-0">Quotations List</h4>
                                        <Link to={"/Masters/CreateQuotation"}>
                                            <button
                                                type="button"
                                                className="btn btn-light btn-sm rounded-circle"
                                                title="Create Quotation"
                                            >
                                                <i className="ri-add-line"></i>
                                            </button>
                                        </Link>
                                    </div>

                                    <div className="card-body">
                                        <div className="row align-items-center justify-content-end mb-4">
                                            <div className="col-md-4">
                                                <div className="position-relative">
                                                    <input
                                                        type="text"
                                                        className="form-control pe-5"
                                                        placeholder="Search by quotation no. or customer name"
                                                        name="keyword"
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
                                            <table className="table table-bordered table-striped table-hover mb-0 table-nowrap">
                                                <thead className="table-light text-center">
                                                    <tr>
                                                        <th>ID</th>
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
                                                    <TableRows rows="10" colspan="9" />
                                                ) : (
                                                    <>
                                                        <tbody>
                                                            {data.length > 0 ? (
                                                                data.map((row) => (
                                                                    <tr key={row.quotation_id} className="text-center">
                                                                        <td>{row.quotation_id}</td>

                                                                        <td>{row.quotation_number}</td>

                                                                        <td>{row.customer_name}</td>
                                                                        <td>{DateFormater(row.issue_date)}</td>
                                                                        <td>{DateFormater(row.expiry_date)}</td>
                                                                        <td>{getValidityDays(row)} days</td>

                                                                        <td>
                                                                            <span
                                                                                className="text-ellipsis"
                                                                                title={row?.remark}
                                                                            >
                                                                                {row?.remark}
                                                                            </span>
                                                                        </td>

                                                                        <td className="d-flex align-items-center justify-content-center gap-2">
                                                                            <Link
                                                                                to={`/Masters/CreateQuotation/${row.quotation_id}`}
                                                                            >
                                                                                <button className="btn btn-sm btn-soft-primary">
                                                                                    <i className="ri-pencil-line"></i>
                                                                                </button>
                                                                            </Link>

                                                                            <button
                                                                                className="btn btn-sm btn-soft-danger"
                                                                                onClick={() =>
                                                                                    handleDelete(row.quotation_id)
                                                                                }
                                                                            >
                                                                                <i className="ri-delete-bin-line"></i>
                                                                            </button>
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
                                                                    <td colSpan="9">
                                                                        <NoRecords />
                                                                    </td>
                                                                </tr>
                                                            )}
                                                        </tbody>

                                                        <tfoot className="table-light">
                                                            <tr>
                                                                <th colSpan={9}>
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
                                                                                {Array.from(
                                                                                    { length: totalPages },
                                                                                    (_, i) => (
                                                                                        <option key={i + 1} value={i + 1}>
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
            </div >
        </>
    )
}

export default QuotationsList