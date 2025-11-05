import React from 'react'
import Navbar from '../Header/Navbar'
import TabsMenu from '../Header/TabsMenu'

const SalesmanDashboard = () => {
    return (
        <>
            <div className="main-content">
                <div className="page-content">
                    <div className="container-fluid">
                        <Navbar />
                        <div className="row">
                            <div className="col-lg-12">
                                <div>
                                    <TabsMenu />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default SalesmanDashboard