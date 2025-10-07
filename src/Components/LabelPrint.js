import React, { useRef } from 'react'
import Barcode from 'react-barcode';

const LabelPrint = ({ orderAddress, orderDetails }) => {

    const pdfRef = useRef();


    const printInvoice = () => {
        const printContents = pdfRef.current.innerHTML;
        const originalContents = document.body.innerHTML;

        document.body.innerHTML = printContents;
        window.print();
        document.body.innerHTML = originalContents;
        window.location.reload()
    };

    return (
        <>


            <button
                className="btn btn-warning btn-sm btn-label waves-light right waves-effect"
                data-bs-toggle="modal"
                data-bs-target="#exampleModal"
            >
                <i className="ri-printer-line label-icon" />
                Label Print
            </button>

            <div className="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">

                            <div className="col-md-12" ref={pdfRef}>
                                <div className="card p-3" style={{ border: '1px solid #000' }}>
                                    {/* Return To */}
                                    <div className="mb-2">
                                        <strong>Return to :</strong>
                                        <p className="mb-0">Showroom 6 -51 AJD Building, 5th Street</p>
                                        <small className="mb-0">Umm Ramool, Dubai,</small>
                                        <br />
                                        <small className="mb-0">United Arab Emirates</small>
                                    </div>

                                    <hr className="my-2" />

                                    {/* Deliver To */}
                                    <div className="mb-2">
                                        <strong>Deliver to :</strong>
                                        <p className="mb-0 fw-bold">{orderAddress?.first_name} {orderAddress?.last_name}</p>
                                        <small className="mb-0">
                                            {orderAddress?.business_full_address}
                                        </small>
                                        <small className="mb-0">{orderAddress?.business_city} - {orderAddress?.pincode}, {orderAddress?.state}</small>
                                        <small className="mb-0">{orderAddress?.country}</small>
                                    </div>

                                    <div className="text-center">
                                        <div className="text-center my-3">
                                            <Barcode
                                                value={String(orderDetails?.business_order_id).padStart(12, '0')}
                                                format="CODE128"
                                                width={2}
                                                height={80}
                                                displayValue={true}
                                            />

                                        </div>
                                    </div>

                                    <div className="text-center">
                                        <img
                                            src="https://ghayar.ae/v1/admin/public/img/totheapp.png"
                                            alt="ghayar-img"
                                            width={100}
                                        />
                                    </div>
                                </div>
                            </div>

                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" className="btn btn-primary" onClick={printInvoice}>Print</button>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}

export default LabelPrint
