import axios from 'axios'
import { useContext, useEffect, useState } from 'react'
import Select from 'react-select'
import { SubmitBtn } from '../../../Components/InputElements'
import { ConfigContext } from '../../../Context/ConfigContext'
import PageTitle from '../../../Components/PageTitle'
import Swal from 'sweetalert2'
import Flatpickr from "react-flatpickr";
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getCurrentDate } from '../../../Components/GlobalFunctions'

const ManageFollowup = () => {

    const { primaryColor, apiHeaderJson, apiURL, selectTheme, selectStyle } = useContext(ConfigContext)
    const { business_salesman_followup_id, business_id } = useParams()
    const navigate = useNavigate()
    const headers = apiHeaderJson;

    const followupId = Number(business_salesman_followup_id) || 0;
    const autoBusinessId = Number(business_id) || 0;

    const isEdit = followupId > 0;

    const [formData, setFormData] = useState({
        date: getCurrentDate(),
        response: "",
        remark: "",
    })

    const [selectedType, setSelectedType] = useState(null)
    const [selectedBusiness, setSelectedBusiness] = useState(null)
    const [errors, setErrors] = useState({})
    const [submitLoading, setSubmitLoading] = useState(false)
    const [businessOptions, setBusinessOptions] = useState([])

    const typeOptions = [
        { value: "Call", label: "Call" },
        { value: "Meet", label: "Meet" },
        { value: "Visit", label: "Visit" },
        { value: "WhatsApp", label: "WhatsApp" },
        { value: "Mail", label: "Mail" },
    ]

    const validateForm = () => {
        const newErrors = {};

        if (!selectedBusiness) newErrors.selectedBusiness = "Business is required";
        if (!selectedType) newErrors.selectedType = "Followup type is required";
        if (!formData.date) newErrors.date = "Followup date is required";
        if (!formData.response.trim()) newErrors.response = "Business response is required";
        if (!formData.remark.trim()) newErrors.remark = "Followup remark is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const resetForm = () => {
        setFormData({
            date: getCurrentDate(),
            response: "",
            remark: ""
        })
        setSelectedType(null)
        setSelectedBusiness(null)
        setErrors({})
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value })
        if (errors[name]) setErrors({ ...errors, [name]: null })
    }

    const getBusinessList = async () => {
        try {
            const response = await axios.get(`${apiURL}Business/GetBusinessesList`, { headers })
            const { success, data } = response.data

            if (success) {
                const options = data.map((item) => ({
                    value: item.business_id,
                    label: item.business_name
                }));
                setBusinessOptions(options)
            }
        } catch (error) {
            console.error(error)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!validateForm()) return

        setSubmitLoading(true)
        try {
            const body = {
                business_id: selectedBusiness?.value,
                business_salesman_followup_type: selectedType,
                business_salesman_followup_date: formData.date,
                business_salesman_business_response: formData.response,
                business_salesman_followup_remark: formData.remark
            }
            
            if (isEdit) {
                body.business_salesman_followup_id = followupId;
            }

            const response = await axios.post(`${apiURL}Masters/CreateFollowup`, body, { headers })
            const { success, message } = response.data

            if (success) {
                Swal.fire('Success!', message, 'success')
                resetForm()
                if (isEdit) navigate("/Masters/FollowupList")
            }
        } catch (error) {
            console.log("error", error)
        } finally {
            setSubmitLoading(false)
        }
    }

    const getInfo = async () => {
        try {
            if (!isEdit) return;

            const response = await axios.get(`${apiURL}Masters/GetFollowupInfo`, {
                headers,
                params: { business_salesman_followup_id: followupId }
            })
            const { success, data } = response.data

            if (success && data.length > 0) {
                const fields = data[0];

                setFormData({
                    date: fields?.business_salesman_followup_date,
                    response: fields?.business_salesman_business_response,
                    remark: fields?.business_salesman_followup_remark
                })
                setSelectedBusiness(fields?.business_id)
                setSelectedType(fields?.business_salesman_followup_type)
            }
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        getBusinessList()
    }, [])

    useEffect(() => {
        if (isEdit) {
            getInfo();
        }
    }, [followupId])

    useEffect(() => {
        if (!isEdit && autoBusinessId > 0 && businessOptions.length > 0) {
            const selectedOption = businessOptions.find(
                opt => opt.value === autoBusinessId
            );

            setSelectedBusiness(selectedOption || null);

            setErrors(prev => ({ ...prev, selectedBusiness: "" }));
        }
    }, [autoBusinessId, businessOptions, isEdit]);

    return (
        <>
            <div className="main-content">
                <div className="page-content">
                    <div className="container-fluid">
                        <PageTitle title="Manage Followup" primary="Masters" />

                        <div className="row">
                            <div className="col-md-12">
                                <div className="card">

                                    <div className="card-header align-items-center d-flex" style={{ backgroundColor: primaryColor }}>
                                        <h4 className="mb-0 flex-grow-1 text-white">Follow Up</h4>
                                        <Link to={"/Masters/FollowupList"}>
                                            <button
                                                type="button"
                                                className="btn btn-light btn-sm rounded-circle"
                                                title="View Followups"
                                            >
                                                <i className="ri-list-unordered"></i>
                                            </button>
                                        </Link>
                                    </div>

                                    <div className="card-body">
                                        <div className="row g-3">

                                            <div className="col-md-4">
                                                <label className="form-label">
                                                    Account <span className="text-danger">*</span>
                                                </label>
                                                <Select
                                                    theme={selectTheme}
                                                    styles={selectStyle}
                                                    options={businessOptions}
                                                    placeholder="Select Business"
                                                    value={selectedBusiness}
                                                    onChange={(selected) => {
                                                        setSelectedBusiness(selected);
                                                        if (errors.selectedBusiness) {
                                                            setErrors(prev => ({ ...prev, selectedBusiness: '' }));
                                                        }
                                                    }}
                                                    classNamePrefix="react-select"
                                                    className={errors.selectedBusiness ? "is-invalid" : ""}
                                                    isClearable
                                                />
                                                {errors.selectedBusiness && (
                                                    <div className="text-danger d-block">{errors.selectedBusiness}</div>
                                                )}
                                            </div>

                                            <div className="col-md-4">
                                                <label className="form-label">
                                                    Followup Type <span className="text-danger">*</span>
                                                </label>
                                                <Select
                                                    theme={selectTheme}
                                                    styles={selectStyle}
                                                    options={typeOptions}
                                                    placeholder="Select Type"
                                                    value={typeOptions.find(opt => opt.value === selectedType) || null}
                                                    onChange={(selected) => {
                                                        setSelectedType(selected ? selected.value : null);
                                                        if (errors.selectedType) {
                                                            setErrors(prev => ({ ...prev, selectedType: "" }));
                                                        }
                                                    }}
                                                    classNamePrefix="react-select"
                                                    className={errors.selectedType ? "is-invalid" : ""}
                                                    isClearable
                                                />
                                                {errors.selectedType && (
                                                    <div className="text-danger d-block">{errors.selectedType}</div>
                                                )}
                                            </div>

                                            <div className="col-md-4">
                                                <label className="form-label">
                                                    Followup Date <span className="text-danger">*</span>
                                                </label>
                                                <Flatpickr
                                                    options={{ dateFormat: "Y-m-d" }}
                                                    className={`form-control ${errors.date ? "is-invalid" : ""}`}
                                                    value={formData.date}
                                                    onChange={(_, dateStr) => {
                                                        setFormData({ ...formData, date: dateStr })
                                                        if (errors.date) {
                                                            setErrors(prev => ({ ...prev, date: '' }))
                                                        }
                                                    }}
                                                />
                                                {errors.date && (
                                                    <div className="invalid-feedback d-block">{errors.date}</div>
                                                )}
                                            </div>

                                            <div className="col-md-12">
                                                <label className="form-label">
                                                    Business Response <span className="text-danger">*</span>
                                                </label>
                                                <textarea
                                                    rows={5}
                                                    name="response"
                                                    value={formData.response}
                                                    onChange={handleInputChange}
                                                    className={`form-control ${errors.response ? "is-invalid" : ""}`}
                                                    placeholder="Enter Business Response"
                                                />
                                                {errors.response && (
                                                    <div className="invalid-feedback d-block">{errors.response}</div>
                                                )}
                                            </div>

                                            <div className="col-md-12">
                                                <label className="form-label">
                                                    Followup Remark <span className="text-danger">*</span>
                                                </label>
                                                <textarea
                                                    rows={5}
                                                    name="remark"
                                                    value={formData.remark}
                                                    onChange={handleInputChange}
                                                    className={`form-control ${errors.remark ? "is-invalid" : ""}`}
                                                    placeholder="Enter Remark"
                                                />
                                                {errors.remark && (
                                                    <div className="invalid-feedback d-block">{errors.remark}</div>
                                                )}
                                            </div>

                                            <div className={`col-md-12 d-flex align-items-end justify-content-${isEdit ? "between" : "end"} gap-3`}>

                                                {isEdit ? (
                                                    <>
                                                        <Link to="/Masters/FollowupList">
                                                            <button type="button" className="btn btn-light btn-label right me-auto">
                                                                Reset
                                                                <i className="ri-arrow-right-line label-icon align-middle fs-16" />
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

export default ManageFollowup;
