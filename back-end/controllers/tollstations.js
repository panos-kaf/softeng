const db = require("../utils/db");

exports.getTollStations = async (req, res) => {
    try {
        const operator_id = req.user.operator_id; // Παίρνουμε το ID του operator από το token

        if (!operator_id) {
            return res.status(403).json({ message: "Δεν έχετε πρόσβαση σε σταθμούς" });
        }

        // Αν ο χρήστης είναι admin, επιστρέφουμε όλους τους σταθμούς
        let query = "SELECT id, toll_id, road, locality FROM toll_stations";
        let params = [];

        if (req.user.role !== "admin") {
            query += " WHERE operator_id = ?";
            params = [operator_id];
        }

        const [stations] = await db.query(query, params);
        res.status(200).json(stations);
    } catch (error) {
        console.error("❌ Σφάλμα κατά την ανάκτηση σταθμών:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
