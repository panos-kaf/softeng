const cron = require('node-cron');
const saveSettlements = require('../utils/saveSettlements');

cron.schedule('0 0 1 * *', async () => { // Min Hour Day Month Year //
    console.log(`Saving monthly settlements to database...`);
    await saveSettlements();
});