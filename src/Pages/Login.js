import React, { useContext, useState } from 'react'
import { ConfigContext } from '../Context/ConfigContext';
import * as Yup from 'yup';
import Swal from 'sweetalert2';
import axios from 'axios';

const Login = () => {

    const { handleUpdateLogin, apiURL, primaryColor } = useContext(ConfigContext);
    const brandRed = "#E20914";

    const [IsDisable, setIsDisable] = useState(false);
    const [IsShow, setIsShow] = useState(false);
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});

    const validationSchema = Yup.object().shape({
        userName: Yup.string().required('Username is required'),
        password: Yup.string().required('Password is required'),
    });

    const ShowPassword = (event) => setIsShow(event.target.checked);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsDisable(true);

        const formData = {
            business_salesman_login_id: userName,
            business_salesman_login_password: password,
        };

        try {
            await validationSchema.validate({ userName, password }, { abortEarly: false });

            const response = await axios.post(`${apiURL}Users/Login`, formData);
            const { data, success, permissions } = response.data;

            if (success) {
                handleUpdateLogin(data, permissions);
                setUserName('');
                setPassword('');
                window.location.href = "/";
            }

        } catch (error) {
            if (error.name === 'ValidationError') {
                const validationErrors = {};
                error.inner.forEach((err) => {
                    validationErrors[err.path] = err.message;
                });
                setErrors(validationErrors);
            }
        } finally {
            setIsDisable(false);
        }
    };

    return (
        <div className="container min-vh-100 d-flex align-items-center justify-content-center">

            <div className="card shadow-lg border-0 w-100"
                style={{ maxWidth: "850px", borderRadius: "14px" }}>

                <div className="row g-0">

                    <div className="col-md-5 d-flex align-items-center justify-content-center p-4"
                        style={{ borderRadius: "14px 0 0 14px" }}>
                        <img
                            src="/assets/images/Login.gif"
                            alt="Brand Logo"
                            className="img-fluid"
                        />
                    </div>

                    <div className="col-md-7 p-4 bg-dark-subtle"
                        style={{ borderRadius: "0 14px 14px 0" }}>
                        <img
                            src="/assets/images/main-logo-2.png"
                            alt="Brand Logo"
                            className="img-fluid"
                            style={{ maxWidth: "100px" }}
                        />
                        <p className="text-muted small mb-4">
                            Access your CRM dashboard
                        </p>

                        <form onSubmit={handleSubmit}>

                            <div className="mb-3">
                                <label className="form-label small fw-semibold">User Name</label>
                                <input
                                    type="text"
                                    className={`form-control ${errors.userName ? "is-invalid" : ""}`}
                                    placeholder="Enter username"
                                    value={userName}
                                    onChange={(e) => setUserName(e.target.value)}
                                    style={{ height: 40 }}
                                />
                                {errors.userName && (
                                    <div className="invalid-feedback">{errors.userName}</div>
                                )}
                            </div>

                            <div className="mb-3">
                                <label className="form-label small fw-semibold">Password</label>
                                <input
                                    type={IsShow ? "text" : "password"}
                                    className={`form-control ${errors.password ? "is-invalid" : ""}`}
                                    placeholder="Enter password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    style={{ height: 40 }}
                                />
                                {errors.password && (
                                    <div className="invalid-feedback d-block">{errors.password}</div>
                                )}
                            </div>

                            <div className="form-check mb-3">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    checked={IsShow}
                                    onChange={ShowPassword}
                                    id="showPw"
                                />
                                <label className="form-check-label small" htmlFor="showPw">
                                    Show Password
                                </label>
                            </div>

                            <button
                                type="submit"
                                className="btn w-100 fw-semibold"
                                disabled={IsDisable || !userName || !password}
                                style={{
                                    backgroundColor: primaryColor,
                                    color: "#fff",
                                    height: 42,
                                    borderRadius: "6px",
                                    opacity: (IsDisable || !userName || !password) ? 0.85 : 1
                                }}
                            >
                                {IsDisable ? "Please wait..." : "Login"}
                            </button>

                        </form>

                        <p className="text-center text-muted small mt-3 mb-0">
                            Secure Login • CRM Admin Panel
                        </p>
                    </div>

                </div>

            </div>

        </div>
    );
};

export default Login;
