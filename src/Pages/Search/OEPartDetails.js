import React, { useContext, useEffect, useState } from 'react'
import PageTitle from '../../Components/PageTitle'
import { ConfigContext } from '../../Context/ConfigContext'
import axios from 'axios'
import Select from 'react-select'
import ImageGallery from 'react-image-gallery'
import 'react-image-gallery/styles/css/image-gallery.css'
import { useNavigate } from 'react-router-dom'
import CompatibilityCars from './CompatibilityCars'
import OESection from './OESection'

const OEPartDetails = () => {
    const {
        primaryColor,
        apiHeaderJson,
        dcapiurl,
        apiURL,
        selectTheme,
        selectStyle
    } = useContext(ConfigContext)
    const headers = apiHeaderJson

    const navigate = useNavigate();

    const [data, setData] = useState([])
    const [images, setImages] = useState([])
    const [galleryImages, setGalleryImages] = useState([])
    const [artId, setArtId] = useState(null)

    const [loading, setLoading] = useState(false)
    const [selectedBrand, setSelectedBrand] = useState(null)
    const [part_number, setPart_number] = useState('')
    const [brandOptions, setBrandOptions] = useState([])
    const [filtersApplied, setFiltersApplied] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        getBrandsList()
    }, [])

    // Reset artId when brand or part number changes
    useEffect(() => {
        setArtId(null)
        setImages([])
        setGalleryImages([])
    }, [selectedBrand, part_number])

    // Convert images to gallery format when images change
    useEffect(() => {
        if (images.length > 0) {
            const formattedImages = images.map(img => ({
                original: `https://dcapi.carz7.com/images/${img.ART_MEDIA_SOURCE}`,
                thumbnail: `https://dcapi.carz7.com/images/${img.ART_MEDIA_SOURCE}`,
                originalAlt: `Part ${part_number}`,
                thumbnailAlt: `Part ${part_number} thumbnail`,
            }))
            setGalleryImages(formattedImages)
        } else {
            setGalleryImages([])
        }
    }, [images, part_number])

    // Fetch images when artId is available and filters are applied
    useEffect(() => {
        if (artId && filtersApplied) {
            getPartsMedia()
        }
    }, [artId, filtersApplied])

    const getBrandsList = async () => {
        try {
            setError('')
            const response = await axios.get(`${apiURL}Reports/GetSupplierBrands`, { headers })
            const { success, data } = response.data
            if (success) {
                setBrandOptions(
                    data.map(i => ({ value: i.sup_id, label: i.sup_brand }))
                )
            }
        } catch (error) {
            console.error('Error fetching brands:', error)
            setError('Failed to load brands list')
        }
    }

    const getData = async () => {
        if (!selectedBrand || !part_number) {
            setError('Please select both brand and part number')
            return
        }

        setLoading(true)
        setError('')
        setData([])
        setImages([])
        setGalleryImages([])
        setArtId(null)

        try {
            const response = await axios.get(`${apiURL}Reports/GetPartInfo`, {
                headers,
                params: {
                    part_number: part_number.trim(),
                    sup_id: selectedBrand
                }
            })
            const { success, data } = response.data

            if (success && data && data.length > 0) {
                setData(data)
                // Set artId from the first item for media fetching
                const firstArtId = data[0]?.ART_ID
                if (firstArtId) {
                    setArtId(firstArtId)
                } else {
                    setImages([])
                    setGalleryImages([])
                }
            } else {
                setData([])
                setError('No part found for the selected criteria')
            }
        } catch (error) {
            console.error('Error fetching part data:', error)
            setError('Failed to fetch part details')
            setData([])
            setImages([])
            setGalleryImages([])
        } finally {
            setLoading(false)
        }
    }

    const getPartsMedia = async () => {
        if (!artId || !selectedBrand || !part_number) {
            setImages([])
            setGalleryImages([])
            return
        }

        try {
            const response = await axios.get(`${dcapiurl}Parts/GetPartMedias`, {
                params: {
                    lang: 'en',
                    part_number: part_number.trim(),
                    sup_id: selectedBrand,
                    art_id: artId
                }
            })

            const { sucess, data } = response.data

            if (sucess && data && data.length > 0) {
                setImages(data)
            } else {
                setImages([])
                setGalleryImages([])
            }
        } catch (error) {
            console.error('Error fetching part media:', error)
            setImages([])
            setGalleryImages([])
        }
    }

    const handleFilter = async () => {
        if (!selectedBrand || !part_number.trim()) {
            setError('Please select both brand and enter part number')
            return
        }

        setFiltersApplied(true)
        await getData()
    }

    const handleReset = () => {
        setSelectedBrand(null)
        setPart_number('')
        setFiltersApplied(false)
        setData([])
        setImages([])
        setGalleryImages([])
        setArtId(null)
        setError('')
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

    const renderImageGallery = () => {
        if (galleryImages.length === 0) {
            return (
                <div className="text-center text-muted p-5 border rounded">
                    <i className="ri-image-line display-4 d-block mb-2"></i>
                    No images available
                </div>
            )
        }

        return (
            <ImageGallery
                items={galleryImages}
                showPlayButton={false}
                showFullscreenButton={false}
                showNav={false}
                showBullets={false}
                thumbnailPosition="bottom"
                lazyLoad={true}
                additionalClass="part-image-gallery"
            />
        )
    }

    return (
        <>
            <style>{`
                @media(min-width: 768px) {
                    .sticky-image {
                        position: sticky;
                        top: 90px;
                    }
                }
                .part-image-gallery .image-gallery-slide img {
                    height: 300px;
                    object-fit: contain;
                }
                .part-image-gallery .image-gallery-thumbnail img {
                    height: 80px;
                    object-fit: cover;
                }
                .part-image-gallery .image-gallery-thumbnails-container {
                    text-align: center;
                }
                .part-image-gallery .image-gallery-thumbnail:hover,
                .part-image-gallery .image-gallery-thumbnail.active {
                    border: 2px solid ${primaryColor};
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
                                {error && (
                                    <div className="alert alert-danger mb-3">
                                        {error}
                                    </div>
                                )}

                                <div className="row g-3">
                                    <div className="col-md-3">
                                        <Select
                                            theme={selectTheme}
                                            styles={selectStyle}
                                            options={brandOptions}
                                            value={brandOptions.find(opt => opt.value === selectedBrand) || null}
                                            onChange={(s) => {
                                                setSelectedBrand(s?.value)
                                                setError('')
                                            }}
                                            placeholder="Select Brand"
                                            isClearable
                                        />
                                    </div>

                                    <div className="col-md-3">
                                        <input
                                            className="form-control"
                                            value={part_number}
                                            onChange={(e) => {
                                                setPart_number(e.target.value)
                                                setError('')
                                            }}
                                            placeholder="Enter part number"
                                        />
                                    </div>

                                    <div className="col-md-3 d-flex gap-2">
                                        <button
                                            className="btn btn-danger btn-label"
                                            onClick={handleFilter}
                                            disabled={!selectedBrand || !part_number.trim() || loading}
                                        >
                                            <i className='ri-filter-line label-icon align-middle' />
                                            {loading ? "Searching..." : "Filter"}
                                        </button>

                                        <button
                                            className="btn btn-light"
                                            onClick={handleReset}
                                            disabled={!filtersApplied && !data.length}
                                        >
                                            Reset
                                        </button>
                                    </div>

                                    <div className="col-md-3 d-flex justify-content-end align-items-center">
                                        <button className='btn btn-dark' onClick={() => navigate("/Search/SearchOEParts")}>After Market</button>
                                    </div>

                                </div>
                            </div>
                        </div>

                        {loading && (
                            <div className="text-center mt-3">
                                <div className="spinner-border text-primary" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                                <p className="mt-2">Loading part details...</p>
                            </div>
                        )}

                        {current && !loading && (
                            <>
                                <div className="card mt-3">
                                    <div className="card-body">
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
                                                    {renderImageGallery()}
                                                </div>
                                            </div>

                                            {/* ---------- RIGHT SIDE DETAILS ---------- */}
                                            <div className="col-md-8">
                                                <div className="row gx-3">

                                                    <div className="col-md-6 mb-2">
                                                        <div className="text-muted small">Manufacturer</div>
                                                        <div className="fw-semibold">{current.MFA_BRAND || '-'}</div>
                                                    </div>

                                                    <div className="col-md-6 mb-2">
                                                        <div className="text-muted small">Article Number</div>
                                                        <div className="fw-semibold">{current.ART_ARTICLE_NR || '-'}</div>
                                                    </div>

                                                    <div className="col-md-6 mb-2">
                                                        <div className="text-muted small">Car Model</div>
                                                        <div className="fw-semibold">{current.MS_NAME || '-'}</div>
                                                    </div>

                                                    <div className="col-md-6 mb-2">
                                                        <div className="text-muted small">Engine / Capacity</div>
                                                        <div className="fw-semibold">
                                                            {current.PC_ENG_CODES || '-'} | {current.PC_CAPACITY_LT || '-'}L
                                                        </div>
                                                    </div>

                                                    <div className="col-md-6 mb-2">
                                                        <div className="text-muted small">Fuel Type</div>
                                                        <div className="fw-semibold">{current.FUEL_TYPE || '-'}</div>
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
                                                                <div className="small text-muted">B2B Price</div>
                                                                <div className="h5 mb-0">
                                                                    {current.stock_bb_price || "0"} AED
                                                                </div>
                                                            </div>

                                                            <div className="border rounded p-3 flex-grow-1">
                                                                <div className="small text-muted">B2G Price</div>
                                                                <div className="h5 mb-0">
                                                                    {current.stock_bg_price || "0"} AED
                                                                </div>
                                                            </div>

                                                            <div className="border rounded p-3 flex-grow-1">
                                                                <div className="small text-muted">B2C Price</div>
                                                                <div className="h5 mb-0">
                                                                    {current.stock_bc_price || "0"} AED
                                                                </div>
                                                            </div>

                                                            <div className="border rounded p-3" style={{ minWidth: 130 }}>
                                                                <div className="small text-muted">Available Qty</div>
                                                                <div className="h5 mb-0">
                                                                    {current.stock_available_qty || "0"}
                                                                </div>
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
                                                                                <td>{c.criteria_en || c.criteria_id}</td>
                                                                                <td>{c.value_en || c.value}</td>
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

                                        </div>
                                    </div>
                                </div>

                                <CompatibilityCars art_id={artId} />
                                <OESection art_id={artId} />

                            </>


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