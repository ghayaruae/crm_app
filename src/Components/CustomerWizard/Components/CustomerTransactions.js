import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { ConfigContext } from '../../../../Context/ConfigContext';
import { useNavigate } from 'react-router-dom';
import { NoRecords, Spinner } from '../../../../Components/Shimmer';
import "../../../Reports/BusinessCredit/credit.css"

const CustomerTransactions = ({ business_id }) => {

    const [loading, setLoading] = useState(false)
    const navigate = useNavigate();

    const [statements, setStatements] = useState([]);
    const [businessInfo, setBusinessInfo] = useState({});
    const [currentDue, setCurrentDue] = useState();

    const { apiURL, apiHeaderJson } = useContext(ConfigContext);

    const GetBusinessTransactions = async () => {
        try {
            setLoading(true)

            const currentDate = new Date();
            const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
            const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

            const headers = apiHeaderJson
            const response = await axios.get(`${apiURL}Transactions/GetBusinessTransactions`,
                {
                    params: {
                        business_id,
                        from_date: firstDay.toISOString().split('T')[0],
                        to_date: lastDay.toISOString().split('T')[0]
                    }, headers
                })
            if (response?.data?.success) {
                const data = response?.data
                setBusinessInfo(data?.business_info[0])
                setStatements(data?.data)
                setCurrentDue(data.current_due || 0);
            }

        } catch (error) {
            console.log("error", error)
        } finally {
            setLoading(false)
        }
    }

    const GetCurrentStatement = () => {
        const lastStatement = statements[statements.length - 1];
        return lastStatement;
    };

    useEffect(() => {
        GetBusinessTransactions();
    }, []);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [])

    if (loading) {
        return (
            <div className="row">
                <div className="card">
                    <div className="card-body">
                        <div className="d-flex justify-content-center align-items-center">
                            <Spinner />
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="row">
            <div className="col-md-12">
                <div className="card shadow-none border">
                    <div className="col-md-12">
                        <div className="card-header">
                            <div className="row mb-4">
                                <div className="col-md-6">
                                    <img src="/assets/images/Ghayar.png" onClick={() => navigate("/")} alt="logo" className="img-fluid mb-4 cursor-pointer" style={{ maxWidth: "200px" }} />
                                </div>
                                <div className="col-md-6">
                                    <div style={{ marginBottom: "38px" }}>
                                        <h4 className="text-primary text-uppercase fw-bold">Credit Statement</h4>
                                    </div>
                                </div>

                                <div className="col-md-12">
                                    To, <strong className='fw-bold'>{businessInfo ? businessInfo.business_name : '-'}</strong><br />
                                    {businessInfo ? businessInfo.business_email : '-'}<br />
                                </div>

                                <div className="row mt-3">
                                    <div className="col-md-4">
                                        <div className="summary-box p-3">
                                            <h6 className="text-muted mb-1">Payment due date</h6>
                                            <h5 className={`mb-0 text-primary fw-bold`}>
                                                {
                                                    statements && statements.length > 0 ? ` ${new Date(GetCurrentStatement().due_date).toLocaleDateString().replaceAll('/', '-')
                                                        }` : `-`
                                                }
                                            </h5>
                                        </div>
                                    </div>
                                    <div className="col-md-8">
                                        <div className="row">
                                            <div className="col">
                                                <div className="summary-box p-3">
                                                    <h6 className="text-muted mb-1">Total Statement Due Amount</h6>
                                                    <h5 className={`mb-0 text-primary fw-bold`}>
                                                        {
                                                            statements && statements.length > 0 ? `AED ${GetCurrentStatement().total_due_amount?.toFixed(2)}` : `AED 0.00`
                                                        }
                                                    </h5>
                                                </div>
                                            </div>
                                            <div className="col">
                                                <div className="summary-box p-3">
                                                    <h6 className="text-muted mb-1">Current Due Amount</h6>
                                                    <h5 className={`mb-0 text-primary fw-bold`}>
                                                        {
                                                            currentDue ? `AED ${currentDue.toFixed(2)}` : `AED 0.00`
                                                        }
                                                    </h5>
                                                </div>
                                            </div>

                                            <div className="col">
                                                <div className="summary-box p-3">
                                                    <h6 className="text-muted mb-1">Credit Limit</h6>
                                                    <h5 className={`mb-0 text-primary fw-bold`}>
                                                        {
                                                            businessInfo ? `AED ${businessInfo.business_credit_limit}` : `AED 0.00`
                                                        }
                                                    </h5>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>

                        <div className="card-body">
                            <div className="table-responsive">
                                <table className="table table-hover">
                                    <thead>
                                        <tr>
                                            <th>Date</th>
                                            <th>Statement No.</th>
                                            <th>Due Amount</th>
                                            <th>Download</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            statements?.length > 0 ?
                                                statements?.map((item) => {
                                                    return (
                                                        <tr>
                                                            <td
                                                                style={{ padding: "5px" }}
                                                            >
                                                                {new Date(item?.statement_date).toLocaleDateString().replaceAll('/', '-')}
                                                            </td>

                                                            <td
                                                                style={{ padding: "5px" }}
                                                            >
                                                                <span className="badge bg-light text-dark">
                                                                    #{item?.business_credit_statement_id}
                                                                </span>
                                                            </td>
                                                            <td
                                                                className='text-danger fw-bold'
                                                                style={{ padding: "5px" }}
                                                            >
                                                                AED {parseFloat(item?.total_due_amount).toFixed(2)}
                                                            </td>
                                                            <td
                                                                style={{ padding: "5px" }}
                                                            >
                                                                <a
                                                                    target="_blank"
                                                                    href={`https://b2bapi.ghayar.com/Customer/Users/statement/${item?.statement_file}`}
                                                                    className="btn btn-link"
                                                                    style={{ textDecoration: "underline" }}
                                                                >
                                                                    Download
                                                                </a>
                                                            </td>

                                                        </tr>

                                                    )
                                                })
                                                :
                                                <tr>
                                                    <td colSpan={7}><NoRecords /></td>
                                                </tr>
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default CustomerTransactions
