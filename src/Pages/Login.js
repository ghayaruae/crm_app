import React, { useContext, useState } from 'react'
import { ConfigContext } from '../Context/ConfigContext';
import * as Yup from 'yup';
import Swal from 'sweetalert2';
import axios from 'axios';

const Login = () => {

    const { handleUpdateLogin, apiURL } = useContext(ConfigContext);
    const [IsDisable, setIsDisable] = useState(false);
    const [IsShow, setIsShow] = useState(false);
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});

    const validationSchema = Yup.object().shape({
        userName: Yup.string().required('Username is required'),
        password: Yup.string().required('Password is required'),
    });

    const ShowPassword = (event) => {
        setIsShow(event.target.checked);
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsDisable(true);
        const formData = {
            business_salesman_login_id: userName,
            business_salesman_login_password: password,
        }
        try {
            await validationSchema.validate({ userName, password }, { abortEarly: false });
            setIsShow(false);
            const response = await axios.post(`${apiURL}Users/Login`, formData);
            const { data, success } = response.data;

            if (success) {
                Swal.fire({
                    title: 'Login Successfully...',
                    text: `success`,
                    icon: 'success',
                    timer: 1000,
                    showConfirmButton: false,
                });
                handleUpdateLogin(data);
                setUserName('');
                setPassword('');

                setTimeout(() => {
                    window.location.href = "/";
                    setIsDisable(false);
                }, 1200);
            }
            else {
                setIsDisable(false);
                Swal.fire('Login failed...', `${response.data.message}`, "error");
            }
        } catch (error) {
            if (error.name === 'ValidationError') {
                const validationErrors = {};
                error.inner.forEach((err) => {
                    validationErrors[err.path] = err.message;
                });
                setErrors(validationErrors);
            } else {
                console.error('Error during validation:', error);
            }
            setIsDisable(false);
        }
    };

    return (
        <>
            <div className='auth-page-wrapper pt-5'>
                <div className="auth-one-bg-position auth-one-bg" id="auth-particles">
                    <div className="bg-overlay" />
                    <div className="shape">
                        <svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 1440 120">
                            <path d="M 0,36 C 144,53.6 432,123.2 720,124 C 1008,124.8 1296,56.8 1440,40L1440 140L0 140z" />
                        </svg>
                    </div>
                </div>

                <div className='auth-page-content'>
                    <div className='container'>
                        <div className='row'>
                            <div className='col-lg-12'>
                                <div className='text-center mt-sm-5 mb-4 text-white-50'>
                                    <div>
                                        <p className="mt-3 fs-15 fw-medium">Master Admin Login</p>
                                    </div>
                                </div>
                            </div>

                            <div className='row justify-content-center'>
                                <div className='col-md-8 col-lg-6 col-xl-5'>
                                    <div className='card mt-4'>
                                        <div className='card-body p-4'>
                                            <div className='text-center mt-2'>
                                                <h5 className="text-primary">Welcome Back !</h5>
                                                <p className="text-muted">Login to continue to Master Admin.</p>
                                            </div>

                                            <div className='p-2 mt-4'>
                                                <form onSubmit={handleSubmit}>
                                                    <div className="mb-3">
                                                        <label htmlFor="username" className="form-label">User Name</label>
                                                        <input type="text" className={`form-control ${errors.userName ? ("is-invalid") : ""}`} id="username" placeholder="Enter User Name" value={userName} onChange={(e) => setUserName(e.target.value)} />
                                                        {errors.userName && <div className="text-danger">{errors.userName}</div>}
                                                    </div>
                                                    <div className="mb-3">
                                                        <label className="form-label" htmlFor="password-input">Password</label>
                                                        <div className="position-relative auth-pass-inputgroup mb-3">
                                                            <input type={`${IsShow === true ? ("text") : "password"}`} className={`form-control pe-5 password-input ${errors.password ? ("is-invalid") : ""}`} placeholder="Enter password" id="password-input" value={password} onChange={(e) => setPassword(e.target.value)} />
                                                            {errors.password && <div className="text-danger">{errors.password}</div>}
                                                        </div>
                                                    </div>
                                                    <div className="d-flex justify-content-between">
                                                        <div className="form-check">
                                                            <input className="form-check-input" type="checkbox" checked={IsShow} onChange={ShowPassword} defaultValue id="auth-show-password" />
                                                            <label className="form-check-label" htmlFor="auth-show-password">Show Password</label>
                                                        </div>
                                                    </div>
                                                    <div className="mt-4">
                                                        {IsDisable === false ?
                                                            <button className={`${!userName || !password ? ('disabled') : ""} btn btn-success w-100`} disabled={IsDisable} type="submit">Login</button>
                                                            :
                                                            <button className="btn btn-success w-100" disabled={IsDisable} type="submit">Please wait...</button>
                                                        }
                                                    </div>
                                                </form>
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

export default Login;