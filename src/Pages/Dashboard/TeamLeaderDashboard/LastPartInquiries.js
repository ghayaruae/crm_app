import React from 'react'
import { DateFormater } from '../../../Components/GlobalFunctions'

const LastPartInquiries = ({ inquiryData }) => {

    return (
        <>
            <div className='col-md-12'>
                <div className="card shadow-sm">
                    <div className="card-header text-white">
                        <h5 className="mb-0">Last Part Inquiries</h5>
                    </div>

                    <div className="card-body">
                        <div className="table-responsive">
                            <table className="table table-borderless table-striped mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th>Salesman Name</th>
                                        <th>Part Name</th>
                                        <th>Brand</th>
                                        <th>Part Number</th>
                                        <th>Qty</th>
                                        <th>Market Price</th>
                                        <th>Status</th>
                                        <th>Request Date</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {inquiryData.length === 0 ? (
                                        <tr>
                                            <td colSpan="10" className="text-center py-3">
                                                No last part inquiries found.
                                            </td>
                                        </tr>
                                    ) : (
                                        inquiryData.map((item, index) => (
                                            <tr key={item.inventory_part_request_id}>
                                                <td>{item.business_salesmen_name}</td>
                                                <td>{item.request_part_name}</td>
                                                <td>{item.request_brand_name}</td>
                                                <td>{item.request_part_number}</td>
                                                <td>{item.request_part_qty}</td>
                                                <td>{item.request_part_market_price}</td>
                                                <td>
                                                    {item.request_status === 0 ? "Pending" :
                                                        item.request_status === 1 ? "Approved" :
                                                            item.request_status === 2 ? "Rejected" :
                                                                "Unknown"}
                                                </td>
                                                <td>{DateFormater(item.request_date)}</td>
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

export default LastPartInquiries
