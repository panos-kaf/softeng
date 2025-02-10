require('dotenv').config({ path: '../../.env' });

const {logToFile, logToBoth, logToBothErr} = require('./logToFile');
const db = require('./db');
const { getChargesBy } = require('../controllers/chargesBy');

function parseTollData(jsonData) {
    if (!jsonData || !jsonData.tollOpID || !Array.isArray(jsonData.vOpList)) {
        logToBothErr("Invalid JSON structure");
        return null;
    }
    
    const tollOpID = jsonData.tollOpID; // Extract the toll operator ID
    const debt = {}; // Initialize the debt object
    
    jsonData.vOpList.forEach(entry => {
        debt[entry.visitingOpID] = parseFloat(entry.passesCost); // Store nPasses for each visiting operator
    });
    
    return debt;
}

async function calculateSettlements(fromDate, toDate) {
    
    const opQuery = `SELECT op_id FROM operators`;
    const [rows] = await db.query(opQuery);
    const operators = rows.map(op => op.op_id);
    let debts = {};
    
    for (const operator of operators) {
        const req = { params: { tollOpID: operator, date_from: fromDate, date_to: toDate } };
        
        let responseData = null; // Explicitly initialize responseData
        const res = {
            status: function (code) {
                this.statusCode = code;
                return this; // Allow chaining
            },
            json: function (data) {
                responseData = data; // Capture response data
            }
        };
        
        await getChargesBy(req, res);

        if (!responseData || responseData.message === 'No content') {
            debts[operator] = {}; // Assign an empty debt object
            continue; // Skip processing
        }

        const debt = parseTollData(responseData); // Correct function call
        
        debts[operator] = debt; // Assign extracted debts to the operator
    }
    
    logToFile(`Debts structure: ${JSON.stringify(debts, null, 1)}`, 'settlements');
    
    let settlements = {};
    
    for (const op1 of operators) {
        settlements[op1] = {};
        for (const op2 of operators) {
            if (op1 === op2) {
                settlements[op1][op2] = 0;
                continue;
            }
            const debt1 = debts[op1]?.[op2] || 0; // Optional chaining to avoid errors
            const debt2 = debts[op2]?.[op1] || 0;

            settlements[op1][op2] = debt1 - debt2;
        }
    }
    return settlements;
}

module.exports = { calculateSettlements };