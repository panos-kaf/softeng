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

exports.getPassAnalysis = async (req, res, next) => {
    let format = req.query.format && req.query.format.toLowerCase() === "csv" ? "csv" : "json";

    const { stationOpID, tagOpID, date_from, date_to } = req.params;

    try {
        // Calculate date period
        const { fromDate, toDate } = calculateDatePeriod(date_from, date_to);
        try {
            const query = `
                SELECT trans.id, trans.charge, t_s.toll_id, tg.tag_ref, trans.timestamp
                FROM transactions trans
                JOIN toll_stations t_s ON trans.toll_station_id = t_s.id
                JOIN tags tg ON trans.tag_id = tg.id
                JOIN operators tollOps ON t_s.operator_id = tollOps.id AND tollOps.op_id = ?
                JOIN operators tagOps ON tg.operator_id = tagOps.id AND tagOps.op_id = ?
                WHERE trans.timestamp BETWEEN ? AND ?;
            `;

            // Execute query
            const [results] = await db.execute(query, [stationOpID, tagOpID, fromDate, toDate]);

            if (!results.length) {
                return res.status(204).json({ message: 'No content' });
            } 

            const passes = results.map(result => ({
                passID: result.passID,
                stationID: result.toll_id,
                timestamp: result.timestamp,
                tagID: result.tag_ref,
                passCharge: result.charge
            }));

            const response = {
                periodFrom: fromDate,
                periodTo : toDate,
                nPasses : passes.length,
                passList : passes
                };
                if (format==='json')
                res.status(200).json(response);
    
                else{
                // Convert JSON response to CSV
                const json2csvParser = new Parser();
                const csvData = json2csvParser.parse([response]);
    
                res.setHeader('Content-Type', 'text/csv');
                res.setHeader('Content-Disposition', 'attachment; filename=passAnalysis.csv');
                return res.status(200).send(csvData);
                }

        } catch (error) {

            logToBothErr(`Database Error:, ${error.message}`); // Log the error
            return res.status(500).json({ message: "Internal Server Error" });
        }
    } catch (error) {
        logToBothErr(`Date Parsing Error:, ${error.message}`); // Log the error
        return res.status(400).json({ message: "Invalid date range" });
    }
};