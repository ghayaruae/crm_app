import React, { useContext, useEffect, useRef, useState } from 'react'
import PageTitle from './PageTitle'
import { useParams } from 'react-router-dom'
import axios from 'axios';
import Invoice from './Invoice';
import html2pdf from 'html2pdf.js';
import { ConfigContext } from '../Context/ConfigContext';


const ViewOrderInvoice = () => {

    const { business_order_id } = useParams();


    const { apiURL, apiHeaderJson } = useContext(ConfigContext);
    const [orderDetails, setOrderDetails] = useState({});
    const [orderItems, setOrderItems] = useState([]);
    const [orderAddress, setOrderAddress] = useState({})

    const getData = async () => {
        try {
            const headers = apiHeaderJson;
            const response = await axios.get(`${apiURL}Business/GetOrderInfo`, {
                params: { business_order_id },
                headers
            });

            if (response.data.success) {
                setOrderDetails(response.data.data[0]);
                setOrderItems(response.data.items);
                setOrderAddress(response.data.order_address[0]);
            } else {
                console.log(response.data.message);
            }
        } catch (error) {
            console.error(error);
        }
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
            html2canvas: { scale: 2, useCORS: true },
            jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
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
                    <PageTitle title="Order Details" primary={"Dashboard"} />

                    <div className="row mb-3">

                        <div className="col-md-6">
                            <h3 className="account-sub-title d-none d-md-block">
                                <i className="ri-dropbox-line align-middle me-3" />
                                Order Number : {orderDetails?.secret_order_id}
                            </h3>
                        </div>

                        <div className="col-md-6">
                            <span
                                className="d-flex justify-content-end align-items-center me-4 cursor-pointer"
                                onClick={downloadPDF}
                            >
                                <i className="ri-download-cloud-2-line me-2 text-primary fs-5" />
                                <span className="text-decoration-underline">Download Invoice</span>
                            </span>
                        </div>

                    </div>

                    <div ref={pdfRef}>
                        <Invoice
                            order={orderDetails}
                            orderItems={orderItems}
                            address={orderAddress}
                        />
                    </div>

                </div>
            </div>
        </div>
    )
}

export default ViewOrderInvoice;
