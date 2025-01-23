const { parse_date, formatDate } = require('../utils/date_conversion')
const db = require('../utils/db');

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
    
    const formattedDateFrom = fromDate.toISOString().slice(0, 19).replace('T', ' ');
    const formattedDateTo = toDate.toISOString().slice(0, 19).replace('T', ' ');
    try {
        const query = `
            SELECT * 
            FROM transactions 
            WHERE toll_station_id = (
            SELECT id 
            FROM toll_stations
            WHERE toll_id = ?
            ) AND TimeStamp BETWEEN ? AND ?;
        `;
        const [results] = await db.execute(query, [tollStationID, formattedDateFrom, formattedDateTo]);

        res.status(200).json(results);
    } catch (error) {
        console.error("Error fetching toll station passes:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
    console.log(`Fetching passes on ${process.env.DB} for ${tollStationID} from ${formatDate(fromDate)} to ${formatDate(toDate)}`);
}