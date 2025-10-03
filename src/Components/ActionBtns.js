import React from 'react'

export const ActionBtns = () => {
    return (
        <div className="d-flex gap-2">
            <button type="button" className="btn btn-sm btn-danger">Copy</button>
            <button type="button" className="btn btn-sm btn-success">CSV</button>
            <button type="button" className="btn btn-sm btn-info">Excel</button>
            <button type="button" className="btn btn-sm btn-warning">PDF</button>
            <button type="button" className="btn btn-sm btn-primary">Print</button>
        </div>
    )
}
