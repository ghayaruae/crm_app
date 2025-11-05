import React, { useContext, useEffect, useState } from 'react'
import { ConfigContext } from '../../../Context/ConfigContext'
import axios from 'axios'
import { NoRecords, TableRows } from '../../Shimmer'
import { DateFormater } from '../../GlobalFunctions'

const TargetsTab = () => {

    const { primaryColor, apiHeaderJson, apiURL } = useContext(ConfigContext)

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
            const response = await axios.get(`${apiURL}Masters/GetTargetsBySalesman`, {
                headers,
                params: { page, limit }
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
            <div className='tab-pane fade show active'>
                <div className="col-md-12">
                    <div className="card">
                        <div className="card-header">
                            <h4 className="mb-0">Targets List</h4>
                        </div>

                        <div className="card-body">
                            <div className="table-responsive table-card">
                                <table className="table table-bordered table-striped table-hover mb-0 table-nowrap">
                                    {loading ? (
                                        <TableRows rows="10" colspan="6" />
                                    ) : (
                                        <>
                                            <thead className="table-light text-center">
                                                <tr>
                                                    <th>ID</th>
                                                    <th>Salesman</th>
                                                    <th>Amount</th>
                                                    <th>From</th>
                                                    <th>To</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {data.length > 0 ? (
                                                    data.map((row) => (
                                                        <tr key={row.business_salesman_target_id} className="text-center">
                                                            <td>{row.business_salesman_target_id}</td>
                                                            <td>{row.business_salesmen_name}</td>
                                                            <td>{row.business_salesman_target}</td>
                                                            <td>{DateFormater(row.business_salesman_target_from)}</td>
                                                            <td>{DateFormater(row.business_salesman_target_to)}</td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan={5}><NoRecords /></td>
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
                                                            {/* <div className='col-md-2'>
                                                                <GlobalLimitChanger
                                                                    placeholder="Set limit:"
                                                                    name="globalLimit"
                                                                    value={limit}
                                                                    onChange={setLimit}
                                                                    showAllValue={totalRecords}
                                                                />
                                                            </div> */}
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
        </>
    )
}

export default TargetsTab