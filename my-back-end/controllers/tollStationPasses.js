const { parse_date, formatDate } = require('../utils/date_conversion')
const db = require('../utils/database');

exports.getAll = async (req, res, next) => {
    let limit = undefined;
    if (req.query.limit) {
        limit = Number(req.query.limit);
        if (!Number.isInteger(limit)) return res.status(400).json({message: 'Limit query param should be an int'});
    }
}

exports.getPassesInDateRange = async (req, res, next) => {
    const { tollStationID, date_from, date_to } = req.params;
    const fromDate = parse_date(date_from);
    const toDate = parse_date(date_to);

    if (isNaN(fromDate) || isNaN(toDate) || fromDate > toDate)
        return res.status(400).json({ message: 'Invalid date' });
    
    console.log(process.env.DB);
    const formattedDateFrom = fromDate.toISOString().slice(0, 19).replace('T', ' ');
    const formattedDateTo = toDate.toISOString().slice(0, 19).replace('T', ' ');
    try {
        const query = `
            SELECT * 
            FROM Transaction 
            WHERE Toll_ID = ? AND TimeStamp BETWEEN ? AND ?;
        `;
        const [results] = await db.execute(query, [tollStationID, formattedDateFrom, formattedDateTo]);

        res.status(200).json(results);
    } catch (error) {
        console.error("Error fetching toll station passes:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
    res.status(404).json({
        message: `Fetching passes for ${tollStationID} from ${formatDate(fromDate)} to ${formatDate(toDate)}`
    });
};