import React, { useContext, useEffect, useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { ConfigContext } from "../Context/ConfigContext";
import axios from "axios";

const Header = () => {
  const { user_id, apiHeaderJson, apiURL } = useContext(ConfigContext)

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_id");
    window.location.href = "/";
  };

  const menuItems = [
    {
      id: "dashboard",
      path: "/",
      icon: "ri-dashboard-2-fill",
      label: "Dashboard",
      isDropdown: false,
    },
    // {
    //   id: "accounts",
    //   icon: "ri-wallet-3-fill",
    //   label: "Accounts",
    //   isDropdown: true,
    //   dropdownId: "sidebarAccounts",
    //   items: [
    //     {
    //       id: "accountsMasters",
    //       label: "Masters",
    //       isDropdown: true,
    //       dropdownId: "sidebarAccountsMasters",
    //       items: [
    //         {
    //           id: "accountsLedger",
    //           label: "Ledger",
    //           isDropdown: true,
    //           dropdownId: "sidebarLedger",
    //           items: [
    //             {
    //               id: "manageLedger",
    //               path: "/Accounts/Masters/ManageLedger",
    //               label: "Manage Ledger",
    //               isDropdown: false,
    //             },
    //             {
    //               id: "ledgerList",
    //               path: "/Accounts/Masters/LedgerList",
    //               label: "Ledger List",
    //               isDropdown: false,
    //             },
    //           ],
    //         },
    //       ]
    //     },
    //   ],
    // },
  ];

  const renderMenuItems = (items) => {
    return items.map((item, index) => {
      if (item.isDropdown) {
        return (
          <li className="nav-item" key={`${item.id || item.label}-${index}`}>
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
          <li className="nav-item" key={`${item.id || item.label}-${index}`}>
            <NavLink to={item.path} className="nav-link">
              {item.label}
            </NavLink>
          </li>
        );
      }
    });
  };

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
                    <img alt="" height={72} />
                  </span>
                  <span className="logo-lg">
                    <img
                      src="https://admin.stoneskill.com/assets/logo/2.png"
                      alt=""
                      height={80}
                    />
                    <img alt="" height={100} />
                  </span>
                </NavLink>
                <NavLink to="/" className="logo logo-light">
                  <span className="logo-sm">
                    <img alt="" height={22} />
                  </span>
                  <span className="logo-lg">
                    <img
                      src="https://admin.stoneskill.com/assets/logo/2.png"
                      alt=""
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
                      src="https://admin.stoneskill.com/assets/logo/download.png"
                      alt="Header Avatar"
                    />
                    <span className="text-start ms-xl-2">
                      <span className="d-xl-infill-block ms-1 fw-medium user-name-text">
                        {/* {data.user_name || "No user found!"} */}
                        Admin
                      </span>
                      <span className="d-none d-xl-block ms-1 fs-12 user-name-sub-text">
                        {/* Founder */}
                      </span>
                    </span>
                  </span>
                </button>
                <div className="dropdown-menu dropdown-menu-end">
                  <h6 className="dropdown-header">Welcome Master Admin!</h6>
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

              {menuItems.map((item) => (
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
                      >
                        <i className={item.icon} />
                        <span data-key="t-dashboards">{item.label}</span>
                      </a>
                      <div
                        className="collapse menu-dropdown"
                        id={item.dropdownId}
                      >
                        <ul className="nav nav-sm flex-column">
                          {renderMenuItems(item.items)}
                        </ul>
                      </div>
                    </>
                  ) : (
                    <NavLink className="nav-link menu-link" to={item.path}>
                      <i className={item.icon} />
                      <span data-key="t-dashboards">{item.label}</span>
                    </NavLink>
                  )}
                </li>
              ))}
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