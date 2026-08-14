const statusStyles = {
    "0": "bg-warning-subtle text-warning",       // Pending
    "1": "bg-info-subtle text-info",             // Assigned
    "2": "bg-primary-subtle text-primary",       // Accepted
    "3": "bg-secondary-subtle text-secondary",   // Packed
    "4": "bg-info-subtle text-info",             // Shipped
    "5": "bg-success-subtle text-success",       // Delivered
    "6": "bg-danger-subtle text-danger",         // Cancelled
    "7": "bg-warning-subtle text-warning",       // Returned
    "8": "bg-info-subtle text-info",             // Returned Collected
    "9": "bg-success-subtle text-success",       // Returned Received
    "10": "bg-primary-subtle text-primary",      // Partly Accept
    "11": "bg-danger-subtle text-danger",        // Partly Cancelled
    "12": "bg-secondary-subtle text-secondary",  // Partly Packed
    "13": "bg-dark-subtle text-dark",             // Out for Delivery
    "14": "bg-secondary-subtle text-secondary",   // Packed To Central Hub
    "15": "bg-secondary-subtle text-secondary",   // Out For Delivery To Central Hub
    "16": "bg-secondary-subtle text-secondary",   // Delivered To Central Hub
};

const statusOptions = [
    { value: "0", label: "Pending" },
    { value: "1", label: "Assigned" },
    { value: "2", label: "Accepted" },
    { value: "3", label: "Packed" },
    { value: "4", label: "Shipped" },
    { value: "5", label: "Delivered" },
    { value: "6", label: "Cancelled" },
    { value: "7", label: "Returned" },
    { value: "8", label: "Returned Collected" },
    { value: "9", label: "Returned Received" },
    { value: "10", label: "Partially Accept" },
    { value: "11", label: "Partially Cancelled" },
    { value: "12", label: "Partially Packed" },
    { value: "13", label: "Out for Delivery" },
    { value: "14", label: "Packed To Central Hub" },
    { value: "15", label: "Out For Delivery To Central Hub" },
    { value: "16", label: "Delivered To Central Hub" },
];

export const GetStatusBadge = (status) => {
    const statusStr = status?.toString();

    const statusOption = statusOptions.find(
        opt => opt.value === statusStr
    );

    const badgeClass =
        statusStyles[statusStr] || "bg-secondary-subtle text-secondary";

    const statusText =
        statusOption ? statusOption.label : "Unknown";

    return (
        <span className={`badge ${badgeClass}`}>
            {statusText}
        </span>
    );
};