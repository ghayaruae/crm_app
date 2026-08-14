// import React from "react";

// const invoiceStyles = {
//     invoiceBox: {
//         top: '0',
//         margin: '0 auto',
//         border: '1px solid #eee',
//         fontSize: '16px',
//         lineHeight: '24px',
//         fontFamily: 'Arial, sans-serif',
//         backgroundColor: '#fff',

//         boxSizing: 'border-box'
//     },
//     logo: {
//         width: '150px',
//         height: 'auto',
//         marginBottom: '20px'
//     },
//     table: {
//         width: '100%',
//         borderCollapse: 'collapse',
//         marginTop: '20px',
//         fontSize: '12px',

//     },
//     heading: {
//         // backgroundColor: 'rgb(154 10 12)',
//         backgroundColor: '#000',
//         color: '#FFF',
//         borderBottom: '1px solid #ddd'
//     },
//     headingCell: {
//         padding: '10px',
//         fontWeight: 'bold'
//     },
//     item: {
//         borderBottom: '1px solid #eee'
//     },
//     itemCell: {
//         padding: '10px',
//         verticalAlign: 'top'
//     },
//     total: {
//         borderTop: '2px solid #eee',
//         fontWeight: 'bold',
//         fontSize: '12px',

//     },
//     headerGrid: {
//         display: 'grid',
//         gridTemplateColumns: '1fr 1fr',
//         gap: '20px',
//         marginBottom: '30px'
//     },
//     businessInfo: {
//         textAlign: 'left'
//     },
//     invoiceInfo: {
//         padding: '15px',
//         textAlign: 'left',
//         fontSize: '12px',
//         color: '#555',
//         lineHeight: '1.5'
//     },
//     shippingAddress: {
//         marginBottom: '20px',
//         padding: '15px',
//         fontSize: '12px',
//         borderRadius: '4px'
//     }
// };

// const PrintStyles = () => (
//     <style>
//         {`
//             @page {
//                 size: A4;
//                 margin: 0;
//             }
//             @media print {
//                 body {
//                     margin: 0;
//                     padding: 0;
//                 }
//                 .invoice-container {
//                     width: 310mm;
//                     height: 297mm;
//                     page-break-after: always;
//                 }
//             }
//         `}
//     </style>
// );

// const Invoice = ({ order, orderItems, address }) => {
//     const dir = localStorage.getItem('dir');
//     if (!orderItems) return <div></div>;

//     return (
//         <>
//             <PrintStyles />
//             <div className="invoice-container" style={invoiceStyles.invoiceBox} dir={dir}>

//                 <div
//                     style={{
//                         display: "flex",
//                         justifyContent: "space-between",
//                         alignItems: "flex-start",
//                         marginBottom: "10px",
//                         width: "100%",
//                         padding: "20px"
//                     }}
//                 >
//                     {/* LEFT SIDE – COMPANY INFO */}
//                     <div style={{ fontSize: "12px", lineHeight: "1.5" }}>
//                         <strong><b>GHAYAR AUTO SPARE PARTS TRADING L.L.C</b>
//                             <br />
//                             TRN: 100442212500003</strong>
//                         <div>Ajman, AL Rawda 1, Algeria St, Al Meera Building, M002,
//                             <br />
//                             Warehouse No. 3 - Umm Dera - New Industrial Area - Emirate of Umm Al
//                             Quwain</div>
//                         <div>Dubai</div>
//                     </div>
//                     <div style={{ textAlign: "right", fontSize: "12px" }}>
//                     </div>
//                 </div>

//                 <div style={{ marginBottom: "-10px" }}>
//                     <h3 style={{ fontWeight: "bold", textAlign: "center", color: "#000", textDecoration: "underline" }}>
//                         Tax Invoice
//                     </h3>
//                 </div>

//                 <div style={invoiceStyles.headerGrid}>

//                     {/* Left side - Business name and shipping */}
//                     <div style={invoiceStyles.businessInfo}>

//                         <div style={invoiceStyles.shippingAddress}>
//                             <p style={{ margin: '10px 0', lineHeight: '1.5' }}>
//                                 <b>Customer Name:</b> {order.business_name}<br />
//                                 {order.business_order_ref_client &&
//                                     <>
//                                         <b>Ref Client:</b> {order.business_order_ref_client}<br />
//                                     </>
//                                 }
//                                 <b>Shipping Address:</b> {address.business_full_address}<br />
//                                 <b>City:</b> {address.business_city}<br />
//                                 <b>Phone:</b> {address.mobile_number_1}<br />
//                                 <b>Email:</b> {address.contact_email}<br />
//                                 <b>TRN:</b> {order.busienss_trn}
//                             </p>
//                         </div>
//                     </div>

