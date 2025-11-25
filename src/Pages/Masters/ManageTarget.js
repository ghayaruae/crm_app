import axios from 'axios'
import { useContext, useEffect, useState } from 'react'
import Select from 'react-select'
import { NoRecords, TableRows } from '../../Components/Shimmer'
import { GlobalLimitChanger, SubmitBtn } from '../../Components/InputElements'
import { ConfigContext } from '../../Context/ConfigContext'
import PageTitle from '../../Components/PageTitle'
import Swal from 'sweetalert2'
import Flatpickr from "react-flatpickr";
import { DateFormater } from '../../Components/GlobalFunctions'

const ManageTarget = () => {

    const { primaryColor, apiHeaderJson, apiURL, selectTheme, selectStyle } = useContext(ConfigContext)
    const headers = apiHeaderJson;

    const [formData, setFormData] = useState({
        business_salesman_id: "",
        amount: "",
        from_date: "",
        to_date: "",
    })
    const [errors, setErrors] = useState({})
    const [data, setData] = useState([])
    const [submitLoading, setSubmitLoading] = useState(false)
    const [next, setNext] = useState(false);
    const [prev, setPrev] = useState(false);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [totalRecords, setTotalRecords] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(true)
    const [keyword, setKeyword] = useState("");
    const [targetId, setTargetId] = useState("");
    const [salesmanOptions, setSalesmanOptions] = useState([])

    const validateForm = () => {
        const newErrors = {};

        if (!formData.business_salesman_id) newErrors.business_salesman_id = "Salesman is required";
        if (!formData.amount.trim()) newErrors.amount = "Amount is required";
        else if (isNaN(formData.amount) || Number(formData.amount) <= 0)
            newErrors.amount = "Enter a valid amount";

        if (!formData.from_date.trim()) newErrors.from_date = "From Date is required";
        if (!formData.to_date.trim()) newErrors.to_date = "To Date is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const resetForm = () => {
        setFormData({
            business_salesman_id: "",
            amount: "",
            from_date: "",
            to_date: ""
        })
        setTargetId("")
        setErrors({})
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value })
        if (errors[name]) setErrors({ ...errors, [name]: null })
    }

    const handleSalesmanChange = (selectedOption) => {
        setFormData({ ...formData, business_salesman_id: selectedOption ? selectedOption.value : "" });
        if (errors.business_salesman_id) setErrors({ ...errors, business_salesman_id: null });
    };

    const getSalesmanList = async () => {
        try {
            const response = await axios.get(`${apiURL}Masters/GetSalesmanList`, { headers })
            const { success, data } = response.data

            if (success) {
                const options = data.map((item) => ({
                    value: item.business_salesman_id,
                    label: item.business_salesmen_name
                }));
                setSalesmanOptions(options)
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
                business_salesman_id: formData.business_salesman_id,
                business_salesman_target_from: formData.from_date,
                business_salesman_target_to: formData.to_date,
                business_salesman_target: formData.amount
            }
            if (targetId) body.business_salesman_target_id = targetId

            const response = await axios.post(`${apiURL}Masters/CreateTarget`, body, { headers })
            const { success, message } = response.data

            if (success) {
                Swal.fire('Success!', message, 'success')
                resetForm()
                getData()
            }
        } catch (error) {
            console.log("error", error)
        } finally {
            setSubmitLoading(false)
        }
    }

    const getData = async () => {
        try {
            setLoading(true)
            const response = await axios.get(`${apiURL}Masters/GetTargets`,
                {
                    headers,
                    params: { page, limit, keyword }
                })
            const { success, data, page: currentPage, next, prev, total_pages, total_records } = response.data

            if (success) {
                setData(data)
                setPage(currentPage)
                setNext(next)
                setPrev(prev)
                setTotalPages(total_pages)
                setTotalRecords(total_records)
            }
        } catch (error) {
            console.log("error", error)
        } finally {
            setLoading(false)
        }
    }

    const getInfo = async (business_salesman_target_id) => {
        try {
            const response = await axios.get(`${apiURL}Masters/GetTargetInfo`, {
                headers,
                params: { business_salesman_target_id: business_salesman_target_id }
            })
            const { success, data } = response.data

            if (success) {
                const fields = data[0]

                setFormData({
                    business_salesman_id: fields.business_salesman_id,
                    amount: fields.business_salesman_target,
                    from_date: fields.business_salesman_target_from,
                    to_date: fields.business_salesman_target_to
                })
                setTargetId(fields.business_salesman_target_id)
            }
        } catch (error) {
            console.error(error)
        }
    }

    const handleDelete = async (business_salesman_target_id) => {
        try {
            const result = await Swal.fire({
                title: "Are you sure?",
                text: "This action will permanently delete the target.",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes!",
                cancelButtonText: "Cancel"
            });

            if (result.isConfirmed) {
                const body = { business_salesman_target_id };

                const response = await axios.post(`${apiURL}Masters/DeleteTarget`, body, { headers });
                const { success, message } = response.data;

                if (success) {
                    Swal.fire("Deleted!", message, "success");
                    getData();
                }
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handlePrev = () => prev && setPage((prevPage) => prevPage - 1);
    const handleNext = () => next && setPage((prevPage) => prevPage + 1);
    const handleChange = (e) => setPage(parseInt(e.target.value, 10));

    useEffect(() => {
        getSalesmanList()
    }, [])

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            getData();
        }, 500);

        return () => clearTimeout(delayDebounce);
    }, [keyword, page, limit]);

    return (
        <>
            <div className="main-content">
                <div className="page-content">
                    <div className="container-fluid">
                        <PageTitle title="Manage Target" primary="Masters" />
                        <div className="row">
                            {/* Left Form */}
                            <div className="col-md-4">
                                <div className="card">
                                    <div className="card-header align-items-center d-flex" style={{ backgroundColor: primaryColor }}>
                                        <h4 className="mb-0 flex-grow-1 text-white">{targetId ? "Edit" : "New"} Target</h4>
                                    </div>
                                    <div className="card-body">
                                        <div className="row g-3">

                                            <div className="col-md-12">
                                                <label className='form-label'>Salesman</label>
                                                <Select
                                                    name="business_salesman_id"
                                                    theme={selectTheme}
                                                    styles={selectStyle}
                                                    options={salesmanOptions}
                                                    placeholder="Select Salesman"
                                                    value={salesmanOptions.find(opt => opt.value === formData.business_salesman_id) || null}
                                                    onChange={handleSalesmanChange}
                                                    classNamePrefix="react-select"
                                                    className={errors.business_salesman_id ? "is-invalid" : ""}
                                                    isClearable
                                                />
                                                {errors.business_salesman_id && <div className="text-danger d-block">{errors.business_salesman_id}</div>}
                                            </div>

                                            <div className="col-md-12">
                                                <label className='form-label'>Target Amount</label>
                                                <input
                                                    type="text"
                                                    name="amount"
                                                    placeholder='Enter Target Amount'
                                                    onChange={handleInputChange}
                                                    value={formData.amount}
                                                    className={`form-control ${errors.amount ? "is-invalid" : ""}`}
                                                />
                                                {errors.amount && <div className="invalid-feedback d-block">{errors.amount}</div>}
                                            </div>

                                            <div className="col-md-12">
                                                <label className='form-label'>From Date</label>
                                                <Flatpickr
                                                    options={{ dateFormat: "Y-m-d" }}
                                                    className={`form-control ${errors.from_date ? "is-invalid" : ""}`}
                                                    placeholder="Select From Date"
                                                    value={formData.from_date}
                                                    onChange={(_, dateStr) => {
                                                        setFormData({ ...formData, from_date: dateStr });
                                                        if (errors.from_date) setErrors({ ...errors, from_date: null });
                                                    }}
                                                />
                                                {errors.from_date && (
                                                    <div className="invalid-feedback d-block">{errors.from_date}</div>
                                                )}
                                            </div>

                                            <div className="col-md-12">
                                                <label className='form-label'>To Date</label>
                                                <Flatpickr
                                                    options={{ dateFormat: "Y-m-d" }}
                                                    className={`form-control ${errors.to_date ? "is-invalid" : ""}`}
                                                    placeholder="Select To Date"
                                                    value={formData.to_date}
                                                    onChange={(_, dateStr) => {
                                                        setFormData({ ...formData, to_date: dateStr });
                                                        if (errors.to_date) setErrors({ ...errors, to_date: null });
                                                    }}
                                                />
                                                {errors.to_date && (
                                                    <div className="invalid-feedback d-block">{errors.to_date}</div>
                                                )}
                                            </div>

                                            <div className='col-md-12 d-flex align-items-end justify-content-end gap-3'>
                                                {targetId ? (
                                                    <>
                                                        <button
                                                            type="button"
                                                            className="btn btn-light btn-label right me-auto"
                                                            onClick={resetForm}
                                                        >
                                                            Reset
                                                            <i className="ri-arrow-right-line label-icon align-middle fs-16" />
                                                        </button>
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
                                                        text={submitLoading ? 'Saving..' : 'Save'}
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

                            {/* Right Table */}
                            <div className="col-md-8">
                                <div className="card">
                                    <div className="card-header" style={{ backgroundColor: primaryColor }}>
                                        <div className="row d-flex align-items-center">
                                            <div className="col-md-7">
                                                <h4 className="text-white mb-0">Targets List</h4>
                                            </div>
                                            <div className="col-md-5 mt-3 mt-md-0">
                                                <div className="position-relative">
                                                    <input
                                                        type="text"
                                                        className="form-control pe-4"
                                                        placeholder="Search by Salesman name"
                                                        name="keyword"
                                                        value={keyword}
                                                        onChange={(e) => setKeyword(e.target.value)}
                                                    />
                                                    <span className="position-absolute end-0 top-50 translate-middle-y me-3">
                                                        <i className="ri-search-line"></i>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="card-body">
                                        <div className="table-responsive table-card">
                                            <table className="table table-bordered table-striped table-hover mb-0 table-nowrap">
                                                {loading ? (
                                                    <TableRows rows="10" colspan="6" />
                                                ) : (
                                                    <>
                                                        <thead className="table-light text-center">
                                                            <tr>
                                                                <th>ID</th>
                                                                <th>Salesman</th>
                                                                <th>Amount</th>
                                                                <th>From</th>
                                                                <th>To</th>
                                                                <th>Action</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {data.length > 0 ? (
                                                                data.map((row) => (
                                                                    <tr key={row.business_salesman_target_id} className="text-center">
                                                                        <td className='text-dark fw-bold'>{row.business_salesman_target_id}</td>
                                                                        <td className='text-dark fw-bold'>{row.business_salesmen_name}</td>
                                                                        <td>{row.business_salesman_target}</td>
                                                                        <td>{DateFormater(row.business_salesman_target_from)}</td>
                                                                        <td>{DateFormater(row.business_salesman_target_to)}</td>
                                                                        <td className='d-flex align-items-center justify-content-center gap-2'>
                                                                            <button
                                                                                className='btn btn-sm btn-soft-primary'
                                                                                onClick={() => getInfo(row.business_salesman_target_id)}
                                                                            >
                                                                                <i className='ri-pencil-line'></i>
                                                                            </button>
                                                                            {/* <button
                                                                                className='btn btn-sm btn-soft-danger'
                                                                                onClick={() => handleDelete(row.business_salesman_target_id)}
                                                                            >
                                                                                <i className='ri-delete-bin-line'></i>
                                                                            </button> */}
                                                                        </td>
                                                                    </tr>
                                                                ))
                                                            ) : (
                                                                <tr>
                                                                    <td colSpan={5}><NoRecords /></td>
                                                                </tr>
                                                            )}
                                                        </tbody>

                                                        <tfoot className='table-light'>
                                                            <tr>
                                                                <th colSpan={8}>
                                                                    <div className="d-flex align-items-center justify-content-between flex-nowrap gap-2">
                                                                        <button disabled={!prev || loading} type="button" onClick={handlePrev} className="btn btn-warning btn-label waves-effect waves-light">
                                                                            <i className="ri-arrow-left-line label-icon align-middle fs-16 me-2" /> Previous
                                                                        </button>
                                                                        <div className='col-md-4' style={{ display: 'flex', alignItems: 'center' }}>
                                                                            <small>Total Records: {totalRecords} | Total Pages: {totalPages} | Current Page: {page}</small>
                                                                        </div>
                                                                        <div className='col-md-2'>
                                                                            <select className="form-select" value={page} onChange={handleChange}>
                                                                                {Array.from({ length: totalPages }, (_, i) => (
                                                                                    <option key={i + 1} value={i + 1}>{i + 1}</option>
                                                                                ))}
                                                                            </select>
                                                                        </div>
                                                                        <div className='col-md-2'>
                                                                            <GlobalLimitChanger
                                                                                placeholder="Set limit:"
                                                                                name="globalLimit"
                                                                                value={limit}
                                                                                onChange={setLimit}
                                                                                showAllValue={totalRecords}
                                                                            />
                                                                        </div>
                                                                        <button disabled={!next || loading} type="button" onClick={handleNext} className="btn btn-primary btn-label waves-effect right waves-light">
                                                                            <i className="ri-arrow-right-line label-icon align-middle fs-16 ms-2" /> Next
                                                                        </button>
                                                                    </div>
                                                                </th>
                                                            </tr>
                                                        </tfoot>
                                                    </>
                                                )}
                                            </table>
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

export default ManageTarget
