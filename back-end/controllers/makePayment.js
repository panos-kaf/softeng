const db = require('../utils/db');
const { logToFile, logToBoth, logToBothErr } = require('../utils/logToFile');

exports.makePayment = async (req, res, next) => {
    const { settlementID } = req.body;
    const query = `INSERT INTO payments (payment_date, settlement_id) VALUES (NOW(), ?)`;
    
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();
        await connection.execute(query, [settlementID]);
        await connection.commit();
        logToBoth(`Payment for Settlement_ID = ${settlementID} complete.`, 'payments');

        res.status(200).json({ "status": "OK" });

    } catch (error) {
        logToBothErr("Something went wrong with the payment. Aborting...");
        await connection.rollback();

        res.status(500).json({ "status": "failed", "info": error.message });
    } finally {
        connection.release();
    }
};