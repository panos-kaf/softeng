const db = require('../utils/db');

exports.getDebt = async (req, res) => {
    const { operatorID, date_from, date_to } = req.params;

    try {
        // Μετατροπή ημερομηνιών αν χρειάζεται (π.χ., αν πρέπει να αφαιρεθούν οι παύλες)
        const formattedFromDate = date_from.replace(/-/g, '');
        const formattedToDate = date_to.replace(/-/g, '');

        // SQL Query για να υπολογίσουμε το συνολικό χρέος προς τον συγκεκριμένο operator
        const query = `
            SELECT 
                SUM(trans.charge) AS totalDebt
            FROM transactions trans
            JOIN toll_stations ts ON trans.toll_station_id = ts.id
            JOIN operators op ON ts.operator_id = op.id
            JOIN tags tg ON trans.tag_id = tg.id
            WHERE tg.operator_id = ? 
            AND trans.timestamp BETWEEN ? AND ?;
        `;

        // Εκτελούμε το query
        const [rows] = await db.execute(query, [operatorID, formattedFromDate, formattedToDate]);

        // Επιστροφή του χρέους
        const totalDebt = rows[0].totalDebt || 0; // Αν δεν υπάρχουν χρέη, επιστρέφουμε 0
        return res.status(200).json({ debtAmount: totalDebt });

    } catch (error) {
        console.error("❌ Σφάλμα στον υπολογισμό του χρέους:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
