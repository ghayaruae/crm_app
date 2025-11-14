import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import Select from 'react-select'
import { SubmitBtn } from '../../Components/InputElements'
import { ConfigContext } from '../../Context/ConfigContext'
import PageTitle from '../../Components/PageTitle'
import Swal from 'sweetalert2'
import Flatpickr from "react-flatpickr";
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getCurrentDate } from '../../Components/GlobalFunctions'

const CreateRequest = () => {

    const { primaryColor, apiHeaderJson, apiURL, selectTheme, selectStyle } = useContext(ConfigContext)
    const { inventory_part_request_id } = useParams()
    const navigate = useNavigate()
    const headers = apiHeaderJson;

    const [formData, setFormData] = useState({
        request_part_name: "",
        request_brand_name: "",
        request_part_number: "",
        request_part_qty: "",
        request_note: "",
        request_part_market_price: "",
        request_supersedes: "",
        request_date: getCurrentDate()
    })

    const [errors, setErrors] = useState({})
    const [submitLoading, setSubmitLoading] = useState(false)

    const validateForm = () => {
        const newErrors = {};

        if (!formData.request_part_name.trim()) newErrors.request_part_name = "Part name is required";
        if (!formData.request_brand_name.trim()) newErrors.request_brand_name = "Brand name is required";
        if (!formData.request_part_number.trim()) newErrors.request_part_number = "Part number is required";
        if (!formData.request_part_qty) newErrors.request_part_qty = "Quantity is required";
        if (!formData.request_part_market_price) newErrors.request_part_market_price = "Market price is required";
        if (!formData.request_date) newErrors.request_date = "Request date is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const resetForm = () => {
        setFormData({
            request_part_name: "",
            request_brand_name: "",
            request_part_number: "",
            request_part_qty: "",
            request_note: "",
            request_part_market_price: "",
            request_supersedes: "",
            request_date: getCurrentDate()
        })
        setErrors({})
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value })
        if (errors[name]) setErrors({ ...errors, [name]: null })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!validateForm()) return

        setSubmitLoading(true)
        try {
            const body = {
                request_part_name: formData.request_part_name,
                request_brand_name: formData.request_brand_name,
                request_part_number: formData.request_part_number,
                request_part_qty: formData.request_part_qty,
                request_note: formData.request_note,
                request_part_market_price: formData.request_part_market_price,
                request_supersedes: formData.request_supersedes,
                request_date: formData.request_date
            }

            if (inventory_part_request_id) {
                body.inventory_part_request_id = inventory_part_request_id
            }

            const response = await axios.post(`${apiURL}Masters/CreateRequestPartInquiry`, body, { headers })
            const { success, message } = response.data

            if (success) {
                Swal.fire("Success!", message, "success")
                resetForm()
                if (inventory_part_request_id) navigate("/Request/RequestPartInquiryList")
            }

        } catch (error) {
            console.log("error", error)
        } finally {
            setSubmitLoading(false)
        }
    }

    const getInfo = async () => {
        try {
            if (inventory_part_request_id == 0) return;

            const response = await axios.get(`${apiURL}Masters/GetRequestPartInquiryInfo`, {
                headers,
                params: { inventory_part_request_id }
            })

            const { success, data } = response.data
            if (success) {
                setFormData({
                    request_part_name: data?.request_part_name,
                    request_brand_name: data?.request_brand_name,
                    request_part_number: data?.request_part_number,
                    request_part_qty: data?.request_part_qty,
                    request_note: data?.request_note,
                    request_part_market_price: data?.request_part_market_price,
                    request_supersedes: data?.request_supersedes,
                    request_date: data?.request_date
                })
            }
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        inventory_part_request_id != 0 && getInfo()
    }, [inventory_part_request_id])


    return (
        <>
            <div className="main-content">
                <div className="page-content">
                    <div className="container-fluid">
                        <PageTitle title="Request Part Inquiry" primary="Requests" />

                        <div className="row">
                            <div className="col-md-12">
                                <div className="card">

                                    <div className="card-header align-items-center d-flex" style={{ backgroundColor: primaryColor }}>
                                        <h4 className="mb-0 flex-grow-1 text-white">Part Inquiry Request</h4>
                                        <Link to={"/Request/RequestPartInquiryList"}>
                                            <button type="button" className="btn btn-light btn-sm rounded-circle"
                                                title="View Requests">
                                                <i className="ri-list-unordered"></i>
                                            </button>
                                        </Link>
                                    </div>

                                    <div className="card-body">
                                        <div className="row g-3">

                                            <div className="col-md-4">
                                                <label className="form-label">Part Name <span className="text-danger">*</span></label>
                                                <input
                                                    type="text"
                                                    name="request_part_name"
                                                    className={`form-control ${errors.request_part_name ? "is-invalid" : ""}`}
                                                    value={formData.request_part_name}
                                                    onChange={handleInputChange}
                                                    placeholder="Enter Part Name"
                                                />
                                                {errors.request_part_name && <div className="invalid-feedback d-block">{errors.request_part_name}</div>}
                                            </div>

                                            <div className="col-md-4">
                                                <label className="form-label">Brand Name <span className="text-danger">*</span></label>
                                                <input
                                                    type="text"
                                                    name="request_brand_name"
                                                    className={`form-control ${errors.request_brand_name ? "is-invalid" : ""}`}
                                                    value={formData.request_brand_name}
                                                    onChange={handleInputChange}
                                                    placeholder="Enter Brand Name"
                                                />
                                                {errors.request_brand_name && <div className="invalid-feedback d-block">{errors.request_brand_name}</div>}
                                            </div>

                                            <div className="col-md-4">
                                                <label className="form-label">Part Number <span className="text-danger">*</span></label>
                                                <input
                                                    type="text"
                                                    name="request_part_number"
                                                    className={`form-control ${errors.request_part_number ? "is-invalid" : ""}`}
                                                    value={formData.request_part_number}
                                                    onChange={handleInputChange}
                                                    placeholder="Enter Part Number"
                                                />
                                                {errors.request_part_number && <div className="invalid-feedback d-block">{errors.request_part_number}</div>}
                                            </div>

                                            <div className="col-md-4">
                                                <label className="form-label">Quantity <span className="text-danger">*</span></label>
                                                <input
                                                    type="number"
                                                    name="request_part_qty"
                                                    className={`form-control ${errors.request_part_qty ? "is-invalid" : ""}`}
                                                    value={formData.request_part_qty}
                                                    onChange={handleInputChange}
                                                    placeholder="Enter Quantity"
                                                />
                                                {errors.request_part_qty && <div className="invalid-feedback d-block">{errors.request_part_qty}</div>}
                                            </div>

                                            <div className="col-md-4">
                                                <label className="form-label">Market Price <span className="text-danger">*</span></label>
                                                <input
                                                    type="number"
                                                    name="request_part_market_price"
                                                    className={`form-control ${errors.request_part_market_price ? "is-invalid" : ""}`}
                                                    value={formData.request_part_market_price}
                                                    onChange={handleInputChange}
                                                    placeholder="Enter Market Price"
                                                />
                                                {errors.request_part_market_price && <div className="invalid-feedback d-block">{errors.request_part_market_price}</div>}
                                            </div>

                                            <div className="col-md-4">
                                                <label className="form-label">Supersedes</label>
                                                <input
                                                    type="text"
                                                    name="request_supersedes"
                                                    className={`form-control`}
                                                    value={formData.request_supersedes}
                                                    onChange={handleInputChange}
                                                    placeholder="Enter Supersedes"
                                                />
                                            </div>

                                            <div className="col-md-4">
                                                <label className="form-label">Request Date <span className="text-danger">*</span></label>
                                                <Flatpickr
                                                    options={{ dateFormat: "Y-m-d" }}
                                                    className={`form-control ${errors.request_date ? "is-invalid" : ""}`}
                                                    value={formData.request_date}
                                                    onChange={(_, dateStr) => {
                                                        setFormData({ ...formData, request_date: dateStr });
                                                        if (errors.request_date) setErrors({ ...errors, request_date: null });
                                                    }}
                                                />
                                                {errors.request_date && <div className="invalid-feedback d-block">{errors.request_date}</div>}
                                            </div>

                                            <div className="col-md-8">
                                                <label className="form-label">Request Note</label>
                                                <textarea
                                                    rows={3}
                                                    name="request_note"
                                                    className={`form-control`}
                                                    value={formData.request_note}
                                                    onChange={handleInputChange}
                                                    placeholder="Enter Request Note"
                                                />
                                            </div>

                                            <div className={`col-md-12 d-flex align-items-end justify-content-${inventory_part_request_id ? "between" : "end"} gap-3`}>
                                                {inventory_part_request_id ? (
                                                    <>
                                                        <Link to={"/Request/List"}>
                                                            <button type="button" className="btn btn-light btn-label right me-auto">
                                                                Reset <i className="ri-arrow-right-line label-icon align-middle fs-16" />
                                                            </button>
                                                        </Link>

                                                        <SubmitBtn
                                                            icon="ri-save-line"
                                                            text="Update"
                                                            onClick={handleSubmit}
                                                            type="primary"
                                                            disabled={submitLoading}
                                                        />
                                                    </>
                                                ) : (
                                                    <SubmitBtn
                                                        text={submitLoading ? "Saving..." : "Save"}
                                                        type="primary"
                                                        icon="ri-save-line"
                                                        onClick={handleSubmit}
                                                        disabled={submitLoading}
                                                    />
                                                )}
                                            </div>

                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </>
    )
}

export default CreateRequest
