const db = require('../utils/db');

exports.getOperators = async (req, res, next) => {
    try {
        const [rows] = await db.execute('SELECT * FROM operators'); // Destructure first element
        res.status(200).json(rows);
    } catch (error) {
        console.error("Error fetching operators:", error);
        res.status(500).json({ status: "failed", info: error.message });
    }
};