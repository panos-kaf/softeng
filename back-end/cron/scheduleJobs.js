const cron = require('node-cron');
const processPayments = require('../utils/processPayments');

cron.schedule('* * * * *', async () => { // Min Hour Day Month Year //
    console.log('Running daily payment settlement...');
    await processPayments();
});