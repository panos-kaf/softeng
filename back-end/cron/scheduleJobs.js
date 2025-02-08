const cron = require('node-cron');
const processPayments = require('../utils/processPayments');

var i = 0;

cron.schedule('0 * * * *', async () => { // Min Hour Day Month Year //
    console.log(`#${i} Running daily payment settlement...`);
    await processPayments(i++);
});