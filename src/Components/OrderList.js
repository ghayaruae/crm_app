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
              <th scope="col" className='text-end'>Sub Total</th>
            </tr>
          </thead>
          <tbody>
            {
              orderItems?.length > 0 ?
                orderItems?.map((item, index) => {
                  return (
                    <tr key={index}>
                      <td>
                        <div className="d-flex">
                          <div className="flex-shrink-0 avatar-md bg-light rounded p-1">
                            <img
                              src={item?.business_order_item_picture_url}
                              alt className="img-fluid d-block" />
                          </div>
                          <div className="flex-grow-1 ms-3">
                            <h5 className="fs-15">
                              <a className="text-reset cursor-pointer">{item?.business_order_item_name}</a>
                            </h5>
                            <p className="text-muted mb-0">
                              <span className="fw-medium">{item?.secret_order_id}</span>
                            </p>
                          </div>
                        </div>
                      </td>
                      <td>{item?.business_order_item_number}</td>
                      <td>{item?.business_order_qty}</td>
                      <td>
                        <div className="text-warning fw-bold fs-15">
                          AED {item.business_order_item_price}
                        </div>
                      </td>
                      <td className="fw-medium text-end">AED {item.business_order_sub_total}</td>
                    </tr>
                  )
                })
                :
                <tr colspan={8}>
                  <td><NoRecords /></td>
                </tr>

            }

            <tr className="border-top border-top-dashed">
              <td colSpan={3} />
              <td colSpan={2} className="fw-medium p-0">
                <table className="table table-borderless mb-0">
                  <tbody>
                    <tr>
                      <td>Sub Total :</td>
                      <td className="text-end">AED {orderDetails.business_order_sub_total}</td>
                    </tr>
                    <tr>
                      <td>Coupon Discount :</td>
                      <td className="text-end">AED {orderDetails.business_order_total_saving}</td>
                    </tr>
                    <tr className="border-top border-top-dashed">
                      <th scope='row'>Grand Total</th>
                      <th className="text-end">AED {orderDetails?.business_order_grand_total}</th>
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
