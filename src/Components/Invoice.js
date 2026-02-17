import React from "react";

const invoiceStyles = {
    invoiceBox: {
        top: '0',
        margin: '0 auto',
        border: '1px solid #eee',
        fontSize: '16px',
        lineHeight: '24px',
        fontFamily: 'Arial, sans-serif',
        backgroundColor: '#fff',

        boxSizing: 'border-box'
    },
    logo: {
        width: '150px',
        height: 'auto',
        marginBottom: '20px'
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
        marginTop: '20px',
        fontSize: '12px',

    },
    heading: {
        // backgroundColor: 'rgb(154 10 12)',
        backgroundColor: '#000',
        color: '#FFF',
        borderBottom: '1px solid #ddd'
    },
    headingCell: {
        padding: '10px',
        fontWeight: 'bold'
    },
    item: {
        borderBottom: '1px solid #eee'
    },
    itemCell: {
        padding: '10px',
        verticalAlign: 'top'
    },
    total: {
        borderTop: '2px solid #eee',
        fontWeight: 'bold',
        fontSize: '12px',

    },
    headerGrid: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '20px',
        marginBottom: '30px'
    },
    businessInfo: {
        textAlign: 'left'
    },
    invoiceInfo: {
        padding: '15px',
        textAlign: 'left',
        fontSize: '12px',
        color: '#555',
        lineHeight: '1.5'
    },
    shippingAddress: {
        marginBottom: '20px',
        padding: '15px',
        fontSize: '12px',
        borderRadius: '4px'
    }
};

const PrintStyles = () => (
    <style>
        {`
            @page {
                size: A4;
                margin: 0;
            }
            @media print {
                body {
                    margin: 0;
                    padding: 0;
                }
                .invoice-container {
                    width: 310mm;
                    height: 297mm;
                    page-break-after: always;
                }
            }
        `}
    </style>
);

