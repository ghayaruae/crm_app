import React, { useContext, useEffect, useState } from "react";
import { ConfigContext } from "../../Context/ConfigContext";
import axios from "axios";

const CompatibilityCars = ({ art_id }) => {
    const { dcapiurl } = useContext(ConfigContext);
    const [compatabilityData, setCompatabilityData] = useState({});

    const GetCompatibilityData = async () => {
        try {
            const response = await axios.get(
                `${dcapiurl}Parts/GetPartFitIn?lang=null&art_id=${art_id}&make=null`
            );

            if (response?.data?.sucess) {
                const data = response?.data?.data;

                const groupedData = data?.reduce((acc, item) => {
                    const brand = item.MFA_BRAND;
                    if (!acc[brand]) acc[brand] = [];

                    const from = item.PCS_CI_FROM ? item.PCS_CI_FROM.split("-")[0] : "";
                    const to = item.PCS_CI_TO ? item.PCS_CI_TO.split("-")[0] : "2024";

                    acc[brand].push({
                        typel: item.TYPEL,
                        term: item.TERM_OF_USE,
                        from,
                        to,
                    });
                    return acc;
                }, {});

                setCompatabilityData(groupedData);
            }
        } catch (error) {
            console.log("error", error);
        }
    };

    useEffect(() => {
        GetCompatibilityData();
    }, []);

    return (
        <div className="card mt-3">
            <div className="card-header">
                <h4 className="card-title mb-0">Compatibility with passenger cars</h4>
            </div>

            <div className="card-body">

                <div className="accordion" id="carAccordion">

                    {Object.keys(compatabilityData).map((brand, index) => (
                        <div className="accordion-item" key={index}>
                            <h2 className="accordion-header" id={`heading${index}`}>
                                <button
                                    className="accordion-button collapsed"
                                    type="button"
                                    data-bs-toggle="collapse"
                                    data-bs-target={`#collapse${index}`}
                                >
                                    {brand}
                                </button>
                            </h2>

                            <div
                                id={`collapse${index}`}
                                className="accordion-collapse collapse"
                                data-bs-parent="#carAccordion"
                            >
                                <div className="accordion-body">
                                    <ul className="list-group">

                                        {compatabilityData[brand].map((item, i) => (
                                            <li className="list-group-item" key={i}>
                                                {item?.typel} {item?.from} - {item?.to} {item?.term && <span> - (Term of Use, {item?.term})</span>}
                                            </li>
                                        ))}

                                    </ul>
                                </div>
                            </div>
                        </div>
                    ))}

                </div>

            </div>
        </div>
    );
};

export default CompatibilityCars;
