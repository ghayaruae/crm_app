const statusStyles = {
    "0": 'bg-warning-subtle text-warning',
    "1": 'bg-info-subtle text-info',
    "2": 'bg-primary-subtle text-primary',
    "3": 'bg-secondary-subtle text-secondary',
    "4": 'bg-info-subtle text-info',
    "5": 'bg-success-subtle text-success',
    "6": 'bg-danger-subtle text-danger',
    "7": 'bg-warning-subtle text-warning',
    "8": 'bg-info-subtle text-info',
    "9": 'bg-success-subtle text-success',
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
];

export const GetStatusBadge = (status) => {

    const statusStr = status.toString();
    const statusOption = statusOptions.find(opt => opt.value === statusStr);

    const badgeClass = statusStyles[statusStr] || 'bg-secondary-subtle text-secondary';
    const statusText = statusOption ? statusOption.label : 'Unknown';

    return <span className={`badge ${badgeClass}`}>{statusText}</span>;
};