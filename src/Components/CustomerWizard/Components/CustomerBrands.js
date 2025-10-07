import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios';
import { ContentLoader } from '../../Shimmer';
import { ConfigContext } from '../../../Context/ConfigContext';

const colorClasses = [
    "profile-project-warning",
    "profile-project-success",
    "profile-project-info",
    "profile-project-primary",
    "profile-project-danger",
    "profile-project-dark"
];

const badgeColorClasses = [
    "bg-warning",
    "bg-success",
    "bg-info",
    "bg-primary",
    "bg-danger",
    "bg-dark"
];

const CustomerBrands = ({ business_id }) => {

    const { apiURL, apiHeaderJson, dcapiurl } = useContext(ConfigContext);
    const [brandsData, setBrandsData] = useState([]);
    const [loading, setLoading] = useState(false)

    const GetBrandList = async () => {
        try {
            setLoading(true)
            const headers = apiHeaderJson;
            const response = await axios.get(`${apiURL}Business/GetBusinessBrands`, { params: { business_id }, headers })
            if (response?.data?.success) {
                const data = response?.data?.data
                setBrandsData(data)
            }

        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        GetBrandList();
    }, [])


    return (
        <div className='row'>
            <div className="col-md-12">

                <div className="card">
                    <div className="card-header border border-bottom d-flex justify-content-between align-items-center">
                        <h5 className="mb-0">Brands</h5>
                    </div>
                    <div className="card-body">
                        <div className="row">
                            {
                                loading ?
                                    <ContentLoader />
                                    :
                                    brandsData?.length > 0 ?
                                        brandsData?.map((item, index) => {
                                            const colorClass = colorClasses[index % colorClasses.length];
                                            const badgeColorClass = badgeColorClasses[index % badgeColorClasses.length];

                                            return (
                                                <div className="col-md-3" key={index}>
                                                    <div className={`card profile-project-card shadow-none ${colorClass}`}>
                                                        <div className="card-body p-4">

                                                            <div className="d-flex flex-column justify-content-center align-items-center text-center">
                                                                <img
                                                                    src={`${dcapiurl}sup-logo/${item?.business_brand}.PNG`}
                                                                    alt="brand-img"
                                                                    className="mb-2"
                                                                    style={{
                                                                        width: "50px",
                                                                        height: "50px",
                                                                        objectFit: "contain",
                                                                        borderRadius: "50%",
                                                                        border: "2px solid #dee2e6",
                                                                        padding: "2px",
                                                                        backgroundColor: "#fff"
                                                                    }}
                                                                />
                                                                <h5 className="fs-14 text-center text-truncate mb-2">
                                                                    {item?.business_brand}
                                                                </h5>
                                                                <div className="d-flex gap-2 mt-3">
                                                                    <h5 className="fs-14 text-center text-truncate mt-1">
                                                                        {item?.business_brand}
                                                                    </h5>
                                                                    <div className="flex-shrink-0 ms-2">
                                                                        <div className={`badge ${badgeColorClass} fs-10`}>
                                                                            {item?.business_brand_discount} % OFF
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>


                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })
                                        :
                                        <div className="d-flex justify-content-center align-items-center">
                                            <div className="col-md-3">
                                                <div className={`card profile-project-card shadow-none profile-project-dark`}>
                                                    <div className="card-body p-4">
                                                        <h5 className="fs-14 text-truncate">
                                                            No Selected Brands
                                                        </h5>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default CustomerBrands
