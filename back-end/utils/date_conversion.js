const parseDate = (dateString, mode) => {
    if (mode == 1) {
        if (!/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/.test(dateString)) return null; // Validate format
       // 2022-01-0100:23
        console.log('hiiii');
        const year = parseInt(dateString.slice(0, 4), 10);
        const month = parseInt(dateString.slice(5, 7), 10) - 1; // Months are 0-indexed
        const day = parseInt(dateString.slice(8, 10), 10);
        const hour = parseInt(dateString.slice(11, 13), 10);
        const min = parseInt(dateString.slice(14, 16), 10);
    
        return new Date(year, month, day, hour, min);
    }

    else{
        console.log('test');
    if (!/^\d{8}$/.test(dateString)) return null; // Ensure it's an 8-digit number
    const year = parseInt(dateString.slice(0, 4), 10);
    const month = parseInt(dateString.slice(4, 6), 10) - 1; // Months are 0-indexed
    const day = parseInt(dateString.slice(6, 8), 10);
    return new Date(year, month, day, 0, 0);
    }
};

const formatDate = (date,db) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Adjust for zero-indexed months
    const year = date.getFullYear();
    if (db) return `${year}-${month}-${day}`;
    return `${day}/${month}/${year}`;
};

const calculateDatePeriod = (fromDate, toDate) => {
    fromDate = parseDate(fromDate);
    toDate = parseDate(toDate);

    if (isNaN(fromDate) || isNaN(toDate) || fromDate > toDate)
        throw new Error();

    const formattedDateFrom = fromDate.toISOString().slice(0, 19).replace('T', ' ');
    const formattedDateTo = toDate.toISOString().slice(0, 19).replace('T', ' ');

    return { fromDate: formattedDateFrom, toDate: formattedDateTo };
};

module.exports = { parseDate , formatDate, calculateDatePeriod };