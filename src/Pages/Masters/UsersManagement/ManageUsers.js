import axios from 'axios'
import { useContext, useEffect, useRef, useState } from 'react'
import { NoRecords, TableRows } from '../../../Components/Shimmer'
import { GlobalLimitChanger, SubmitBtn } from '../../../Components/InputElements'
import { ConfigContext } from '../../../Context/ConfigContext'
import PageTitle from '../../../Components/PageTitle'
import Swal from 'sweetalert2'
import { Link } from 'react-router-dom'

const ManageUsers = () => {

    const { primaryColor, apiHeaderFile, apiURL } = useContext(ConfigContext)
    const headers = apiHeaderFile;
    const imageInputRef = useRef(null);

    const [formData, setFormData] = useState({
        business_salesmen_name: "",
        business_salesmen_contact_number: "",
        business_salesman_login_id: "",
        business_salesman_login_password: "",
        business_salesman_email: "",
        business_salesman_image: null
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
    const [userId, setUserId] = useState("");
    const [imagePreview, setImagePreview] = useState("")

    const validateForm = () => {
        const newErrors = {};

        if (!formData.business_salesmen_name.trim()) newErrors.business_salesmen_name = "Name is required";
        if (!formData.business_salesmen_contact_number.trim()) newErrors.business_salesmen_contact_number = "Contact number is required";

        if (!formData.business_salesman_login_id.trim()) newErrors.business_salesman_login_id = "Login ID is required";
        if (!formData.business_salesman_login_password.trim()) newErrors.business_salesman_login_password = "Password is required";

        if (!formData.business_salesman_email.trim()) newErrors.business_salesman_email = "Email is required";
        else if (formData.business_salesman_email && !/\S+@\S+\.\S+/.test(formData.business_salesman_email))
            newErrors.business_salesman_email = "Enter a valid email address";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const resetForm = () => {
        setFormData({
            business_salesmen_name: "",
            business_salesmen_contact_number: "",
            business_salesman_login_id: "",
            business_salesman_login_password: "",
            business_salesman_email: "",
            business_salesman_image: null
        })
        setUserId("")
        setImagePreview("")
        setErrors({})
        if (imageInputRef.current) {
            imageInputRef.current.value = ""
        }
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value })
        if (errors[name]) setErrors({ ...errors, [name]: null })
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, business_salesman_image: file });
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!validateForm()) return

        setSubmitLoading(true)
        try {
            const body = new FormData();
            body.append('business_salesmen_name', formData.business_salesmen_name);
            body.append('business_salesmen_contact_number', formData.business_salesmen_contact_number);
            body.append('business_salesman_login_id', formData.business_salesman_login_id);
            body.append('business_salesman_login_password', formData.business_salesman_login_password);
            body.append('business_salesman_email', formData.business_salesman_email);

            if (formData.business_salesman_image) {
                body.append('business_salesman_image', formData.business_salesman_image);
            }

            if (userId) body.append('business_salesman_id', userId)

            const response = await axios.post(`${apiURL}Users/CreateUser`, body, { headers })
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
            const response = await axios.get(`${apiURL}Users/GetUsers`,
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

    const getInfo = async (business_salesman_id) => {
        try {
            const response = await axios.get(`${apiURL}Users/GetUserInfo`, {
                headers,
                params: { business_salesman_id: business_salesman_id }
            })
            const { success, data } = response.data

            if (success) {
                const fields = data[0]

                setFormData({
                    business_salesmen_name: fields.business_salesmen_name,
                    business_salesmen_contact_number: fields.business_salesmen_contact_number,
                    business_salesman_login_id: fields.business_salesman_login_id,
                    business_salesman_login_password: fields?.business_salesman_login_password,
                    business_salesman_email: fields.business_salesman_email,
                    business_salesman_image: null
                })
                setUserId(fields.business_salesman_id)
                setImagePreview(
                    fields.business_salesman_image
                        ? `${apiURL}public/salesmans/${fields.business_salesman_image}`
                        : ""
                )
            }
        } catch (error) {
            console.error(error)
        }
    }

    const handleDelete = async (business_salesman_id) => {
        try {
            const result = await Swal.fire({
                title: "Are you sure?",
                text: "This action will permanently delete the user.",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes!",
                cancelButtonText: "Cancel"
            });

            if (result.isConfirmed) {
                const body = new FormData();
                body.append('business_salesman_id', business_salesman_id);

                const response = await axios.post(`${apiURL}Users/DeleteUser`, body, { headers });
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
                        <PageTitle title="Manage Salesman" primary="Salesman" />
                        <div className="row">
                            <div className="col-md-4">
                                <div className="card">
                                    <div className="card-header align-items-center d-flex" style={{ backgroundColor: primaryColor }}>
                                        <h4 className="mb-0 flex-grow-1 text-white">{userId ? "Edit" : "New"} Salesman</h4>
                                    </div>
                                    <div className="card-body">
                                        <div className="row g-3">

                                            <div className="col-md-12">
                                                <label className='form-label'>Name</label>
                                                <input
                                                    type="text"
                                                    name="business_salesmen_name"
                                                    placeholder='Enter Name'
                                                    onChange={handleInputChange}
                                                    value={formData.business_salesmen_name}
                                                    className={`form-control ${errors.business_salesmen_name ? "is-invalid" : ""}`}
                                                />
                                                {errors.business_salesmen_name && <div className="invalid-feedback d-block">{errors.business_salesmen_name}</div>}
                                            </div>

                                            <div className="col-md-12">
                                                <label className='form-label'>Contact Number</label>
                                                <input
                                                    type="text"
                                                    name="business_salesmen_contact_number"
                                                    placeholder='Enter Contact Number'
                                                    onChange={handleInputChange}
                                                    value={formData.business_salesmen_contact_number}
                                                    className={`form-control ${errors.business_salesmen_contact_number ? "is-invalid" : ""}`}
                                                />
                                                {errors.business_salesmen_contact_number && <div className="invalid-feedback d-block">{errors.business_salesmen_contact_number}</div>}
                                            </div>

                                            <div className="col-md-12">
                                                <label className='form-label'>Login ID</label>
                                                <input
                                                    type="text"
                                                    name="business_salesman_login_id"
                                                    placeholder='Enter Login ID'
                                                    onChange={handleInputChange}
                                                    value={formData.business_salesman_login_id}
                                                    className={`form-control ${errors.business_salesman_login_id ? "is-invalid" : ""}`}
                                                />
                                                {errors.business_salesman_login_id && <div className="invalid-feedback d-block">{errors.business_salesman_login_id}</div>}
                                            </div>

                                            <div className="col-md-12">
                                                <label className='form-label'>Password</label>
                                                <input
                                                    type="text"
                                                    name="business_salesman_login_password"
                                                    placeholder={"Enter Password"}
                                                    onChange={handleInputChange}
                                                    value={formData.business_salesman_login_password}
                                                    className={`form-control ${errors.business_salesman_login_password ? "is-invalid" : ""}`}
                                                />
                                                {errors.business_salesman_login_password && <div className="invalid-feedback d-block">{errors.business_salesman_login_password}</div>}
                                            </div>

                                            <div className="col-md-12">
                                                <label className='form-label'>Email</label>
                                                <input
                                                    type="email"
                                                    name="business_salesman_email"
                                                    placeholder='Enter Email'
                                                    onChange={handleInputChange}
                                                    value={formData.business_salesman_email}
                                                    className={`form-control ${errors.business_salesman_email ? "is-invalid" : ""}`}
                                                />
                                                {errors.business_salesman_email && <div className="invalid-feedback d-block">{errors.business_salesman_email}</div>}
                                            </div>

                                            <div className="col-md-12">
                                                <label className='form-label'>Profile Image</label>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleImageChange}
                                                    className="form-control"
                                                    ref={imageInputRef}
                                                />
                                                {imagePreview && (
                                                    <div className="mt-2 d-flex gap-2 align-items-center">
                                                        <img
                                                            src={imagePreview}
                                                            alt="Preview"
                                                            className="img-thumbnail"
                                                            style={{ maxWidth: '100px', maxHeight: '100px' }}
                                                        />
                                                    </div>
                                                )}
                                            </div>

                                            <div className='col-md-12 d-flex align-items-end justify-content-end gap-3'>
                                                {userId ? (
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

                            <div className="col-md-8">
                                <div className="card">
                                    <div className="card-header" style={{ backgroundColor: primaryColor }}>
                                        <div className="row d-flex align-items-center">
                                            <div className="col-md-7">
                                                <h4 className="text-white mb-0">Salesman List</h4>
                                            </div>
                                            <div className="col-md-5 mt-3 mt-md-0">
                                                <div className="position-relative">
                                                    <input
                                                        type="text"
                                                        className="form-control pe-4"
                                                        placeholder="Search by name or login ID"
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
                                                <thead className="table-light text-center">
                                                    <tr>
                                                        <th>ID</th>
                                                        <th>Name</th>
                                                        <th>Contact</th>
                                                        <th>Login ID</th>
                                                        <th>Password</th>
                                                        <th>Email</th>
                                                        <th>Image</th>
                                                        <th>Action</th>
                                                    </tr>
                                                </thead>

                                                {loading ? (
                                                    <TableRows rows="10" colspan="8" />
                                                ) : (
                                                    <>
                                                        <tbody>
                                                            {data.length > 0 ? (
                                                                data.map((row) => (
                                                                    <tr
                                                                        key={row.business_salesman_id}
                                                                        className="text-center"
                                                                    >
                                                                        <td>{row.business_salesman_id}</td>
                                                                        <td>{row.business_salesmen_name}</td>
                                                                        <td>{row.business_salesmen_contact_number}</td>
                                                                        <td>{row.business_salesman_login_id}</td>
                                                                        <td>{row.business_salesman_login_password}</td>
                                                                        <td>{row.business_salesman_email || 'N/A'}</td>
                                                                        <td>
                                                                            {row.business_salesman_image ? (
                                                                                <img
                                                                                    src={row.business_salesman_image_url}
                                                                                    alt="Profile"
                                                                                    className="img-fluid"
                                                                                    style={{
                                                                                        width: '50px',
                                                                                        height: '50px',
                                                                                        objectFit: 'contain'
                                                                                    }}
                                                                                />
                                                                            ) : (
                                                                                'No Image'
                                                                            )}
                                                                        </td>
                                                                        <td className="d-flex align-items-center justify-content-center gap-2">
                                                                            <button
                                                                                className="btn btn-sm btn-soft-primary"
                                                                                onClick={() =>
                                                                                    getInfo(row.business_salesman_id)
                                                                                }
                                                                            >
                                                                                <i className="ri-pencil-line"></i>
                                                                            </button>

                                                                            <Link to={`/UserPermissions/${row.business_salesman_id}`}>
                                                                                <button className="btn btn-sm btn-soft-success">
                                                                                    <i className="ri-flag-line"></i>
                                                                                </button>
                                                                            </Link>

                                                                            <button
                                                                                className="btn btn-sm btn-soft-danger"
                                                                                onClick={() =>
                                                                                    handleDelete(row.business_salesman_id)
                                                                                }
                                                                            >
                                                                                <i className="ri-delete-bin-line"></i>
                                                                            </button>
                                                                        </td>
                                                                    </tr>
                                                                ))
                                                            ) : (
                                                                <tr>
                                                                    <td colSpan={8}>
                                                                        <NoRecords />
                                                                    </td>
                                                                </tr>
                                                            )}
                                                        </tbody>

                                                        <tfoot className="table-light">
                                                            <tr>
                                                                <th colSpan={8}>
                                                                    <div className="d-flex align-items-center justify-content-between flex-nowrap gap-2">
                                                                        <button
                                                                            disabled={!prev || loading}
                                                                            type="button"
                                                                            onClick={handlePrev}
                                                                            className="btn btn-warning btn-label waves-effect waves-light"
                                                                        >
                                                                            <i className="ri-arrow-left-line label-icon align-middle fs-16 me-2" />
                                                                            Previous
                                                                        </button>

                                                                        <div
                                                                            className="col-md-4"
                                                                            style={{ display: "flex", alignItems: "center" }}
                                                                        >
                                                                            <small>
                                                                                Total Records: {totalRecords} | Total Pages: {totalPages} | Current Page: {page}
                                                                            </small>
                                                                        </div>

                                                                        <div className="col-md-2">
                                                                            <select
                                                                                className="form-select"
                                                                                value={page}
                                                                                onChange={handleChange}
                                                                            >
                                                                                {Array.from({ length: totalPages }, (_, i) => (
                                                                                    <option key={i + 1} value={i + 1}>
                                                                                        {i + 1}
                                                                                    </option>
                                                                                ))}
                                                                            </select>
                                                                        </div>

                                                                        <div className="col-md-2">
                                                                            <GlobalLimitChanger
                                                                                placeholder="Set limit:"
                                                                                name="globalLimit"
                                                                                value={limit}
                                                                                onChange={setLimit}
                                                                                showAllValue={totalRecords}
                                                                            />
                                                                        </div>

                                                                        <button
                                                                            disabled={!next || loading}
                                                                            type="button"
                                                                            onClick={handleNext}
                                                                            className="btn btn-primary btn-label waves-effect right waves-light"
                                                                        >
                                                                            Next
                                                                            <i className="ri-arrow-right-line label-icon align-middle fs-16 ms-2" />
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

export default ManageUsers