//                     {/* Right side - Invoice details */}
//                     <div style={invoiceStyles.invoiceInfo}>

//                         <table style={{ marginLeft: 'auto' }}>
//                             <tr>
//                                 <td style={{ padding: '5px 0', color: '#666' }}>Invoice #:</td>
//                                 <td style={{ padding: '5px 0 5px 15px' }}>{order.secret_order_id}</td>
//                             </tr>
//                             <tr>
//                                 <td style={{ padding: '5px 0', color: '#666' }}>Date:</td>
//                                 <td style={{ padding: '5px 0 5px 15px' }}>{order.business_order_date}</td>
//                             </tr>
//                             <tr>
//                                 <td style={{ padding: '5px 0', color: '#666' }}>Payment Method:</td>
//                                 <td style={{ padding: '5px 0 5px 15px', textAlign: 'left', textTransform: 'capitalize' }}>{order.business_order_payment_method}</td>
//                             </tr>
//                         </table>
//                     </div>
//                 </div>

//                 <table style={invoiceStyles.table} >
//                     <thead>
//                         <tr style={invoiceStyles.heading}>
//                             <td style={invoiceStyles.headingCell}>Product</td>
//                             <td style={invoiceStyles.headingCell} align="right">Price</td>
//                             <td style={invoiceStyles.headingCell} align="right">Quantity</td>
//                             <td style={invoiceStyles.headingCell} align="right">VAT</td>
//                             <td style={invoiceStyles.headingCell} align="right">Sub Total</td>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {orderItems?.map((item) => (
//                             <tr key={item.item_number} style={invoiceStyles.item}>
//                                 <td style={invoiceStyles.itemCell}>
//                                     {item.item_name}<br />
//                                     <small>{item.item_number}</small> <br />
//                                     {
//                                         item.item_status === 7 &&
//                                         <span className="badge bg-danger">Returned</span>
//                                     }
//                                 </td>
//                                 <td style={invoiceStyles.itemCell} align="right">
//                                     {item.item_price_excl_vat} AED
//                                 </td>
//                                 <td style={invoiceStyles.itemCell} align="right">
//                                     {item.item_qty}
//                                 </td>
//                                 <td style={invoiceStyles.itemCell} align="right">
//                                     {item.item_vat_amount} AED
//                                 </td>
//                                 <td style={invoiceStyles.itemCell} align="right">
//                                     {item.item_sub_total} AED
//                                 </td>
//                             </tr>
//                         ))}

//                         <tr style={invoiceStyles.total}>
//                             <td colSpan="4" style={invoiceStyles.itemCell} align="right">
//                                 <span style={{ lineHeight: '0' }}>Sub Total : <div><small>(Including VAT)</small></div></span>
//                             </td>
//                             <td style={invoiceStyles.itemCell} align="right">
//                                 {order.display_corrected_grand_total}
//                             </td>
//                         </tr>
//                         {Number(order.business_order_total_saving) > 0 && (
//                             <tr style={invoiceStyles.total}>
//                                 <td colSpan="4" style={invoiceStyles.itemCell} align="right">
//                                     Discount :
//                                 </td>
//                                 <td style={invoiceStyles.itemCell} align="right">
//                                     {order.business_order_total_saving} AED
//                                 </td>
//                             </tr>
//                         )}

//                         {order.shipping_charges > 0 && (
//                             <tr style={invoiceStyles.total}>
//                                 <td colSpan="4" style={invoiceStyles.itemCell} align="right">
//                                     Shipping Charges :
//                                 </td>
//                                 <td style={invoiceStyles.itemCell} align="right">
//                                     {order.shipping_charges} AED
//                                 </td>
//                             </tr>
//                         )}



//                         <tr style={{ ...invoiceStyles.total, fontSize: '12px' }}>
//                             <td colSpan="4" style={invoiceStyles.itemCell} align="right">

//                                 <span style={{ lineHeight: '0' }}>Amount : <div><small>(Excluding VAT)</small></div></span>
//                             </td>
//                             <td style={invoiceStyles.itemCell} align="right">
//                                 <strong>{order.display_corrected_excl_vat}</strong>
//                             </td>
//                         </tr>
//                         <tr style={{ ...invoiceStyles.total, fontSize: '12px' }}>
//                             <td colSpan="4" style={invoiceStyles.itemCell} align="right">
//                                 <strong>VAT 5% : </strong>
//                             </td>
//                             <td style={invoiceStyles.itemCell} align="right">
//                                 <strong>{order.display_corrected_vat_amount}</strong>
//                             </td>
//                         </tr>

