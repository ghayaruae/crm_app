import React, { useContext, useEffect, useState } from 'react'
import PageTitle from '../../../Components/PageTitle'
import { useNavigate, useParams } from 'react-router-dom'
import { ConfigContext } from '../../../Context/ConfigContext';
import axios from 'axios';
import Swal from "sweetalert2"

const UserPermissions = () => {

    const { business_salesman_id } = useParams();
    const { apiURL, apiHeaderJson } = useContext(ConfigContext);

    const [routes, setRoutes] = useState([]);
    const [user, setUser] = useState(null);
    const [selectedPermissions, setSelectedPermissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saveLoading, setSaveLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [groupedRoutes, setGroupedRoutes] = useState({});
    const [showAllPermissions, setShowAllPermissions] = useState(false);
    const navigate = useNavigate();

    const GetUserPrivilageList = async () => {
        try {
            const headers = apiHeaderJson;

            const response = await axios.get(`${apiURL}Users/GetSalesmanPrivilageList`, { headers })

            if (response?.data?.success) {
                const data = response?.data?.data;
                setRoutes(data);

                const grouped = {};
                data.forEach(route => {
                    const category = route.salesman_description.split('/')[1] || 'General';
                    if (!grouped[category]) {
                        grouped[category] = [];
                    }
                    grouped[category].push(route);
                });
                setGroupedRoutes(grouped);

            }


        } catch (error) {
            console.error('Error fetching privilege list:', error);
        } finally {
            setLoading(false)
        }
    }

    const GetUserInfo = async () => {
        try {

            const headers = apiHeaderJson;
            const response = await axios.get(`${apiURL}Users/GetSalesmanPrivillageInfo`, { params: { business_salesman_id }, headers })

            if (response?.data?.success) {
                const data = response?.data;
                setUser(data?.data[0])

                if (data?.permissions.length > 0) {
                    const user_permissions = data?.permissions?.map(permission => Number(permission.salesman_privilage_id));
                    setSelectedPermissions(user_permissions);
                }
            }

        } catch (error) {
            console.log("error", error)
        }
    }

    const savePermissions = async () => {
        try {
            setSaveLoading(true);
            const headers = apiHeaderJson;
            const body = {
                business_salesman_id,
                permissions: selectedPermissions
            }
            const response = await axios.post(`${apiURL}Users/UpdateSalesmanPermissions`, body, { headers });

            if (response?.data?.success) {
                GetUserPrivilageList();
                GetUserInfo();
                Swal.fire({
                    title: "Success!",
                    text: "Permissions updated successfully.",
                    icon: "success",
                    confirmButtonText: "OK"
                }).then(() => {
                    navigate('/Masters/ManageUsers');
                });
            }

        } catch (error) {
            console.error('Error saving permissions:', error);
        } finally {
            setSaveLoading(false);
        }
    }

    // Toggle permission selection
    const togglePermission = (permissionId) => {
        setSelectedPermissions(prev => {
            if (prev.includes(permissionId)) {
                return prev.filter(id => id !== permissionId);
            } else {
                return [...prev, permissionId];
            }
        });
    };

    // Toggle all permissions in a category
    const toggleCategory = (category, permissions) => {
        const allSelected = permissions.every(p => selectedPermissions.includes(p.salesman_privilage_id));

        setSelectedPermissions(prev => {
            if (allSelected) {
                // Remove all permissions in this category
                return prev.filter(id =>
                    !permissions.some(p => p.salesman_privilage_id === id)
                );
            } else {
                // Add all permissions in this category
                const newPermissions = permissions
                    .map(p => p.salesman_privilage_id)
                    .filter(id => !prev.includes(id));
                return [...prev, ...newPermissions];
            }
        });
    };

    // Filter routes based on search term
    const filteredRoutes = Object.entries(groupedRoutes).reduce((acc, [category, permissions]) => {
        const filtered = permissions.filter(route =>
            route.salesman_privilege_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            route.salesman_description.toLowerCase().includes(searchTerm.toLowerCase())
        );
        if (filtered.length > 0) {
            acc[category] = filtered;
        }
        return acc;
    }, {});


    const HeadingIcon = (heading) => {
        const iconsArray = [
            { title: 'General', icon: 'ri-home-5-line' },
            { title: 'Accounts', icon: 'ri-wallet-3-line' },
            { title: 'Reports', icon: 'ri-file-3-line' },
            { title: 'Inventory', icon: 'ri-apps-2-line' },
            { title: 'Users', icon: 'ri-group-line' },
            { title: 'Settings', icon: 'mdi mdi-cog-outline fs-22' },
            { title: 'business', icon: 'ri-store-2-line' },
            { title: 'Orders', icon: 'ri-shopping-bag-line' },
            { title: 'Return', icon: 'mdi mdi-restart' },
            { title: 'Coupon', icon: 'ri-gift-line' },
            { title: 'Salesman', icon: 'ri-user-3-line' },
            { title: 'Offers', icon: 'ri-hand-coin-line' },
        ];

        const found = iconsArray.find(item => item.title.toUpperCase() === heading.toUpperCase());
        return found?.icon || '';
    };

    useEffect(() => {
        GetUserInfo();
    }, [business_salesman_id])

    useEffect(() => {
        GetUserPrivilageList();
    }, [business_salesman_id])

    if (loading) {
        return (

            <div className='main-content'>
                <div className='page-content'>
                    <div className='container-fluid'>
                        <div className="d-flex justify-content-center align-items-center" style={{ height: "75vh" }}>
                            <div className="spinner-border" style={{ color: "#132530" }} role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className='main-content'>
            <div className='page-content'>
                <div className='container-fluid'>
                    <PageTitle title={"User Permissions"} primary={"Dashboard"} />

                    {user && (
                        <div className="card mb-4 border-0 shadow-sm">
                            <div className="card-body p-4">
                                <div className="row g-4">
                                    {/* Profile Section */}
                                    <div className="col-md-5">
                                        <div className="d-flex flex-column align-items-center justify-content-center text-center p-3 bg-light rounded-3 h-100">
                                            {/* Profile Picture */}
                                            <div className="mb-3 position-relative">
                                                <div
                                                    className="rounded-circle d-flex align-items-center justify-content-center bg-info text-white shadow"
                                                    style={{
                                                        width: "120px",
                                                        height: "120px",
                                                        fontSize: "3rem"
                                                    }}
                                                >
                                                    {user?.business_salesmen_name?.charAt(0).toUpperCase() || <i className="bx bx-user"></i>}
                                                </div>
                                                <button
                                                    className="btn btn-sm btn-primary position-absolute bottom-0 end-0 rounded-circle"
                                                    style={{ width: "32px", height: "32px" }}
                                                >
                                                    <i className="bx bx-camera"></i>
                                                </button>
                                            </div>

                                            <div className="w-100">
                                                <h3 className="mb-2">{user?.business_salesmen_name || 'No Name'}</h3>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Permissions Section */}
                                    <div className="col-md-7">
                                        <div className="card shadow-none h-100 border">
                                            <div className="card-header bg-transparent border-0 pb-0">
                                                <div className="d-flex justify-content-between align-items-center">
                                                    <h4 className="mb-0">
                                                        <i className="bx bx-shield-alt me-2"></i>
                                                        Permissions
                                                    </h4>
                                                    <span className="badge bg-primary rounded-pill px-3 py-2">
                                                        {selectedPermissions.length} of {routes.length} enabled
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="card-body">
                                                {selectedPermissions.length === 0 ? (
                                                    <div className="text-center py-5">
                                                        <i className="bx bx-lock-open-alt display-4 text-muted mb-3"></i>
                                                        <h5 className="text-muted">No permissions assigned</h5>
                                                        <p className="text-muted">This user has restricted access</p>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <div className="mb-3">
                                                            <div className="progress bg-light" style={{ height: "8px" }}>
                                                                <div
                                                                    className={`progress-bar ${((selectedPermissions.length / routes.length) * 100) === 100 ? 'bg-success' : 'bg-primary'} mt-0`}
                                                                    style={{
                                                                        width: `${(selectedPermissions.length / routes.length) * 100}%`
                                                                    }}
                                                                ></div>
                                                            </div>
                                                            <small className="text-muted">
                                                                {Math.round((selectedPermissions.length / routes.length) * 100)}% of total permissions
                                                            </small>
                                                        </div>

                                                        <div className="d-flex flex-wrap gap-2 mb-3">
                                                            {selectedPermissions.slice(0, 12).map(id => {
                                                                const perm = routes.find(p => p.salesman_privilage_id === id);
                                                                return perm ? (
                                                                    <span
                                                                        key={id}
                                                                        className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 rounded-pill px-3 py-2"
                                                                    >
                                                                        <i className="bx bx-check-circle me-1"></i>
                                                                        {perm.salesman_privilege_name}
                                                                    </span>
                                                                ) : null;
                                                            })}
                                                        </div>

                                                        {selectedPermissions.length > 12 && (
                                                            <div className="text-center">
                                                                <button
                                                                    className="btn btn-sm btn-link text-primary"
                                                                    onClick={() => setShowAllPermissions(!showAllPermissions)}
                                                                >
                                                                    {showAllPermissions ? 'Show Less' : `Show All (${selectedPermissions.length})`}
                                                                    <i className={`bx bx-chevron-${showAllPermissions ? 'up' : 'down'} ms-1`}></i>
                                                                </button>
                                                            </div>
                                                        )}

                                                        {showAllPermissions && (
                                                            <div className="mt-3">
                                                                <h6 className="mb-3">Full Permission List</h6>
                                                                <div className="row g-2">
                                                                    {selectedPermissions.map(id => {
                                                                        const perm = routes.find(p => p.salesman_privilage_id === id);
                                                                        return perm ? (
                                                                            <div className="col-md-6" key={id}>
                                                                                <div className="p-2 bg-light rounded d-flex align-items-center">
                                                                                    <i className="bx bx-check text-success me-2"></i>
                                                                                    <small>{perm.salesman_privilege_name}</small>
                                                                                </div>
                                                                            </div>
                                                                        ) : null;
                                                                    })}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="card">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <h4>Manage Permissions</h4>
                                <div className="search-box" style={{ width: '300px' }}>
                                    <div className="position-relative">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Search permissions..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                        <i className="bx bx-search-alt search-icon"></i>
                                    </div>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-md-12">
                                    {Object.entries(filteredRoutes).map(([category, permissions]) => (
                                        <div key={category} className="mb-4">
                                            <div className="d-flex justify-content-between align-items-center mb-2">
                                                <h5 className="mb-0 text-capitalize">
                                                    <i className={`${HeadingIcon(category.replace(/([A-Z])/g, ' $1').trim())}`}></i> {category.replace(/([A-Z])/g, ' $1').trim()} Permissions
                                                </h5>
                                                <button
                                                    className="btn btn-sm btn-outline-primary"
                                                    onClick={() => toggleCategory(category, permissions)}
                                                >
                                                    {permissions.every(p => selectedPermissions.includes(p.salesman_privilage_id))
                                                        ? 'Deselect All'
                                                        : 'Select All'}
                                                </button>
                                            </div>
                                            <div className="row">
                                                {permissions.map(route => (
                                                    <div key={route.salesman_privilage_id} className="col-md-4 mb-3">
                                                        <div className="form-check">
                                                            <input
                                                                className="form-check-input"
                                                                type="checkbox"
                                                                id={`perm-${route.salesman_privilage_id}`}
                                                                checked={selectedPermissions.includes(route.salesman_privilage_id)}
                                                                onChange={() => togglePermission(route.salesman_privilage_id)}
                                                            />
                                                            <label
                                                                className="form-check-label"
                                                                htmlFor={`perm-${route.salesman_privilage_id}`}
                                                            >
                                                                {route.salesman_privilege_name}
                                                                <small className="d-block text-muted">
                                                                    {route.salesman_description}
                                                                </small>
                                                            </label>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="text-end mt-4">
                                <button
                                    className="btn btn-primary me-2"
                                    onClick={savePermissions}
                                    disabled={saveLoading}
                                >
                                    {saveLoading ? 'Saving...' : 'Save Permissions'}
                                </button>
                                <button className="btn btn-secondary" onClick={() => navigate(-1)}>Cancel</button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default UserPermissions;
