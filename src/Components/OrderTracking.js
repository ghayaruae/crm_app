// import React from 'react';
// import dayjs from 'dayjs';

// const statusIcons = {
//   "0": "ri-time-line",
//   "1": "ri-user-add-line",
//   "2": "ri-check-line",
//   "3": "mdi mdi-gift-outline",
//   "4": "ri-truck-line",
//   "5": "ri-check-double-line",
//   "6": "ri-close-line",
//   "7": "ri-loop-left-line",
//   "8": "ri-inbox-unarchive-line",
//   "9": "ri-inbox-archive-line",
// };

// const OrderTracking = ({ orderTimeLineDate }) => {
//   return (
//     <div className="card">
//       <div className="card-header">
//         <div className="d-sm-flex align-items-center">
//           <h5 className="card-title flex-grow-1 mb-0">Order Time Line / Logs</h5>
//         </div>
//       </div>
//       <div className="card-body">
//         <div className="profile-timeline">
//           <div className="accordion accordion-flush" id="accordionFlushExample">
//             {orderTimeLineDate?.map((item, index) => (
//               <div className="accordion-item border-0" key={item.business_order_timeline_id}>
//                 <div className="accordion-header" id={`heading${index}`}>
//                   <a
//                     className={`accordion-button p-2 shadow-none ${index !== 0 ? 'collapsed' : ''}`}
//                     data-bs-toggle="collapse"
//                     href={`#collapse${index}`}
//                     aria-expanded={index === 0 ? "true" : "false"}
//                     aria-controls={`collapse${index}`}
//                   >
//                     <div className="d-flex align-items-center">
//                       <div className="flex-shrink-0 avatar-xs">
//                         <div className="avatar-title bg-success text-white rounded-circle">
//                           <i className={statusIcons[item.business_order_status] || "ri-time-line"} />
//                         </div>
//                       </div>
//                       <div className="flex-grow-1 ms-3">
//                         <h6 className="fs-15 mb-0 fw-semibold">
//                           {item.business_order_status_label} -
//                           <span className="fw-normal"> {dayjs(item.business_order_timeline_datetime).format("ddd, DD MMM YYYY - hh:mm A")}</span>
//                         </h6>
//                       </div>
//                     </div>
//                   </a>
//                 </div>
//                 <div
//                   id={`collapse${index}`}
//                   className={`accordion-collapse collapse ${index === 0 ? 'show' : ''}`}
//                   aria-labelledby={`heading${index}`}
//                   data-bs-parent="#accordionFlushExample"
//                 >
//                   <div className="accordion-body ms-2 ps-5 pt-0">
//                     <p className="text-muted mb-2">
//                       Order has been : <strong>{item.business_order_status_label || 'Unknown'}</strong>
//                     </p>
//                     <p className="text-muted mb-2">Remark : {item.business_order_status_text || 'No additional notes.'}</p>
//                     <p className="text-muted mb-2">
//                       Action by: <strong>{item.action_by_name || 'Unknown'}</strong>
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//           {/*end accordion*/}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default OrderTracking;




import React, { useState } from 'react';
import dayjs from 'dayjs';

const statusIcons = {
  "0": "ri-time-line",
  "1": "ri-user-add-line",
  "2": "ri-check-line",
  "3": "mdi mdi-gift-outline",
  "4": "ri-truck-line",
  "5": "ri-check-double-line",
  "6": "ri-close-line",
  "7": "ri-loop-left-line",
  "8": "ri-inbox-unarchive-line",
  "9": "ri-inbox-archive-line",
};

const OrderTracking = ({ orderTimeLineDate }) => {
  const lastIndex = orderTimeLineDate?.length - 1;
  const [expandedIndex, setExpandedIndex] = useState(lastIndex);

  const toggleAccordion = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className="card">
      <div className="card-header">
        <div className="d-sm-flex align-items-center">
          <h5 className="card-title flex-grow-1 mb-0">Order Time Line / Logs</h5>
        </div>
      </div>
      <div className="card-body">
        <div className="profile-timeline">
          <div className="accordion accordion-flush" id="accordionFlushExample">
            {orderTimeLineDate?.map((item, index) => {
              const isExpanded = expandedIndex === index;
              return (
                <div className="accordion-item border-0" key={item.business_order_timeline_id}>
                  <div className="accordion-header" id={`heading${index}`}>
                    <a
                      className={`accordion-button p-2 shadow-none ${!isExpanded ? 'collapsed' : ''}`}
                      data-bs-toggle="collapse"
                      href={`#collapse${index}`}
                      aria-expanded={isExpanded ? "true" : "false"}
                      aria-controls={`collapse${index}`}
                      onClick={() => toggleAccordion(index)}
                    >
                      <div className="d-flex align-items-center w-100 justify-content-between">
                        <div className="d-flex align-items-center">
                          <div className="flex-shrink-0 avatar-xs">
                            <div className="avatar-title bg-success text-white rounded-circle">
                              <i className={statusIcons[item.business_order_status] || "ri-time-line"} />
                            </div>
                          </div>
                          <div className="flex-grow-1 ms-3">
                            <h6 className="fs-15 mb-0 fw-semibold">
                              {item.business_order_status_label} -
                              <span className="fw-normal">
                                {" "}
                                {dayjs(item.business_order_timeline_datetime).format("ddd, DD MMM YYYY - hh:mm A")}
                              </span>
                            </h6>
                          </div>
                        </div>
                        {/* Arrow Icon */}
                        <div className="ms-2">
                          <i className={isExpanded ? "ri-arrow-up-s-line" : "ri-arrow-down-s-line"} />
                        </div>
                      </div>
                    </a>
                  </div>
                  <div
                    id={`collapse${index}`}
                    className={`accordion-collapse collapse ${isExpanded ? 'show' : ''}`}
                    aria-labelledby={`heading${index}`}
                    data-bs-parent="#accordionFlushExample"
                  >
                    <div className="accordion-body ms-2 ps-5 pt-0">
                      <p className="text-muted mb-2">
                        Order has been : <strong>{item.business_order_status_label || 'Unknown'}</strong>
                      </p>
                      <p className="text-muted mb-2">Remark : {item.business_order_status_text || 'No additional notes.'}</p>
                      <p className="text-muted mb-2">
                        Action by: <strong>{item.action_by_name || 'Unknown'}</strong>
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;
