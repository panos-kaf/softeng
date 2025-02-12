const db = require('../utils/db');
const {logToFile, logToBoth, logToBothErr} = require('../utils/logToFile');

exports.getSettlement = async (req, res, next) => {
    const { fromOpID, toOpID, yyyymm } = req.params;

    console.log("fromIpID:", fromOpID);
    console.log("toOpID:", toOpID);
    console.log("yyyymm:", yyyymm);

    try {
        const year = yyyymm.substring(0, 4);
        const month = yyyymm.substring(4, 6);

        const firstDay = new Date(`${year}-${month}-01`);
        const lastDay = new Date(year, month, 0);
        
        const firstDayFormatted = firstDay.toISOString().split('T')[0];
        const lastDayFormatted = lastDay.toISOString().split('T')[0];
        
        const query = `
                SELECT s.id, s.amount, s.date, s.is_paid 
                FROM settlements s
                JOIN operators fromOp ON fromOp.id = s.from_operator
                JOIN operators toOp ON toOp.id = s.to_operator
                WHERE fromOp.op_id = ?
                AND toOp.op_id = ?
                AND s.date BETWEEN ? AND ?
                `;
        const [settlement] = await db.execute(query, [fromOpID, toOpID, firstDayFormatted, lastDayFormatted]);
        res.status(200).json(settlement);
    } catch (error) {
        logToBothErr(`Error fetching settlement: ${error}`);
        res.status(500).json({ status: "failed", info: error.message });
    }
};