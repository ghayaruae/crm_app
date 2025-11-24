import React, { useContext, useEffect, useState } from 'react'
import { ConfigContext } from '../../Context/ConfigContext';
import axios from 'axios';

const OESection = ({ art_id }) => {

    const { dcapiurl } = useContext(ConfigContext);
    const [crosses, setCrosses] = useState([]);

    const GetOENumbers = async () => {
        try {

            const response = await axios.get(`${dcapiurl}Parts/GetPartCrossRef?lang=en&art_id=${art_id}&lang=null`)

            if (response?.data?.sucess) {
                const data = response?.data?.data;

                const OENumbers = data?.filter(item => item?.ARL_TYPE === "OENumber");
                setCrosses(OENumbers);

            }

        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        GetOENumbers();
    }, [])

    return (
        <div className='card mt-3'>
            <div className="card-header">
                <h5 className='card-title mb-0'>OE Numbers</h5>
            </div>

            <div className="card-body">
                <div className="row">
                    {
                        crosses?.length > 0 && crosses?.map(cross => {
                            return (
                                <div className="col-md-3">
                                    <span>{cross?.ART_SUP_BRAND} - {cross?.ART_ARTICLE_NR}</span>
                                </div>
                            )
                        })
                    }
                </div>
            </div>

        </div>
    )
}

export default OESection
