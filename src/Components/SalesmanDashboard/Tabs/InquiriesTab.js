import React, { useContext, useEffect, useState } from 'react'
import { ConfigContext } from '../../../Context/ConfigContext'
import axios from 'axios'
import { NoRecords, TableRows } from '../../Shimmer'
import { DateFormater } from '../../GlobalFunctions'

const InquiriesTab = () => {

    const { apiHeaderJson, apiURL, business_salesman_id } = useContext(ConfigContext)

    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)

    const getList = async () => {
        try {
            const headers = apiHeaderJson
            const response = await axios.get(`${apiURL}Masters/GetSalesmanPartInquiry`, {
                headers,
                params: { business_salesman_id }
            })
            const { success, data } = response.data

            if (success) {
                setData(data)
            }
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getList()
    }, [])

    return (
        <>
            <div className='tab-pane fade show active'>
                <div className="col-md-12">
                    <div className="card">
                        <div className="card-header">
                            <h4 className="mb-0">Part Inquiries List</h4>
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
                                                    <th>Part</th>
                                                    <th>Brand</th>
                                                    <th>Part Number</th>
                                                    <th>Quantity</th>
                                                    <th>Market Price</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {data.length > 0 ? (
                                                    data.map((row) => (
                                                        <tr key={row.business_salesman_followup_id} className="text-center">
                                                            <td>{row.business_salesmen_name}</td>
                                                            <td>{row.request_part_name}</td>
                                                            <td>{row.request_brand_name}</td>
                                                            <td>{row.request_part_number}</td>
                                                            <td>{row.request_part_qty}</td>
                                                            <td>{row.request_part_market_price}</td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan={7}><NoRecords /></td>
                                                    </tr>
                                                )}
                                            </tbody>
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

export default InquiriesTab