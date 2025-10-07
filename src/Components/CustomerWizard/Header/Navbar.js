import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios';
import Swal from "sweetalert2"
import html2pdf from "html2pdf.js";
import { ConfigContext } from '../../../Context/ConfigContext';


const Navbar = ({ business_id }) => {


    const { apiURL, apiHeaderJson } = useContext(ConfigContext);
    const [loading, setLoading] = useState(true);
    const [businessVerify, setBusinessVerify] = useState({});

    const GetBusinessInfo = async () => {
        try {
            const headers = apiHeaderJson
            const response = await axios.get(`${apiURL}Business/GetBusinessInfo`, { params: { business_id }, headers })

            if (response?.data?.success) {
                const data = response?.data?.data;
                setBusinessVerify(data)
            }

        } catch (error) {
            console.log("error =>", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        GetBusinessInfo()
    }, [business_id])


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
                        <div className="avatar-lg">
                            <img
                                src="https://cirrusindia.co.in/wp-content/uploads/2016/10/dummy-profile-pic-male1.jpg"
                                alt="user-img"
                                className="img-thumbnail rounded-circle"
                            />
                        </div>
                    </div>
                    {/*end col*/}
                    <div className="col">
                        <div className="p-2">
                            {
                                loading ?
                                    <>
                                        <h3 className="text-white mb-1">LOADING...</h3>
                                        <p className="text-white text-opacity-75"></p>
                                        <p className="text-white text-opacity-75"> </p>
                                        <div className="hstack text-white-50 gap-1">
                                            <div className='me-2'>

                                            </div>
                                            <div>
                                            </div>
                                        </div>
                                    </>
                                    :
                                    <>
                                        <h3 className="text-white mb-1">{businessVerify?.business_contact_person}</h3>
                                        <p className="text-white text-opacity-75 mb-1">{businessVerify?.business_contact_number}</p>
                                        <p className="text-white text-opacity-75 mb-1">TRN : {businessVerify?.busienss_trn ?? "0"}</p>

                                        <div className="hstack text-white-50 gap-1">
                                            <div>
                                                <i className="ri-map-pin-user-line me-1 text-white text-opacity-75 fs-16 align-middle" />{businessVerify?.business_email}
                                            </div>
                                        </div>
                                    </>
                            }
                        </div>
                    </div>
                </div>
                {/*end row*/}
            </div>
        </>
    )
}

export default Navbar
