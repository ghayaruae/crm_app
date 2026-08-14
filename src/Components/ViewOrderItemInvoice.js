import React, { useContext, useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import html2pdf from 'html2pdf.js';
import PageTitle from '../Components/PageTitle';
import axios from 'axios';
import OrderItemInvoice from './OrderItemInvoice';
import { ConfigContext } from '../Context/ConfigContext';

const ViewOrderItemInvoice = () => {

    const { business_id, business_order_id, invoice_id, invoice_no } = useParams();
    const { apiURL, apiHeaderJson, primaryColor } = useContext(ConfigContext);

    const [orderDetails, setOrderDetails] = useState({});
    const [orderItems, setOrderItems] = useState([]);
    const [orderAddress, setOrderAddress] = useState({})
    const [returnData, setReturnData] = useState([]);
    const [cancelData, setCancelData] = useState([]);

    const getData = async () => {
        try {
            const response = await axios.get(`${apiURL}Business/GetViewInvoiceOrdersDetails`, {
                headers: apiHeaderJson,
                params: {
                    secret_order_id: business_order_id,
                    business_id,
                    invoice_id
                }
            });

            if (response.data.success) {
                setOrderDetails(response.data.data);
                setOrderItems(response.data.items);
                setOrderAddress(response.data.address);
                setReturnData(response.data.return_data || []);
                setCancelData(response.data.cancel_data || []);
            } else {
                console.log(response.data.message);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const PrintInvoice = () => {
        const printContents = pdfRef.current.innerHTML;
        const printWindow = window.open("", "_blank");

        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
                <head>
                    <title>Invoice</title>
                    <meta charset="utf-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1" />
                    
                    <link rel="stylesheet" href="/assets/css/bootstrap.min.css" />
                    <link rel="stylesheet" href="/assets/css/icons.min.css" />
                    <link rel="stylesheet" href="/assets/css/app.min.css" />

                    <style>
                        @page {
                            size: A4 portrait;
                            margin: 0;
                        }

                        * {
                            box-sizing: border-box !important;
                            -webkit-print-color-adjust: exact !important;
                            print-color-adjust: exact !important;
                        }

                        html,
                        body {
                            margin: 0 !important;
                            padding: 0 !important;
                            width: 210mm !important;
                            height: 297mm !important;
                            background: #fff !important;
                            overflow: hidden !important;
                        }

                        body {
                            display: flex !important;
                            align-items: flex-start !important;
                            justify-content: center !important;
                        }

                        .invoice-container {
                            width: 210mm !important;
                            height: 297mm !important;
                            max-width: 210mm !important;
                            max-height: 297mm !important;
                            padding: 6mm !important;
                            margin: 0 !important;
                            background: #fff !important;
                            overflow: hidden !important;
                            display: flex !important;
                            flex-direction: column !important;
                            font-family: Arial, sans-serif !important;
                            color: #000 !important;
                            transform: scale(1);
                            transform-origin: top left;
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
                            padding: 0 5px !important;
                        }

                        .col-4 {
                            width: 33.333333% !important;
                            padding: 0 5px !important;
                        }

                        .col-6 {
                            width: 50% !important;
                            padding: 0 5px !important;
                        }

                        table {
                            width: 100% !important;
                            border-collapse: collapse !important;
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

                        img {
                            max-width: 100% !important;
                            height: auto !important;
                        }
                    </style>
                </head>

                <body>
                    ${printContents}
                </body>
            </html>
        `);

        printWindow.document.close();

        setTimeout(() => {
            printWindow.focus();
            printWindow.print();
            printWindow.close();
        }, 0);
    };

    const pdfRef = useRef();

    const downloadPDF = async () => {
        const element = pdfRef.current;

        const images = element.querySelectorAll("img");
        const imageLoadPromises = Array.from(images).map((img) => {
            if (!img.complete) {
                return new Promise((resolve) => {
                    img.onload = resolve;
                    img.onerror = resolve;
                });
            }
            return Promise.resolve();
        });

        await Promise.all(imageLoadPromises);

        const options = {
            margin: 0.3,
            filename: `Invoice_${orderDetails?.secret_order_id || 'order'}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: {
                scale: 2,
                useCORS: true,
                letterRendering: true
            },
            jsPDF: {
                unit: 'in',
                format: 'a4',
                orientation: 'portrait'
            },
            pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
        };

        html2pdf().set(options).from(element).save();
    };

    useEffect(() => {
        getData();
    }, [business_order_id]);

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    return (
        <div className='main-content'>
            <div className='page-content'>
                <div className='container-fluid'>
                    <br />
                    <PageTitle title="View Order Item Invoice" primary={"Dashboard"} />

                    <div className="row mb-3">
                        <div className="col-md-6">
                            <h3 className="account-sub-title d-none d-md-block">
                                <i className="ri-dropbox-line align-middle me-3" />
                                Order Number : {orderDetails?.secret_order_id}
                            </h3>
                        </div>

                        <div className="col-md-6">
                            <div className="d-flex justify-content-end align-items-center gap-4 me-4">
                                <span
                                    className="cursor-pointer"
                                    onClick={PrintInvoice}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <i className="ri-printer-line me-2 text-success fs-5" />
                                    <span className="text-decoration-underline">Print Invoice</span>
                                </span>

                                <span
                                    className="cursor-pointer"
                                    onClick={downloadPDF}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <i className="ri-download-cloud-2-line me-2 text-primary fs-5" />
                                    <span className="text-decoration-underline">Download Invoice</span>
                                </span>
                            </div>
                        </div>
                    </div>

                    <div ref={pdfRef}>
                        <OrderItemInvoice
                            order={orderDetails}
                            orderItems={orderItems}
                            address={orderAddress}
                            returnData={returnData}
                            cancelData={cancelData}
                            invoice_no={invoice_no}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ViewOrderItemInvoice;