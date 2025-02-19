const {calculateDatePeriod} = require('../utils/date_conversion');
const {logToFile, logToBoth, logToBothErr} = require('../utils/logToFile');
const db = require('../utils/db');
const {Parser} = require('json2csv');

exports.getAll = async(req, res, next) => {
    let limit = undefined;
    if (req.query.limit) {
        limit = Number(req.query.limit);
        if (!Number.isInteger(limit)) return res.status(400).json({message: 'Limit query param should be an int'});
    }
}

exports.getChargesBy = async (req, res) => {
    let format = req.query.format && req.query.format.toLowerCase() === "csv" ? "csv" : "json";
    const { tollOpID, date_from, date_to } = req.params;
    try{
        const {fromDate, toDate} = calculateDatePeriod(date_from, date_to);
        try {
            const query = `
                    SELECT
                        vOps.op_id AS visitingOpID, 
                        COUNT(DISTINCT transactions.id) AS nPasses,
                        SUM(transactions.charge) AS passesCost
                    FROM 
                        transactions
                    JOIN 
                        tags vtags ON transactions.tag_id = vtags.id
                    JOIN 
                        operators vOps ON vtags.operator_id = vOps.id
                    JOIN 
                        toll_stations ON transactions.toll_station_id = toll_stations.id
                    JOIN 
                        operators tollOp ON toll_stations.operator_id = tollOp.id
                    WHERE 
                        tollOp.op_id = ?
                        AND vOps.id != toll_stations.operator_id
                        AND transactions.timestamp BETWEEN ? AND ?
                    GROUP BY 
                        vOps.op_id;
            `;
    
            const [results] = await db.execute(query, [tollOpID, fromDate, toDate]);

            if (!results.length) {
                return res.status(204).json({ message: 'No content' });
            }
            const response = {
                tollOpID,
                requestTimestamp: new Date().toISOString(),
                periodFrom: fromDate,
                periodTo: toDate,
                vOpList: results.map((row) => ({
                    visitingOpID: row.visitingOpID,
                    nPasses: row.nPasses,
                    passesCost: row.passesCost || 0.0,
                })),
                };

                if (format==='json')
                res.status(200).json(response);
    
                else{
                // Convert JSON response to CSV
                const json2csvParser = new Parser();
                const csvData = json2csvParser.parse([response]);
    
                res.setHeader('Content-Type', 'text/csv');
                res.setHeader('Content-Disposition', 'attachment; filename=chargesBy.csv');
                return res.status(200).send(csvData);
                }
            
        } catch (error) {
            logToBothErr(`Error fetching charges by operators: ${error}`);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    } catch (error) {
        res.status(400).json({message:"Invalid date range"});
    }
};