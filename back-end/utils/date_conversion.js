const parseDate = (dateString) => {
    if (!/^\d{8}$/.test(dateString)) return null; // Ensure it's an 8-digit number
    
    const year = parseInt(dateString.slice(0, 4), 10);
    const month = parseInt(dateString.slice(4, 6), 10) - 1; // Months are 0-indexed
    const day = parseInt(dateString.slice(6, 8), 10);
    
    return new Date(year, month, day, 0, 0);
};

const formatDate = (date,db) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Adjust for zero-indexed months
    const year = date.getFullYear();
    if (db) return `${year}-${month}-${day}`;
    return `${day}/${month}/${year}`;
};

const calculateDatePeriod = (fromDate, toDate) => {
    fromDate = parseDate(fromDate, 0);
    toDate = parseDate(toDate, 0);

    if (isNaN(fromDate) || isNaN(toDate) || fromDate > toDate)
        throw new Error();

    const formattedDateFrom = fromDate.toISOString().slice(0, 19).replace('T', ' ');
    const formattedDateTo = toDate.toISOString().slice(0, 19).replace('T', ' ');

    return { fromDate: formattedDateFrom, toDate: formattedDateTo };
};

module.exports = { parseDate , formatDate, calculateDatePeriod };