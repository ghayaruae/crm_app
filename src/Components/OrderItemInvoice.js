import React from "react";
import dayjs from "dayjs";

const invoiceStyles = {
    invoiceBox: {
        margin: "0px",
        fontSize: "16px",
        lineHeight: "24px",
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#fff",
        boxSizing: "border-box",
        padding: "10px",
        color: "#000"
    },
    table: {
        width: "100%",
        borderCollapse: "collapse",
        fontSize: "12px",
        border: "2px solid #000"
    },
    heading: { color: "#000" },
    headingCell: {
        fontWeight: "bold",
        border: "1px solid #000",
        textAlign: "center"
    },
    itemCell: {
        padding: "0px 4px 0px",
        verticalAlign: "top",
        borderRight: "1px solid #000"
    },


    total: {
        fontWeight: "bold",
        fontSize: "12px"
    },
    totalLabelCell: {
        padding: "5px",
        textAlign: "right",
        fontWeight: "bold",
        // border: "1px solid #000"
    },
    totalValueCell: {
        padding: "5px",
        textAlign: "right",
        fontWeight: "bold",
        // border: "1px solid #000"
    },
    shippingAddress: {
        marginBottom: "10px",
        padding: "4px 15px",
        fontSize: "12px",
        borderRadius: "10px",
        border: "2px solid #000"
    }
};

const PrintStyles = () => (
    <style>
        {`
            @page {
                size: A4 portrait;
                margin: 0;
            }

            @media print {
                html, body {
                    margin: 0 !important;
                    padding: 0 !important;
                    width: 210mm !important;
                    height: 297mm !important;
                    overflow: hidden !important;
                    -webkit-print-color-adjust: exact !important;
                    print-color-adjust: exact !important;
                }

                body * {
                    visibility: hidden !important;
                }

                .invoice-container,
                .invoice-container * {
                    visibility: visible !important;
                }

                .invoice-container {
                    position: fixed !important;
                    left: 0 !important;
                    top: 0 !important;
                    width: 210mm !important;
                    height: 297mm !important;
                    padding: 6mm !important;
                    margin: 0 !important;
                    box-sizing: border-box !important;
                    background: #fff !important;
                    overflow: hidden !important;
                    display: flex !important;
                    flex-direction: column !important;
                }

                .row {
                    display: flex !important;
                    flex-wrap: wrap !important;
                    margin-left: 0 !important;
                    margin-right: 0 !important;
                }

                .col-7 {
                    width: 58.333333% !important;
                    padding: 0 5px !important;
                }

                .col-5 {
                    width: 41.666667% !important;
                    padding: 0 5px !important;
                }

                .col-8 {
                    width: 66.666667% !important;
                }

                .col-4 {
                    width: 33.333333% !important;
                }

                .col-6 {
                    width: 50% !important;
                }

                table {
                    width: 100% !important;
                    page-break-inside: avoid !important;
                    break-inside: avoid !important;
                }

                tr, td, th {
                    page-break-inside: avoid !important;
                    break-inside: avoid !important;
                }

                .footer-section {
                    margin-top: auto !important;
                }

                .text-end {
                    text-align: right !important;
                }

                .align-items-center {
                    align-items: center !important;
                }

                .mb-1 {
                    margin-bottom: 4px !important;
                }
            }
        `}
    </style>
);

