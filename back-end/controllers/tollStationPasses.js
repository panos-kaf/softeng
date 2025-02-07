const {formatDate, calculateDatePeriod} = require('../utils/date_conversion');
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
    try{
        const {fromDate, toDate} = calculateDatePeriod(date_from, date_to);
        try {

            const query = `
                SELECT 
                t.id AS passID, 
                t.timestamp AS timestamp, 
                t.charge AS passCharge, 
                tg.tag_ref AS tagID, 
                tag_provider.name AS tagProvider,
                CASE 
                    WHEN tag_provider.id = ts.operator_id THEN 'home' 
                    ELSE 'visitor' 
                END AS passType
                FROM 
                    transactions t
                JOIN 
                    toll_stations ts ON t.toll_station_id = ts.id
                JOIN 
                    tags tg ON t.tag_id = tg.id
                JOIN
                    operators tag_provider ON tg.operator_id = tag_provider.id
                WHERE 
                    ts.toll_id = ? 
                    AND t.timestamp BETWEEN ? AND ?
                ORDER BY 
                    t.timestamp;
            `;

            const [results] = await db.execute(query, [tollStationID, fromDate, toDate]);

            if (!results.length) {
                return res.status(204).json({ message: 'No content' }); 
            }
            
            const passes = results.map(result => ({
                passID: result.passID,
                passTimestamp: result.timestamp,
                tagID: result.tagID,
                tagProvider: result.tagProvider,
                passType: result.passType,
                passCharge: result.passCharge
            }));

            res.status(200).json({
                periodFrom: fromDate,
                periodTo : toDate,
                nPasses : passes.length,
                passList : passes
            });
        } catch (error) {
            console.error("Error fetching toll station passes:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
   } catch(error){return res.status(400).json({message:"Invalid date range"});}
      
}