//                         <tr style={{ ...invoiceStyles.total, fontSize: '12px' }}>
//                             <td colSpan="4" style={invoiceStyles.itemCell} align="right">
//                                 <strong>Grand Total : </strong>
//                             </td>
//                             <td style={invoiceStyles.itemCell} align="right">
//                                 <strong>{order.display_corrected_grand_total} AED</strong>
//                             </td>
//                         </tr>
//                     </tbody>
//                 </table>
//             </div>
//         </>
//     );
// };

// export default Invoice;



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
        fontWeight: "bold"
    },
    totalValueCell: {
        padding: "5px",
        textAlign: "right",
        fontWeight: "bold"
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
                size: A4 landscape;
                margin: 0;
            }

            @media print {
                html, body {
                    margin: 0 !important;
                    padding: 0 !important;
                    width: 297mm !important;
                    height: 210mm !important;
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
                    width: 297mm !important;
                    height: 210mm !important;
                    padding: 8mm !important;
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
                }

                .col-5 {
                    width: 41.666667% !important;
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
            }
        `}
    </style>
);

const Invoice = ({ order, orderItems, address, returnData, cancelData }) => {
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
                    <div style={{ width: "180px", flexShrink: 0 }}>
                        <img
                            src="/assets/images/main-logo-2.png"
                            alt="logo"
                            style={{
                                width: "100%",
                                height: "auto",
                                objectFit: "contain",
                                display: "block"
                            }}
                        />
                    </div>

                    <div style={{ flex: 1, textAlign: "center", paddingRight: "40px" }}>
                        <h4
                            style={{
                                margin: 0,
                                fontSize: "20px",
                                fontWeight: "700",
                                color: "#000",
                                lineHeight: "30px",
                                wordBreak: "break-word"
                            }}
                        >
                            GHAYAR AUTO SPARE PARTS TRADING L.L.C
                        </h4>
                    </div>
                </div>

                <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <span style={{ fontSize: "16px", fontWeight: "bold", marginBottom: "10px" }}>
                        Order Details
                    </span>
                </div>

                <div className="row">
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
                            <div style={{ display: "flex", gap: "30px" }}>
                                <div>
                                    <b>Customer Name:</b> {order.business_name}
                                </div>
                                <div>
                                    {order.business_order_ref_client && (
                                        <>
                                            <b>Ref Client:</b> {order.business_order_ref_client}
                                        </>
                                    )}
                                </div>
                            </div>

                            <span>Shipping Address:</span> {address.business_full_address}
                            <br />

                            <div style={{ display: "flex", gap: "30px", marginBottom: "-5px" }}>
                                <div>
                                    <b>Phone:</b> {address.mobile_number_1}
                                </div>
                                <div>
                                    {order.busienss_trn && (
                                        <>
                                            <b>TRN:</b> {order.busienss_trn}
                                        </>
                                    )}
                                </div>
                            </div>

                            <b>Email:</b> {address.contact_email}
                        </div>
                    </div>

                    <div className="col-5">
                        <div
                            style={{
                                border: "2px solid #000",
                                borderRadius: "10px",
                                marginBottom: "2px",
                                textAlign: "center"
                            }}
                        >
                            <span style={{ textTransform: "uppercase", fontWeight: "bold", fontSize: "13px" }}>
                                TRN Number : 100442212500003
                            </span>
                        </div>

                        <div style={invoiceStyles.shippingAddress}>
                            <b>Reference Order No # :</b> {order?.secret_order_id}
                            <br />
                            <b>Date :</b> {dayjs(order?.business_order_date).format("DD MMM YYYY")}
                            <div style={{ display: "flex", marginBottom: "-5px" }}>
                                <div>
                                    <b>Currency :</b> AED
                                </div>
                            </div>
                            <b>Payment Method : </b> {order.business_order_payment_method}
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
                            {/* <td style={invoiceStyles.headingCell} align="center">Sub Total</td> */}
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
                                    <td style={invoiceStyles.itemCell}>
                                        <div>{item.item_name}</div>
                                        {
                                            item.invoice_no &&
                                            <small>Invoice No: {item.invoice_no}</small>
                                        }
                                    </td>
                                    <td style={invoiceStyles.itemCell} align="left">{item?.item_number}</td>
                                    <td style={invoiceStyles.itemCell} align="left">{item?.item_brand}</td>
                                    <td style={invoiceStyles.itemCell} align="left">{item?.item_price_excl_vat} AED</td>
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
                                {order?.business_order_total_saving > 0 ? "Sub Total" : "Taxable Amount"} :
                            </td>
                            <td style={invoiceStyles.totalValueCell} align="right">
                                {order?.display_sub_total}
                            </td>
                        </tr>

                        {Number(order.business_order_total_saving) > 0 && (
                            <tr style={invoiceStyles.total}>
                                <td colSpan="7" style={invoiceStyles.totalLabelCell} align="right">
                                    Discount :
                                </td>
                                <td style={invoiceStyles.totalValueCell} align="right">
                                    {order.business_order_total_saving} AED
                                </td>
                            </tr>
                        )}

                        {Number(order.business_order_total_saving) > 0 && (
                            <tr style={invoiceStyles.total}>
                                <td colSpan="7" style={invoiceStyles.totalLabelCell} align="right">
                                    Taxable Amount :
                                </td>
                                <td style={invoiceStyles.totalValueCell} align="right">
                                    {order.business_order_sub_total - order.business_order_total_saving ?? 0} AED
                                </td>
                            </tr>
                        )}



                        {order.shipping_charges > 0 && (
                            <tr style={invoiceStyles.total}>
                                <td colSpan="7" style={invoiceStyles.totalLabelCell} align="right">
                                    Shipping Charges :
                                </td>
                                <td style={invoiceStyles.totalValueCell} align="right">
                                    {order.shipping_charges} AED
                                </td>
                            </tr>
                        )}

                        {/* <tr style={invoiceStyles.total}>
                            <td colSpan="7" style={invoiceStyles.totalLabelCell} align="right">
                                Amount :
                                <div><small>(Excluding VAT)</small></div>
                            </td>
                            <td style={invoiceStyles.totalValueCell} align="right">
                                <strong>{order?.display_excl_vat}</strong>
                            </td>
                        </tr> */}

                        <tr style={invoiceStyles.total}>
                            <td colSpan="7" style={invoiceStyles.totalLabelCell} align="right">
                                VAT 5%
                            </td>
                            <td style={invoiceStyles.totalValueCell} align="right">
                                <strong>{order.display_vat_amount ?? 0}</strong>
                            </td>
                        </tr>

                        <tr style={invoiceStyles.total}>
                            <td
                                colSpan="7"
                                style={{
                                    ...invoiceStyles.totalLabelCell,
                                    borderBottom: "2px solid #000"
                                }}
                                align="right"
                            >
                                Grand Total
                            </td>
                            <td
                                style={{
                                    ...invoiceStyles.totalValueCell,
                                    borderBottom: "2px solid #000"
                                }}
                                align="right"
                            >
                                <strong>{order.display_grand_total}</strong>
                            </td>
                        </tr>
                    </tbody>
                </table>

                <div
                    className="footer-section"
                    style={{
                        marginTop: "auto",
                        paddingTop: "10px"
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            padding: "16px",
                            alignItems: "center"
                        }}
                    >
                        <div>
                            <div style={{ height: "2px", background: "#000", width: "100%" }} />
                            <span style={{ textTransform: "uppercase" }}>Received by</span>
                        </div>

                        <div>
                            <div style={{ height: "2px", background: "#000", width: "100%" }} />
                            <span style={{ textTransform: "uppercase" }}>Authorized signatory</span>
                        </div>
                    </div>

                    <div className="row align-items-center">
                        <div className="col-8">
                            <div className="row">
                                <div className="col-6 mb-1">
                                    <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                                        <i className="fa fa-globe" style={{ color: "red" }} />
                                        <span>www.business.ghayar.com</span>
                                    </div>
                                </div>

                                <div className="col-6 mb-1">
                                    <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                                        <i className="fa fa-envelope" style={{ color: "red" }} />
                                        <span>business@ghayar.com</span>
                                    </div>
                                </div>

                                <div className="col-6">
                                    <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                                        <i className="fa fa-map-marker" style={{ color: "red", marginTop: "4px" }} />
                                        <span>
                                            Algeria Street, Al Meera Building,
                                            Al Rawda 1, Ajman
                                        </span>
                                    </div>
                                </div>

                                <div className="col-6">
                                    <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                                        <i className="fa fa-phone" style={{ color: "red" }} />
                                        <span>Toll-Free : 800442522</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-4 text-end">
                            <img
                                src="/assets/images/inv-logo.jpeg"
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

export default Invoice;