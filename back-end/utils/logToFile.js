const fs = require('fs');

function logToFile(message, type) {
    const timestamp = new Date().toISOString();
    fs.appendFileSync(`./logs/${type}.log`, `[${timestamp}] ${message}\n`);
}

module.exports = {logToFile};