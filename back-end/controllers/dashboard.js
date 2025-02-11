const db = require("../utils/db");

exports.getDashboardStats = async (req, res) => {
    try {
        const [operatorsResult] = await db.execute("SELECT COUNT(*) AS totalOperators FROM operators");
        const [tollsResult] = await db.execute("SELECT COUNT(*) AS totalTolls FROM toll_stations");

        const totalOperators = operatorsResult[0]?.totalOperators || 0;
        const totalTolls = tollsResult[0]?.totalTolls || 0;

        res.json({ totalOperators, totalTolls });
    } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

