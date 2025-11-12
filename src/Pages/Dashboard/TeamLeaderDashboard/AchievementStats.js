import React, { useState } from 'react'

const AchievementStats = ({ aboveTargetData = [], belowTargetData = [] }) => {
    const [activeTab, setActiveTab] = useState('above')

    const renderTable = (data, type) => {
        const isAbove = type === 'above'

        return (
            <div className="table-responsive mt-3">
                {data.length > 0 ? (
                    <table className="table align-middle table-striped table-hover mb-0">
                        <thead className="table-light">
                            <tr>
                                <th style={{ width: "50px" }}>#</th>
                                <th>Salesman</th>
                                <th>Email</th>
                                <th>Contact</th>
                                <th className="text-end">Target (AED)</th>
                                <th className="text-end">Achievement (AED)</th>
                                <th className={`text-end fw-semibold ${isAbove ? 'text-success' : 'text-danger'}`}>
                                    {isAbove ? '+ Difference' : '− Difference'}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((item, index) => (
                                <tr key={item.business_salesman_id}>
                                    <td>{index + 1}</td>
                                    <td>
                                        <div className="fw-semibold">{item.business_salesman_name || '-'}</div>
                                    </td>
                                    <td>{item.business_salesman_email || '-'}</td>
                                    <td>{item.business_salesman_contact_number || '-'}</td>
                                    <td className="text-end">{item.total_target?.toLocaleString()}</td>
                                    <td className="text-end text-primary fw-semibold">
                                        {item.total_achievement?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </td>
                                    <td className={`text-end fw-semibold ${isAbove ? 'text-success' : 'text-danger'}`}>
                                        {item.difference?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="text-muted text-center py-4">
                        <i className="ri-information-line me-1"></i>No records found
                    </div>
                )}
            </div>
        )
    }

    return (
        <div className="col-12">
            <div className="card">
                <div className="card-body">
                    <div className="d-flex align-items-center justify-content-between mb-4">
                        <h4 className="card-title fw-bold mb-0" style={{color:"#132530"}}>
                            <i className="ri-bar-chart-2-line me-2"></i>Salesman Achievement Report
                        </h4>
                    </div>

                    {/* Tabs */}
                    <ul className="nav nav-tabs nav-tabs-custom nav-dark mb-3" role="tablist">
                        <li className="nav-item">
                            <button
                                className={`nav-link fw-semibold ${activeTab === 'above' ? 'active' : ''}`}
                                onClick={() => setActiveTab('above')}
                                role="tab"
                            >
                                <i className="ri-arrow-up-line me-1 text-success"></i>
                                Above Target
                                <span className="badge bg-success-subtle text-success rounded-pill ms-2">
                                    {aboveTargetData.length}
                                </span>
                            </button>
                        </li>
                        <li className="nav-item">
                            <button
                                className={`nav-link fw-semibold ${activeTab === 'below' ? 'active' : ''}`}
                                onClick={() => setActiveTab('below')}
                                role="tab"
                            >
                                <i className="ri-arrow-down-line me-1 text-danger"></i>
                                Below Target
                                <span className="badge bg-danger-subtle text-danger rounded-pill ms-2">
                                    {belowTargetData.length}
                                </span>
                            </button>
                        </li>
                    </ul>

                    {/* Tab content */}
                    <div className="tab-content text-muted">
                        <div className={`tab-pane fade ${activeTab === 'above' ? 'show active' : ''}`}>
                            {renderTable(aboveTargetData, 'above')}
                        </div>
                        <div className={`tab-pane fade ${activeTab === 'below' ? 'show active' : ''}`}>
                            {renderTable(belowTargetData, 'below')}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AchievementStats
