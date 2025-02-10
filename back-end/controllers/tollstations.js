/*
const db = require("../utils/db");
exports.getTollStations = async (req, res) => {
   try {
        const operator_name = req.body.operator_name; // Παίρνουμε το ID του operator από το token
        console.log(operator_name);
        if (!operator_name) {
            return res.status(403).json({ message: "Invalid operator" });
        }

        // Αν ο χρήστης είναι admin, επιστρέφουμε όλους τους σταθμούς
        //let query = "SELECT id, toll_id, road, locality FROM toll_stations";
        //let params = [];

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
*/

const db = require("../utils/db");

exports.getTollStations = async (req, res) => {
    try {
        const { operator_name } = req.body; // Παίρνουμε το όνομα του operator 
        const userRole = req.user.role; // Παίρνουμε τον ρόλο του χρήστη από το token

        console.log(" Operator Name:", operator_name);
        console.log(" User Role:", userRole);

        if (!operator_name && userRole !== "admin") {
            return res.status(403).json({ message: "Invalid operator" });
        }

        let query;
        let params = [];

        // Αν ο χρήστης είναι admin και δεν έχει επιλέξει operator, επιστρέφουμε όλους τους σταθμούς
        if (userRole === "admin" && !operator_name) {
            console.log("🔹 Admin: Επιστροφή όλων των σταθμών");
            query = "SELECT id, toll_id, road, locality FROM toll_stations";
        } else {
            console.log(`🔹 Φιλτράρισμα σταθμών για τον operator: ${operator_name}`);
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
        console.error("❌ Σφάλμα στο tollStations API:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

