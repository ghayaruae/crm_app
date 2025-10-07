import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom';
import Navbar from '../Header/Navbar';
import TabsMenu from '../TabsMenu';
import CustomerTransactions from '../Components/CustomerTransactions';

const CustomerTransaction = () => {

    const { business_id } = useParams();

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    return (
        <div className="main-content">
            <div className="page-content">
                <div className="container-fluid">
                    <Navbar business_id={business_id} />
                    <div className="row">
                        <div className="col-lg-12">
                            <div>
                                <TabsMenu business_id={business_id} />
                                <div className="tab-content pt-4 text-muted">
                                    <div className="tab-pane active" id="overview-tab" role="tabpanel">
                                        <CustomerTransactions business_id={business_id} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CustomerTransaction
