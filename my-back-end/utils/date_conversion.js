const parse_date = (dateString) => {
    if (!/^\d{8}$/.test(dateString)) return null; // Ensure it's an 8-digit number
    const year = parseInt(dateString.slice(0, 4), 10);
    const month = parseInt(dateString.slice(4, 6), 10);
    const day = parseInt(dateString.slice(6, 8), 10);
    return new Date(year, month, day);
};

const formatDate = (date,db) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Adjust for zero-based months
    const year = date.getFullYear();
    if (db) return `${year}-${month}-${day}`;
    return `${day}/${month}/${year}`;
};

module.exports = { parse_date , formatDate };