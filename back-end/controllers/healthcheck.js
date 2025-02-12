const db = require('../utils/db');
const {logToFile, logToBoth, logToBothErr} = require('../utils/logToFile');
const { Parser } = require('json2csv');

exports.getHealthcheck = async(req, res, next) => {
    let format = req.query.format && req.query.format.toLowerCase() === "csv" ? "csv" : "json";

    const connection_string = `mysql://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB}`;
    try {
        const n_tags = await db.execute('SELECT COUNT(*) FROM tags');
        const n_stations = await db.execute('SELECT COUNT(*) FROM toll_stations');
        const n_passes = await db.execute('SELECT COUNT(*) FROM transactions');
        const response = {
            "status": 'OK',
            "db_connection": connection_string,
            "n_tags": n_tags[0][0]['COUNT(*)'],
            "n_stations": n_stations[0][0]['COUNT(*)'],
            "n_passes": n_passes[0][0]['COUNT(*)']
        };
        
        if (format==="json")
        res.status(200).json(response);
        
        else {
            const json2csvParser = new Parser();
            const csvData = json2csvParser.parse([response]);
            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', 'attachment; filename=healthcheck.csv');
            return res.status(200).send(csvData);
        }
    } catch (error) {
        logToBothErr(`Error fetching healthcheck: ${error}`);
        res.status(401).json({status: "failed", "db_connection": connection_string,
        });
    }
}