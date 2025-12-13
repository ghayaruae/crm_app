import React from 'react'
import { NoRecords } from './Shimmer'

const OrderList = ({ orderItems, orderDetails }) => {


  return (
    <div className="card-body">
      <div className="table-responsive table-card">
        <table className="table table-nowrap align-middle table-borderless mb-0">
          <thead className="table-light text-muted">
            <tr>
              <th scope="col">Product Details</th>
              <th scope="col">Part Number</th>
              <th scope="col">Qty</th>
              <th scope="col">Price</th>
              <th scope="col">VAT</th>
              <th scope="col" className='text-end'>Sub Total</th>
            </tr>
          </thead>
          <tbody>
            {
              orderItems?.length > 0 ?
                orderItems?.map((item, index) => {
                  return (
                    <tr key={index} className={item?.item_status === 7 ? "return-overlay" : ""}>
                      <td>
                        <div className="d-flex">
                          <div className="flex-shrink-0 avatar-md bg-light rounded p-1">
                            <img
                              src={item?.item_img_url}
                              alt className="img-fluid d-block" />
                          </div>
                          <div className="flex-grow-1 ms-3">
                            <h5 className="fs-15">
                              <a className="text-reset cursor-pointer">{item?.item_name}</a>
                            </h5>
                            <p className='text-muted mb-0'>{item?.store_name}</p>
                            {item?.item_status === 7 &&
                              <span className='badge bg-danger'>
                                Returned
                              </span>
                            }
                          </div>
                        </div>
                      </td>
                      <td>{item?.business_order_item_numberitem_number}</td>
                      <td>{item?.item_qty}</td>
                      <td>
                        <div className="text-warning fw-bold fs-15">
                          AED {item.item_price}
                        </div>
                      </td>
                      <td>
                        <div className="text-danger fw-bold fs-15">
                          AED {item.item_vat_amount}
                        </div>
                      </td>
                      <td className="fw-medium text-end">AED {item.item_sub_total}</td>
                    </tr>
                  )
                })
                :
                <tr colspan={8}>
                  <td><NoRecords /></td>
                </tr>

            }

            <tr className="border-top border-top-dashed">
              <td colSpan={4} />
              <td colSpan={2} className="fw-medium p-0">
                <table className="table table-borderless mb-0">
                  <tbody>
                    <tr>
                      <td>Sub Total :</td>
                      <td className="text-end">{orderDetails.display_corrected_grand_total}</td>
                    </tr>
                    <tr>
                      <td>Total Exc. Tax :</td>
                      <td className="text-end">{orderDetails.display_corrected_excl_vat}</td>
                    </tr>
                    <tr>
                      <td>VAT :</td>
                      <td className="text-end">{orderDetails.display_corrected_vat_amount}</td>
                    </tr>
                    <tr>
                      <td>Coupon Discount :</td>
                      <td className="text-end">{orderDetails.item_discount}</td>
                    </tr>
                    <tr className="border-top border-top-dashed">
                      <th scope='row'>Grand Total</th>
                      <th className="text-end">{orderDetails?.display_corrected_grand_total}</th>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default OrderList
