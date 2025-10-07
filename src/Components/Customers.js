import React, { useContext, useEffect, useState } from 'react'
import { ConfigContext } from '../Context/ConfigContext'
import axios from 'axios'
import Swal from "sweetalert2"
import { DateFormater, TimeFormater } from './GlobalFunctions'
import { Link } from 'react-router-dom'

const Customers = ({ orderAddress }) => {

  return (
    <>
      <div className="card">
        <div className="card-header">
          <div className="d-flex">
            <h5 className="card-title flex-grow-1 mb-0">
              Customer Details
            </h5>
            <Link to={`/CustomerDashboard/${orderAddress?.business_id}`} target="_blank">
              View Business
            </Link>
          </div>
        </div>
        <div className="card-body">
          <ul className="list-unstyled mb-0 vstack gap-3">
            <li>
              <div className="d-flex align-items-center">
                <div className="flex-shrink-0">
                  <img
                    src="https://cirrusindia.co.in/wp-content/uploads/2016/10/dummy-profile-pic-male1.jpg"
                    alt className="avatar-sm rounded"
                  />
                </div>
                <div className="flex-grow-1 ms-3">
                  <h6 className="fs-14 mb-1">{orderAddress?.first_name} {orderAddress?.last_name}</h6>
                  <p className="text-muted mb-0">Customer</p>
                </div>
              </div>
            </li>
            <li>
              <i className="ri-mail-line me-2 align-middle text-muted fs-16" />{orderAddress?.contact_email}
            </li>
            <li>
              <i className="ri-phone-line me-2 align-middle text-muted fs-16" />{orderAddress?.mobile_number_1}
            </li>
          </ul>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h5 className="card-title mb-0">
            <i className="ri-map-pin-line align-middle me-1 text-muted" />
            Shipping Address
          </h5>
        </div>
        <div className="card-body">
          <ul className="list-unstyled vstack gap-2 fs-13 mb-0">
            <li className="fw-medium fs-14">{orderAddress?.first_name} {orderAddress?.last_name}</li>
            <li>{orderAddress?.mobile_number_1}</li>
            <li>{orderAddress?.business_full_address}</li>
            <li>{orderAddress?.business_city} - {orderAddress?.pincode}</li>
            <li>{orderAddress?.country}</li>
          </ul>
        </div>
      </div>
    </>
  )
}

export default Customers
