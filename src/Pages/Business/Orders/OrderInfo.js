import { useContext, useRef, useEffect, useState } from 'react'
import PageTitle from '../../../Components/PageTitle';
import axios from 'axios';
import { ConfigContext } from '../../../Context/ConfigContext';
import { Link, useParams } from 'react-router-dom';
import { ContentLoader, Spinner } from '../../../Components/Shimmer';
import OrderTracking from '../../../Components/OrderTracking';
import OrderList from '../../../Components/OrderList';
import Customers from '../../../Components/Customers';
import LabelPrint from '../../../Components/LabelPrint';
import { GetStatusBadge } from '../../../Utils/GetStatusBadge';

const OrderInfo = () => {
    const { apiURL, apiHeaderJson, primaryColor } = useContext(ConfigContext);

    const [orderDetails, setOrderDetails] = useState({});
    const [orderItems, setOrderItems] = useState([]);
    const [orderAddress, setOrderAddress] = useState({})
    const [orderTimeLineDate, setOrderTimeLineDate] = useState([])

    const { business_order_id } = useParams();
    const [loading, setLoading] = useState(true);

    const GetOrdersTimeLine = async () => {
        try {

            const headers = apiHeaderJson;
            const response = await axios.get(`${apiURL}Orders/GetOrderTimeline`, { params: { business_order_id }, headers })

            if (response?.data?.success) {
                setOrderTimeLineDate(response?.data?.data)
            }

        } catch (error) {
            console.log("error", error)
        }
    }

    useEffect(() => {
        GetOrdersTimeLine();
    }, [])

    const getData = async () => {
        try {
            setLoading(true);
            const headers = apiHeaderJson;
            const response = await axios.get(`${apiURL}Business/GetOrderInfo`, {
                params: { business_order_id },
                headers
            });

            if (response.data.success) {
                setOrderDetails(response.data.data[0]);
                setOrderItems(response.data.items);
                setOrderAddress(response.data.order_address[0]);
                setLoading(false)
            } else {
                console.log(response.data.message);
            }
        } catch (error) {
            setLoading(false)
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getData();
    }, [business_order_id]);

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    return (
        <div className="main-content">
            <div className="page-content">
                <div className="container-fluid">
                    {
                        loading ? (
                            <ContentLoader />
                        ) : (
                            <>
                                <PageTitle title="Order Details" primary={"Dashboard"} />

                                <div className="row">
                                    <div className="col-md-10">
                                        <div className="p-3 bg-white mb-3 rounded border-start border-4 border-danger">
                                            <h6 className="fw-bold mb-2" color={primaryColor}>Special Instruction</h6>
                                            <p className="mb-0">
                                                {orderDetails?.business_order_special_instruction || "No special instructions"}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="col-md-2 d-flex justify-content-end align-items-center">
                                        <Link to={`/ViewOrderInvoice/${orderDetails?.business_order_id}`}>
                                            <span className="d-flex align-items-center me-4 cursor-pointer">
                                                <i className="ri-download-cloud-2-line me-2 text-danger fs-5" />
                                                <span className="text-decoration-underline text-danger">View Invoice</span>
                                            </span>
                                        </Link>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-xl-9">
                                        <div className="card">

                                            <div className="card-header">
                                                <div className="d-flex justify-content-between align-items-center">
                                                    <div className="d-flex gap-3">
                                                        <h5 className="card-title flex-grow-1 mb-0">Order ID #{orderDetails?.secret_order_id}</h5>
                                                        {GetStatusBadge(orderDetails.business_order_status)}
                                                    </div>

                                                    <div className="d-flex gap-3">
                                                        <LabelPrint
                                                            orderAddress={orderAddress}
                                                            orderDetails={orderDetails}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <OrderList
                                                orderItems={orderItems}
                                                orderDetails={orderDetails}
                                            />
                                        </div>
                                        {
                                            orderTimeLineDate?.length > 0 &&
                                            <OrderTracking orderTimeLineDate={orderTimeLineDate} />
                                        }
                                    </div>
                                    <div className="col-xl-3">
                                        <Customers orderAddress={orderAddress} />
                                    </div>
                                </div>
                            </>
                        )
                    }
                </div>
            </div >
        </div >
    );
};

export default OrderInfo;
