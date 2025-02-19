const {saveSettlements} = require('./saveSettlements');
const {logToFile} = require('./logToFile');

async function initSettlements() {
    const startYear = 2020;
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1; // Months are 0-indexed in JavaScript

    for (let year = startYear; year <= currentYear; year++) {
        const lastMonth = (year === currentYear) ? currentMonth : 12; // Stop at the current month in the current year

        for (let month = 1; month <= lastMonth; month++) {
            const dateFrom = new Date(year, month - 1, 1); // First day of the month
            const dateTo = new Date(year, month, 0); // Last day of the month

            logToFile(`Processing settlements for ${dateFrom} to ${dateTo}`,'settlements');
            await saveSettlements(dateFrom, dateTo);
        }
    }
}

module.exports = {initSettlements};