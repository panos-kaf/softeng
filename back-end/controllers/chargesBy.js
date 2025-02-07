const {calculateDatePeriod} = require('../utils/date_conversion');
const db = require('../utils/db');

exports.getAll = async(req, res, next) => {
    let limit = undefined;
    if (req.query.limit) {
        limit = Number(req.query.limit);
        if (!Number.isInteger(limit)) return res.status(400).json({message: 'Limit query param should be an int'});
    }
}

exports.getChargesBy = async (req, res) => {
    const { tollOpID, date_from, date_to } = req.params;
    try{
        const {fromDate, toDate} = calculateDatePeriod(date_from, date_to);
        try {
            // SQL Query to get charges by visiting operators
            const query = `
                SELECT
                    vOps.op_id AS visitingOpID, 
                    COUNT(*) AS nPasses,
                    SUM(transactions.charge) AS passesCost
                FROM 
                    transactions
                JOIN
                    operators tollOp 
                JOIN 
                    toll_stations ON tollOp.id = toll_stations.operator_id
                JOIN 
                    tags vtags ON transactions.tag_id = vtags.id
                JOIN 
                    operators vOps ON vtags.operator_id = vOps.id
                WHERE 
                    tollOp.op_id = ?
                    AND vOps.id != toll_stations.operator_id
                    AND transactions.timestamp BETWEEN ? AND ?
                GROUP BY 
                    vtags.operator_id;
            `;
    
            const [results] = await db.execute(query, [tollOpID, fromDate, toDate]);

            if (!results.length) {
                return res.status(204).json({ message: 'No content' });
            }
    
            res.status(200).json({
                tollOpID,
                requestTimestamp: new Date().toISOString(),
                periodFrom: fromDate,
                periodTo: toDate,
                vOpList: results.map((row) => ({
                    visitingOpID: row.visitingOpID,
                    nPasses: row.nPasses,
                    passesCost: row.passesCost || 0.0,
                })),
            });
            
        } catch (error) {
            console.error('Error fetching charges by operators:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    } catch (error) {
        res.status(400).json({message:"Invalid date range"});
    }
};