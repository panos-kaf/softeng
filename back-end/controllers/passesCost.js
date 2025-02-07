const {calculateDatePeriod} = require('../utils/date_conversion');
const db = require('../utils/db');

exports.getAll = async(req, res, next) => {
    let limit = undefined;
    if (req.query.limit) {
        limit = Number(req.query.limit);
        if (!Number.isInteger(limit)) return res.status(400).json({message: 'Limit query param should be an int'});
    }
}
exports.getPassesCost = async (req, res) => {
    const { tollOpID, tagOpID, date_from, date_to } = req.params;

    // Validate and parse the date range
    try {
        const {fromDate, toDate} = calculateDatePeriod(date_from, date_to, res);
        try {
            // Query to calculate the cost of passes
            const query = `
                SELECT COUNT(*) AS nPasses, SUM(charge) AS passesCost
                FROM transactions trans
                JOIN toll_stations t_s ON trans.toll_station_id = t_s.id
                JOIN tags tg ON trans.tag_id = tg.id
                JOIN operators tollOps ON t_s.operator_id = tollOps.id AND tollOps.op_id = ?
                JOIN operators tagOps ON tg.operator_id = tagOps.id AND tagOps.op_id = ?
                WHERE trans.timestamp BETWEEN ? AND ?;
                `;
    
            const [results] = await db.execute(query, [tollOpID, tagOpID, fromDate, toDate]);
    
            // Handle response
            if (!results.length) {
                return res.status(204).json({ message: 'No content' }); 
            }
            res.status(200).json({
                tollOpID,
                tagOpID,
                requestTimestamp: new Date().toISOString(),
                periodFrom: fromDate,
                periodTo: toDate,
                nPasses: results[0].nPasses,
                passesCost: results[0].passesCost || 0.0,
            });
        } catch (error) {
            console.error('Error calculating passes cost:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
    catch (error) {
        return res.status(400).json({message: 'Invalid date range'});
    }
};