const {calculateDatePeriod} = require('../utils/date_conversion');
const db = require('../utils/db');

exports.getAll = async(req, res, next) => {
    let limit = undefined;
    if (req.query.limit) {
        limit = Number(req.query.limit);
        if (!Number.isInteger(limit)) return res.status(400).json({message: 'Limit query param should be an int'});
    }
}

exports.getPassAnalysis = async (req, res, next) => {
    const { stationOpID, tagOpID, date_from, date_to } = req.params;

    try {
        // Calculate date period
        const { fromDate, toDate } = calculateDatePeriod(date_from, date_to);
        try {
            const query = `
                SELECT t.*
                FROM transactions t
                JOIN toll_stations ts ON t.toll_station_id = ts.id
                JOIN operators o ON ts.operator_id = o.id
                JOIN tags tg ON t.tag_id = tg.id
                WHERE o.id = (SELECT id FROM operators WHERE op_id = ?)
                  AND tg.id = (SELECT id FROM tags WHERE tag_ref = ?)
                  AND t.timestamp BETWEEN ? AND ?;
            `;

            // Execute query
            const [results] = await db.execute(query, [stationOpID, tagOpID, fromDate, toDate]);

            // Respond with results
            return res.status(200).json(results);
        } catch (error) {
            console.error("Database Error:", error.message); // Log the error
            return res.status(500).json({ message: "Internal Server Error" });
        }
    } catch (error) {
        console.error("Date Parsing Error:", error.message); // Log the error
        return res.status(400).json({ message: "Invalid date range" });
    }
};