const OrderItemInvoice = ({ order, orderItems, address, returnData, cancelData, invoice_no }) => {
    const dir = localStorage.getItem("dir");

    const getItemReturns = (itemId) => {
        return returnData?.filter(
            (ret) => Number(ret.business_return_order_item_id) === Number(itemId)
        ) || [];
    };

    const getTotalReturnedQty = (itemId) => {
        return getItemReturns(itemId)
            .filter((ret) => Number(ret.business_return_status) === 3)
            .reduce((sum, ret) => sum + Number(ret.business_return_qty || 0), 0);
    };

    const getItemCancels = (itemId) => {
        return cancelData?.filter(
            (cancel) => Number(cancel.business_order_item_id) === Number(itemId)
        ) || [];
    };

    const getTotalCancelledQty = (itemId) => {
        return getItemCancels(itemId)
            .filter((cancel) => Number(cancel.business_order_cancel_status) === 1)
            .reduce(
                (sum, cancel) =>
                    sum + Number(cancel.business_order_cancel_item_qty || 0),
                0
            );
    };

    if (!orderItems) return <div></div>;

    return (
        <>
            <PrintStyles />

            <div
                className="invoice-container"
                style={{
                    ...invoiceStyles.invoiceBox,
                    display: "flex",
                    flexDirection: "column"
                }}
                dir={dir}
            >
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        width: "100%",
                        gap: "20px",
                        paddingBottom: "10px"
                    }}
                >
                    <div style={{ width: "150px", flexShrink: 0 }}>
                        <img
                            src="https://b2badmin.ghayar.com/assets/images/Ghayar.png"
                            alt="logo"
                            style={{
                                width: "100%",
                                height: "auto",
                                objectFit: "contain",
                                display: "block"
                            }}
                        />
                    </div>

                    <div style={{ flex: 1, textAlign: "center", paddingRight: "20px" }}>
                        <h4
                            style={{
                                margin: 0,
                                fontSize: "18px",
                                fontWeight: "700",
                                color: "#000",
                                lineHeight: "26px",
                                wordBreak: "break-word"
                            }}
                        >
                            GHAYAR AUTO SPARE PARTS TRADING L.L.C
                        </h4>
                    </div>
                </div>

                <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <span style={{ fontSize: "16px", fontWeight: "bold", marginBottom: "8px" }}>
                        Tax Invoice
                    </span>
                </div>

                <div className="row" style={{ marginBottom: "8px" }}>
                    <div className="col-7">
                        <div
                            style={{
                                border: "2px solid #000",
                                borderRadius: "10px",
                                padding: "0px 6px",
                                marginBottom: "2px"
                            }}
                        >
                            <span style={{ textTransform: "uppercase", fontWeight: "bold", fontSize: "12px" }}>
                                Customer Details :
                            </span>
                        </div>

                        <div style={invoiceStyles.shippingAddress}>
                            <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
                                <div>
                                    <b>Customer Name:</b> {order.business_name}
                                </div>
                                {order.business_order_ref_client && (
                                    <div>
                                        <b>Ref Client:</b> {order.business_order_ref_client}
                                    </div>
                                )}
                            </div>

                            <div>
                                <b>Shipping Address:</b> {address.business_full_address}
                            </div>

                            <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", marginBottom: "-5px" }}>
                                <div>
                                    <b>Phone:</b> {address.mobile_number_1}
                                </div>
                                {order.busienss_trn && (
                                    <div>
                                        <b>TRN:</b> {order.busienss_trn}
                                    </div>
                                )}
                            </div>

                            <div>
                                <b>Email:</b> {address.contact_email}
                            </div>
                        </div>
                    </div>

                    <div className="col-5">
                        <div
                            style={{
                                border: "2px solid #000",
                                borderRadius: "10px",
                                marginBottom: "2px",
                                textAlign: "center",
                                padding: "2px"
                            }}
                        >
                            <span style={{ textTransform: "uppercase", fontWeight: "bold", fontSize: "12px" }}>
                                TRN Number : 100442212500003
                            </span>
                        </div>

                        <div style={invoiceStyles.shippingAddress}>
                            <div><b>Ref Order No # :</b> {order?.secret_order_id}</div>
                            <div><b>Invoice No :</b> {invoice_no}</div>
                            <div><b>Date :</b> {dayjs(order?.business_order_date).format("DD MMM YYYY")}</div>
                            <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", marginBottom: "-5px" }}>
                                <div><b>Currency :</b> AED</div>
                            </div>
                            <div><b>Payment Method :</b> {order.business_order_payment_method}</div>
                        </div>
                    </div>
                </div>

                <table style={invoiceStyles.table}>
                    <thead>
                        <tr style={invoiceStyles.heading}>
                            <td width="4%" style={invoiceStyles.headingCell}>Sr No</td>
                            <td style={invoiceStyles.headingCell}>Product</td>
                            <td style={invoiceStyles.headingCell} align="center">Part Number</td>
                            <td style={invoiceStyles.headingCell} align="center">Brand Name</td>
                            <td style={invoiceStyles.headingCell} align="center">Unit Price</td>
                            <td style={invoiceStyles.headingCell} align="center">Quantity</td>
                            <td style={invoiceStyles.headingCell} align="center">VAT 5%</td>
                            <td style={invoiceStyles.headingCell} align="center">Total</td>
                        </tr>
                    </thead>

                    <tbody>
                        {orderItems?.map((item, index) => {
                            const totalReturnedQty = getTotalReturnedQty(item.item_id);
                            const totalCancelledQty = getTotalCancelledQty(item.item_id);

                            const remainingQty =
                                Number(item.item_qty) -
                                Number(totalReturnedQty) -
                                Number(totalCancelledQty);

                            if (remainingQty <= 0) return null;

                            return (
                                <tr key={item.item_number}>
                                    <td style={invoiceStyles.itemCell}>{index + 1}</td>
                                    <td style={invoiceStyles.itemCell}>{item.item_name}</td>
                                    <td style={invoiceStyles.itemCell} align="left">{item?.item_number}</td>
                                    <td style={invoiceStyles.itemCell} align="left">{item?.item_brand}</td>
                                    <td style={invoiceStyles.itemCell} align="left">{item?.item_price} AED</td>
                                    <td style={invoiceStyles.itemCell} align="left">{remainingQty}</td>
                                    <td style={invoiceStyles.itemCell} align="left">{item?.item_vat_amount} AED</td>
                                    <td style={invoiceStyles.itemCell} align="left">
                                        {parseFloat(item?.item_sub_total).toFixed(2)} AED
                                    </td>
                                </tr>
                            );
                        })}

                        <tr style={invoiceStyles.total}>
                            <td colSpan="7" style={invoiceStyles.totalLabelCell} align="right">
                                {Number(order.business_order_total_saving) > 0 ? "Sub Total" : "Taxable Amount"} :
                            </td>
                            <td style={invoiceStyles.totalValueCell} align="right">
                                {orderItems[0]?.taxable_amount} AED
                            </td>
                        </tr>

                        <tr style={invoiceStyles.total}>
                            <td colSpan="7" style={invoiceStyles.totalLabelCell} align="right">
                                VAT 5%
                            </td>
                            <td style={invoiceStyles.totalValueCell} align="right">
                                <strong>{orderItems[0]?.vat_amount ?? 0} AED</strong>
                            </td>
                        </tr>

                        <tr style={invoiceStyles.total}>
                            <td
                                colSpan="7"
                                style={{
                                    ...invoiceStyles.totalLabelCell,
                                }}
                                align="right"
                            >
                                Grand Total
                            </td>
                            <td
                                style={{
                                    ...invoiceStyles.totalValueCell,
                                }}
                                align="right"
                            >
                                <strong>{orderItems[0]?.total_bill_amount} AED</strong>
                            </td>
                        </tr>
                    </tbody>
                </table>

                <div
                    className="footer-section"
                    style={{
                        marginTop: "auto",
                        paddingTop: "8px"
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            padding: "8px 16px",
                            alignItems: "center"
                        }}
                    >
                        <div style={{ flex: 1 }}>
                            <div style={{ height: "2px", background: "#000", width: "100%" }} />
                            <span style={{ textTransform: "uppercase", fontSize: "12px" }}>Received by</span>
                        </div>

                        <div style={{ flex: 1, marginLeft: "20px" }}>
                            <div style={{ height: "2px", background: "#000", width: "100%" }} />
                            <span style={{ textTransform: "uppercase", fontSize: "12px" }}>Authorized signatory</span>
                        </div>
                    </div>

                    <div className="row align-items-center" style={{ marginTop: "4px" }}>
                        <div className="col-8">
                            <div className="row">
                                <div className="col-6 mb-1">
                                    <div style={{ display: "flex", gap: "10px", alignItems: "center", fontSize: "11px" }}>
                                        <i className="fa fa-globe" style={{ color: "red" }} />
                                        <span>www.business.ghayar.com</span>
                                    </div>
                                </div>

                                <div className="col-6 mb-1">
                                    <div style={{ display: "flex", gap: "10px", alignItems: "center", fontSize: "11px" }}>
                                        <i className="fa fa-envelope" style={{ color: "red" }} />
                                        <span>business@ghayar.com</span>
                                    </div>
                                </div>

                                <div className="col-6">
                                    <div style={{ display: "flex", gap: "10px", alignItems: "flex-start", fontSize: "11px" }}>
                                        <i className="fa fa-map-marker" style={{ color: "red", marginTop: "4px" }} />
                                        <span>
                                            Algeria Street, Al Meera Building,
                                            Al Rawda 1, Ajman
                                        </span>
                                    </div>
                                </div>

                                <div className="col-6">
                                    <div style={{ display: "flex", gap: "10px", alignItems: "center", fontSize: "11px" }}>
                                        <i className="fa fa-phone" style={{ color: "red" }} />
                                        <span>Toll-Free : 800442522</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-4 text-end">
                            <img
                                src="https://b2badmin.ghayar.com/assets/images/invoice/invoice_emirates.png"
                                alt="logo"
                                style={{
                                    width: "90px",
                                    objectFit: "contain"
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default OrderItemInvoice;