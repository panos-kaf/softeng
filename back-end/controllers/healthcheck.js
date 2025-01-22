const db = require('../utils/db');

exports.getHealthcheck = async(req, res, next) => {
    const connection_string = `mysql://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB}`;
    try {
        const n_tags = await db.execute('SELECT COUNT(*) FROM tags');
        const n_stations = await db.execute('SELECT COUNT(*) FROM toll_stations');
        const n_passes = await db.execute('SELECT COUNT(*) FROM transactions');
        res.status(200).json({
            "status": 'OK',
            "db_connection": connection_string,
            "n_tags": n_tags[0][0]['COUNT(*)'],
            "n_stations": n_stations[0][0]['COUNT(*)'],
            "n_passes": n_passes[0][0]['COUNT(*)']
        });
    } catch (error) {
        console.error("Error fetching healthcheck:", error);
        res.status(401).json({status: "failed",
            "db_connection": connection_string,
        });
    }
}