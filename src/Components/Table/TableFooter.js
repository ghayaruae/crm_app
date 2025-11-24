import React from 'react'
import { GlobalLimitChanger } from '../InputElements'

const TableFooter = ({ next, prev, page, setPage, loading, limit, setLimit, totalRecords, totalPages }) => {

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

    return (
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
    )
}

export default TableFooter