const Invoice = ({ order, orderItems, address }) => {
    const dir = localStorage.getItem('dir');
    if (!orderItems) return <div></div>;

    return (
        <>
            <PrintStyles />
            <div className="invoice-container" style={invoiceStyles.invoiceBox} dir={dir}>

                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        marginBottom: "10px",
                        width: "100%",
                        padding: "20px"
                    }}
                >
                    {/* LEFT SIDE – COMPANY INFO */}
                    <div style={{ fontSize: "12px", lineHeight: "1.5" }}>
                        <strong><b>GHAYAR AUTO SPARE PARTS TRADING L.L.C</b>
                            <br />
                            TRN: 100442212500003</strong>
                        <div>Ajman, AL Rawda 1, Algeria St, Al Meera Building, M002,
                            <br />
                            Warehouse No. 3 - Umm Dera - New Industrial Area - Emirate of Umm Al
                            Quwain</div>
                        <div>Dubai</div>
                    </div>
                    <div style={{ textAlign: "right", fontSize: "12px" }}>
                    </div>
                </div>

                <div style={{ marginBottom: "-10px" }}>
                    <h3 style={{ fontWeight: "bold", textAlign: "center", color: "#000", textDecoration: "underline" }}>
                        Invoice
                    </h3>
                </div>

                <div style={invoiceStyles.headerGrid}>

                    {/* Left side - Business name and shipping */}
                    <div style={invoiceStyles.businessInfo}>

                        <div style={invoiceStyles.shippingAddress}>
                            <p style={{ margin: '10px 0', lineHeight: '1.5' }}>
                                <b>Customer Name:</b> {order.business_name}<br />
                                <b>Shipping Address:</b> {address.business_full_address}<br />
                                <b>City:</b> {address.business_city}<br />
                                <b>Phone:</b> {address.mobile_number_1}<br />
                                <b>Email:</b> {address.contact_email}<br />
                                <b>TRN:</b> {order.busienss_trn}
                            </p>
                        </div>
                    </div>

                    {/* Right side - Invoice details */}
                    <div style={invoiceStyles.invoiceInfo}>

                        <table style={{ marginLeft: 'auto' }}>
                            <tr>
                                <td style={{ padding: '5px 0', color: '#666' }}>Invoice #:</td>
                                <td style={{ padding: '5px 0 5px 15px' }}>{order.secret_order_id}</td>
                            </tr>
                            <tr>
                                <td style={{ padding: '5px 0', color: '#666' }}>Date:</td>
                                <td style={{ padding: '5px 0 5px 15px' }}>{order.business_order_date}</td>
                            </tr>
                            <tr>
                                <td style={{ padding: '5px 0', color: '#666' }}>Payment Method:</td>
                                <td style={{ padding: '5px 0 5px 15px', textAlign: 'left', textTransform: 'capitalize' }}>{order.business_order_payment_method}</td>
                            </tr>
                        </table>
                    </div>
                </div>

                <table style={invoiceStyles.table} >
                    <thead>
                        <tr style={invoiceStyles.heading}>
                            <td style={invoiceStyles.headingCell}>Product</td>
                            <td style={invoiceStyles.headingCell} align="right">Price</td>
                            <td style={invoiceStyles.headingCell} align="right">Quantity</td>
                            <td style={invoiceStyles.headingCell} align="right">VAT</td>
                            <td style={invoiceStyles.headingCell} align="right">Sub Total</td>
                        </tr>
                    </thead>
                    <tbody>
                        {orderItems?.map((item) => (
                            <tr key={item.item_number} style={invoiceStyles.item}>
                                <td style={invoiceStyles.itemCell}>
                                    {item.item_name}<br />
                                    <small>{item.item_number}</small> <br />
                                    {
                                        item.item_status === 7 &&
                                        <span className="badge bg-danger">Returned</span>
                                    }
                                </td>
                                <td style={invoiceStyles.itemCell} align="right">
                                    {item.item_price_excl_vat} AED
                                </td>
                                <td style={invoiceStyles.itemCell} align="right">
                                    {item.item_qty}
                                </td>
                                <td style={invoiceStyles.itemCell} align="right">
                                    {item.item_vat_amount} AED
                                </td>
                                <td style={invoiceStyles.itemCell} align="right">
                                    {item.item_sub_total} AED
                                </td>
                            </tr>
                        ))}

                        <tr style={invoiceStyles.total}>
                            <td colSpan="4" style={invoiceStyles.itemCell} align="right">
                                <span style={{ lineHeight: '0' }}>Sub Total : <div><small>(Including VAT)</small></div></span>
                            </td>
                            <td style={invoiceStyles.itemCell} align="right">
                                {order.display_corrected_grand_total}
                            </td>
                        </tr>
                        {Number(order.business_order_total_saving) > 0 && (
                            <tr style={invoiceStyles.total}>
                                <td colSpan="4" style={invoiceStyles.itemCell} align="right">
                                    Discount :
                                </td>
                                <td style={invoiceStyles.itemCell} align="right">
                                    {order.business_order_total_saving} AED
                                </td>
                            </tr>
                        )}

                        {order.shipping_charges > 0 && (
                            <tr style={invoiceStyles.total}>
                                <td colSpan="4" style={invoiceStyles.itemCell} align="right">
                                    Shipping Charges :
                                </td>
                                <td style={invoiceStyles.itemCell} align="right">
                                    {order.shipping_charges} AED
                                </td>
                            </tr>
                        )}



                        <tr style={{ ...invoiceStyles.total, fontSize: '12px' }}>
                            <td colSpan="4" style={invoiceStyles.itemCell} align="right">

                                <span style={{ lineHeight: '0' }}>Amount : <div><small>(Excluding VAT)</small></div></span>
                            </td>
                            <td style={invoiceStyles.itemCell} align="right">
                                <strong>{order.display_corrected_excl_vat}</strong>
                            </td>
                        </tr>
                        <tr style={{ ...invoiceStyles.total, fontSize: '12px' }}>
                            <td colSpan="4" style={invoiceStyles.itemCell} align="right">
                                <strong>VAT 5% : </strong>
                            </td>
                            <td style={invoiceStyles.itemCell} align="right">
                                <strong>{order.display_corrected_vat_amount}</strong>
                            </td>
                        </tr>

                        <tr style={{ ...invoiceStyles.total, fontSize: '12px' }}>
                            <td colSpan="4" style={invoiceStyles.itemCell} align="right">
                                <strong>Grand Total : </strong>
                            </td>
                            <td style={invoiceStyles.itemCell} align="right">
                                <strong>{order.display_corrected_grand_total} AED</strong>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default Invoice;
