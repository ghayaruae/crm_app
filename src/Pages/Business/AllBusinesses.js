import { useContext, useEffect, useState } from 'react'
import PageTitle from '../../Components/PageTitle'
import { ConfigContext } from '../../Context/ConfigContext'
import axios from 'axios'
import { TableRows, NoRecords } from '../../Components/Shimmer'
import { Link } from 'react-router-dom'
import { GlobalLimitChanger } from '../../Components/InputElements'

const AllBusinesses = () => {

    const { primaryColor, apiHeaderJson, apiURL } = useContext(ConfigContext)
    const headers = apiHeaderJson

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

    const getData = async () => {
        try {
            setLoading(true)
            const response = await axios.get(`${apiURL}Business/GetBusinesses`, {
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

    return (
        <>
            <div className="main-content">
                <div className="page-content">
                    <div className="container-fluid">
                        <PageTitle title="Bussinnesses" primary="Business" />

                        <div className="row">
                            <div className="col-md-12">
                                <div className="card">
                                    <div
                                        className="card-header d-flex align-items-center justify-content-between"
                                        style={{ backgroundColor: primaryColor }}
                                    >
                                        <h5 className="mb-0 text-white">
                                            Businesses List
                                        </h5>
                                    </div>

                                    <div className="card-body">
                                        <div className="row mb-4 align-items-center">
                                            <div className="col-md-3">
                                                <div className="position-relative w-100">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="Search by Business Name"
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
                                                {loading ? (
                                                    <TableRows rows="10" colspan="10" />
                                                ) : (
                                                    <>
                                                        <thead className="table-light text-center">
                                                            <tr>
                                                                <th>Business ID</th>
                                                                <th>Business Name</th>
                                                                <th>Owner</th>
                                                                <th>Contact No.</th>
                                                                <th>TRN No.</th>
                                                                <th>Email</th>
                                                                <th>Reward Points</th>
                                                                <th>Credit Limit</th>
                                                                <th>Actions</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {data.length > 0 ? (
                                                                data.map((row) => (
                                                                    <tr key={row.business_id} className="text-center">
                                                                        <td>
                                                                            <Link style={{ color: primaryColor, fontWeight: "bolder" }} to={`/CustomerDashboard/${row.business_id}`}>
                                                                                {row.business_id}
                                                                            </Link>
                                                                        </td>
                                                                        <td>
                                                                            <Link style={{ color: primaryColor, fontWeight: "bolder" }} to={`/CustomerDashboard/${row.business_id}`}>
                                                                                {row.business_name}
                                                                            </Link>
                                                                        </td>
                                                                        <td>{row.business_contact_person}</td>
                                                                        <td>{row.business_contact_number}</td>
                                                                        <td>{row.busienss_trn}</td>
                                                                        <td>{row.business_email}</td>
                                                                        <td>{row.business_reward_points_balance}</td>
                                                                        <td>AED {row.business_credit_limit}</td>
                                                                        <td className='d-flex gap-2 justify-content-center'>
                                                                            <Link to={`/CustomerDashboard/${row.business_id}`}>
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
                                                                    <td colSpan={10}>
                                                                        <NoRecords />
                                                                    </td>
                                                                </tr>
                                                            )}
                                                        </tbody>
                                                        <tfoot className='table-light'>
                                                            <tr>
                                                                <th colSpan={10}>
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
        </>
    )
}

export default AllBusinesses