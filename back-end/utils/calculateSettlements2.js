const { getChargesBy } = require('../controllers/chargesBy');

const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'softeng',
    password: 'root',
    port: '3306'
});


async function calculateDailySettlements() {
    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    let debts = {};
    const opQuery = `SELECT op_id FROM operators`;
    const [operators] = await pool.query(opQuery);
    const opIDs = operators.map(op => op.op_id);

    console.log(opIDs);
    
    for (const opID of opIDs) {
        debts[opID] = await getChargesBy(opID, today, tomorrowStr);
    }

    let settlements = {};

    for (const op1 of opIDs) {
        settlements[op1] = {};
        for (const op2 of opIDs) {
            if (op1 === op2) {
                settlements[op1][op2] = 0;
                continue;
            }

            const debt1 = debts[op1][op2] || 0;
            const debt2 = debts[op2][op1] || 0;

            settlements[op1][op2] = debt1 - debt2;
        }
    }

    console.log(settlements);
    return settlements;
}

calculateDailySettlements();