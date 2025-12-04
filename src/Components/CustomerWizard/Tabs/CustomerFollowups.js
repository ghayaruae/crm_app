import React, { useContext, useEffect, useState } from 'react'
import { ConfigContext } from '../../../Context/ConfigContext'
import axios from 'axios'
import { NoRecords, TableRows } from '../../Shimmer'
import { DateFormater } from '../../GlobalFunctions'
import { useParams } from 'react-router-dom'
import TabsMenu from '../TabsMenu'
import Navbar from '../Header/Navbar'

const CustomerFollowups = () => {

    const { apiHeaderJson, apiURL } = useContext(ConfigContext)
    const { business_id } = useParams()

    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)
    const [next, setNext] = useState(false);
    const [prev, setPrev] = useState(false);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [totalRecords, setTotalRecords] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const getList = async () => {
        try {
            const headers = apiHeaderJson
            const response = await axios.get(`${apiURL}Masters/GetFollowupByBusiness`, {
                headers,
                params: { page, limit, business_id }
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
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    const handlePrev = () => prev && setPage((prevPage) => prevPage - 1);
    const handleNext = () => next && setPage((prevPage) => prevPage + 1);
    const handleChange = (e) => setPage(parseInt(e.target.value, 10));

    useEffect(() => {
        getList()
    }, [])

    return (
        <>
            <div className="main-content">
                <div className="page-content">
                    <div className="container-fluid">
                        <Navbar business_id={business_id} />
                        <div className="row">
                            <div className="col-lg-12">
                                <div>
                                    <TabsMenu business_id={business_id} />
                                    <div className="tab-content pt-4 text-muted">
                                        <div className="tab-pane active" id="overview-tab" role="tabpanel">
                                            <div className="col-md-12">
                                                <div className="card">
                                                    <div className="card-header">
                                                        <h4 className="mb-0">Followups List</h4>
                                                    </div>

                                                    <div className="card-body">
                                                        <div className="table-responsive table-card">
                                                            <table className="table table-bordered table-striped table-hover mb-0 table-nowrap">
                                                                {loading ? (
                                                                    <TableRows rows="10" colspan="7" />
                                                                ) : (
                                                                    <>
                                                                        <thead className="table-light text-center">
                                                                            <tr>
                                                                                <th>Salesman</th>
                                                                                <th>Account</th>
                                                                                <th>Type</th>
                                                                                <th>Date</th>
                                                                                <th>Response</th>
                                                                                <th>Remark</th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                            {data.length > 0 ? (
                                                                                data.map((row) => (
                                                                                    <tr key={row.business_salesman_followup_id} className="text-center">
                                                                                        <td>{row.business_salesmen_name}</td>
                                                                                        <td>{row.business_name}</td>
                                                                                        <td>{row.business_salesman_followup_type}</td>
                                                                                        <td>{DateFormater(row.business_salesman_followup_date)}</td>
                                                                                        <td>{row.business_salesman_business_response}</td>
                                                                                        <td>{row.business_salesman_followup_remark}</td>
                                                                                    </tr>
                                                                                ))
                                                                            ) : (
                                                                                <tr>
                                                                                    <td colSpan={7}><NoRecords /></td>
                                                                                </tr>
                                                                            )}
                                                                        </tbody>
                                                                        <tfoot className='table-light'>
                                                                            <tr>
                                                                                <th colSpan={8}>
                                                                                    <div className="d-flex align-items-center justify-content-between flex-nowrap gap-2">
                                                                                        <button disabled={!prev || loading} type="button" onClick={handlePrev} className="btn btn-warning btn-label waves-effect waves-light">
                                                                                            <i className="ri-arrow-left-line label-icon align-middle fs-16 me-2" /> Previous
                                                                                        </button>
                                                                                        <div className='col-md-4' style={{ display: 'flex', alignItems: 'center' }}>
                                                                                            <small>Total Records: {totalRecords} | Total Pages: {totalPages} | Current Page: {page}</small>
                                                                                        </div>
                                                                                        <div className='col-md-2'>
                                                                                            <select className="form-select" value={page} onChange={handleChange}>
                                                                                                {Array.from({ length: totalPages }, (_, i) => (
                                                                                                    <option key={i + 1} value={i + 1}>{i + 1}</option>
                                                                                                ))}
                                                                                            </select>
                                                                                        </div>
                                                                                        <button disabled={!next || loading} type="button" onClick={handleNext} className="btn btn-primary btn-label waves-effect right waves-light">
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
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default CustomerFollowups