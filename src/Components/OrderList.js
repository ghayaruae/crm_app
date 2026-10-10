import React, { useContext, useState } from 'react'
import { NoRecords } from './Shimmer'
import { GetStatusBadge } from '../Utils/GetStatusBadge';
import { Link } from 'react-router-dom';
import { ConfigContext } from '../Context/ConfigContext';
import axios from 'axios';
import Swal from 'sweetalert2';

const OrderList = ({
  orderItems,
  orderDetails,
  returnData,
  cancelData
}) => {

  const { apiHeaderJson, apiURL } = useContext(ConfigContext)
  const headers = apiHeaderJson;

  const [openReturnIndex, setOpenReturnIndex] = useState(null);
  const [openCancelIndex, setOpenCancelIndex] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const [cancelRemark, setCancelRemark] = useState("");
  const [returnQty, setReturnQty] = useState(1);
  const [returnReason, setReturnReason] = useState("");
  const [loadingRequest, setLoadingRequest] = useState(false);

  const openCancelModal = (item) => {
    setSelectedItem(item);
    setCancelRemark("");
    setShowCancelModal(true);
  };

  const openReturnModal = (item) => {
    setSelectedItem(item);
    setReturnQty(1);
    setReturnReason("");
    setShowReturnModal(true);
  };

  const submitCancelRequest = async () => {
    if (!cancelRemark.trim()) {
      Swal.fire("Required", "Please enter cancel remark.", "warning");
      return;
    }

    try {
      setLoadingRequest(true);

      const payload = {
        business_order_id: orderDetails?.business_order_id,
        business_id: orderDetails?.business_order_business_id,
        business_order_cancel_remark: cancelRemark,
        business_order_item_id: selectedItem?.item_id,
        business_order_cancel_item_name: selectedItem?.item_name,
        business_order_cancel_item_number: selectedItem?.item_number,
        business_order_cancel_item_brand_name: selectedItem?.item_brand,
        business_order_cancel_item_sup_id: selectedItem?.business_order_item_sup_id,
        business_order_cancel_item_qty: selectedItem?.item_qty,
        business_order_cancel_item_price: selectedItem?.item_price,
        business_order_cancel_item_store_id: selectedItem?.business_order_item_store_id,
        business_order_cancel_item_stock_oe: selectedItem?.stock_oe
      };

      const response = await axios.post(
        `${apiURL}Business/CancelOrderItem`,
        payload, { headers }
      );

      if (response?.data?.success) {
        setShowCancelModal(false);

        Swal.fire(
          "Success",
          response?.data?.message || "Cancellation request submitted successfully.",
          "success"
        );
      } else {
        Swal.fire(
          "Error",
          response?.data?.message || "Unable to submit cancellation request.",
          "error"
        );
      }
    } catch (error) {
      Swal.fire(
        "Error",
        error?.response?.data?.message || "Something went wrong.",
        "error"
      );
    } finally {
      setLoadingRequest(false);
    }
  };

  const submitReturnRequest = async () => {
    if (!returnQty || Number(returnQty) <= 0) {
      Swal.fire("Required", "Please enter valid return quantity.", "warning");
      return;
    }

    if (Number(returnQty) > Number(selectedItem?.item_qty || 0)) {
      Swal.fire(
        "Invalid Quantity",
        `Maximum return quantity is ${selectedItem?.item_qty}.`,
        "warning"
      );
      return;
    }

    if (!returnReason.trim()) {
      Swal.fire("Required", "Please enter return reason.", "warning");
      return;
    }

    try {
      setLoadingRequest(true);

      const payload = {
        order_id: orderDetails?.business_order_id,
        business_id: orderDetails?.business_order_business_id,
        order_item_id: selectedItem?.item_id,
        return_quantity: Number(returnQty),
        return_reason: returnReason,
        invoice_id: selectedItem?.invoice_id
      };

      const response = await axios.post(
        `${apiURL}Business/ReturnRequest`,
        payload, { headers }
      );

      if (response?.data?.success) {
        setShowReturnModal(false);

        Swal.fire(
          "Success",
          response?.data?.message || "Return request submitted successfully.",
          "success"
        );
      } else {
        Swal.fire(
          "Error",
          response?.data?.message || "Unable to submit return request.",
          "error"
        );
      }
    } catch (error) {
      Swal.fire(
        "Error",
        error?.response?.data?.message || "Something went wrong.",
        "error"
      );
    } finally {
      setLoadingRequest(false);
    }
  };

  // ==============================
  // RETURN FUNCTIONS
  // ==============================
  const getItemReturns = (itemId) => {
    return returnData?.filter(
      (ret) => Number(ret.business_return_order_item_id) === Number(itemId)
    ) || [];
  };

  const getTotalReturnedQty = (itemId) => {
    return getItemReturns(itemId)
      .filter((ret) => Number(ret.business_return_status) === 3)
      .reduce((sum, ret) => {
        return sum + Number(ret.business_return_qty || 0);
      }, 0);
  };

  // ==============================
  // CANCEL FUNCTIONS
  // ==============================
  const getItemCancels = (itemId) => {
    return cancelData?.filter(
      (cancel) => Number(cancel.business_order_item_id) === Number(itemId)
    ) || [];
  };

  const getTotalCancelledQty = (itemId) => {
    return getItemCancels(itemId)
      .filter((cancel) => Number(cancel.business_order_cancel_status) === 1)
      .reduce((sum, cancel) => {
        return sum + Number(cancel.business_order_cancel_item_qty || 0);
      }, 0);
  };

  return (
    <div className="card-body">
      <div className="table-responsive table-card">

        <table className="table table-nowrap align-middle table-borderless mb-0">

          <thead className="table-light text-muted">
            <tr>
              <th scope="col">Product Details</th>
              <th scope="col">Part Number</th>
              <th scope="col">Brand Name</th>
              <th scope="col">Qty</th>
              <th scope="col">Unit Price</th>
              <th scope="col">VAT 5%</th>
              <th scope="col">Total</th>
              <th scope="col">Status</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>

          <tbody>

            {
              orderItems?.length > 0 ?

                orderItems?.map((item, index) => {

                  const itemReturns = getItemReturns(item.item_id);
                  const totalReturnedQty = getTotalReturnedQty(item.item_id);

                  const itemCancels = getItemCancels(item.item_id);
                  const totalCancelledQty = getTotalCancelledQty(item.item_id);

                  const remainingQty =
                    Number(item.item_qty)
                    - Number(totalReturnedQty)
                    - Number(totalCancelledQty);

                  return (
                    <tr
                      key={index}
                      className={Number(item?.item_qty) === Number(totalReturnedQty + totalCancelledQty) || item?.item_status === 6 ? "return-overlay"
                        : ""
                      }
                    >

                      <td>

                        <div className="d-flex">

                          <div className="flex-shrink-0 avatar-md bg-light rounded p-1">
                            <img
                              src={item?.item_img_url}
                              alt='img-url'
                              className="img-fluid d-block"
                            />
                          </div>

                          <div className="flex-grow-1 ms-3">

                            <h5 className="fs-15">
                              <span className="text-reset cursor-pointer">
                                {item?.item_name}
                              </span>
                            </h5>

                            <p className='text-muted mb-0'>
                              {item?.store_name}
                            </p>

                            <p className='text-muted mb-0'>
                              Delivery Day : {
                                item?.stock_delivery_days === 0
                                  ? "Same"
                                  : item.stock_delivery_days
                              } Day
                            </p>

                            {/* =========================
                                RETURN SECTION
                            ========================= */}

                            {itemReturns?.length > 0 && (

                              <div
                                className="alert alert-danger py-2 px-3 mt-2 mb-0"
                                style={{ cursor: "pointer" }}
                                onClick={() =>
                                  setOpenReturnIndex(
                                    openReturnIndex === item.item_id
                                      ? null
                                      : item.item_id
                                  )
                                }
                              >

                                <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">

                                  <span className="badge bg-danger d-flex align-items-center gap-1">
                                    <i className="fa fa-undo"></i>
                                    Return request
                                  </span>

                                  <div>
                                    <i className={`fa ${openReturnIndex === item.item_id
                                      ? "fa-chevron-up"
                                      : "fa-chevron-down"
                                      }`}>
                                    </i>
                                  </div>

                                </div>

                                {
                                  openReturnIndex === item.item_id && (
                                    <div className="mt-2">

                                      {
                                        itemReturns.map((ret, rIndex) => (

                                          <div
                                            key={rIndex}
                                            className="bg-white border rounded px-2 py-2 mb-1"
                                            style={{ fontSize: "12px" }}
                                          >

                                            <div>
                                              <b>
                                                Request #{ret.business_return_id}
                                              </b>
                                            </div>

                                            <div>
                                              Qty : {ret.business_return_qty}
                                            </div>

                                            <div>
                                              Amount : {
                                                parseFloat(
                                                  ret.business_return_total_refund_amount
                                                ).toFixed(2)
                                              } AED
                                            </div>

                                            {
                                              ret?.business_return_refund_method &&
                                              <div>
                                                Refund : {
                                                  ret.business_return_refund_method || "-"
                                                }
                                              </div>
                                            }

                                            <div>
                                              Remark : {
                                                ret.business_return_reason || "-"
                                              }
                                            </div>

                                            {
                                              ret?.business_return_status === 4 &&
                                              <div>
                                                Status : Your request is rejected
                                              </div>
                                            }

                                          </div>
                                        ))
                                      }

                                    </div>
                                  )
                                }

                              </div>
                            )}

                            {/* =========================
                                CANCEL SECTION
                            ========================= */}

                            {itemCancels?.length > 0 && (

                              <div
                                className="alert alert-warning py-2 px-3 mt-2 mb-0"
                                style={{ cursor: "pointer" }}
                                onClick={() =>
                                  setOpenCancelIndex(
                                    openCancelIndex === item.item_id
                                      ? null
                                      : item.item_id
                                  )
                                }
                              >

                                <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">

                                  <span className="badge bg-warning d-flex align-items-center gap-1">
                                    <i className="fa fa-ban"></i>
                                    Cancel request
                                  </span>

                                  <div>
                                    <i className={`fa ${openCancelIndex === item.item_id
                                      ? "fa-chevron-up"
                                      : "fa-chevron-down"
                                      }`}>
                                    </i>
                                  </div>

                                </div>

                                {
                                  openCancelIndex === item.item_id && (
                                    <div className="mt-2">

                                      {
                                        itemCancels.map((cancel, cIndex) => (

                                          <div
                                            key={cIndex}
                                            className="bg-white border rounded px-2 py-2 mb-1"
                                            style={{ fontSize: "12px" }}
                                          >

                                            <div>
                                              <b>
                                                Cancel #{cancel.business_order_cancel_id}
                                              </b>
                                            </div>

                                            <div>
                                              Qty : {cancel.business_order_cancel_item_qty}
                                            </div>

                                            <div>
                                              Amount : {
                                                parseFloat(
                                                  cancel.business_order_cancel_item_sub_total || 0
                                                ).toFixed(2)
                                              } AED
                                            </div>

                                            {/* REQUEST REMARK */}
                                            <div>
                                              Remark : {
                                                cancel.business_order_cancel_remark || "-"
                                              }
                                            </div>

                                            {/* APPROVED / REJECTED REMARK */}
                                            {
                                              cancel?.business_order_cancel_approved_remark &&
                                              <div>
                                                Admin Remark : {
                                                  cancel.business_order_cancel_approved_remark
                                                }
                                              </div>
                                            }

                                            {/* STATUS */}
                                            <div>
                                              Status :{" "}

                                              <span
                                                className={
                                                  Number(cancel.business_order_cancel_status) === 0
                                                    ? "text-warning fw-bold"

                                                    : Number(cancel.business_order_cancel_status) === 1
                                                      ? "text-success fw-bold"

                                                      : Number(cancel.business_order_cancel_status) === 2
                                                        ? "text-danger fw-bold"

                                                        : "text-secondary fw-bold"
                                                }
                                              >
                                                {
                                                  Number(cancel.business_order_cancel_status) === 0
                                                    ? "Pending"

                                                    : Number(cancel.business_order_cancel_status) === 1
                                                      ? "Approved"

                                                      : Number(cancel.business_order_cancel_status) === 2
                                                        ? "Rejected"

                                                        : "Unknown"
                                                }
                                              </span>
                                            </div>

                                          </div>
                                        ))
                                      }

                                    </div>
                                  )
                                }

                              </div>
                            )}

                          </div>

                        </div>

                      </td>

                      <td>{item?.item_number}</td>

                      <td className='text-center'>
                        {item?.item_brand}
                      </td>

                      <td>{remainingQty}</td>

                      <td>
                        <div className="text-warning fw-bold fs-15">
                          {item.business_order_item_price}
                        </div>
                      </td>

                      <td>
                        <div className="text-danger fw-bold fs-15">
                          {item.item_vat_amount}
                        </div>
                      </td>

                      <td className="fw-bold text-success">
                        {item?.item_sub_total}
                      </td>

                      <td>
                        {GetStatusBadge(item?.item_status)}
                      </td>

                      <td>
                        {
                          item?.item_status === 6 ? (
                            <span className="badge bg-danger text-white">
                              Item Cancelled
                            </span>
                          ) : item?.item_status === 7 ? (
                            <span className="badge bg-warning text-dark">
                              Item Returned
                            </span>
                          ) : item?.invoice_no ? (
                            <>
                              <span className="text-dark fw-bold">{item?.invoice_no}</span>
                              <br />

                              <Link to={`/ViewOrderItemInvoice/${item?.business_id}/${item?.business_order_id}/${item?.invoice_id}/${item?.invoice_no}`}>
                                <button className="btn btn-sm btn-warning mb-2">
                                  View Invoice
                                </button>
                              </Link>

                              <br />

                              {item?.business_order_e_signature_url && (
                                <button
                                  onClick={() =>
                                    window.open(
                                      item?.business_order_e_signature_url,
                                      "_blank",
                                      "noopener,noreferrer"
                                    )
                                  }
                                  disabled={!item?.business_order_e_signature_url}
                                  className="btn btn-sm btn-info"
                                >
                                  Signature
                                </button>
                              )}
                            </>
                          ) : (
                            <span className="badge bg-danger text-white">
                              -
                            </span>
                          )
                        }

                        {(Number(item?.item_status) === 0 || Number(item?.item_status) === 5) && (
                          <div className="d-flex flex-wrap gap-2 mt-2 justify-content-center">
                            {Number(item?.item_status) === 0 && (
                              <button
                                type="button"
                                className="btn btn-sm btn-danger"
                                onClick={() => openCancelModal(item)}
                              >
                                <i className="fa fa-ban me-1"></i>
                                Cancel Request
                              </button>
                            )}

                            {Number(item?.item_status) === 5 && (
                              <button
                                type="button"
                                className="btn btn-sm btn-warning"
                                onClick={() => openReturnModal(item)}
                              >
                                <i className="fa fa-undo me-1"></i>
                                Return Request
                              </button>
                            )}
                          </div>
                        )}
                      </td>

                    </tr>
                  )
                })

                :

                <tr>
                  <td colSpan={8}>
                    <NoRecords />
                  </td>
                </tr>
            }

            <tr className="border-top border-top-dashed">

              <td colSpan={3} />

              <td colSpan={3} className="fw-medium p-0">

                <table className="table table-borderless mb-0">

                  <tbody>

                    {/* <tr>
                      <td>Amount :</td>
                      <td className="text-end text-primary fw-bold">
                        {orderDetails?.display_sub_total}
                      </td>
                    </tr> */}

                    {
                      orderDetails?.business_order_payment_method === 'cod'
                      &&
                      orderDetails?.cod_applicable === 1 &&
                      <tr>
                        <td>Shipping Charges</td>
                        <td className='text-end'>
                          {orderDetails?.display_cod_charges}
                        </td>
                      </tr>
                    }


                    <tr>
                      <td>{orderDetails?.business_order_total_saving > 0 ? "Sub Total" : "Taxable Amount"} :</td>
                      <td className="text-end">
                        {orderDetails.display_excl_vat}
                      </td>
                    </tr>


                    {
                      orderDetails?.business_order_total_saving > 0 && (
                        <tr>
                          <td>Discount :</td>
                          <td className="text-end">
                            {orderDetails?.business_order_total_saving ?? 0} AED
                          </td>
                        </tr>
                      )
                    }

                    {
                      orderDetails?.business_order_total_saving > 0 && <tr>
                        <td>Taxable Amount :</td>
                        <td className="text-end">
                          {orderDetails?.business_order_sub_total - orderDetails?.business_order_total_saving ?? 0} AED
                        </td>
                      </tr>
                    }

                    <tr>
                      <td>VAT 5% :</td>
                      <td className="text-end">
                        {orderDetails?.display_vat_amount}
                      </td>
                    </tr>

                    {
                      (
                        orderDetails?.business_order_payment_method === "cod"
                        ||
                        orderDetails?.business_order_payment_method === "bank"
                      )
                      &&
                      orderDetails?.business_balance_amount > 0 &&
                      <tr>
                        <th>Due Amount</th>
                        <td className="text-end text-danger fw-bold">
                          {orderDetails?.business_balance_amount} AED
                        </td>
                      </tr>
                    }

                    <tr className="border-top border-top-dashed">
                      <th scope='row'>Grand Total</th>
                      <th className="text-end">
                        {orderDetails?.display_grand_total}
                      </th>
                    </tr>

                  </tbody>

                </table>

              </td>

            </tr>

          </tbody>

        </table>

      </div>
      {showReturnModal && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Return Request</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowReturnModal(false)}
                />
              </div>

              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">
                    Return Quantity
                  </label>

                  <input
                    type="number"
                    min="1"
                    max={selectedItem?.item_qty}
                    className="form-control"
                    value={returnQty}
                    onChange={(e) => setReturnQty(e.target.value)}
                  />

                  <small className="text-muted">
                    Available quantity: {selectedItem?.item_qty}
                  </small>
                </div>

                <div className="mb-3">
                  <label className="form-label">
                    Return Reason
                  </label>

                  <textarea
                    className="form-control"
                    rows="4"
                    value={returnReason}
                    onChange={(e) => setReturnReason(e.target.value)}
                    placeholder="Enter return reason"
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-light"
                  onClick={() => setShowReturnModal(false)}
                  disabled={loadingRequest}
                >
                  Close
                </button>

                <button
                  type="button"
                  className="btn btn-warning"
                  onClick={submitReturnRequest}
                  disabled={loadingRequest}
                >
                  {loadingRequest ? "Submitting..." : "Submit Return Request"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showCancelModal && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Cancel Request</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowCancelModal(false)}
                />
              </div>

              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">
                    Cancel Remark
                  </label>

                  <textarea
                    className="form-control"
                    rows="4"
                    value={cancelRemark}
                    onChange={(e) => setCancelRemark(e.target.value)}
                    placeholder="Enter cancel remark"
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-light"
                  onClick={() => setShowCancelModal(false)}
                  disabled={loadingRequest}
                >
                  Close
                </button>

                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={submitCancelRequest}
                  disabled={loadingRequest}
                >
                  {loadingRequest ? "Submitting..." : "Submit Cancel Request"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default OrderList;