const db = require("../utils/db");
const {logToFile, logToBoth, logToBothErr} = require('../utils/logToFile');


exports.getDashboardStats = async (req, res) => {
    try {
        const [[{ totalOperators }]] = await pool.query("SELECT COUNT(*) AS totalOperators FROM operators");
        const [[{ totalTolls }]] = await pool.query("SELECT COUNT(*) AS totalTolls FROM toll_stations");

        res.json({ totalOperators, totalTolls });
    } catch (error) {
        logToBothErr(`Error fetching dashboard stats: ${error}`);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

