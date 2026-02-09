import { useContext } from "react";
import { NavLink } from "react-router-dom";
import { ConfigContext } from "../Context/ConfigContext";

const Header = () => {
  const { permissions } = useContext(ConfigContext);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("business_salesman_id");
    window.location.href = "/";
  };

  const menuItems = [
    {
      id: "dashboard",
      icon: "ri-dashboard-2-fill",
      label: "Dashboard",
      isDropdown: true,
      dropdownId: "sidebarDashboard",
      items: [
        {
          id: "MainDashboard",
          icon: "ri-dashboard-2-fill",
          label: "Dashboard",
          path: "/",
          isDropdown: false,
        },
        {
          id: "SalesmanDashboard",
          icon: "ri-dashboard-2-fill",
          label: "Salesman Dashboard",
          path: "/Dashboad/SalesmanDashboard",
          isDropdown: false,
        },
      ],
    },
    {
      id: "Orders",
      icon: "ri-shopping-cart-2-fill",
      label: "Orders",
      isDropdown: true,
      dropdownId: "sidebarOrders",
      items: [
        {
          id: "SalesmanOrders",
          path: "/Reports/SalesmanOrders",
          label: "Salesman Orders Report",
          isDropdown: false,
        },
        {
          id: "FullOrdersReport",
          path: "/Reports/FullOrdersReport",
          label: "All Orders Report",
          isDropdown: false,
        }
      ],
    },
    {
      id: "Targets",
      icon: "mdi mdi-bullseye",
      label: "Targets",
      isDropdown: true,
      dropdownId: "sidebarTargets",
      items: [
        {
          id: "ManageTarget",
          path: "/Masters/ManageTarget",
          label: "Manage Target",
          isDropdown: false,
        },
        {
          id: "TargetReport",
          path: "/Reports/TargetReport",
          label: "Target Report",
          isDropdown: false,
        }
      ]
    },
    {
      id: "Followups",
      icon: "ri-phone-fill",
      label: "Followups",
      isDropdown: true,
      dropdownId: "sidebarFollowupsMenu",
      items: [
        {
          id: "ManageFollowup",
          path: "/Masters/ManageFollowup",
          label: "Manage Followup",
          isDropdown: false,
        },
        {
          id: "FollowupList",
          path: "/Masters/FollowupList",
          label: "Followup List",
          isDropdown: false,
        },
        {
          id: "FollowupReport",
          path: "/Reports/FollowupReport",
          label: "Followup Report",
          isDropdown: false,
        }
      ],
    },
    {
      id: "Business",
      icon: "ri-briefcase-4-fill",
      label: "Business",
      isDropdown: true,
      dropdownId: "sidebarBusiness",
      items: [
        {
          id: "SalesmanBusiness",
          path: "/Salesman/AllBusinesses",
          label: "Salesman Accounts List",
          isDropdown: false,
        },
        {
          id: "AllBusinessesReport",
          path: "/Reports/AllBusinessesReport",
          label: "All Accounts List",
          isDropdown: false,
        },
        {
          id: "AllSalesmanReport",
          path: "/Reports/AllSalesmanReport",
          label: "All Salesman List",
          isDropdown: false,
        }
      ],
    },
    {
      id: "Request Part Inquiry",
      icon: "mdi mdi-clipboard-text-outline fs-22",
      label: "Request Part Inquiry",
      isDropdown: true,
      dropdownId: "sidebarRequestPartInquiry",
      items: [
        {
          id: "RequestPartInquiry",
          path: "/Request/RequestPartInquiry",
          label: "Request Part Inquiry",
          isDropdown: false,
        },
        {
          id: "RequestPartInquiry",
          path: "/Request/SalesmanRequestPartList",
          label: "Part Inquiries List",
          isDropdown: false,
        },
        {
          id: "AllRequestPartInquiryList",
          path: "/Request/RequestPartInquiryList",
          label: "Part Inquiries Report",
          isDropdown: false,
        },
      ],
    },
    {
      id: "Search",
      icon: "ri-search-line fs-22",
      label: "Search Parts",
      isDropdown: true,
      dropdownId: "sidebarSearch",
      items: [
        {
          id: "SearchOEParts",
          path: "/Search/SearchOEParts",
          label: "Search OE Parts",
          isDropdown: false,
        },
        {
          id: "OEPartDetails",
          path: "/Search/OEPartDetails",
          label: "Part Details",
          isDropdown: false,
        },
      ],
    },
    {
      id: "Salesman",
      icon: "ri-user-3-line fs-22",
      label: "Salesman",
      isDropdown: true,
      dropdownId: "sidebarSalesman",
      items: [
        {
          id: "ManageSalesman",
          path: "/Masters/ManageUsers",
          label: "Manage Salesman",
          isDropdown: false,
        },
      ],
    },
  ];


  const hasPermission = (path) => {
    if (!permissions || permissions.length === 0) return false;
    return permissions.some((perm) => perm.salesman_description === path);
  };

  const hasNestedPermission = (item) => {
    if (item.path && hasPermission(item.path)) return true;
    if (item.items && item.items.length > 0) {
      return item.items.some(hasNestedPermission);
    }
    return false;
  };

  const getAllowedChildren = (item) => {
    if (!item.items) return [];
    return item.items.filter((child) => hasNestedPermission(child));
  };

  // ===================== RECURSIVE MENU RENDERER =====================
  const renderMenuItems = (items) =>
    items?.filter((item) => hasNestedPermission(item)).map((item, index) => {
      if (item.isDropdown) {
        return (
          <li className="nav-item" key={`${item.id}-${index}`}>
            <a
              className="nav-link collapsed"
              href={`#${item.dropdownId}`}
              data-bs-toggle="collapse"
              role="button"
              aria-expanded="false"
              aria-controls={item.dropdownId}
            >
              {item.label}
            </a>
            <div className="collapse menu-dropdown" id={item.dropdownId}>
              <ul className="nav nav-sm flex-column">
                {renderMenuItems(item.items)}
              </ul>
            </div>
          </li>
        );
      } else {
        return (
          <li className="nav-item" key={`${item.id}-${index}`}>
            <NavLink to={item.path} className="nav-link">
              {item.label}
            </NavLink>
          </li>
        );
      }
    });

  return (
    <div>
      <header id="page-topbar">
        <div className="layout-width">
          <div className="navbar-header">
            <div className="d-flex">
              {/* LOGO */}
              <div className="navbar-brand-box horizontal-logo">
                <NavLink to="/" className="logo logo-dark">
                  <span className="logo-sm">
                    <img alt="logo_image" height={72} />
                  </span>
                  <span className="logo-lg">
                    <img
                      src="https://admin.stoneskill.com/assets/logo/2.png"
                      alt="logo_image"
                      height={80}
                    />
                    <img alt="logo_image" height={100} />
                  </span>
                </NavLink>
                <NavLink to="/" className="logo logo-light">
                  <span className="logo-sm">
                    <img alt="logo_image" height={22} />
                  </span>
                  <span className="logo-lg">
                    <img
                      src="https://admin.stoneskill.com/assets/logo/2.png"
                      alt="logo_image"
                      height={17}
                    />
                  </span>
                </NavLink>
              </div>
              <button
                type="button"
                className="btn btn-sm px-3 fs-16 header-item vertical-menu-btn topnav-hamburger"
                id="topnav-hamburger-icon"
              >
                <span className="hamburger-icon">
                  <span />
                  <span />
                  <span />
                </span>
              </button>
            </div>
            <div className="d-flex align-items-center">
              <div className="dropdown ms-sm-3 header-item topbar-user">
                <button
                  type="button"
                  className="btn"
                  id="page-header-user-dropdown"
                  data-bs-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  <span className="d-flex align-items-center">
                    <img
                      className="rounded-circle header-profile-user"
                      src="/assets/Image.jpg"
                      alt="Header Avatar"
                    />
                    <span className="text-start ms-xl-2">
                      <span className="d-xl-infill-block ms-1 fw-medium user-name-text">
                        {/* {data.user_name || "No user found!"} */}
                        CRM
                      </span>
                      <span className="d-none d-xl-block ms-1 fs-12 user-name-sub-text">
                        {/* Founder */}
                      </span>
                    </span>
                  </span>
                </button>
                <div className="dropdown-menu dropdown-menu-end">
                  <h6 className="dropdown-header">Welcome Master CRM !</h6>
                  <div className="dropdown-divider" />
                  <NavLink
                    className="dropdown-item"
                    to="/"
                    onClick={handleLogout}
                  >
                    <i className="mdi mdi-logout text-muted fs-16 align-middle me-1" />
                    <span className="align-middle" data-key="t-logout">
                      Logout
                    </span>
                  </NavLink>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="app-menu navbar-menu">
        {/* LOGO */}
        <div className="navbar-brand-box">
          <NavLink to="/" className="logo logo-dark">
            <span className="logo-sm">
              <img src="/assets/images/main-logo.png" alt height={22} />
            </span>
            <span className="logo-lg">
              <img src="/assets/images/main-logo.png" alt height={17} />
            </span>
          </NavLink>
          <NavLink to="/" className="logo logo-light">
            <span className="logo-sm">
              <img src="/assets/images/main-logo.png" alt height={22} />
            </span>
            <span className="logo-lg">
              <img src="/assets/images/main-logo.png" alt height={50} />
            </span>
          </NavLink>
          <button
            type="button"
            className="btn btn-sm p-0 fs-20 header-item float-end btn-vertical-sm-hover"
            id="vertical-hover"
          >
            <i className="ri-record-circle-fill" />
          </button>
        </div>

        <div id="scrollbar">
          <div className="container-fluid">
            <div id="two-column-menu"></div>

            <ul className="navbar-nav" id="navbar-nav">

              <li className="menu-title">
                <span data-key="t-menu">Menu</span>
              </li>

              {menuItems
                .filter((item) => hasNestedPermission(item))
                .map((item) => {
                  const allowedChildren = getAllowedChildren(item);

                  // 🔥 RULE: If dropdown has only 1 permitted child -> direct open
                  if (item.isDropdown && allowedChildren.length === 1) {
                    const onlyChild = allowedChildren[0];

                    return (
                      <li className="nav-item" key={item.id}>
                        <NavLink
                          className="nav-link menu-link"
                          to={onlyChild.path}
                          title={onlyChild.label}
                        >
                          <i className={item.icon}></i>
                          <span>{onlyChild.label}</span>
                        </NavLink>
                      </li>
                    );
                  }

                  // NORMAL DROPDOWN (2+ children)
                  return (
                    <li className="nav-item" key={item.id}>
                      {item.isDropdown ? (
                        <>
                          <a
                            className="nav-link menu-link"
                            href={`#${item.dropdownId}`}
                            data-bs-toggle="collapse"
                            role="button"
                            aria-expanded="false"
                            aria-controls={item.dropdownId}
                            title={item.label}
                          >
                            <i className={item.icon} />
                            <span>{item.label}</span>
                          </a>

                          <div className="collapse menu-dropdown" id={item.dropdownId}>
                            <ul className="nav nav-sm flex-column">
                              {renderMenuItems(item.items)}
                            </ul>
                          </div>
                        </>
                      ) : (
                        <NavLink
                          className="nav-link menu-link"
                          to={item.path}
                          title={item.label}
                        >
                          <i className={item.icon} />
                          <span>{item.label}</span>
                        </NavLink>
                      )}
                    </li>
                  );
                })}
            </ul>


          </div>
        </div>
        {/* Sidebar */}
        <div className="sidebar-background"></div>
        <div className="removeNotificationModal" id="removeNotificationModal" />
      </div>
      <div
        className="vertical-overlay"
        onClick={() => {
          document.body.classList.remove("vertical-sidebar-enable");
          document.body.classList.remove("twocolumn-panel");
        }}
      />
    </div>
  );
};

export default Header;