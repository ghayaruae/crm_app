import { useContext, useEffect, useState } from 'react'
import PageTitle from '../../../Components/PageTitle'
import { useNavigate, useParams } from 'react-router-dom'
import { ConfigContext } from '../../../Context/ConfigContext';
import axios from 'axios';
import Swal from "sweetalert2"

const UserPermissions = () => {
    const { business_salesman_id } = useParams();
    const { apiURL, apiHeaderJson, primaryColor } = useContext(ConfigContext);

    const [routes, setRoutes] = useState([]);
    const [user, setUser] = useState(null);
    const [selectedPermissions, setSelectedPermissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saveLoading, setSaveLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [groupedRoutes, setGroupedRoutes] = useState({});
    const [expandedCategories, setExpandedCategories] = useState({});
    const navigate = useNavigate();

    const categoryConfig = {
        'Dashboard': ['dashboard', 'maindashboard'],
        'Business': ['business', 'allbusinesses', 'businessdetails'],
        'Orders': ['orders', 'orderinfo', 'vieworderinvoice'],
        'Customer': ['customer', 'customerdashboard', 'customerinfo', 'customerdocument', 'customerbrands', 'customerorders', 'customerrequest'],
        'Reports': ['reports', 'salesmanorders', 'targetreport', 'followupreport', 'fullordersreport', 'allbusinessesreport', 'allsalesmanreport', 'orderbystatusreport'],
        'Masters': ['masters', 'managetarget', 'managefollowup', 'followuplist', 'manageusers', 'userpermissions']
    };

    const GetUserPrivilageList = async () => {
        try {
            const headers = apiHeaderJson;
            const response = await axios.get(`${apiURL}Users/GetSalesmanPrivilageList`, { headers })

            if (response?.data?.success) {
                const data = response?.data?.data;
                setRoutes(data);

                const grouped = {};
                data.forEach(route => {
                    let category = 'General';
                    const description = route.salesman_description?.toLowerCase() || '';
                    const privilegeName = route.salesman_privilege_name?.toLowerCase() || '';

                    for (const [cat, keywords] of Object.entries(categoryConfig)) {
                        if (keywords.some(keyword =>
                            description.includes(keyword) || privilegeName.includes(keyword)
                        )) {
                            category = cat;
                            break;
                        }
                    }

                    if (!grouped[category]) {
                        grouped[category] = [];
                    }
                    grouped[category].push(route);
                });

                setGroupedRoutes(grouped);

                const expanded = {};
                Object.keys(grouped).forEach(cat => {
                    expanded[cat] = true;
                });
                setExpandedCategories(expanded);
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
            const response = await axios.get(`${apiURL}Users/GetSalesmanPrivillageInfo`, {
                params: { business_salesman_id },
                headers
            })

            if (response?.data?.success) {
                const data = response?.data;
                setUser(data?.data[0])

                if (data?.permissions.length > 0) {
                    const user_permissions = data?.permissions?.map(permission =>
                        Number(permission.salesman_privilage_id)
                    );
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
            Swal.fire({
                title: "Error!",
                text: "Failed to update permissions.",
                icon: "error",
                confirmButtonText: "OK"
            });
        } finally {
            setSaveLoading(false);
        }
    };

    const togglePermission = (permissionId) => {
        setSelectedPermissions(prev => {
            if (prev.includes(permissionId)) {
                return prev.filter(id => id !== permissionId);
            } else {
                return [...prev, permissionId];
            }
        });
    };

    const toggleCategory = (permissions) => {
        const allSelected = permissions.every(p =>
            selectedPermissions.includes(p.salesman_privilage_id)
        );

        setSelectedPermissions(prev => {
            if (allSelected) {
                return prev.filter(id =>
                    !permissions.some(p => p.salesman_privilage_id === id)
                );
            } else {
                const newPermissions = permissions
                    .map(p => p.salesman_privilage_id)
                    .filter(id => !prev.includes(id));
                return [...prev, ...newPermissions];
            }
        });
    };

    const toggleCategoryExpand = (category) => {
        setExpandedCategories(prev => ({
            ...prev,
            [category]: !prev[category]
        }));
    };

    const selectAllPermissions = () => {
        const allPermissionIds = routes.map(route => route.salesman_privilage_id);
        setSelectedPermissions(allPermissionIds);
    };

    const clearAllPermissions = () => {
        setSelectedPermissions([]);
    };

    const getCategoryIcon = (category) => {
        const icons = {
            'Dashboard': 'bx bx-home',
            'Business': 'bx bx-building',
            'Orders': 'bx bx-cart',
            'Customer': 'bx bx-user',
            'Reports': 'bx bx-bar-chart',
            'Masters': 'bx bx-cog',
            'General': 'bx bx-folder'
        };
        return icons[category] || 'bx bx-folder';
    };

    const filteredRoutes = Object.entries(groupedRoutes).reduce((acc, [category, permissions]) => {
        const filtered = permissions.filter(route =>
            route.salesman_privilege_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            route.salesman_description?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        if (filtered.length > 0) {
            acc[category] = filtered;
        }
        return acc;
    }, {});

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
                    <PageTitle title={"Salesman Permissions"} primary={"Dashboard/Salesman"} />

                    {user && (
                        <div className="card mb-4 border-0 shadow-sm">
                            <div className="card-body p-4">
                                <div className="row g-4 align-items-center">
                                    <div className="col-md-8">
                                        <div className="d-flex align-items-center">
                                            <div className="flex-shrink-0">
                                                <div
                                                    className="rounded-circle d-flex align-items-center justify-content-center text-white shadow overflow-hidden"
                                                    style={{
                                                        backgroundColor: primaryColor,
                                                        width: "80px",
                                                        height: "80px",
                                                        fontSize: "2rem",
                                                        fontWeight: "600"
                                                    }}
                                                >
                                                    {user?.business_salesman_image ? (
                                                        <img
                                                            src={`${apiURL}public/salesmans/${user.business_salesman_image}`}
                                                            alt="Profile"
                                                            style={{
                                                                width: "100%",
                                                                height: "100%",
                                                                objectFit: "cover"
                                                            }}
                                                        />
                                                    ) : (
                                                        user?.business_salesmen_name?.charAt(0).toUpperCase() || "U"
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex-grow-1 ms-3">
                                                <h4 className="mb-1">{user?.business_salesmen_name || 'No Name'}</h4>
                                                <p className="text-muted mb-2">{user?.business_salesman_email || 'No Email'}</p>
                                                <div className="d-flex align-items-center">
                                                    <div className="me-4">
                                                        <small className="text-muted">Total Permissions</small>
                                                        <h6 className="mb-0">{routes.length}</h6>
                                                    </div>
                                                    <div className="me-4">
                                                        <small className="text-muted">Enabled</small>
                                                        <h6 className="mb-0 text-success">{selectedPermissions.length}</h6>
                                                    </div>
                                                    <div>
                                                        <small className="text-muted">Disabled</small>
                                                        <h6 className="mb-0 text-danger">{routes.length - selectedPermissions.length}</h6>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="text-center">
                                            <div className="mb-3">
                                                <div className="progress bg-light" style={{ height: "12px", borderRadius: "6px" }}>
                                                    <div
                                                        className={`progress-bar ${((selectedPermissions.length / routes.length) * 100) === 100 ? 'bg-success' : 'bg-primary'}`}
                                                        style={{
                                                            width: `${(selectedPermissions.length / routes.length) * 100}%`
                                                        }}
                                                    ></div>
                                                </div>
                                                <small className="text-muted">
                                                    {Math.round((selectedPermissions.length / routes.length) * 100)}% permissions enabled
                                                </small>
                                            </div>
                                            <div className="d-flex gap-2 justify-content-center">
                                                <button
                                                    className="btn btn-sm btn-outline-primary"
                                                    onClick={selectAllPermissions}
                                                >
                                                    Select All
                                                </button>
                                                <button
                                                    className="btn btn-sm btn-outline-danger"
                                                    onClick={clearAllPermissions}
                                                >
                                                    Clear All
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="card border-0 shadow-sm">
                        <div className="card-header bg-transparent border-0 py-3">
                            <div className="row align-items-center g-2">
                                <div className="col-md-8">
                                    <h4 className="mb-0">
                                        <i className="bx bx-shield-alt me-2"></i>
                                        Manage Permissions
                                    </h4>
                                </div>
                                <div className="col-md-4">
                                    <div className="search-box position-relative">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Search permissions..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                        <i className="bx bx-search search-icon"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="card-body">
                            {Object.entries(filteredRoutes).map(([category, permissions]) => (
                                <div key={category} className="category-section mb-4">
                                    <div className="category-header bg-light rounded p-3 mb-3">
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div className="d-flex align-items-center">
                                                <i className={`${getCategoryIcon(category)} me-2 fs-5`} style={{ color: primaryColor }}></i>
                                                <h5 className="mb-0 text-capitalize">{category}</h5>
                                                <span className="badge bg-primary ms-2">
                                                    {permissions.length} {permissions.length === 1 ? 'permission' : 'permissions'}
                                                </span>
                                            </div>
                                            <div className="d-flex align-items-center gap-2">
                                                <button
                                                    className="btn btn-sm btn-outline-primary"
                                                    onClick={() => toggleCategory(category, permissions)}
                                                >
                                                    {permissions.every(p => selectedPermissions.includes(p.salesman_privilage_id))
                                                        ? 'Deselect All'
                                                        : 'Select All'}
                                                </button>
                                                <button
                                                    className="btn btn-sm btn-light"
                                                    onClick={() => toggleCategoryExpand(category)}
                                                >
                                                    <i className={`bx bx-chevron-${expandedCategories[category] ? 'up' : 'down'}`}></i>
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {expandedCategories[category] && (
                                        <div className="row g-3">
                                            {permissions.map(route => (
                                                <div key={route.salesman_privilage_id} className="col-xl-4 col-lg-6">
                                                    <div className={`permission-card card border h-100 ${selectedPermissions.includes(route.salesman_privilage_id) ? 'border-none bg-dark-subtle bg-opacity-5' : ''}`}>
                                                        <div className="card-body p-3">
                                                            <div className="d-flex align-items-start">
                                                                <div className="flex-shrink-0 mt-1">
                                                                    <div className="form-check">
                                                                        <input
                                                                            className="form-check-input"
                                                                            type="checkbox"
                                                                            id={`perm-${route.salesman_privilage_id}`}
                                                                            checked={selectedPermissions.includes(route.salesman_privilage_id)}
                                                                            onChange={() => togglePermission(route.salesman_privilage_id)}
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <div className="flex-grow-1 ms-3">
                                                                    <label
                                                                        className="form-check-label fw-medium mb-1 cursor-pointer"
                                                                        htmlFor={`perm-${route.salesman_privilage_id}`}
                                                                    >
                                                                        {route.salesman_privilege_name}
                                                                    </label>
                                                                    {route.salesman_description && (
                                                                        <p className="text-muted small mb-0">
                                                                            {route.salesman_description}
                                                                        </p>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}

                            {Object.keys(filteredRoutes).length === 0 && (
                                <div className="text-center py-5">
                                    <i className="bx bx-search-alt display-4 text-muted mb-3"></i>
                                    <h5 className="text-muted">No permissions found</h5>
                                    <p className="text-muted">Try adjusting your search terms</p>
                                </div>
                            )}
                        </div>
                        <div className="card-footer bg-transparent border-0 py-3">
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <span className="text-muted">
                                        {selectedPermissions.length} of {routes.length} permissions selected
                                    </span>
                                </div>
                                <div className="d-flex gap-2">
                                    <button
                                        className="btn btn-secondary btn-label"
                                        onClick={() => navigate(-1)}
                                    >
                                        <i className="bx bx-arrow-back label-icon"></i>
                                        Back
                                    </button>
                                    <button
                                        className="btn btn-primary btn-label"
                                        onClick={savePermissions}
                                        disabled={saveLoading}
                                    >
                                        {saveLoading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                                Saving...
                                            </>
                                        ) : (
                                            <>
                                                <i className="bx bx-save label-icon"></i>
                                                Save Permissions
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserPermissions;