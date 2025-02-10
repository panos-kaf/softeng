const db = require("../utils/db");
const {logToFile, logToBoth, logToBothErr} = require('../utils/logToFile');

exports.getTollStations = async (req, res) => {
    try {
        const { operator_name } = req.body; // Παίρνουμε το όνομα του operator 
        const userRole = req.user.role; // Παίρνουμε τον ρόλο του χρήστη από το token

        logToBoth(`Operator Name: ${operator_name}`);
        logToBoth(`User Role: ${userRole}`);

        if (!operator_name && userRole !== "admin") {
            return res.status(403).json({ message: "Invalid operator" });
        }

        let query;
        let params = [];

        // Αν ο χρήστης είναι admin και δεν έχει επιλέξει operator, επιστρέφουμε όλους τους σταθμούς
        if (userRole === "admin" && !operator_name) {
            logToBoth("🔹 Admin: Επιστροφή όλων των σταθμών");
            query = "SELECT id, toll_id, road, locality FROM toll_stations";
        } else {
            logToBoth(`🔹 Φιλτράρισμα σταθμών για τον operator: ${operator_name}`);
            query = `
                SELECT ts.id, ts.toll_id, ts.road, ts.locality 
                FROM toll_stations ts
                JOIN operators op ON ts.operator_id = op.id
                WHERE op.name = ?
            `;
            params = [operator_name];
        }

        const [stations] = await db.query(query, params);

        if (stations.length === 0) {
            console.warn(` Δεν βρέθηκαν σταθμοί για τον operator: ${operator_name}`);
        }

        res.status(200).json(stations);
    } catch (error) {
        logToBothErr(`❌ Σφάλμα στο tollStations API: ${error}`);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

