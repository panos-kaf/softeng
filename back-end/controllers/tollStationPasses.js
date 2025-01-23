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
            console.log(`
            Fetching passes on ${process.env.DB}
            for ${tollStationID}
            from ${fromDate} 
            to ${toDate}`);
    
            const query = `
                SELECT * 
                FROM transactions 
                WHERE toll_station_id = (
                SELECT id 
                FROM toll_stations
                WHERE toll_id = ?
                ) AND TimeStamp BETWEEN ? AND ?;
            `;
            const [results] = await db.execute(query, [tollStationID, fromDate, toDate]);
    
            res.status(200).json(results);
        } catch (error) {
            console.error("Error fetching toll station passes:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
   } catch(error){return res.status(400).json({message:"Invalid date range"});}
      
}