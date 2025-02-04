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
                SELECT trans.id, trans.charge, t_s.toll_id, tg.tag_ref
                FROM transactions trans
                JOIN toll_stations t_s ON trans.toll_station_id = t_s.id
                JOIN tags tg ON trans.tag_id = tg.id
                JOIN operators tollOps ON t_s.operator_id = tollOps.id AND tollOps.op_id = ?
                JOIN operators tagOps ON tg.operator_id = tagOps.id AND tagOps.op_id = ?
                WHERE trans.timestamp BETWEEN ? AND ?;
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