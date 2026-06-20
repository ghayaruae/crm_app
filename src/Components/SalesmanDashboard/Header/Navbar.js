import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios';
import { ConfigContext } from '../../../Context/ConfigContext';
import { Link } from 'react-router-dom';

const Navbar = () => {

    const { apiURL, apiHeaderJson, permissions } = useContext(ConfigContext);
    const headers = apiHeaderJson

    const [loading, setLoading] = useState(true);
    const [data, setData] = useState({})

    const getSalesmanData = async () => {
        try {
            const response = await axios.get(`${apiURL}Dashboard/GetDashboardData`, { headers })
            const { success, salesman_info } = response.data

            if (success) {
                setData(salesman_info)
            }
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getSalesmanData()
    }, [])

    return (
        <>
            <div className="profile-foreground position-relative mx-n4 mt-n4">
                <div className="profile-wid-bg">
                    <img src="/assets/images/ghayar banner.jpg" alt className="profile-wid-img" />
                </div>
            </div>
            <div className="pt-4 mb-4 mb-lg-3 pb-lg-4 profile-wrapper">
                <div className="row g-4">

                    <div className="col-auto">
                        <div
                            className="avatar-lg rounded-circle overflow-hidden"
                            style={{
                                width: "100px",
                                height: "100px",
                                minWidth: "100px",
                            }}
                        >
                            <img
                                src={
                                    data?.business_salesman_image
                                        ? `${apiURL}public/salesmans/${data?.business_salesman_image}`
                                        : "/assets/Image.jpg"
                                }
                                alt="user-img"
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover"
                                }}
                            />
                        </div>
                    </div>

                    <div className="col">
                        <div className="p-2">
                            {
                                loading ? (
                                    <>
                                        <h3 className="text-white mb-1">LOADING...</h3>
                                        <p className="text-white text-opacity-75 mb-1"></p>
                                    </>
                                ) : (
                                    <>
                                        <h3 className="text-white mb-1">{data?.business_salesmen_name}</h3>
                                        <p className="text-white text-opacity-75 mb-1">
                                            {data?.business_salesmen_contact_number}
                                        </p>

                                        <div className="hstack text-white-50 gap-1">
                                            <div>
                                                <i className="ri-map-pin-user-line me-1 text-white text-opacity-75 fs-16 align-middle" />
                                                {data?.business_salesman_email}
                                            </div>
                                        </div>
                                    </>
                                )
                            }
                        </div>
                    </div>
                    {
                        permissions?.map(item => {
                            if (item.description === "/Masters/ManageFollowup") {
                                return (
                                    <div className="col-auto ms-auto">
                                        <Link to={"/Masters/ManageFollowup"}>
                                            <button className='btn btn-danger btn-label'>
                                                <i className='ri-phone-line label-icon align-middle'></i> Followup
                                            </button>
                                        </Link>
                                    </div>
                                )
                            }
                        })
                    }

                </div>
            </div>
        </>
    )
}

export default Navbar