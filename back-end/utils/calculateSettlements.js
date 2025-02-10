require('dotenv').config({path:'../.env'});

const { getChargesBy } = require('../controllers/chargesBy');

const db = require('./db');

async function calculateDailySettlements() {
    const today = new Date().toISOString().split('T')[0].replace(/-/g,'');
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0].replace(/-/g,'');

    let debts = {};
    const opQuery = `SELECT op_id FROM operators`;
    const [rows] = await db.query(opQuery);
    const operators = rows.map(op => op.op_id);
    
    for (const operator of operators) {
        //const req = { params: { tollOpID: operator, date_from: today, date_to: tomorrowStr } };
        const req = { params: { tollOpID: operator, date_from: '20101010', date_to: '20261010' } };

        const res = {
        json: (data) => console.log("Response:", data),
        status: (code) => ({ json: (data) => console.error(`Error ${code}:`, data) })
    };
        debts[operator] = await getChargesBy(req, res);
    }

    let settlements = {};

    for (const op1 of operators) {
        settlements[op1] = {};
        for (const op2 of operators) {
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