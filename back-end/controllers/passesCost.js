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
                FROM transactions
                WHERE toll_station_id IN (
                    SELECT id FROM toll_stations WHERE operator_id = ?
                )
                AND tag_id IN (
                    SELECT id FROM tags WHERE operator_id = ?
                )
                AND timestamp BETWEEN ? AND ?;
            `;
    
            const [results] = await db.execute(query, [tollOpID, tagOpID, fromDate, toDate]);
    
            // Handle response
            if (results.length === 0) {
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