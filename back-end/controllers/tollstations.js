const db = require("../utils/db");

exports.getTollStations = async (req, res) => {
    try {
        const operator_name = req.body.operator_name; // Παίρνουμε το ID του operator από το token
        console.log(operator_name);
        if (!operator_name) {
            return res.status(403).json({ message: "Invalid operator" });
        }

        // Αν ο χρήστης είναι admin, επιστρέφουμε όλους τους σταθμούς
        let query = "SELECT id, toll_id, road, locality FROM toll_stations";
        let params = [];

        if (req.user.role !== "admin") {
            query += `  WHERE operator_id = (
                        SELECT id FROM operators WHERE name = ?)`;
            params = [operator_name];
        }

        const [stations] = await db.query(query, params);
        res.status(200).json(stations);
    } catch (error) {
        console.error("tollStations error:",error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
