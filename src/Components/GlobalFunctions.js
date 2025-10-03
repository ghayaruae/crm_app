export function TimeFormater(datetimeString) {
    if (!datetimeString) {
        return "";
    }
    var timeString = datetimeString?.split(' ')[1];
    if (timeString) {
        var timeComponents = timeString?.split(':');
        var hours = parseInt(timeComponents[0]);
        var minutes = parseInt(timeComponents[1]);
        var meridiem = (hours < 12) ? 'AM' : 'PM';
        hours = (hours % 12 === 0) ? 12 : hours % 12;
        if (minutes < 10) {
            minutes = '0' + minutes;
        }
        var formattedTime = hours + ':' + minutes + ' ' + meridiem;
        return formattedTime;
    }
    else {
        timeString = datetimeString?.split('T')[1];
        var timeComponents = timeString?.split(':');
        var hours = parseInt(timeComponents[0]);
        var minutes = parseInt(timeComponents[1]);
        var meridiem = (hours < 12) ? 'AM' : 'PM';
        hours = (hours % 12 === 0) ? 12 : hours % 12;
        if (minutes < 10) {
            minutes = '0' + minutes;
        }
        var formattedTime = hours + ':' + minutes + ' ' + meridiem;
        return formattedTime;
    }
}


export function DateFormater(GettedDate) {
    if (!GettedDate) {
        return null;
    }

    const date = new Date(GettedDate);
    if (isNaN(date.getTime())) {
        return null;
    }

    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    return `${day.toString().padStart(2, '0')}-${month.toString().padStart(2, '0')}-${year}`;
}


export function formatNumber(num) {
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'k';
    } else {
        return num;
    }
}

export const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`; // Format: Y-m-d
};

export const calculateDuration = (startDateTime, endDateTime) => {
    if (!startDateTime || !endDateTime) return null;
    const startDate = new Date(startDateTime);
    const endDate = new Date(endDateTime);

    if (isNaN(startDate) || isNaN(endDate)) return 'Invalid date format';

    const diffInMs = endDate - startDate;

    if (diffInMs < 0) return 'End date cannot be before start date';

    const totalSeconds = Math.floor(diffInMs / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    let result = '';

    if (hours > 0) {
        result += `${hours}h `;
    }

    if (minutes > 0 || hours > 0) {
        result += `${minutes}m`;
    } else if (seconds > 0) {
        result += `${seconds}s`;
    } else {
        result = '0m';
    }

    return result.trim();
}

export const calculateWastage = (totalQty, wastagePercentage) => {
    const parseQuantity = (value) => {
        if (typeof value === 'string') {
            const match = value.match(/(\d+(\.\d+)?)/);
            return match ? parseFloat(match[1]) : 0;
        }
        return Number(value) || 0;
    };

    const total = parseQuantity(totalQty);
    const wastagePercent = parseQuantity(wastagePercentage);

    if (total === 0) return 0;

    const wastageQuantity = (total * wastagePercent) / 100;
    return Math.round(wastageQuantity * 100) / 100;
}

export const calculateTax = (amount, taxRate, isInterState = false) => {
  const taxAmount = (amount * taxRate) / 100;
  
  if (isInterState) {
    return {
      igst: taxAmount,
      cgst: 0,
      sgst: 0,
      total: amount + taxAmount
    };
  } else {
    const halfRate = taxRate / 2;
    const halfAmount = taxAmount / 2;
    
    return {
      igst: 0,
      cgst: halfAmount,
      sgst: halfAmount,
      total: amount + taxAmount
    };
  }
};