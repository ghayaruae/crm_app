import React, { useContext, useEffect, useState } from 'react'
import PageTitle from '../../Components/PageTitle'
import { ConfigContext } from '../../Context/ConfigContext'
import axios from 'axios'
import Select from 'react-select'
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Thumbs } from 'swiper/modules'

const OEPartDetails = () => {

    const { primaryColor, apiHeaderJson, dcapiurl, apiURL, selectTheme, selectStyle } =
        useContext(ConfigContext)
    const headers = apiHeaderJson

    const [data, setData] = useState([])
    const [images, setImages] = useState([])
    const [thumbsSwiper, setThumbsSwiper] = useState(null)

    const [loading, setLoading] = useState(false)
    const [selectedBrand, setSelectedBrand] = useState(null)
    const [part_number, setPart_number] = useState('')
    const [brandOptions, setBrandOptions] = useState([])
    const [filtersApplied, setFiltersApplied] = useState(false)

    useEffect(() => {
        getBrandsList()
    }, [])

    const getBrandsList = async () => {
        try {
            const response = await axios.get(`${apiURL}Reports/GetSupplierBrands`, { headers })
            const { success, data } = response.data
            if (success) {
                setBrandOptions(
                    data.map(i => ({ value: i.SUP_ID, label: i.SUP_BRAND }))
                )
            }
        } catch (e) { }
    }

    const getData = async () => {
        setLoading(true)
        try {
            const response = await axios.get(`${apiURL}Reports/GetPartInfo`, {
                headers,
                params: { part_number, sup_id: selectedBrand }
            })
            const { success, data } = response.data
            setData(success ? data : [])
        } catch (e) {
            setData([])
        }
        setLoading(false)
    }

    const getPartsMedia = async () => {
        try {
            const response = await axios.get(`${dcapiurl}Parts/GetPartMedias`, {
                params: { lang: 'en', part_number, sup_id: selectedBrand }
            })
            const { success, data } = response.data
            setImages(success ? data : [])
        } catch (e) {
            setImages([])
        }
    }

    const handleFilter = async () => {
        if (!selectedBrand || !part_number) return
        setFiltersApplied(true)
        await Promise.all([getData(), getPartsMedia()])
    }

    const handleReset = () => {
        setSelectedBrand(null)
        setPart_number('')
        setFiltersApplied(false)
        setData([])
        setImages([])
    }

    const formatDate = (d) => {
        if (!d) return '-'
        const dt = new Date(d)
        return isNaN(dt) ? d : dt.toLocaleString()
    }

    const groupOEMByBrand = (oem = []) =>
        oem.reduce((acc, cur) => {
            const brand = cur.ARL_BRA_BRAND || "OTHER"
            acc[brand] = acc[brand] || []
            acc[brand].push(cur)
            return acc
        }, {})

    const current = data.length > 0 ? data[0] : null
    const oemGroups = current ? groupOEMByBrand(current.OEM_NUMBERS) : {}
    const criteria = current?.ARTICLE_CRITERIA ?? []

    return (
        <>
            <style>{`
                @media(min-width: 768px) {
                    .sticky-image {
                        position: sticky;
                        top: 90px;
                    }
                }
            `}</style>

            <div className="main-content">
                <div className="page-content">
                    <div className="container-fluid">

                        <PageTitle title="Part Details" primary="Reports" />

                        <div className="card">
                            <div className="card-header" style={{ backgroundColor: primaryColor }}>
                                <h5 className="text-white mb-0">Search Part Details</h5>
                            </div>

                            <div className="card-body">
                                <div className="row g-3">
                                    <div className="col-md-3">
                                        <Select
                                            theme={selectTheme}
                                            styles={selectStyle}
                                            options={brandOptions}
                                            value={brandOptions.find(opt => opt.value === selectedBrand) || null}
                                            onChange={(s) => setSelectedBrand(s?.value)}
                                            placeholder="Select Brand"
                                        />
                                    </div>

                                    <div className="col-md-3">
                                        <input
                                            className="form-control"
                                            value={part_number}
                                            onChange={(e) => setPart_number(e.target.value)}
                                            placeholder="Enter part number"
                                        />
                                    </div>

                                    <div className="col-md-3 d-flex gap-2">
                                        <button
                                            className="btn btn-danger btn-label"
                                            onClick={handleFilter}
                                            disabled={!selectedBrand || !part_number}
                                        >
                                            <i className='ri-filter-line label-icon align-middle' /> {loading ? "Searching..." : "Filter"}
                                        </button>

                                        <button
                                            className="btn btn-light"
                                            onClick={handleReset}
                                            disabled={!filtersApplied}
                                        >
                                            Reset
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {current && (
                            <div className="card mt-3">
                                <div className="card-body">
                                    <div className="row">
                                    </div>
                                    <div className="row">
                                        <div className="col-md-12">
                                            <div className="d-flex justify-content-between">
                                                <h3 className="mb-4">
                                                    {current.ART_SUP_BRAND} {current.ART_ARTICLE_NR} {current.ART_PRODUCT_NAME}
                                                </h3>
                                            </div>
                                        </div>
                                        <div className="col-md-4 sticky-image mb-3">
                                            <div className="border rounded p-2">

                                                {images.length > 0 ? (
                                                    <>
                                                        <Swiper
                                                            modules={[Navigation, Thumbs]}
                                                            navigation
                                                            thumbs={{ swiper: thumbsSwiper }}
                                                            className="mb-2"
                                                            style={{ height: 300 }}
                                                        >
                                                            {images.map(img => (
                                                                <SwiperSlide key={img.ART_MEDIA_ID}>
                                                                    <img
                                                                        src={`${dcapiurl}${img.ART_MEDIA_SOURCE}`}
                                                                        className="img-fluid rounded w-100 h-100"
                                                                        style={{ objectFit: "contain" }}
                                                                    />
                                                                </SwiperSlide>
                                                            ))}
                                                        </Swiper>

                                                        {/* THUMBNAILS */}
                                                        <Swiper
                                                            modules={[Thumbs]}
                                                            onSwiper={setThumbsSwiper}
                                                            slidesPerView={4}
                                                            spaceBetween={10}
                                                        >
                                                            {images.map(img => (
                                                                <SwiperSlide key={img.ART_MEDIA_ID}>
                                                                    <img
                                                                        src={`${dcapiurl}${img.ART_MEDIA_SOURCE}`}
                                                                        className="img-fluid rounded"
                                                                        style={{
                                                                            height: 70,
                                                                            objectFit: "cover"
                                                                        }}
                                                                    />
                                                                </SwiperSlide>
                                                            ))}
                                                        </Swiper>
                                                    </>
                                                ) : (
                                                    <div className="text-center text-muted p-5">
                                                        No images available
                                                    </div>
                                                )}

                                                {/* <div className="mt-3 small text-muted">
                                                    <div><strong>Supplier:</strong> {current.SUP_FULL_NAME}</div>
                                                    <div><strong>Stock Qty:</strong> {current.stock_available_qty}</div>
                                                    <div><strong>MRP:</strong> {current.stock_price_mrp}</div>
                                                </div> */}
                                            </div>
                                        </div>

                                        <div className="col-md-8">
                                            <div className="row gx-3">
                                                <div className="col-md-6 mb-2">
                                                    <div className="text-muted small">Manufacturer</div>
                                                    <div className="fw-semibold">{current.MFA_BRAND}</div>
                                                </div>

                                                <div className="col-md-6 mb-2">
                                                    <div className="text-muted small">Article Number</div>
                                                    <div className="fw-semibold">{current.ART_ARTICLE_NR}</div>
                                                </div>

                                                <div className="col-md-6 mb-2">
                                                    <div className="text-muted small">Car Model</div>
                                                    <div className="fw-semibold">{current.MS_NAME}</div>
                                                </div>

                                                <div className="col-md-6 mb-2">
                                                    <div className="text-muted small">Engine / Capacity</div>
                                                    <div className="fw-semibold">
                                                        {current.PC_ENG_CODES} | {current.PC_CAPACITY_LT}L
                                                    </div>
                                                </div>

                                                <div className="col-md-6 mb-2">
                                                    <div className="text-muted small">Fuel Type</div>
                                                    <div className="fw-semibold">{current.FUEL_TYPE}</div>
                                                </div>

                                                <div className="col-md-6 mb-2">
                                                    <div className="text-muted small">Stock Last Update</div>
                                                    <div className="fw-semibold">
                                                        {formatDate(current.stock_status_last_update_date)}
                                                    </div>
                                                </div>

                                                {/* Pricing Boxes */}
                                                <div className="col-12 mt-3">
                                                    <div className="d-flex gap-3 flex-wrap">
                                                        <div className="border rounded p-3 flex-grow-1">
                                                            <div className="small text-muted">Purchase Price</div>
                                                            <div className="h5 mb-0">{current.stock_purchase_price}</div>
                                                        </div>

                                                        <div className="border rounded p-3 flex-grow-1">
                                                            <div className="small text-muted">Retail (MRP)</div>
                                                            <div className="h5 mb-0">{current.stock_price_mrp}</div>
                                                        </div>

                                                        <div className="border rounded p-3" style={{ minWidth: 130 }}>
                                                            <div className="small text-muted">Available Qty</div>
                                                            <div className="h5 mb-0">{current.stock_available_qty}</div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Article Criteria */}
                                                <div className="col-12 mt-4">
                                                    <h6>Article Criteria</h6>
                                                    {criteria.length > 0 ? (
                                                        <div className="table-responsive">
                                                            <table className="table table-sm">
                                                                <thead>
                                                                    <tr>
                                                                        <th>Criteria</th>
                                                                        <th>Value</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {criteria.map(c => (
                                                                        <tr key={c.criteria_id}>
                                                                            <td>{c.criteria_en}</td>
                                                                            <td>{c.value_en}</td>
                                                                        </tr>
                                                                    ))}
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    ) : (
                                                        <div className="text-muted small">No criteria available.</div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        {/* OEM Accordion */}
                                        {/* <div className="col-md-12 mt-4">
                                            <h6>OEM Numbers</h6>

                                            <div className="accordion" id="oemAccordion">

                                                {Object.keys(oemGroups).map((brand, idx) => (
                                                    <div className="accordion-item" key={brand}>
                                                        <h2 className="accordion-header" id={`head-${idx}`}>
                                                            <button
                                                                className="accordion-button collapsed"
                                                                data-bs-toggle="collapse"
                                                                data-bs-target={`#col-${idx}`}
                                                            >
                                                                {brand} ({oemGroups[brand].length})
                                                            </button>
                                                        </h2>

                                                        <div
                                                            id={`col-${idx}`}
                                                            className="accordion-collapse collapse"
                                                            data-bs-parent="#oemAccordion"
                                                        >
                                                            <div className="accordion-body">
                                                                {oemGroups[brand].map((oem, i) => (
                                                                    <div key={i} className="d-flex justify-content-between">
                                                                        <span>{oem.ARL_DISPLAY_NR}</span>
                                                                        <small className="text-muted">{oem.ARL_SEARCH_NUMBER}</small>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}

                                            </div>
                                        </div> */}
                                    </div>
                                </div>
                            </div>
                        )}

                        {filtersApplied && !current && !loading && (
                            <div className="alert alert-warning mt-3">
                                No part found for this filter.
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </>
    )
}

export default OEPartDetails
