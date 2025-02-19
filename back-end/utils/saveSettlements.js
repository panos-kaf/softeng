require('dotenv').config({path: '../../.env'});

const {logToFile, logToBoth, logToBothErr} = require('./logToFile');
const db = require('./db');
const { calculateSettlements } = require('./calculateSettlements');

async function saveSettlements(dateFrom, dateTo) {

    const firstDay = new Date(dateTo.getFullYear(), dateTo.getMonth(), 2);
    const SettlementDate = firstDay.toISOString().split('T')[0];
    
    const settlements = await calculateSettlements(dateFrom, dateTo);

    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        // Fetch operator IDs from the database
        const [operators] = await connection.query("SELECT id, op_id FROM operators");
        const operatorMap = {};
        for (const row of operators) {
            operatorMap[row.op_id] = row.id;
        }

        const insertQuery = `
            INSERT INTO settlements (amount, date, from_operator, to_operator)
            VALUES (?, ?, ?, ?)
        `;

        const insertPromises = [];

        for (const fromOpId in settlements) {
            if (!operatorMap[fromOpId]) {
                console.warn(`Skipping unknown fromOperator: ${fromOpId}`);
                continue;
            }
        
            for (const toOpId in settlements[fromOpId]) {
                if (!operatorMap[toOpId]) {
                    console.warn(`Skipping unknown toOperator: ${toOpId}`);
                    continue;
                }
        
                const amount = settlements[fromOpId][toOpId] || 0;
                logToFile(`Processing: ${fromOpId} -> ${toOpId} | Amount: ${amount}`, 'settlements');
        
                if (amount !== 0) {
                    insertPromises.push(
                        connection.execute(insertQuery, [amount, SettlementDate, operatorMap[fromOpId], operatorMap[toOpId]])
                    );
                }
            }
        }

        await Promise.all(insertPromises);  // Execute all insertions concurrently
        await connection.commit();
        logToFile("Settlements saved successfully.",'settlements');
    } catch (error) {
        await connection.rollback();
        logToBothErr("Error saving settlements:", error);
    } finally {
        connection.release();
    }
};

module.exports = {saveSettlements};