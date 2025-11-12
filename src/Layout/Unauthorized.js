export const Unauthorized = () => {
    return (
        <div className="auth-page-wrapper py-5 d-flex justify-content-center align-items-center min-vh-100">
            {/* auth-page content */}
            <div className="auth-page-content overflow-hidden p-0">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-xl-7 col-lg-8">
                            <div className="text-center">
                                <img
                                    src="/assets/images/401-unauthorized.png"
                                    alt="unauthorized img"
                                    className="img-fluid"
                                    style={{ maxWidth: "400px" }}
                                />
                                <div className="mt-3">
                                    <h3 className="text-uppercase text-danger">
                                        Unauthorized Access 🚫
                                    </h3>
                                    {/* <p className="text-muted mb-4">
                                        You don’t have the necessary permissions to view this page.
                                        <br />
                                        Please contact your administrator if you believe this is a mistake.
                                    </p> */}
                                </div>
                            </div>
                        </div>
                        {/* end col */}
                    </div>
                    {/* end row */}
                </div>
                {/* end container */}
            </div>
            {/* end auth-page content */}
        </div>
    )
}
