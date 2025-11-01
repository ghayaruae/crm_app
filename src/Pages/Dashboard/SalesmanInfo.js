import React from 'react'

const SalesmanInfo = ({ salesmanData }) => {

    const phoneNumber = salesmanData?.business_salesmen_contact_number;
    const loginId = salesmanData?.business_salesman_login_id;
    const loginPassword = salesmanData?.business_salesman_login_password;

    return (
        <>
            <div className="col-md-5">
                <div className="card">
                    <div className="card-body text-center">
                        <img
                            src={salesmanData?.image ?? "/assets/Image.jpg"}
                            alt={salesmanData?.business_salesmen_name}
                            className='w-50 rounded-circle'
                        />
                        <h4 className='mb-0'>{salesmanData?.business_salesmen_name}</h4>
                        <p className='text-muted small'>Salesman, Ghayar UAE</p>
                        <div className="d-flex align-items-center justify-content-center gap-2">
                            <a
                                href={`tel:${phoneNumber}`}
                                className="btn btn-soft-dark rounded-circle"
                                title={`Call ${phoneNumber}`}
                            >
                                <i className="ri-phone-line align-middle fs-16"></i>
                            </a>
                            <a
                                href={`mail:${phoneNumber}`}
                                className="btn btn-soft-dark rounded-circle"
                                title={`Mail ${phoneNumber}`}
                            >
                                <i className="ri-mail-line align-middle fs-16"></i>
                            </a>
                            <a
                                className="btn btn-soft-dark rounded-circle"
                                title={`Login ID: ${loginId || 'N/A'}\nPassword: ${loginPassword || 'N/A'}`}
                            >
                                <i className="ri-information-line align-middle fs-16"></i>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default SalesmanInfo