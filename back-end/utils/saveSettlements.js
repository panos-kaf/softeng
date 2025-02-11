require('dotenv').config({path: '../../.env'});

const {logToFile, logToBoth, logToBothErr} = require('./logToFile');
const db = require('./db');
const { calculateSettlements } = require('./calculateSettlements');

async function saveSettlements() {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const lastDay = new Date(today.getFullYear(), today.getMonth(), 0);

    const formattedFirstDay = firstDay.toISOString().slice(0,10).replace(/-/g,'');
    const formattedLastDay = lastDay.toISOString().slice(0,10).replace(/-/g,'');

    const settlements = await calculateSettlements(formattedFirstDay, formattedLastDay);

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
            VALUES (?, NOW(), ?, ?)
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
                        connection.execute(insertQuery, [amount, operatorMap[fromOpId], operatorMap[toOpId]])
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

saveSettlements();

module.exports = {saveSettlements};