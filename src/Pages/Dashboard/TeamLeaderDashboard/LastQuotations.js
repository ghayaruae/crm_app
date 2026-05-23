import { Link } from 'react-router-dom'
import { DateFormater, getValidityDays } from '../../../Components/GlobalFunctions'

const LastQuotations = ({ quotationData }) => {
    return (
        <>
            <div className='col-md-12'>
                <div className="card shadow-sm">

                    <div className="card-header text-white d-flex justify-content-between align-items-center">
                        <h5 className="mb-0">Last 5 Quotations</h5>

                        <Link to="/Reports/QuotationsReport" className="btn btn-dark btn-sm btn-label right">
                            View More <i className='ri-arrow-right-line label-icon' />
                        </Link>
                    </div>

                    <div className="card-body">
                        <div className="table-responsive">
                            <table className="table table-borderless table-striped table-nowrap mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th>ID</th>
                                        <td>Salesman</td>
                                        <th>Quotation No.</th>
                                        <th>Customer Name</th>
                                        <th>Issue Date</th>
                                        <th>Expity Date</th>
                                        <th>Validity</th>
                                        <th>Remark</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {quotationData.length === 0 ? (
                                        <tr>
                                            <td colSpan="10" className="text-center py-3">
                                                No last part inquiries found.
                                            </td>
                                        </tr>
                                    ) : (
                                        quotationData.map((item, index) => (
                                            <tr key={item?.quotation_id}>
                                                <td>{item?.quotation_id}</td>
                                                <td className='text-dark fw-bold'>{item?.business_salesmen_name}</td>
                                                <td className='text-primary fw-bold'>{item?.quotation_number}</td>
                                                <td>{item?.customer_name}</td>
                                                <td>{DateFormater(item.issue_date)}</td>
                                                <td>{DateFormater(item.expiry_date)}</td>
                                                <td>{getValidityDays(item)} days</td>
                                                <td>
                                                    <span
                                                        className="text-ellipsis"
                                                        title={item?.remark}
                                                    >
                                                        {item?.remark}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default LastQuotations
