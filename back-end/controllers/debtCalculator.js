const db = require('../utils/db');
const { calculateSettlements } = require('../utils/calculateSettlements');

exports.getDebt = async (req, res) => {
    const { month_year } = req.params;

    try {
        const year = parseInt(month_year.substring(0, 4), 10);
        const month = parseInt(month_year.substring(4, 6), 10);

        if (isNaN(month))
            return res.status(400).json({error:"Invalid date"});

        const firstDay = new Date(year, month - 1, 1);  //months are 0-indexed
        const lastDay = new Date(year, month, 0);       //0th day of next month is last day of our month

        const formattedFirstDay = firstDay.toISOString().slice(0, 10).replace(/-/g, '');
        const formattedLastDay = lastDay.toISOString().slice(0, 10).replace(/-/g, '');

        const settlements = await calculateSettlements(formattedFirstDay, formattedLastDay);

        res.status(200).json({ settlements: settlements});

    } catch (error) {
        console.error("❌ Σφάλμα στον υπολογισμό του χρέους:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
