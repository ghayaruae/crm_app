import { useContext, useEffect, useState } from 'react';
import PageTitle from '../../../Components/PageTitle';
import axios from 'axios';
import { ConfigContext } from '../../../Context/ConfigContext';
import { Link, useParams } from 'react-router-dom';
import { ContentLoader } from '../../../Components/Shimmer';
import { getValidityDays } from '../../../Components/GlobalFunctions';

const ViewQuotation = () => {
    const { apiURL, apiHeaderJson, primaryColor } = useContext(ConfigContext);
    const { quotation_id } = useParams();

    const [quotation, setQuotation] = useState(null);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    const getQuotationData = async () => {
        try {
            setLoading(true);
            const headers = apiHeaderJson;
            const response = await axios.get(`${apiURL}Masters/GetQuotationInfo`, {
                params: {
                    quotation_id: quotation_id
                },
                headers
            });

            if (response.data.success) {
                setQuotation(response.data.data);
                setItems(response.data.data.items || []);
                setLoading(false);
            } else {
                console.log(response.data.message);
            }
        } catch (error) {
            console.error("Error fetching quotation:", error);
            setLoading(false);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (quotation_id) {
            getQuotationData();
        }
    }, [quotation_id]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const handlePrint = () => {
        window.print();
    };

    // Calculate totals from items
    const calculateSubtotal = () => {
        return items.reduce(
            (sum, item) =>
                sum +
                (parseFloat(item.item_price || 0) * parseFloat(item.item_qty || 0)),
            0
        );
    };

    const calculateTotalVAT = () => {
        return items.reduce((sum, item) => {
            const taxable =
                parseFloat(item.item_price || 0) *
                parseFloat(item.item_qty || 0);

            return sum + (taxable * parseFloat(item.item_vat || 0)) / 100;
        }, 0);
    };

    const calculateNetAmount = () => {
        return calculateSubtotal() + calculateTotalVAT();
    };

    // Format number to 2 decimal places
    const formatAmount = (amount) => {
        return parseFloat(amount).toFixed(2);
    };

    // Convert number to words (simple version for amount)
    const numberToWords = (num) => {
        if (num === 0) return 'ZERO';
        const ones = ['', 'ONE', 'TWO', 'THREE', 'FOUR', 'FIVE', 'SIX', 'SEVEN', 'EIGHT', 'NINE', 'TEN', 'ELEVEN', 'TWELVE', 'THIRTEEN', 'FOURTEEN', 'FIFTEEN', 'SIXTEEN', 'SEVENTEEN', 'EIGHTEEN', 'NINETEEN'];
        const tens = ['', '', 'TWENTY', 'THIRTY', 'FORTY', 'FIFTY', 'SIXTY', 'SEVENTY', 'EIGHTY', 'NINETY'];

        const convertHundreds = (n) => {
            if (n === 0) return '';
            if (n < 20) return ones[n] + ' ';
            if (n < 100) return tens[Math.floor(n / 10)] + ' ' + (n % 10 !== 0 ? ones[n % 10] + ' ' : '');
            return ones[Math.floor(n / 100)] + ' HUNDRED ' + (n % 100 !== 0 ? convertHundreds(n % 100) : '');
        };

        const dollars = Math.floor(num);
        const cents = Math.round((num - dollars) * 100);

        let result = '';
        if (dollars > 0) {
            if (dollars >= 1000) {
                const thousands = Math.floor(dollars / 1000);
                const remainder = dollars % 1000;
                result += convertHundreds(thousands) + 'THOUSAND ';
                if (remainder > 0) result += convertHundreds(remainder);
            } else {
                result += convertHundreds(dollars);
            }
            result += 'AED';
        }

        if (cents > 0) {
            result += ' AND ' + cents + '/100';
        } else {
            result += ' AND 00/100';
        }

        return result.trim();
    };

    if (loading) {
        return (
            <div className="main-content">
                <div className="page-content">
                    <div className="container-fluid">
                        <ContentLoader />
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="main-content">
            <div className="page-content">
                <div className="container-fluid">

                    <div className="text-end mb-3 no-print">
                        <button className="btn btn-primary" onClick={handlePrint}>
                            <i className="ri-printer-line me-1"></i>
                            Print
                        </button>
                        <Link className='btn btn-secondary ms-3' to={"/Masters/QuotationsList"}>
                            Back <i className='ri-arrow-right-line ms-2 align-middle'></i>
                        </Link>
                    </div>

                    <div className="quotation-sheet bg-white mx-auto">

                        {/* HEADER */}

                        <div className="row align-items-center mb-4">

                            <div className="col-3">

                                <img
                                    src="/assets/images/main-logo-2.png"
                                    style={{
                                        width: "180px",
                                        objectFit: "contain"
                                    }}
                                />

                            </div>

                            <div className="col-9 text-end">

                                <h4 className="">
                                    Ghayar Auto Spare Parts Trading LLC
                                </h4>

                            </div>

                        </div>

                        <h2 className='text-center mb-3'>QUOTATION</h2>



                        {/* TOP BOXES */}

                        <div className="row mt-3 g-2">

                            <div className="col-8">

                                <div className="border border-black rounded p-2 top-box">
                                    <div className="mb-3">
                                        <div><strong>Name:</strong> {quotation?.customer_name || "-"}</div>
                                        <div><strong>Contact:</strong> {quotation?.customer_contact || "-"}</div>
                                        <div><strong>Email:</strong> {quotation?.customer_email || "-"}</div>
                                    </div>

                                    <div className="mb-2">
                                        <strong>Subject:</strong>
                                    </div>

                                    <div>
                                        <strong>Attention:</strong>
                                    </div>
                                </div>

                            </div>



                            <div className="col-4">

                                <div className="border border-black rounded p-2 top-box">

                                    <div className="d-flex justify-content-between">

                                        <span>Quot No</span>

                                        <b>{quotation?.quotation_number}</b>

                                    </div>

                                    <div className="d-flex justify-content-between mt-2">

                                        <span>Date</span>

                                        <span>{quotation?.issue_date}</span>

                                    </div>

                                    <div className="d-flex justify-content-between mt-2">

                                        <span>Cust Ref</span>

                                        <span>-</span>

                                    </div>

                                    <div className="d-flex justify-content-between mt-2">

                                        <span>Dept.</span>

                                        <span>-</span>

                                    </div>

                                    <div className="d-flex justify-content-between mt-2">

                                        <span>Salesman</span>

                                        <span>

                                            {quotation?.business_salesmen_name}

                                        </span>

                                    </div>

                                </div>

                            </div>

                        </div>



                        {/* TABLE */}

                        <div className='border border-black mt-2 rounded'>
                            <table className="quotation-table w-100">

                                <thead>

                                    <tr>
                                        <th>SN</th>
                                        <th>ITEM CODE</th>
                                        <th>DESCRIPTION</th>
                                        <th>UNIT</th>
                                        <th>QTY</th>
                                        <th>UNIT PRICE</th>
                                        <th>AMOUNT</th>
                                    </tr>

                                </thead>

                                <tbody>

                                    {items.map((item, index) => (

                                        <tr key={index}>

                                            <td>{index + 1}</td>
                                            <td>{item.item_number}</td>
                                            <td>{item.item_name}</td>
                                            <td>PCS</td>
                                            <td>{item.item_qty}</td>
                                            <td>{Number(item.item_price).toFixed(3)}</td>
                                            <td>{Number(item.item_total).toFixed(2)}</td>

                                        </tr>

                                    ))}

                                </tbody>

                            </table>



                            {/* TOTALS */}

                            <div className="row mt-2 p-2">

                                <div className="col-7">

                                    AED :

                                    {numberToWords(calculateNetAmount())}

                                </div>

                                <div className="col-5">

                                    <table className="w-100">

                                        <tbody>

                                            <tr>

                                                <td>Total Amount</td>

                                                <td className="text-end">

                                                    {formatAmount(calculateSubtotal())}

                                                </td>

                                            </tr>

                                            <tr>

                                                <td>Discount</td>

                                                <td className="text-end">

                                                    0.00

                                                </td>

                                            </tr>

                                            <tr>

                                                <td>Taxable Amount</td>

                                                <td className="text-end">

                                                    {formatAmount(calculateSubtotal())}

                                                </td>

                                            </tr>

                                            <tr>

                                                <td>Vat (5%)</td>

                                                <td className="text-end">

                                                    {formatAmount(calculateTotalVAT())}

                                                </td>

                                            </tr>

                                            <tr className="fw-bold">

                                                <td>Net Amount</td>

                                                <td className="text-end">

                                                    {formatAmount(calculateNetAmount())}

                                                </td>

                                            </tr>

                                        </tbody>

                                    </table>

                                </div>

                            </div>
                        </div>



                        <hr className="my-2" />



                        {/* TERMS */}

                        <div className="border border-black rounded p-2 terms-box">

                            <u>Terms & Payment Methods</u>

                            <div className="mt-2">

                                Payment

                            </div>

                            <div className="mt-2">

                                Delivery

                            </div>

                            <div className="mt-2">

                                Validity

                                <span className="ms-5">

                                    {quotation?.expiry_date
                                        ? getValidityDays(quotation) + " Days From Quot Date"
                                        : "7 Days From Quot Date"}

                                </span>

                            </div>

                        </div>



                        {/* FOOTER */}

                        <div className="row mt-5">

                            <div className="col-6">

                                Prepared By

                                <span className="ms-2">

                                    {quotation?.business_salesmen_name}

                                </span>

                            </div>

                            <div className="col-6">

                                <div className="signature-line"></div>
                                <p className='mb-0 mt-1'>For</p>
                            </div>

                        </div>


                        <div className="text-center mt-2">

                            {new Date().toLocaleString()}

                        </div>


                    </div>

                </div>
            </div>
        </div>
    );
};

export default ViewQuotation;