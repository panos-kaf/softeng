require('dotenv').config({path:'../.env'});

const axios = require('axios');
const https = require('https');
const mysql = require('mysql2/promise');
const fs = require('fs');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'softeng',
    password: 'root',
    port: '3306'
});

const HOST = process.env.HOST_IP;
const PORT = process.env.HTTPS_PORT;
const API = `https://${HOST}:${PORT}/api`;

const cert = fs.readFileSync(process.env.SSL_CERT);
const agent = new https.Agent({
    ca: cert
  });

async function getOperatorDebt(operatorID, date_from, date_to) {
    try {
        const url = `${API}/chargesBy/${operatorID}/${date_from}/${date_to}`;
        const response = await axios.get(url, {httpsAgent: agent});
        
        // Convert API response into a debt map { creditor: amount }
        let debtMap = {};
        response.data.forEach(debt => {
            debtMap[debt.debtor_op] = debt.total_owed;
        });

        return debtMap;
    } catch (err) {
        console.error(`Error fetching debts for operator ${operatorID}:`, err.message);
        return {};
    }
}

async function calculateDailySettlements() {
    const today = new Date().toISOString().split('T')[0]; // Get current date (YYYY-MM-DD)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    let debts = {}; // { operatorID: { debtorID: amount } }

// Step 1: Get debt information for each operator
    const opQuery = `SELECT op_id FROM operators`;
    const [operators] = await pool.query(opQuery);

    const opIDs = operators.map(op => op.op_id);
    console.log(opIDs);
    for (const opID of opIDs) {
        debts[opID] = await getOperatorDebt(opID, today, tomorrowStr);
    }

    let settlements = {}; // { operator1: { operator2: settlementAmount } }

    // Step 2: Compute settlements between operators
    for (const operator1 of operators) {
        settlements[operator1] = {};
        for (const operator2 of operators) {
            if (operator1 === operator2) {
                settlements[operator1][operator2] = 0;
                continue;
            }

            const debt1 = debts[operator1][operator2] || 0; // Amount operator1 owes to operator2
            const debt2 = debts[operator2][operator1] || 0; // Amount operator2 owes to operator1

            settlements[operator1][operator2] = debt1 - debt2;
        }
    }

    console.log(settlements);
    return settlements;
}

// Example usage:
calculateDailySettlements().then(console.log).catch(console.error);